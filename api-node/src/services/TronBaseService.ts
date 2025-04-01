import { WalletModel } from "../collections";
import { tronWeb } from "../dal";
import { ClientError } from "../models";
import { CoinTypes } from "../utils/coins";
import WalletBaseService from "./WalletBaseService";

class TronBaseService extends WalletBaseService {
  public coin: CoinTypes = CoinTypes.TRX;

  async createWallet(user_id: string, coin: CoinTypes): Promise<WalletModel> {
    try {
      const wallet = await tronWeb.createAccount();
      return this.saveWallet(
        user_id,
        {
          address: wallet.address.base58,
          name: coin,
          privateKey: wallet.privateKey,
          publicKey: wallet.publicKey,
          hex: wallet.address.hex
        });
    } catch (error) {
      throw new ClientError(500, `TronBaseService.createWallet[Error]: ${error?.message}`);
    }
  };

  async fetchTransactions(address: string): Promise<any[]> {
    return [];
  };
  async sendCoin(wallet: WalletModel, toAddress: string, amountInTrx: number): Promise<any> {
    return [];
  };
};

export default TronBaseService;