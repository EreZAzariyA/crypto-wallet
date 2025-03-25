import { ObjectId, Types } from "mongoose";
import Wallets, { IWalletModel } from "../models/wallet-model";
import { ClientError, UserModel } from "../models";
import { Service } from "../services/WalletBaseService";
import WalletServiceFactory from "../services/WalletServiceFactory";

export enum CoinTypes {
  TRX = "TRX",
};

const isCoinValid = (coin: CoinTypes): Boolean => {
  return Object.values(CoinTypes).includes(coin.toUpperCase() as CoinTypes);
};

class WalletsLogic {
  async getUserWallets(user_id: string) {
    if (!Types.ObjectId.isValid(user_id)){
      throw new ClientError(500, 'User id is not in the correct format');
    }

    const user = await UserModel.findById(user_id).exec();
    if (!user) {
      throw new ClientError(400, 'User not found');
    }

    return await Wallets.find({ user_id }).exec();
  };

  async getUserWalletByCoin(user_id: string, coin: CoinTypes): Promise<IWalletModel> {
    if (!isCoinValid(coin)) {
      throw new ClientError(500, `Coin ${coin} is not valid`);
    }

    return Wallets.findOne({ user_id, name: coin }).exec();
  };

  async createWallet(user_id: string, coin: CoinTypes) {
    const service = WalletServiceFactory.createService(coin);
    console.log({service});
    const wallet = await service.createWallet(user_id);
    console.log({wallet});
    return wallet;
  }
};

const walletsLogic = new WalletsLogic();
export default walletsLogic;