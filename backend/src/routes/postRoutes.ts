import express from "express";
import postController from "../controllers/postController";

const router = express.Router();

router.get("/", postController.getAllPosts);
router.get("/popular", postController.getPopularPosts);
router.get("/feed", postController.getFeedPosts);
router.get("/:id", postController.getPost);
router.post("/", postController.createPost);
router.put("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);

export default router;
