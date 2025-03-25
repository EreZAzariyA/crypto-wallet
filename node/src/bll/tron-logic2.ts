import axios from "axios";
import { ClientError, UserModel } from "../models";
import Wallets, { IWalletModel } from "../models/wallet-model";
import { Types } from "mongoose";

class TronLogic {

  async createWallet(user_id: string) {
    const objectId = new Types.ObjectId(user_id);
    const user = UserModel.findById(objectId).exec();
    if (!user) {
      throw new ClientError(400, 'User not found');
    }

    const tronWallet = await Wallets.findOne({ name: 'TRON' }).exec();
    if (!!tronWallet) {
      console.log({ tronWallet });
      return tronWallet
    }

    let wallet = null;

    try {
      const res = await axios.post<IWalletModel>(`http://localhost:5001/api/create-wallet/${user_id}`);
      wallet = res.data;
    } catch (error) {
      console.log({ error });
      throw new ClientError(500, error?.message);
    }

    if (wallet.name && wallet.address.hex) {
      wallet.user_id = user_id;
      const newWallet = new Wallets(wallet);
      const errors = newWallet.validateSync();
      if (errors) {
        throw new ClientError(500, errors.message);
      }
      wallet = newWallet.save();
    }

    return wallet;
  }
};

const tronLogic = new TronLogic();
export default tronLogic;