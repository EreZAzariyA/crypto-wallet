import axios from "axios";
import { WalletModel } from "../models";
import config from "../utils/config";


class WalletsServices {

  async getUserWallets(user_id: string): Promise<WalletModel[]> {
    const res = await axios.get<WalletModel[]>(`${config.urls.wallet.getWallets}/${user_id}`);
    const wallets = res.data;
    return wallets;
  }

};

const walletServices = new WalletsServices();
export default walletServices;