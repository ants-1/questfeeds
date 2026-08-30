import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import commentService from "../services/CommentService";
import { createResponse } from "../utils/createResponse";
import {
  createCommentSchema,
  updateCommentSchema,
  deleteCommentSchema,
} from "../schemas/commentSchema";

const createComment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId, content, author } = await createCommentSchema.parseAsync(
      req.body,
    );

    const result = await commentService.createComment(postId, content, author);

    res.status(201).json(createResponse(true, result, null));
  },
);

const updateComment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId, commentId, content, author } =
      await updateCommentSchema.parseAsync(req.body);

    const result = await commentService.updateComment(
      postId,
      commentId,
      content,
      author,
    );

    res.status(200).json(createResponse(true, result, null));
  },
);

const deleteComment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId, commentId, author } = await deleteCommentSchema.parseAsync(
      req.body,
    );

    const result = await commentService.deleteComment(
      postId,
      commentId,
      author,
    );

    res.status(200).json(createResponse(true, result, null));
  },
);

export default {
  createComment,
  updateComment,
  deleteComment,
};
