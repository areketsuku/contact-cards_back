import express from "express";
import request from "supertest";
import { errorMiddleware } from "../../middlewares/error.middleware";
import { CustomError } from "../../types/errors";

describe("Given errorMiddleware", () => {
  const testApp = express();

  beforeAll(() => {
    testApp.use(express.json());

    testApp.get("/error-400", (_req, _res, next) => {
      const err: CustomError = new Error("fail") as CustomError;
      err.statusCode = 400;
      next(err);
    });

    testApp.get("/error-no-status", (_req, _res, next) => {
      const err: CustomError = new Error("boom") as CustomError;
      next(err);
    });

    testApp.get("/error-empty", (_req, _res, next) => {
      const err = {} as CustomError;
      next(err);
    });

    testApp.use(errorMiddleware);
  });

  describe("When called with a CustomError with statusCode", () => {
    it("Should respond with that statusCode and message", async () => {
      const response = await request(testApp).get("/error-400");

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("statusCode", 400);
      expect(response.body).toHaveProperty("message", "fail");
    });
  });

  describe("When called with a CustomError without statusCode", () => {
    it("Should respond with 500 and the error message", async () => {
      const response = await request(testApp).get("/error-no-status");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("statusCode", 500);
      expect(response.body).toHaveProperty("message", "boom");
    });
  });

  describe("When called with an empty error object", () => {
    it("Should respond with 500 and default internal server message", async () => {
      const response = await request(testApp).get("/error-empty");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("statusCode", 500);
      expect(response.body).toHaveProperty("message", "Internal server error");
    });
  });
});
