import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";

interface TokenPayload extends JwtPayload {
  userId: string;
}

export const jwtMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token not provided" });
  }

  try {

    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    if (!decoded.userId) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    req.userId = decoded.userId;

    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: " + (err instanceof Error ? err.message : String(err)) });
  }
};
