import { Middleware } from "redux";
import { logoutAction, signinAction } from "../actions/auth-actions";
import { clearWallets } from "../slicers/wallets-slicer";
import Cookies from 'js-cookie';

const authMiddleWare: Middleware = (store) => (next) => async (action: any) => {
  const { dispatch } = store;

  if (action.type === signinAction.fulfilled.type) {
    next(action);
  }

  if (action.type === logoutAction.fulfilled.type) {
    dispatch(clearWallets());
    Cookies.remove('token');
    next(action);
  }

  next(action);
};

export default authMiddleWare;