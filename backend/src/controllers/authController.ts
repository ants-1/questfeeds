import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import authService from "../services/authService";
import { createResponse } from "../utils/createResponse";

const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body;

    const result = await authService.register(username, email, password);

    res.status(201).json(createResponse(true, { user: result.user }, null));
  },
);

const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    const result = await authService.login(username, password);

    // Store refresh token in HttpOnly cookie
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // enable in production (https)
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res
      .status(200)
      .json(
        createResponse(
          true,
          { user: result.user, token: result.accessToken },
          null,
        ),
      );
  },
);

const logout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.split(" ")[1];
    const refreshToken = req.cookies.refreshToken;

    const result = await authService.logout(accessToken, refreshToken);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json(createResponse(true, result, null));
  },
);

const refresh = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    const result = await authService.refresh(refreshToken);

    // Replace refresh token cookie
    res.cookie("refreshToken", result.newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res
      .status(200)
      .json(createResponse(true, { token: result.newAccessToken }, null));
  },
);

export default {
  register,
  login,
  logout,
  refresh,
};
