import { ClientError } from "../models";
import { IWalletModel } from "../models/wallet-model";
import { tronWeb } from "../dal";
import { CoinTypes } from "../bll/wallets";
import config from "../utils/config";
import WalletBaseService from "./WalletBaseService";

class TronService extends WalletBaseService {
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
      return this.saveWallet(user_id, wallet);
    }

    return wallet;
  };
};

export default TronService;