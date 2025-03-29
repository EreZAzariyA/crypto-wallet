import { CoinsType } from "../utils/coinsUtils";

export const TransactionsStatus = {
  Success: 'Success',
  Denied: 'Denied',
  Pending: 'Pending'
};

export enum TransactionType {
  Sent = "Sent",
  Receive = "Receive"
};

export interface TransactionModel {
  _id: string;
  date: string;
  from: string;
  to: string;
  coin: CoinsType,
  amount: number;
  status: string;
  type: TransactionType,
  user_id: string
};