import mongoose from "mongoose";
import { mongoose as mongooseDB } from "../dal";
import { CoinTypes } from "../utils/coins";

export interface WalletModel {
  _id: mongoose.Types.ObjectId;
  name: CoinTypes;
  network?: string;
  user_id: mongoose.Schema.Types.ObjectId;
  isTestNet: boolean;
  privateKey: string;
  publicKey: string;
  address: string;
  hex: string;
  lastScanBlock: number;
  walletBalance: number;
};
export const Wallets = mongooseDB.db?.collection<WalletModel>('wallets');