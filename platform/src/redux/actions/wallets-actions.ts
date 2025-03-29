import { createAsyncThunk } from "@reduxjs/toolkit";
import { WalletModel } from "../../models";
import walletServices from "../../services/wallets";
import { CoinsType } from "../../utils/enums";

export enum WalletActions {
  CREATE_WALLET = "wallet/create-wallet",
  GET_WALLETS = "wallet/get-wallet",
  SEND_COINS = "wallet/send-coins",
};

export const createWalletAction = createAsyncThunk<WalletModel, { user_id: string, coin: CoinsType }>(
  WalletActions.CREATE_WALLET,
  async ({ user_id, coin }, thunkApi) => {
    try {
      const wallet = await walletServices.createWallet(user_id, coin);
      return thunkApi.fulfillWithValue(wallet);
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  },
);

export const getUserWalletsAction = createAsyncThunk<WalletModel[], string>(
  WalletActions.GET_WALLETS,
  async (user_id) => await walletServices.getUserWallets(user_id),
);

export const sendCoinsAction = createAsyncThunk<WalletModel[], { wallet: WalletModel, to: string, amount: number }>(
  WalletActions.SEND_COINS,
  async ({ wallet, to, amount }, thunkApi) => {
    try {
      const trans = await walletServices.sendCoins(wallet, to, amount);
      return thunkApi.fulfillWithValue(trans);
    } catch (error: any) {
      return thunkApi.rejectWithValue(error?.message);
    }
  },
);