import { useEffect } from "react";
import socketIo from "../services/socketServices"

export const useSubscription = (emitTo: string) => {
  const socket = socketIo.socket;

  const onUpdate = (params: any) => {
    return params;
  };

  useEffect(() => {
    socket.on(emitTo, onUpdate);
  }, [emitTo, socket]);

  return onUpdate;
};