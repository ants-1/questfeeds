import * as z from "zod";

export const usersSchema = z.object({
  page: z.coerce.number().min(1, "Page requires a positive number").optional(),
  limit: z.coerce
    .number()
    .min(1, "Limit requires a positive number")
    .optional(),
  search: z.string().optional(),
});

export const userIdSchema = z.object({
  id: z.string(),
});

export const updateUserSchema = z.object({
  username: z.string().min(3, "Username must be 3 characters long").optional(),
  email: z.email().optional(),
  avatar: z.string().optional(),
  bio: z.string().optional(),
});

export const updatePasswordSchema = z.object({
  id: z.string(),
  oldPassword: z.string().min(6, "Old password must be 6 characters long"),
  newPassword: z.string().min(6, "New password must be 6 characters long"),
});
