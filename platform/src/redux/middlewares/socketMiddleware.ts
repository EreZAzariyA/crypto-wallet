import { Middleware } from "@reduxjs/toolkit";
import socketIo from "../../services/socketServices";
import { updateAddress } from "../slicers/wallets-slicer";

const socketMiddleware: Middleware = (store) => {
  const { dispatch, getState } = store;
  return (next) => (action: any) => {
    const socket = socketIo.socket;
    const { token } = getState().auth;
    socket.auth = { token };

    socket.on('wallet-balance', ({ coin, wallet }) => {
      dispatch(updateAddress({ coin, wallet }));
      console.log('wallet updated');
    });

    socket.io.on('reconnect', () => {
      console.log('Server reconnected...');
    });
    socket.io.on('reconnect_error', (error) => {
      console.log(`Server reconnect error - ${error?.message}.`);
    });
    socket.io.on('reconnect_attempt', (attempt) => {
      console.log(`Trying to reconnect server - ${attempt} time.`);
    });

    return next(action);
  };
};

export default socketMiddleware;
