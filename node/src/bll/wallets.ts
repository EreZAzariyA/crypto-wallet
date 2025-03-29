import { Types } from "mongoose";
import { ClientError, IWalletModel } from "../models";
import WalletServiceFactory from "../services/WalletServiceFactory";
import { Wallets, Users } from "../collections";
import { TransactionReceipt } from "web3";
import { socket } from "../app";

export enum CoinTypes {
  TRX = "TRX",
  ETH = "ETH",
  USDT_ERC20 = "USDT_ERC20",
  USDC_ERC20 = "USDC_ERC20",
  USDT_TRC20 = "USDT_TRC20",
  USDC_TRC20 = "USDC_TRC20",
};

export enum TransactionType {
  Sent = "Sent",
  Receive = "Receive"
};

export const NetworksList = [
  CoinTypes.ETH,
  CoinTypes.TRX
];

const CoinsByNetwork = {
  [CoinTypes.ETH]: [CoinTypes.ETH, CoinTypes.USDC_ERC20, CoinTypes.USDT_ERC20],
  [CoinTypes.TRX]: [CoinTypes.TRX, CoinTypes.USDC_TRC20, CoinTypes.USDT_TRC20]
};

export const getNetworkByCoin = (coin: CoinTypes): CoinTypes => {
  if (NetworksList.includes(coin)) {
    return coin;
  };

  for (const [network, coins] of Object.entries(CoinsByNetwork)) {
    if (coins.includes(coin)) {
      return CoinTypes[network];
    }
  }

  return undefined;
};


export const isCoinSupported = (coin: CoinTypes): Boolean => {
  return Object.values(CoinTypes).includes(coin.toUpperCase() as CoinTypes);
};

class WalletsLogic {
  private socket = socket;

  async getUserWallets(user_id: string) {
    if (!Types.ObjectId.isValid(user_id)){
      throw new ClientError(500, 'User id is not in the correct format');
    }

    const user = await Users.findById(user_id).exec();
    if (!user) {
      throw new ClientError(400, 'User not found');
    }

    return await Wallets.find({ user_id }, { privateKey: 0, isTestNet: 0, hex: 0 }).exec();
  };

  async getUserWalletByCoin(user_id: string, coin: CoinTypes): Promise<IWalletModel> {
    if (!isCoinSupported(coin)) {
      throw new ClientError(500, `Coin ${coin} is not valid`);
    }

    return Wallets.findOne({ user_id, name: coin }).exec();
  };

  async createWallet(user_id: string, coin: CoinTypes, isAdmin?: boolean) {
    const service = WalletServiceFactory.createService(coin);
    const wallet = await service.createWallet(user_id, coin);
    if (isAdmin) {
      socket.io.to(user_id).emit('admin:wallet:create', wallet);
    }
    return wallet;
  };

  async sendCoins(wallet: IWalletModel, to: string, amount: number): Promise<{ receipt: TransactionReceipt, wallet: IWalletModel }> {
    const service = WalletServiceFactory.createService(wallet.name);
    const userWallet = await Wallets.findById(wallet._id).exec();
    if (!userWallet) {
      throw new ClientError(400, 'Wallet not found');
    }

    return service.sendCoin(userWallet, to, amount);
  };

};

export const walletsLogic = new WalletsLogic();