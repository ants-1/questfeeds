import express from "express";
import userController from "../controllers/userController";

const router = express.Router();

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUser);
router.put("/", userController.updateUser);
router.put("/:id/password", userController.updateUserPassword);

export default router;