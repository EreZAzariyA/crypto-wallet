import { mongoose } from "../dal";
import { CoinTypes, TransactionType } from "../utils/coins";

export const TransactionsStatus = {
  Success: 'Success',
  Denied: 'Denied',
  Pending: 'Pending'
};

export interface Transaction {
  blockNumber: number;
  date: string;
  hash: string;
  blockHash: string;
  transactionIndex: number;
  from: string;
  to: string;
  coin: CoinTypes;
  amount: number;
  status: string;
  type: TransactionType;
  user_id: string;
};

export const Transactions = mongoose.db?.collection<Transaction>('transactions');