import { io, Socket } from "socket.io-client";

class SocketIo {
  public socket: Socket;

  initSocket() {
    this.socket = io(
      import.meta.env.VITE_SOCKET_URL,
      {
      reconnection: true,
      autoConnect: true,
    });
  };

  userConnect(user_id: string) {
    this.socket.connect();
    this.socket.emit('user-connected', user_id);
  };

  userDisconnect(user_id: string) {
    this.socket.emit('user-disconnect', user_id);
  };

  async sendHandshake(user_id: string) {
    console.log('Sending handshake to server...');

    this.socket.emit('handshake', user_id, async (user: string) => {
      console.log('User handshake callback message received', user);
      return user;
    });
  }
}

const socketIo = new SocketIo();
export default socketIo;