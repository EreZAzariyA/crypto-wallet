import { Server as SocketServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import config from "../utils/config";
import { ClientError, UserModel } from "../models";

const options = {
  cors: {
    origin: "*"
  }
};

class SocketIo {
  public static socket: SocketIo;
  public io: SocketServer

  public users: Record<string, string> = {};

  constructor (httpServer: HttpServer) {
    SocketIo.socket = this;
    this.io = new SocketServer(httpServer, options);
    this.io.on('connect', this.startListeners);
  }

  startListeners = (socket: Socket) => {
    config.log.debug('Open rooms:', this.users, Array.from(socket.rooms));
    socket.on('user-connected', (user_id: string) => {
      console.log(`User ${user_id} connected...`);
      this.joinRoom(socket, user_id);
    })

    socket.on('handshake', async (user_id, callback) => {
      try {
        const user = await UserModel.findById(user_id).exec();
        if (!user) return;
        this.joinRoom(socket, user_id);
        const response = `Hello ${user.emails[0].email}, handshake completed. ${socket.id}`;
        callback(response);
      } catch (error) {
        console.log({ error });
      }
    });

    socket.on("user-disconnect", (user_id: string) => {
      console.log(`user ${user_id} disconnected`);
      socket.leave(user_id);
      if (user_id) {
        delete this.users[user_id];
      }
    });
  };

  sendMessage(name: string, to: string, payload?: Object) {
    config.log.info(`Emitting event: ${name} to ${to}`);
    this.io.to(to).emit(name, payload);
  };

  joinRoom(socket: Socket, user_id: string) {
    this.users[user_id] = socket.id;
    socket.join(user_id);
    console.log(`User: ${user_id} subscribe on socket: ${socket.id}`);
  }
};

export default SocketIo;