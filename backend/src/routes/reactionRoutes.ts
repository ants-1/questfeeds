import express from "express";
import reactionController from "../controllers/reactionController";

const router = express.Router({ mergeParams: true });

router.use("/likes", reactionController.toggleLikes);
router.use("/dislikes", reactionController.toggleDislikes);

export default router;
