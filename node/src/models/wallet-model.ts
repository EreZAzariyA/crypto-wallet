import mongoose, { Document, model, Schema } from "mongoose"
import { CoinTypes } from "../bll/wallets";

export interface IWalletModel extends Document {
  name: string;
  user_id: mongoose.Schema.Types.ObjectId;
  isTestNet: boolean;
  privateKey: string;
  publicKey: string;
  address: string;
  lastScanBlock: number;
  walletBalance: number;
};

const WalletSchema = new Schema<IWalletModel>({
  name: {
    type: String,
    required: true
  },
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

const Wallets = model<IWalletModel>('wallet', WalletSchema, 'wallets');
export default Wallets;
