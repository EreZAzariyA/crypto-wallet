import mongoose, { Document, model, Schema } from "mongoose"

export interface IWalletModel extends Document {
  name: string;
  user_id: mongoose.Schema.Types.ObjectId;
  isTestNet: boolean;
  privateKey: string;
  publicKey: string;
  address: string;
  walletBalance: number;
};

const WalletSchema = new Schema<IWalletModel>({
  name: {
    type: String,
    required: true
  },
  user_id: {
    type: Schema.ObjectId,
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
    unique: true
  },
  address: {
    type: String,
    required: true,
    unique: true
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
