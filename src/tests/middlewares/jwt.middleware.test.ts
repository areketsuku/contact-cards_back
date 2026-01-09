import express, { Request, Response } from "express";
import supertest from "supertest";
import jwt from "jsonwebtoken";
import { jwtMiddleware } from "../../middlewares/jwt.middleware";

const TEST_JWT_SECRET = "testsecret"; // secret de test

describe("Given the JWT middleware", () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();

    // Passar el secret de test al middleware
    app.get("/protected", jwtMiddleware(TEST_JWT_SECRET), (req: Request, res: Response) => {
      res.status(200).json({ userId: req.userId });
    });
  });

  it("should set req.userId and call next when Authorization header is valid", async () => {
    const token = jwt.sign({ userId: "12345" }, TEST_JWT_SECRET);

    const response = await supertest(app)
      .get("/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.userId).toBe("12345");
  });

  it("should return 401 if Authorization header is missing", async () => {
    const response = await supertest(app).get("/protected");
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Missing or invalid Authorization header" });
    expect(response.body.error).toBe("Missing or invalid Authorization header");
  });

  it("should return 401 if token is invalid", async () => {
    const response = await supertest(app)
      .get("/protected")
      .set("Authorization", "Bearer invalidtoken");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Unauthorized: jwt malformed" });
  });

  it("should return 401 if token payload is invalid", async () => {
    const invalidToken = jwt.sign({ foo: "bar" }, TEST_JWT_SECRET);
    const response = await supertest(app)
      .get("/protected")
      .set("Authorization", `Bearer ${invalidToken}`);

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Invalid token payload");
  });

});
