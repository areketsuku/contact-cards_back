import express, { Request, Response, NextFunction } from "express";
import supertest from "supertest";
import { errorMiddleware } from "../../middlewares/error.middleware";
import { CustomError } from "../../types/errors";

describe("Given the Error middleware", () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();

    // Ruta que llença un error per provar el middleware
    app.get("/error", (_req: Request, _res: Response, next: NextFunction) => {
      const error: CustomError = new Error("Something went wrong");
      error.statusCode = 418;
      next(error);
    });


    // Middleware d'errors
    app.use(errorMiddleware);
  });

  it("should catch an error and respond with status and message", async () => {
    const response = await supertest(app).get("/error");

    expect(response.status).toBe(418);
    expect(response.body).toEqual({
      statusCode: 418,
      message: "Something went wrong",
    });
  });

  it("should default statusCode to 500 if none is set", async () => {
    const app2 = express();

    app2.get("/default-error", (_req, _res, next) => {
      next(new Error("Default error"));
    });

    app2.use(errorMiddleware);

    const response = await supertest(app2).get("/default-error");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      statusCode: 500,
      message: "Default error",
    });
  });
});
