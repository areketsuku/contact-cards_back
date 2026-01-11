import express, { Request, Response } from "express";
import supertest from "supertest";
import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtMiddleware } from "../../middlewares/jwt.middleware";
import { JWT_SECRET } from "../../config/env";

interface AuthRequest extends Request {
  user?: string | JwtPayload;
}

describe("Given the JWT middleware", () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();

    // Ruta de prova protegida pel middleware
    app.get("/protected", jwtMiddleware, (req: AuthRequest, res: Response) => {
      res.status(200).json({ message: "Access granted" });
    });
  });

  describe("When the Authorization header is missing", () => {
    it("should respond with 401", async () => {
      const response = await supertest(app).get("/protected");

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: "Authorization header missing" });
    });
  });

  describe("When the token is missing", () => {
    it("should respond with 401", async () => {
      const response = await supertest(app)
        .get("/protected")
        .set("Authorization", "Bearer ");

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: "Token missing" });
    });
  });

  describe("When the token is invalid", () => {
    it("should respond with 403", async () => {
      const response = await supertest(app)
        .get("/protected")
        .set("Authorization", "Bearer invalid-token");

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ message: "Invalid token" });
    });
  });

  describe("When the token is valid", () => {
    it("should call next and attach decoded token to req.user", async () => {
      const payload = { userId: "123" };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

      // Captura segura sense usar `any`
      let capturedUser: string | JwtPayload | undefined = undefined;

      const appWithCapture = express();
      appWithCapture.get(
        "/protected",
        jwtMiddleware,
        (req: AuthRequest, res: Response) => {
          capturedUser = req.user;
          res.status(200).json({ message: "Access granted" });
        }
      );

      const response = await supertest(appWithCapture)
        .get("/protected")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Access granted" });
      expect(capturedUser).toMatchObject(payload);
    });
  });
});
