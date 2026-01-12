// src/tests/app.test.ts
import request from "supertest";
import express, { Request, Response, NextFunction } from "express";
import app from "../app";

describe("Given express app", () => {
  describe("When GET /health is called", () => {
    it("Should respond with 200 and a success message", async () => {
      const response = await request(app).get("/health");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: "ok" });
    });
  });

  describe("When cors is initiated", () => {
    let originalEnv: NodeJS.ProcessEnv;

    beforeAll(() => {
      originalEnv = { ...process.env };
    });

    afterAll(() => {
      process.env = originalEnv;
    });

    it("Should allow all origins in development", async () => {
      process.env.NODE_ENV = "development";
      jest.resetModules();

      const devApp = (await import("../app")).default;

      const response = await request(devApp).get("/health").set("Origin", "http://example.com");

      expect(response.headers["access-control-allow-origin"]).toBe("*");
    });

    it("Should restrict origins in production", async () => {
      process.env.NODE_ENV = "production";
      jest.resetModules();

      const prodApp = (await import("../app")).default;

      const response = await request(prodApp).get("/health").set("Origin", "https://midomini.com");

      expect(response.headers["access-control-allow-origin"]).toBe("https://midomini.com");
    });

    describe("When Error middleware is initiated", () => {
      it("Should catch errors and respond with statusCode and message", async () => {
        const tempApp = express();
        tempApp.use(express.json());

        tempApp.get("/test-error", (_req: Request, _res: Response, next: NextFunction) => {
          const error: Error & { statusCode?: number } = new Error("Internal server error");
          error.statusCode = 500;
          next(error);
        });

        const { errorMiddleware } = await import("../middlewares/error.middleware");
        tempApp.use(errorMiddleware);

        const response = await request(tempApp).get("/test-error");

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty("statusCode", 500);
        expect(response.body).toHaveProperty("message", "Internal server error");
      });
    });
  });
});
