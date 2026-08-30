import express from "express";
import commentController from "../controllers/commentController";

const router = express.Router({ mergeParams: true });

router.post("/", commentController.createComment);
router.put("/:commentId", commentController.updateComment);
router.delete("/:commentId", commentController.deleteComment);

export default router;