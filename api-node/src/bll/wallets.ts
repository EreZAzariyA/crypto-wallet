import { ClientError, IWalletModel } from "../models";
import WalletServiceFactory from "../services/WalletServiceFactory";
import { Wallets } from "../collections";
import { TransactionReceipt } from "web3";
import { CoinTypes } from "../utils/coins";

class WalletsLogic {
  async createWallet(user_id: string, coin: CoinTypes, isAdmin?: boolean) {
    const service = WalletServiceFactory.createService(coin);
    const wallet = await service.createWallet(user_id, coin);
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