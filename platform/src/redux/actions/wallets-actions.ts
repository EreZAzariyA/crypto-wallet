import { createAsyncThunk } from "@reduxjs/toolkit";
import walletServices from "../../services/wallets";
import { WalletModel } from "../../models";

export enum WalletActions {
  GET_WALLETS = "wallet/get-wallet",
};

export const getUserWalletsAction = createAsyncThunk<WalletModel[], { user_id: string }>(
  WalletActions.GET_WALLETS,
  async({ user_id }) => await walletServices.getUserWallets(user_id),
);