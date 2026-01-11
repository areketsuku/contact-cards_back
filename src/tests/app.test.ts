import request from "supertest";
import app from "../app";

describe("Given express app", () => {
  describe("When GET /health is called", () => {
    it("Should respond with 200 and a success message", async () => {
      const response = await request(app).get("/health");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: "ok" });
    });
  });
});
