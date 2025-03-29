import { Document, Schema } from "mongoose";
import { CoinTypes, TransactionType } from "../bll";

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
  type: TransactionType,
  user_id: string
};

export const TransactionSchema = new Schema<ITransaction>({
  blockNumber: {
    type: Number,
    required: true,
  },
  date: String,
  hash: {
    type: String,
    required: true,
  },
  blockHash: {
    type: String,
    required: true,
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
  status: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    required: true
  }
}, {
  versionKey: false,
  autoIndex: true
});