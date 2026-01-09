import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";

interface TokenPayload extends JwtPayload {
  userId: string;
}

/**
 * Middleware per validar JWT i injectar req.userId
 * @param secretOverride opcional, només per tests
 */
export const jwtMiddleware = (secretOverride?: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid Authorization header" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Token not provided" });
    }

    try {
      const secret = secretOverride || JWT_SECRET;

      const decoded = jwt.verify(token, secret) as TokenPayload;

      if (!decoded.userId) {
        return res.status(401).json({ error: "Invalid token payload" });
      }

      req.userId = decoded.userId;

      next();
    } catch (err) {
      return res.status(401).json({ error: "Unauthorized: " + (err instanceof Error ? err.message : String(err)) });
    }
  };
};
