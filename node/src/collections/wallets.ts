import { model } from "mongoose";
import { IWalletModel, WalletSchema } from "../models";

export const Wallets = model<IWalletModel>('wallet', WalletSchema, 'wallets');