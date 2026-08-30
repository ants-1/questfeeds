import { Router } from "express";

import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import postRoutes from "./postRoutes";
import commentRoutes from "./commentRoutes";
import reactionRoutes from "./reactionRoutes";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/users", userRoutes);
routes.use("/posts", postRoutes);
routes.use("/posts/:postId/comments", commentRoutes);
routes.use("/posts/:postId", reactionRoutes);

export default routes;
