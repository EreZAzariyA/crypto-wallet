import { createSlice } from '@reduxjs/toolkit'

const initialState: Record<string, number> = {};

const ratesSlicer = createSlice({
  name: 'rates',
  initialState,
  reducers: {
    handleRateUpdateAction(state, action) {
      state[action.payload.coin] = action.payload.last;
    }
  },
});

export const { handleRateUpdateAction } = ratesSlicer.actions;
export default ratesSlicer.reducer;