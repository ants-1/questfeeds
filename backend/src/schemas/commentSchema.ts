import * as z from "zod";

export const createCommentSchema = z.object({
  postId: z.string(),
  content: z.string().min(3, "Content must have more than 3 characters"),
  author: z.string(),
});

export const updateCommentSchema = z.object({
  postId: z.string(),
  commentId: z.string(),
  content: z.string().min(3, "Content must have more than 3 characters"),
  author: z.string(),
});

export const deleteCommentSchema = z.object({
  postId: z.string(),
  commentId: z.string(),
  author: z.string(),
});
