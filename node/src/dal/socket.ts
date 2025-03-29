import { Server as HttpServer } from "http";
import { Server as SocketServer, Socket, Namespace } from "socket.io";
import { Users } from "../collections";
import config from "../utils/config";

const options = {
  cors: {
    origin: "*"
  }
};

class SocketIo {
  public io: SocketServer;
  public users: Record<string, string> = {};

  constructor (httpServer: HttpServer) {
    this.io = new SocketServer(httpServer, options);
    this.io.on('connection', this.startListeners);
    this.io.of('/admin').on('connection', this.startAdminListeners);
  };

  startListeners = (socket: Socket) => {
    socket.on('user-connected', (user_id: string) => {
      console.log(`User ${user_id} connected...`);
      this.joinRoom(socket, user_id);
    });

    socket.on('handshake', async (user_id, callback) => {
      try {
        const user = await Users.findById(user_id).exec();
        if (!user) return;
        this.joinRoom(socket, user_id);
        callback(`Hello ${user.emails[0].email}, handshake completed. ${socket.id}`);
      } catch (error) {
        console.log({ error });
      }
    });

    socket.on("user-disconnect", (user_id: string) => {
      socket.leave(user_id);
      if (user_id) {
        delete this.users[user_id];
      }
      console.log(`user ${user_id} disconnected`);
    });
  };

  startAdminListeners = async (socket: Socket) => {
    const { user_id } = socket.handshake.auth;
    const user = await Users.findById(user_id).exec();
    if (!user) return;
    const { admin } = user;

    config.log.info(`Admin ${user.emails[0].email} connected...`);
    this.joinRoom(socket, user._id.toString());

    socket.on('handshake', async (user_id, callback) => {
      if (!admin) {
        this.joinRoom(socket, user_id);
      }
      callback(`Hello ${admin ? 'admin' : ''} ${user.emails[0].email}, handshake completed. ${socket.id}`);
    });

    socket.on("user-disconnect", (user_id: string) => {
      socket.leave(user_id);
      if (user_id) {
        delete this.users[user_id];
      }
      socket.disconnect();
      config.log.info(`user ${user_id} disconnected`);
    });
  };

  sendMessage(name: string, to: string, payload?: Object) {
    config.log.info(`Emitting event: ${name} to ${to}`);
    this.io.to(to).emit(name, payload);
  };

  joinRoom(socket: Socket, user_id: string) {
    this.users[user_id] = socket.id;
    socket.join(user_id);
    config.log.info(`User: ${user_id} subscribe on socket: ${socket.id}`);
  }

  leaveRoom(socket: Socket, user_id: string) {
    delete this.users[user_id];
    socket.leave(user_id);
    config.log.info(`User: ${user_id} unsubscribe on socket: ${socket.id}`);
  }
};

export default SocketIo;