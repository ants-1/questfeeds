import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler";
import routes from "./routes/indexRoutes";
import { rateLimiter } from "./middlewares/rateLimiter";

const app = express();

// Global Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(rateLimiter);

// Routes
app.use("/api/v1", routes);

// Global error handler
app.use(errorHandler);

export default app;
