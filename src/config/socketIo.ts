import { Server }from "socket.io";

const connectSocket = (server:any) => {   
    const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"],
    },
    });

    io.on("connection", (socket) => {
    // console.log(`User Connected: ${socket.id}`);

    socket.on("send_message", (data) => {
        socket.broadcast.emit("receive_message", data)
    });
    })
}

export default connectSocket;