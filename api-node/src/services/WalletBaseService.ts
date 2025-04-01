import { TransactionReceipt } from "web3";
import { WalletModel, Wallets } from "../collections";
import { ClientError } from "../models";
import config from "../utils/config";
import { CoinTypes } from "../utils/coins";
import { Types } from "mongoose";

export interface Service {
  coin: CoinTypes;
  createWallet: (user_id: string, coin: CoinTypes) => Promise<WalletModel>;
  fetchTransactions: (address: string) => Promise<any[]>;
  sendCoin: (wallet: WalletModel, toAddress: string, amountInEth: number) => Promise<{ receipt: TransactionReceipt, wallet: WalletModel }>;
};

abstract class WalletBaseService implements Service {
  public abstract coin: CoinTypes;

  abstract createWallet(user_id: string, coin: CoinTypes): Promise<WalletModel>;
  abstract fetchTransactions(address: string): Promise<any[]>;
  abstract sendCoin(wallet: WalletModel, toAddress: string, amountInEth: number): Promise<any>;

  protected async saveWallet(user_id: string, wallet: Partial<WalletModel>) {
    const newWallet: WalletModel = {
      user_id: new Types.ObjectId(user_id),
      network: this.coin,
      isTestNet: !config.isProduction,
      ...wallet
    };

    const errors = newWallet.validateSync();
    if (errors) {
      throw new ClientError(500, errors.message);
    }

    return newWallet.save();
  };
};

export default WalletBaseService;