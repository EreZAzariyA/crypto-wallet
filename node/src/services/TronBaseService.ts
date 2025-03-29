import { tronWeb } from "../dal";
import { CoinTypes } from "../bll";
import { ClientError, IWalletModel } from "../models";
import WalletBaseService from "./WalletBaseService";

class TronBaseService extends WalletBaseService {
  public coin: CoinTypes = CoinTypes.TRX;

  async createWallet(user_id: string, coin: CoinTypes): Promise<IWalletModel> {
    try {
      const wallet = await tronWeb.createAccount();
      return this.saveWallet(
        user_id,
        { address: wallet.address.base58,
          name: coin,
          privateKey: wallet.privateKey,
          publicKey: wallet.publicKey,
        });
    } catch (error) {
      throw new ClientError(500, `TronBaseService.createWallet[Error]: ${error?.message}`);
    }
  };

  async fetchTransactions(address: string): Promise<any[]> {
    return [];
  };
  async sendCoin(wallet: IWalletModel, toAddress: string, amountInTrx: number): Promise<any> {
    return [];
  };
};

export default TronBaseService;