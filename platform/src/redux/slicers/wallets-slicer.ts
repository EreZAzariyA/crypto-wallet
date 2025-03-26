import { ActionReducerMapBuilder, createSlice, SerializedError } from '@reduxjs/toolkit'
import { WalletModel } from '../../models';
import { createWalletAction, getUserWalletsAction } from '../actions/wallets-actions';

export interface WalletsState {
  wallets: Record<string, WalletModel>;
  loading: boolean;
  error: SerializedError | null;
};

const initialState: WalletsState = {
  wallets: {},
  loading: false,
  error: null,
};

const extraReducers = (builder: ActionReducerMapBuilder<WalletsState>) => {

  builder.addCase(getUserWalletsAction.pending, (state) => ({
    ...state,
    loading: true,
  }))
  .addCase(getUserWalletsAction.rejected, (state, { error }) => ({
    ...state,
    loading: false,
    error: error
  }))
  .addCase(getUserWalletsAction.fulfilled, (state, { payload }) => {
    const userWallets: Record<string, WalletModel> = {};
    payload.forEach((wallet) => {
      userWallets[wallet.name] = wallet;
    });

    return {
      ...state,
      loading: false,
      error: null,
      wallets: userWallets
    }
  });

  builder.addCase(createWalletAction.pending, (state) => ({
    ...state,
    loading: true
  }))
  .addCase(createWalletAction.rejected, (state, { error}) => ({
    ...state,
    loading: false,
    error: error
  }))
  .addCase(createWalletAction.fulfilled, (state, { payload, meta }) => ({
    ...state,
    loading: false,
    wallets: { ...state.wallets, [meta.arg.coin]: payload }
  }))
};

const walletsSlicer = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    updateAddress(state, action) {
      const { coin, wallet } = action.payload;
      state.wallets[coin] = wallet;
    },
    clearWallets(state) {
      state.wallets = {};
    }
  },
  extraReducers
});

export const { updateAddress, clearWallets } = walletsSlicer.actions;
export default walletsSlicer.reducer;