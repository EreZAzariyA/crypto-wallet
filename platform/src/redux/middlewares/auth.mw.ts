import { Middleware } from "redux";
import { logoutAction, signinAction } from "../actions/auth-actions";
import socketIo from "../../services/socketServices";
import { clearWallets } from "../slicers/wallets-slicer";

const authMiddleWare: Middleware = (store) => (next) => async (action: any) => {
  const { dispatch, getState } = store;
  const socket = socketIo;

  if (action.type === signinAction.fulfilled.type) {
    localStorage.setItem('user_id', action.payload.user_id);
    await next(action);
    const { user_id } = getState().auth;
    socket.userConnect(user_id);
  }

  if (action.type === logoutAction.fulfilled.type) {
    const { user_id } = getState().auth;
    socket.userDisconnect(user_id);
    dispatch(clearWallets());
    localStorage.removeItem('user_id');
  }

  next(action);
};

export default authMiddleWare;