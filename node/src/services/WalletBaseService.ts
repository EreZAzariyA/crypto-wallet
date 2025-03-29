import { TransactionReceipt } from "web3";
import { CoinTypes, getNetworkByCoin } from "../bll/wallets";
import { Wallets } from "../collections";
import { ClientError } from "../models";
import { IWalletModel } from "../models/wallet-model";
import config from "../utils/config";

export interface Service {
  coin: CoinTypes;
  createWallet: (user_id: string, coin: CoinTypes) => Promise<IWalletModel>;
  fetchTransactions: (address: string) => Promise<any[]>;
  sendCoin: (wallet: IWalletModel, toAddress: string, amountInEth: number) => Promise<{ receipt: TransactionReceipt, wallet: IWalletModel }>;
};

abstract class WalletBaseService implements Service {
  public abstract coin: CoinTypes;

  abstract createWallet(user_id: string, coin: CoinTypes): Promise<IWalletModel>;
  abstract fetchTransactions(address: string): Promise<any[]>;
  abstract sendCoin(wallet: IWalletModel, toAddress: string, amountInEth: number): Promise<any>;

  protected async saveWallet(user_id: string, wallet: Partial<IWalletModel>) {
    console.log({ walletToSave: wallet });

    const newWallet = new Wallets({
      user_id,
      network: this.coin,
      isTestNet: !config.isProduction,
      ...wallet
    });

    const errors = newWallet.validateSync();
    if (errors) {
      throw new ClientError(500, errors.message);
    }

    return newWallet.save();
  };
};

export default WalletBaseService;