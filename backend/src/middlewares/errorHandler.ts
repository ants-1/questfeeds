import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { createResponse } from "../utils/createResponse";

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);

  res.status(err.status || 500).json(createResponse(false, null, err.message));
};
