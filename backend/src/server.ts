import { createServer } from "http";
import { Server } from "socket.io";

import app from "./app";
import config from "./config/serverConfig";
import connectDB from "./config/db";
import { initialiseSocket } from "./socket";

const httpServer = createServer(app);
const io = new Server(httpServer, {});

initialiseSocket(io);

connectDB();

httpServer.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
