import { createAsyncThunk } from "@reduxjs/toolkit";
import walletServices from "../../services/wallets";
import { WalletModel } from "../../models";
import { CoinsType } from "../../utils/enums";

export enum WalletActions {
  CREATE_WALLET = "wallet/create-wallet",
  GET_WALLETS = "wallet/get-wallet",
};

export const createWalletAction = createAsyncThunk<WalletModel, { user_id: string, coin: CoinsType }>(
  WalletActions.CREATE_WALLET,
  async ({ user_id, coin }, thunkApi) => {
    try {
      const wallet = await walletServices.createWallet(user_id, coin);
      console.log({ wallet });
      
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