import { ObjectId, Types } from "mongoose";
import { tronWeb } from "../dal";
import { ClientError, UserModel } from "../models";
import { IWalletModel } from "../models/wallet-model";
import walletsLogic, { CoinTypes } from "./wallets";
import { Service } from "../services/WalletBaseService";
import WalletServiceFactory from "../services/WalletServiceFactory";

class TronLogic {
  protected coin = CoinTypes.TRX;
  private service: Service = WalletServiceFactory.createService(CoinTypes.TRX);

  async createWallet(user_id: string): Promise<IWalletModel> {
    const wallet = await this.getWallet(user_id);
    if (!!wallet) {
      console.log({ exsitWallet: wallet });
      return wallet;
    }

    const newWallet = await this.service.createWallet(user_id);
    if (!newWallet) {
      throw new ClientError(500, 'TronLogic.createWallet[Warn]: Could not create address');
    }

    return newWallet;
  };

  async getWallet(user_id: string): Promise<IWalletModel> {
    if (!Types.ObjectId.isValid(user_id)){
      throw new ClientError(500, 'User id is not in the correct format');
    }

    const user = await UserModel.findById(user_id).exec();
    if (!user) {
      throw new ClientError(400, 'User not found');
    }

    let wallet: IWalletModel;
    wallet = await walletsLogic.getUserWalletByCoin(user._id.toString(), this.coin);
    if (!!wallet) {
      const walletBalance = await this.getBalance(wallet.address.hex);
      wallet.walletBalance = walletBalance;
      wallet.save();
      return wallet;
    };

    return wallet;
  };

  async getWalletDetails(address: string): Promise<IWalletModel> {
    await this.validateAddress(address);
    return await tronWeb.trx.getAccount(address);
  };

  async getBalance(address: string): Promise<number> {
    await this.validateAddress(address);
    const balance = await tronWeb.trx.getBalance(address);
    return balance / 1_000_000;
  };

  async validateAddress(address: string) {
    const isValidAddress = await tronWeb.isAddress(address);
    if (!isValidAddress) {
      throw new ClientError(400, 'Address is not valid');
    }
    return isValidAddress;
  }

  async fetchWalletTransactions(address: string) {
    try {
      const transactions = await tronWeb.trx.getTransactionsRelated(address, 'all', 10, 0);
      console.log(transactions);
      return transactions;
    } catch (error) {
      throw new ClientError(error.status, error?.message);
    }
  };

};

const tronLogic = new TronLogic();
export default tronLogic;