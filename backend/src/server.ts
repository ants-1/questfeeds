import { createServer } from "http";
import { Server } from "socket.io";

import app from "./app";
import config from "./config/serverConfig";
import connectDB from "./config/db";
import { initialiseSocket } from "./socket";

const httpServer = createServer(app);
const io = new Server(httpServer, {});

initialiseSocket(io);

const startServer = async () => {
  try {
    await connectDB();

    httpServer.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);      
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();