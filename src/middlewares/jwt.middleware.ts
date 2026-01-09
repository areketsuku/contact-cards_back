import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtUserPayload } from "../types/jwt";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

function isJwtUserPayload(value: unknown): value is JwtUserPayload {
  return (
    typeof value === "object" &&
    value !== null &&
    "userId" in value &&
    typeof (value as Record<string, unknown>).userId === "string"
  );
}

export const jwtMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Missing Authorization header" });
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res
        .status(401)
        .json({ error: "Malformed Authorization header" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    if (!isJwtUserPayload(decoded)) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    req.userId = decoded.userId;

    next();
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(401).json({ error: "Unauthorized: " + err.message });
    }

    return res.status(401).json({ error: "Unauthorized" });
  }
};
