import { Router } from "express";

import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import postRoutes from "./postRoutes";
import commentRoutes from "./commentRoutes";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/users", userRoutes);
routes.use("/posts", postRoutes);
routes.use("/posts/:postId/comments", commentRoutes);

export default routes;
