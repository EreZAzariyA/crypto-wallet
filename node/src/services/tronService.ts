import { ClientError } from "../models";
import { IWalletModel } from "../models/wallet-model";
import { tronWeb } from "../dal";
import { CoinTypes } from "../bll/wallets";
import WalletBaseService from "./WalletBaseService";

class TronService extends WalletBaseService {
  public coin: CoinTypes = CoinTypes.TRX;

  async createWallet(user_id: string): Promise<IWalletModel> {
    try {
      const wallet = await tronWeb.createAccount();
      return this.saveWallet(
        user_id,
        { address: wallet.address.base58,
          privateKey: wallet.privateKey,
          publicKey: wallet.publicKey
        });
    } catch (error) {
      throw new ClientError(500, `TronService.createWallet[Error]: ${error?.message}`);
    }
  };

  async fetchTransactions(address: string): Promise<any[]> {
    return [];
  };
  async sendCoin(wallet: IWalletModel, toAddress: string, amountInTrx: string): Promise<any> {
    return [];
  };
};

export default TronService;