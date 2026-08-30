import * as z from "zod";

export const toggleSchema = z.object({
  postId: z.string(),
  userId: z.string(),
});
