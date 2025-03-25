import axios from "axios";
import { WalletModel } from "../models";
import config from "../utils/config";
import { CoinsType } from "../utils/enums";


class WalletsServices {

  async createWallet(user_id: string, coin: CoinsType): Promise<WalletModel> {
    const res = await axios.post<WalletModel>(`${config.urls.wallet.createWallet}`, { user_id, coin });
    const wallets = res.data;
    return wallets;
  };

  async getUserWallets(user_id: string): Promise<WalletModel[]> {
    const res = await axios.get<WalletModel[]>(`${config.urls.wallet.getWallets}/${user_id}`);
    const wallets = res.data;
    return wallets;
  }

};

const walletServices = new WalletsServices();
export default walletServices;