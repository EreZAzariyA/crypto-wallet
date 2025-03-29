import { io, Socket } from "socket.io-client";

const isAdminENV = JSON.parse(import.meta.env.VITE_ADMIN || null)
const url = `${import.meta.env.VITE_SOCKET_URL}${isAdminENV ? 'admin' : ''}`

class SocketIo {
  public socket: Socket;
  public walletsNamespace: Socket;

  initSocket() {
    this.socket = io(
      url,
      {
        reconnection: true,
        autoConnect: false,
      },
    )
  };

  connect(user_id: string) {
    this.socket.connect();
    this.socket.auth = { user_id }
    this.sendHandshake(user_id);
    this.startListeners(this.socket, user_id);
  };
  disconnect(user_id: string) {
    this.socket.emit('user-disconnect', user_id);
    this.socket.disconnect();
  };

  userConnect(user_id: string) {
    this.socket.emit('user-connected', user_id);
  };

  // userDisconnect(user_id: string) {
    
  // };

  async sendHandshake(user_id: string) {
    console.log('Sending handshake to server...');

    this.socket.emit('handshake', user_id, async (message: string) => {
      console.log('User handshake callback message received:', message);
    });
  };

  startListeners(socket: Socket, user_id: string) {
    socket.io.on('reconnect', () => {
      console.log('Server reconnected...');
      this.sendHandshake(user_id);
    });

    socket.io.on('reconnect_error', (error) => {
      console.log(`Server reconnect error - ${error?.message}.`);
    });

    socket.io.on('reconnect_attempt', (attempt) => {
      console.log(`Trying to reconnect server - ${attempt} time.`);
    });
  }
}

const socketServices = new SocketIo();
export default socketServices;