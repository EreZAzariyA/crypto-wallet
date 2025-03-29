import { Middleware } from "@reduxjs/toolkit";
import socketServices from "../../services/socketServices";

const socketMiddleware: Middleware = (store) => (next) => (action) => {
  const { getState } = store;
  const socketIo = socketServices;

  socketIo.socket.io.on('reconnect', () => {
    console.log('Server reconnected...');
    const { user } = getState().auth;
    socketIo.sendHandshake(user._id);
  });

  socketIo.socket.io.on('reconnect_error', (error) => {
    console.log(`Server reconnect error - ${error?.message}.`);
  });

  socketIo.socket.io.on('reconnect_attempt', (attempt) => {
    console.log(`Trying to reconnect server - ${attempt} time.`);
  });

  next(action);

};

export default socketMiddleware;
