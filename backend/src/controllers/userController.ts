import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import userService from "../services/userService";
import { createResponse } from "../utils/createResponse";

const getAllUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.page?.toString() || "";

    const result = await userService.getAllUsers(page, limit, search);

    res.status(200).json(createResponse(true, result, null));
  },
);

const getUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = userService.getUser(id.toString());

    res.status(200).json(createResponse(true, result, null));
  },
);

const updateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { username, email, avatar, bio } = req.body;

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
    const { id, oldPassword, newPassword } = req.body;

    const result = await userService.updateUserPassword(
      id,
      oldPassword,
      newPassword,
    );

    res.status(200).json(createResponse(true, result, null));
  },
);

export default { getAllUsers, getUser, updateUser, updateUserPassword };
