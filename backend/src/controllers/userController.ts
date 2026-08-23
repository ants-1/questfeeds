import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import userService from "../services/userService";
import { createResponse } from "../utils/createResponse";
import {
  usersSchema,
  userIdSchema,
  updateUserSchema,
  updatePasswordSchema,
} from "../schemas/userSchema";

const getAllUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      page = 1,
      limit = 10,
      search = "",
    } = await usersSchema.parseAsync(req.query);

    const result = await userService.getAllUsers(page, limit, search);

    res.status(200).json(createResponse(true, result, null));
  },
);

const getUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = await userIdSchema.parseAsync(req.params);

    const result = userService.getUser(id);

    res.status(200).json(createResponse(true, result, null));
  },
);

const updateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = await userIdSchema.parseAsync(req.params);
    const { username, email, avatar, bio } = await updateUserSchema.parseAsync(
      req.body,
    );

    const result = await userService.updateUser(
      id.toString(),
      username,
      email,
      avatar,
      bio,
    );

    res.status(200).json(createResponse(true, result, null));
  },
);

const updateUserPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id, oldPassword, newPassword } =
      await updatePasswordSchema.parseAsync(req.body);

    const result = await userService.updateUserPassword(
      id,
      oldPassword,
      newPassword,
    );

    res.status(200).json(createResponse(true, result, null));
  },
);

export default { getAllUsers, getUser, updateUser, updateUserPassword };
