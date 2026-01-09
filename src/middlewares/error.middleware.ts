// src/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error(err);
  res.status(500).json({ error: "Internal server error" });
};
