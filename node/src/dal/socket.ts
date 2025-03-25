import { Server as SocketServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import config from "../utils/config";
import { UserModel } from "../models";

const options = {
  cors: {
    origin: "*"
  }
};

class SocketIo {
  public static socket: SocketIo;
  public io: SocketServer

  public users: Record<string, string>;

  constructor (httpServer: HttpServer) {
    SocketIo.socket = this;
    this.users = {};
    this.io = new SocketServer(httpServer, options);
    this.io.sockets.adapter
    this.io.on('connect', this.startListeners);
  }

  startListeners = (socket: Socket) => {
    console.log(Array.from(this.io.sockets.adapter.rooms));
    console.log("One client has been connected...", socket.id);

    socket.on('handshake', async (user_id, callback) => {
      const user = await UserModel.findById(user_id).exec();
      const response = `Hello ${user.profile?.first_name}, handshake completed. ${socket.id}`;
      socket.join(user_id);
      console.log(`Room for ${user_id} created`);
      callback(response);
    });

    socket.on("user-disconnect", (user_id: string) => {
      console.log(`user ${user_id} disconnected`);
      socket.leave(user_id);
      if (user_id) {
        delete this.users[user_id];
      }
    });

    socket.on('disconnect', () => {
      console.info('Disconnect received from: ' + socket.id);
    });
  };

  // emitWalletBalance(user_id: string, wallet: IWalletModel) {
  //   const socketId = this.sockets[user_id];
  //   if (socketId) {
  //     this.socket.to(socketId).emit('wallet-balance', wallet);
  //   }
  // };


  getUserIdFromSocketID = (socketId: string) => {
    return Object.keys(this.users).find((socket) => socket === socketId);
  };

  sendMessage(name: string, to: string, payload?: Object) {
    config.log.info(`Emitting event: ${name} to ${to}`);
    this.io.to(to).emit(name, payload);
  };

  joinRoom(socket: Socket, user_id: string) {
    socket.join(user_id);
    console.log(socket.rooms.keys);
  }
};

export default SocketIo;