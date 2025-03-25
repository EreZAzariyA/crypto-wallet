import { ClientError } from "../models";
import Wallets, { IWalletModel } from "../models/wallet-model";
import { CoinTypes } from "../bll/wallets";
import config from "../utils/config";
import WalletBaseService from "./WalletBaseService";
import Web3 from 'web3';
import Web3Provider from "../dal/web3";

class ETHService extends WalletBaseService {
  public coin: CoinTypes = CoinTypes.ETH;

  protected web3 = new Web3(Web3Provider);

  async createWallet(user_id: string): Promise<IWalletModel> {
    try {
      const wallet = this.web3.eth.accounts.create();


      return await this.saveWallet(user_id, { address: wallet.address, privateKey: wallet.privateKey });
    } catch (error) {
      throw new ClientError(500, `ETHService.createWallet[Error]: ${error?.message}`);
    }

    // if (wallet.publicKey && wallet.address && wallet.address.hex) {
    //   return this.saveWallet(user_id, wallet);
    // }

  };
};

export default ETHService;