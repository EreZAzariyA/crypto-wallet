import { ActionReducerMapBuilder, createSlice, SerializedError } from '@reduxjs/toolkit'
import { WalletModel } from '../../models';
import { getUserWalletsAction } from '../actions/wallets-actions';

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
    .addCase(getUserWalletsAction.rejected, (state, action) => ({
      ...state,
      loading: false,
      error: action.error
    }))
    .addCase(getUserWalletsAction.fulfilled, (state, action) => {
      const userWallets: Record<string, WalletModel> = {};
      action.payload.forEach((wallet) => {
        userWallets[wallet.name] = wallet;
      })

      return {
        ...state,
        loading: false,
        error: null,
        wallets: userWallets
      }
    });
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