import { ClientError, IWalletModel } from "../models";
import WalletServiceFactory from "../services/WalletServiceFactory";
import { Users, Wallets } from "../collections";
import { TransactionReceipt } from "web3";
import { CoinTypes } from "../utils/coins";
import { Types } from "mongoose";

class WalletsLogic {

  async getUserWallets(user_id: string) {
    if (!Types.ObjectId.isValid(user_id)){
      throw new ClientError(500, 'User id is not in the correct format');
    }

    return Wallets.find({ user_id }, { privateKey: 0, isTestNet: 0, hex: 0 }).exec();
  };

  async createWallet(user_id: string, coin: CoinTypes, isAdmin?: boolean) {
    const service = WalletServiceFactory.createService(coin);
    const wallet = await service.createWallet(user_id, coin);
    return wallet;
  };

  async sendCoins(wallet: IWalletModel, to: string, amount: number): Promise<{ receipt: TransactionReceipt, wallet: IWalletModel }> {
    const service = WalletServiceFactory.createService(wallet.name);
    const userWallet = await Wallets.findOne({ address: wallet.address });
    if (!userWallet) {
      throw new ClientError(400, 'Wallet not found');
    }

    return service.sendCoin(userWallet, to, amount);
  };
};

export const walletsLogic = new WalletsLogic();