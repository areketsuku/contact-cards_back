import { Request, Response, NextFunction } from "express";
import { CustomError } from "../types/errors";

export const errorMiddleware = (
  err: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({ statusCode, message });
};
