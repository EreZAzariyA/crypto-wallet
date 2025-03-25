import { Document, model, Schema } from "mongoose"

export interface IWalletModel extends Document {
  name: string;
  user_id: string;
  isTestNet: boolean;
  privateKey: string;
  publicKey: string;
  address: {
    base58: string;
    hex: string
  };
  walletBalance: number;
};

const WalletSchema = new Schema<IWalletModel>({
  name: {
    type: String,
    required: true
  },
  user_id: Schema.ObjectId,
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
    required: true,
    unique: true
  },
  address: {
    base58: {
      type: String,
      required: true,
      unique: true
    },
    hex: {
      type: String,
      required: true,
      unique: true
    }
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
