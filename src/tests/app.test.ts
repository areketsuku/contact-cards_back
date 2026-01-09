import request from "supertest";
import app  from "../app";

describe("Given the Express app", () => {
  describe("When GET /health is called", () => {
    it("should respond with 200 and a message", async () => {
      const response = await request(app).get("/health");
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: "ok" });
    });
  });
});
