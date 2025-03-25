import { CoinTypes } from "../bll/wallets";
import { ClientError } from "../models";
import Wallets, { IWalletModel } from "../models/wallet-model";
import config from "../utils/config";

export interface Service {
  coin: CoinTypes;
  createWallet: (user_id: string) => Promise<IWalletModel>;
};

abstract class WalletBaseService implements Service {
  public abstract coin: CoinTypes;

  abstract createWallet(user_id: string): Promise<IWalletModel>;

  protected async saveWallet(user_id: string, wallet: Partial<IWalletModel>) {
    const newWallet = new Wallets({
      user_id,
      name: this.coin,
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