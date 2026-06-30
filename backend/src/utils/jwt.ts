import jwt from "jsonwebtoken";
import { Types } from "mongoose";

interface TokenUser {
  userId: Types.ObjectId;
}

export const generateAccessToken = (userId: TokenUser) => {
  return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "7d",
  });
};
