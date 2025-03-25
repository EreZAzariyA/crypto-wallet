import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SocketState {
  messages: string[];
  data: any;
}

const initialState: SocketState = {
  messages: [],
  data: null,
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    updateData: (state, action: PayloadAction<any>) => {
      state.data = action.payload;
    },
    newMessage: (state, action: PayloadAction<string>) => {
      state.messages.push(action.payload);
    },
  },
});

export const { updateData, newMessage } = socketSlice.actions;
export default socketSlice.reducer;
