import { configureStore } from "@reduxjs/toolkit";
import authSlicer from "./slicers/auth-slicer";
import walletSlicer from "./slicers/wallets-slicer";
import { useDispatch, useSelector } from "react-redux";
import socketMiddleware from "./middlewares/socketMiddleware";
import authMiddleWare from "./middlewares/auth.mw";

const store = configureStore({
  reducer: {
    auth: authSlicer,
    wallets: walletSlicer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ['payload'],
      },
    }).concat(socketMiddleware).concat(authMiddleWare),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>()

export default store;