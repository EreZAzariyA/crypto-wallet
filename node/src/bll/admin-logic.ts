import { QueryOptions } from "mongoose";
import { Users, Wallets } from "../collections";
import { IUserModel, IWalletModel } from "../models";


class AdminLogic {

  async getUsers(queryOptions?: Partial<QueryOptions>): Promise<{ users: (Partial<IUserModel> & { wallet?: IWalletModel })[], total: number }> {
    const total = await Users.countDocuments({ admin: { $exists: false } }).lean().exec();
    const users = await Users.find(
      { admin: { $exists: false } },
      { services: 0, createdAt: 0, updatedAt: 0, loginAttempts: 0 },
      queryOptions
    ).exec();

    // const usersIds = users.map((user) => user._id);
    // const wallets = await Wallets.find({ user_id: { $in: usersIds }}).lean().exec();
    // const usersWallets = new Map(wallets.map((wallet) => [wallet.user_id.toString(), wallet]));

    return {
      // users: users.map((user) => ({
      //   ...user.toObject(),
      //   wallet: usersWallets.get(user._id.toString())
      // })),
      users,
      total
    };
  };

};

const adminLogic = new AdminLogic();
export default adminLogic;