import { tronWeb } from "../dal";
import { ClientError, IWalletModel } from "../models";
import { CoinsByNetwork, CoinTypes } from "../utils/coins";
import WalletBaseService from "./WalletBaseService";

class TronBaseService extends WalletBaseService {
  public coin: CoinTypes = CoinTypes.TRX;
  private supportedCoins = CoinsByNetwork[CoinTypes.TRX];

  async createWallet(user_id: string, coin: CoinTypes): Promise<IWalletModel> {
    try {
      const wallet = await tronWeb.createAccount();
      const wallets = {};
      for (const supCoin of this.supportedCoins) {
        const walletData = {
          address: wallet.address.base58,
          name: supCoin,
          privateKey: wallet.privateKey,
          publicKey: wallet.publicKey,
          hex: wallet.address.hex
        };
        try {
          const newWallet = await this.saveWallet(user_id, walletData);
          wallets[newWallet.name] = newWallet;
        } catch (error) {
          console.error(`Error saving wallet for ${supCoin}:`, error.message);
          if (error.code === 11000) {  // MongoDB duplicate key error code
            console.error(`Duplicate wallet detected for ${supCoin}. Skipping.`);
          } else {
            throw new ClientError(500, `TronBaseService.createWallet[Error]: ${error.message}`);
          }
        }
      }

      return wallets[CoinTypes.TRX];
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