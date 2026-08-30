import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import reactionService from "../services/reactionService";
import { createResponse } from "../utils/createResponse";
import { toggleSchema } from "../schemas/reactionSchema";

const toggleLikes = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const { userId } = req.body;

    await toggleSchema.parseAsync({ postId, userId });

    const result = await reactionService.toggleLikes(postId.toString(), userId);

    res.status(200).json(createResponse(true, result, null));
  },
);

const toggleDislikes = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const { userId } = req.body;

    await toggleSchema.parseAsync({ postId, userId });

    const result = await reactionService.toggleDislikes(postId.toString(), userId);

    res.status(200).json(createResponse(true, result, null));
  },
);

export default {
  toggleLikes,
  toggleDislikes,
};
