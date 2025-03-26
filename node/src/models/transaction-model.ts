import { Document, model, Schema } from "mongoose";
import { CoinTypes } from "../bll/wallets";

export const TransactionsStatus = {
  Success: 'Success',
  Denied: 'Denied',
  Pending: 'Pending'
};

export interface ITransaction extends Document {
  blockNumber: number;
  date: string;
  hash: string;
  blockHash: string;
  transactionIndex: number;
  from: string;
  to: string;
  coin: CoinTypes,
  amount: number;
  status: string;
};

const TransactionSchema = new Schema<ITransaction>({
  blockNumber: {
    type: Number,
    required: true,
    unique: true
  },
  date: String,
  hash: {
    type: String,
    required: true,
    unique: true
  },
  blockHash: {
    type: String,
    required: true,
    unique: true
  },
  transactionIndex: Number,
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  coin: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: String,
}, {
  versionKey: false,
  autoIndex: true
});

const TransactionModel = model<ITransaction>('Transaction', TransactionSchema, 'transactions');
export default TransactionModel;