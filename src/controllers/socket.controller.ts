import { Server } from "socket.io";
import Chat from "../models/chat.model";

const online_users: { id: string; username: string }[] = [];

const connectSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    socket.on("disconnect", () => {
      const index = online_users.findIndex((u) => u.id == socket.id);
      online_users.splice(index, 1);
      socket.broadcast.emit(
        "users",
        online_users.map((u) => u.username)
      );
    });

    socket.on("joined", (username) => {
      online_users.push({ username, id: socket.id });
      socket.broadcast.emit("new_user", username);
      socket.emit(
        "users",
        online_users.map((u) => u.username)
      );
      Chat.find()
        .exec()
        .then((data) => {
          socket.emit("messages", data);
        });
    });

    socket.on("send_message", (data) => {
      const chat = new Chat({
        ...data,
      });
      chat.save().then((newChat) => {
        socket.broadcast.emit("receive_message", newChat);
      });
    });
  });
};

export default connectSocket;
