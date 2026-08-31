import express from "express";
import userController from "../controllers/userController";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", authenticate, userController.getAllUsers);
router.get("/:id", authenticate, userController.getUser);
router.put("/:id", authenticate, userController.updateUser);
router.put("/:id/password", authenticate, userController.updateUserPassword);

export default router;
