import jwt from "jsonwebtoken";
import { Types } from "mongoose";

interface TokenUser {
  userId: Types.ObjectId;
}

export const generateAccessToken = ({ userId }: TokenUser) => {
  return jwt.sign(
    { id: userId.toString() },
    process.env.JWT_ACCESS_SECRET as string,
    {
      expiresIn: "15m",
    },
  );
};

export const generateRefreshToken = ({ userId }: TokenUser) => {
  return jwt.sign(
    { id: userId.toString() },
    process.env.JWT_REFRESH_SECRET as string,
    {
      expiresIn: "7d",
    },
  );
};