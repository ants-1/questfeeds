import { Router } from "express";

import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/users", userRoutes);

export default routes;