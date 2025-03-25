import { ClientError } from "../models";
import Wallets, { IWalletModel } from "../models/wallet-model";
import { tronWeb } from "../dal";
import { CoinTypes } from "../bll/wallets";
import config from "../utils/config";

class TronService {
  public coin: CoinTypes = CoinTypes.TRX;

  async createWallet(user_id: string): Promise<IWalletModel> {
    let wallet: IWalletModel;
    try {
      wallet = await tronWeb.createAccount();
      wallet.isTestNet = !config.isProduction;
    } catch (error) {
      throw new ClientError(500, `TronService.createWallet[Error]: ${error?.message}`);
    }

    if (wallet.publicKey && wallet.address && wallet.address.hex) {
      const newWallet = new Wallets({
        user_id,
        name: this.coin,
        ...wallet
      });

      const errors = newWallet.validateSync();
      if (errors) {
        throw new ClientError(500, errors.message);
      }

      return newWallet.save();
    }

    return wallet;
  }
};

const tronService = new TronService();
export default tronService;