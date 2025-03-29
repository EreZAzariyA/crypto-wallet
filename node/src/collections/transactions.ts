import { model } from "mongoose";
import { ITransaction, TransactionSchema } from "../models";

export const Transactions = model<ITransaction>('Transaction', TransactionSchema, 'transactions');