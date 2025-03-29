import { Middleware } from "redux";
import { logoutAction, signinAction } from "../actions/auth-actions";
import socketIo from "../../services/socketServices";
import { clearWallets } from "../slicers/wallets-slicer";
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";

const authMiddleWare: Middleware = (store) => (next) => async (action: any) => {
  const { dispatch, getState } = store;

  if (action.type === signinAction.fulfilled.type) {
    const expires = new Date(jwtDecode(action.payload).exp * 1000)
    Cookies.set('token', action.payload, {
      expires,
      secure: true,
      path: '/',
    });
    next(action);
  }

  if (action.type === logoutAction.fulfilled.type) {
    const user_id = getState().auth.user_id;
    socketIo.userDisconnect(user_id);
    dispatch(clearWallets());
    Cookies.remove('token');
    next(action);
  }

  next(action);
};

export default authMiddleWare;