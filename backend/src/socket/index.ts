import { Server } from "socket.io";

export function initialiseSocket(io: Server) {
  io.on("connection", (socket) => {
    console.log(`Connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`Disconnected: ${socket.id}`);
    });
  });
}
