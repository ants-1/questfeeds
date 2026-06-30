import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { createReponse } from "../utils/createReponse";

export interface AuthRequest extends Request {
  userId?: string | JwtPayload | undefined;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json(createReponse(false, null, "Unauthorized"));
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as {
      userId: string;
    };

    req.userId = decoded.userId;

    next();
  } catch {
    res.status(401).json(createReponse(false, null, "Unauthorized"));
  }
};
