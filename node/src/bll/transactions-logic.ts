import { QueryOptions } from "mongoose";
import { Transactions } from "../collections";
import { ITransaction } from "../models";
import { walletsLogic } from "./wallets";

class TransactionsLogic {
  async getUserTransactions(user_id: string, queryOptions: Partial<QueryOptions> = {}, isAdmin?: boolean): Promise<{ transactions: ITransaction[], total: number }> {

    const wallets = await walletsLogic.getUserWallets(user_id);
    const walletsAddress = wallets.map((wallet) => wallet.address.toLowerCase());

    const totalTransactions = await Transactions.aggregate([
      {
        $match: {
          $or: [
            { from: { $in: walletsAddress } },
            { to: { $in: walletsAddress } }
          ],
        }
      },
      {
        $facet: {
          transactions: [
            { $sort: { date: -1 } },
            { $project: {
                date: 1,
                from: 1,
                to: 1,
                coin: 1,
                amount: 1,
                status: 1,
                type: 1
              }
            },
            ...(queryOptions.skip ? [{ $skip: Number(queryOptions.skip) }] : []),
            ...(queryOptions.limit ? [{ $limit: Number(queryOptions.limit) }] : [])
          ],
          totalAmount: [{
            $group: {
              _id: null,
              total: { $sum: "$amount" }
            }
          }],
          totalCount: [{
            $count: "count"
          }]
        }
      }
    ]).exec();
    const transactions = totalTransactions[0].transactions || [];
    const total = totalTransactions[0].totalCount[0]?.count || 0;

    return {
      transactions,
      total
    };
  };
};

export const transactionsLogic = new TransactionsLogic();