import { Middleware } from "redux";
import { logoutAction, signinAction } from "../actions/auth-actions";
import socketIo from "../../services/socketServices";
import { clearWallets } from "../slicers/wallets-slicer";
// import { jwtDecode } from "jwt-decode";


const authMiddleWare: Middleware = (store) => (next) => async (action: any) => {
  const { dispatch, getState } = store;
  const socket = socketIo;

  if (action.type === signinAction.fulfilled.type) {
    await next(action);
    const { user } = getState().auth;
    socket.userConnect(user?._id);
  }

  if (action.type === logoutAction.fulfilled.type) {
    const { user } = getState().auth;
    socket.userDisconnect(user?._id);
    dispatch(clearWallets());
    localStorage.removeItem('token');
  }

  next(action);
};

export default authMiddleWare;