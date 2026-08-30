import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import postService from "../services/postService";
import { createResponse } from "../utils/createResponse";
import {
  postsSchema,
  postIdSchema,
  createPostSchema,
  updatePostSchema,
  deletePostSchema,
  feedPostsSchema,
} from "../schemas/postSchema";

const getAllPosts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      page = 1,
      limit = 10,
      search = "",
    } = await postsSchema.parseAsync(req.query);

    const result = await postService.getAllPosts(page, limit, search);

    res.status(200).json(createResponse(true, result, null));
  },
);

const getPopularPosts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.getPopularPost();

    res.status(200).json(createResponse(true, result, null));
  },
);

const getFeedPosts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      id,
      page = 1,
      limit = 10,
      search = "",
    } = await feedPostsSchema.parseAsync(req.body);

    const result = await postService.getFeedPosts(id, page, limit, search);

    res.status(200).json(createResponse(true, result, null));
  },
);

const getPost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = await postIdSchema.parseAsync(req.params);

    const result = await postService.getPost(id);

    res.status(200).json(createResponse(true, result, null));
  },
);

const createPost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, content, featureImg, author } =
      await createPostSchema.parseAsync(req.body);

    const result = await postService.createPost(
      title,
      content,
      author,
      featureImg,
    );

    res.status(201).json(createResponse(true, result, null));
  },
);

const updatePost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = await postIdSchema.parseAsync(req.params);
    const { author, title, content, featureImg } =
      await updatePostSchema.parseAsync(req.body);

    const result = await postService.updatePost(
      id.toString(),
      author,
      title,
      content,
      featureImg,
    );

    res.status(200).json(createResponse(true, result, null));
  },
);

const deletePost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = await postIdSchema.parseAsync(req.params);
    const { author } = await deletePostSchema.parseAsync(req.body);

    const result = await postService.deletePost(id, author);

    res.status(200).json(createResponse(true, result, null));
  },
);

export default {
  getAllPosts,
  getPopularPosts,
  getFeedPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
};
