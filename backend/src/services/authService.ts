import jwt, { JwtPayload } from "jsonwebtoken";
import User, { IUser } from "../models/User";
import { AppError } from "../utils/AppError";
import { redis } from "../config/redis";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

const register = async (username: string, email: string, password: string) => {
  const existingUser: IUser | null = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new AppError("Username or email already exists", 409);
  }

  const newUser: IUser | null = await User.create({
    username,
    email,
    password,
  });

  return {
    user: {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    },
  };
};

const login = async (username: string, password: string) => {
  const user: IUser | null = await User.findOne({
    username,
  }).select("+password");

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isPasswordValid: boolean = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new AppError("Invalid crendetials", 401);
  }

  // Generate tokens
  const accessToken = await generateAccessToken({ userId: user._id });
  const refreshToken = generateRefreshToken({ userId: user._id });

  // Save refresh token
  await redis.set(`refresh:${user._id.toString()}`, refreshToken, {
    EX: 7 * 24 * 60 * 60,
  });

  return {
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
    },
    accessToken,
    refreshToken,
  };
};

const logout = async (
  accessToken: string | undefined,
  refreshToken: string,
) => {
  // Blacklist access token
  if (accessToken) {
    const decoded = jwt.decode(accessToken) as JwtPayload;

    if (decoded?.exp) {
      const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);

      if (expiresIn > 0) {
        await redis.set(`blacklist:${accessToken}`, "true", {
          EX: expiresIn,
        });
      }
    }
  }

  // Remove refresh token from Redis
  if (refreshToken) {
    const decoded = jwt.decode(refreshToken) as JwtPayload;

    if (decoded?.id) {
      await redis.del(`refresh:${decoded.id}`);
    }
  }

  return {
    message: "Logged out successfully",
  };
};

const refresh = async (refreshToken: any) => {
  if (!refreshToken) {
    throw new AppError("No token provided", 401);
  }

  let payload: JwtPayload;

  try {
    payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string,
    ) as JwtPayload;
  } catch {
    throw new AppError("Invalid refresh token", 401);
  }

  const storedToken = await redis.get(`refresh:${payload.id}`);

  if (!storedToken || storedToken !== refreshToken) {
    throw new AppError("Invalid refresh token", 401);
  }

  const user = await User.findById(payload.id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Generate new tokens
  const newAccessToken = await generateAccessToken({ userId: user._id });
  const newRefreshToken = await generateRefreshToken({ userId: user._id });

  // Replace refresh token in Redis
  await redis.set(`refresh:${user._id}`, newRefreshToken, {
    EX: 7 * 24 * 60 * 60,
  });

  return {
    newRefreshToken,
    newAccessToken,
  };
};

export default {
  register,
  login,
  logout,
  refresh,
};
