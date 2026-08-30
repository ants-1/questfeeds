import * as z from "zod";

export const postsSchema = z.object({
  page: z.coerce.number().min(1, "Page requires a positive number").optional(),
  limit: z.coerce
    .number()
    .min(1, "Limit requires a positive number")
    .optional(),
  search: z.string().optional(),
});

export const feedPostsSchema = z.object({
  id: z.string(),
  page: z.coerce.number().min(1, "Page requires a positive number").optional(),
  limit: z.coerce
    .number()
    .min(1, "Limit requires a positive number")
    .optional(),
  search: z.string().optional(),
});

export const postIdSchema = z.object({
  id: z.string(),
});

export const createPostSchema = z.object({
  title: z.string().min(3, "Title must be 3 characters long"),
  content: z.string().min(3, "Content must be 3 characters long"),
  featureImg: z.string().optional(),
  author: z.string(),
});

export const updatePostSchema = z.object({
  title: z.string().min(3, "Title must be 3 characters long").optional(),
  content: z.string().min(3, "Content must be 3 characters long").optional(),
  featureImg: z.string().optional(),
  author: z.string(),
});

export const deletePostSchema = z.object({
  author: z.string(),
});
