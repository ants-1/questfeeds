import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { createResponse } from "../utils/createResponse";
import { prettifyError, ZodError } from "zod";

export const errorHandler = (
  err: AppError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);

  if (err instanceof ZodError) {
    return res
      .status(400)
      .json(createResponse(false, null, prettifyError(err)));
  }

  res.status(err.status || 500).json(createResponse(false, null, err.message));
};
