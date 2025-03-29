import { useEffect } from 'react';
import socketServices from '../services/socketServices';

export interface Event {
  name: string;
  handler(...args: any[]): any;
}

export const useSocketEvents = (events: Event[]) => {
  const socket = socketServices.socket;

  useEffect(() => {
    if (!socket) return;
    for (const event of events) {
      socket.on(event.name, event.handler);
    }

    return function () {
      for (const event of events) {
        socket.off(event.name);
      }
    };
  }, [socket]);
}