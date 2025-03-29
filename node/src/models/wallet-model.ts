import mongoose, { Document, model, Schema } from "mongoose"
import { CoinTypes } from "../bll";

export interface IWalletModel extends Document {
  name: CoinTypes;
  network?: string;
  user_id: mongoose.Schema.Types.ObjectId;
  isTestNet: boolean;
  privateKey: string;
  publicKey: string;
  address: string;
  lastScanBlock: number;
  walletBalance: number;
};

export const WalletSchema = new Schema<IWalletModel>({
  name: {
    type: String,
    required: true
  },
  network: String,
  user_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  isTestNet: {
    type: Boolean,
    required: true
  },
  privateKey: {
    type: String,
    required: true,
    unique: true
  },
  publicKey: {
    type: String,
    unique: true,
    sparse: true
  },
  address: {
    type: String,
    required: true,
    unique: true
  },
  lastScanBlock: {
    type: Number,
    default: 0
  },
  walletBalance: {
    type: Number,
    default: 0
  }
}, {
  versionKey: false,
  timestamps: true,
  autoIndex: true
});