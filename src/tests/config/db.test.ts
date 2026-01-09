import mongoose from "mongoose";
import { connectDB } from "../../config/db";
import { logger } from "../../utils/logger";
import { JWT_SECRET, MONGO_URI, PORT } from "../../config/env";

jest.mock("mongoose");
jest.mock("../../utils/logger", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe("Given connectDB", () => {
  const mongoURI = "mongodb://localhost:27017/testdb";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call mongoose.connect and logger.info on success", async () => {
    (mongoose.connect as jest.Mock).mockResolvedValue({});

    await connectDB(mongoURI);

    expect(mongoose.connect).toHaveBeenCalledWith(mongoURI);
    expect(logger.info).toHaveBeenCalledWith("✅ MongoDB connected");
  });

  it("should call logger.error and throw on connection failure", async () => {
    const error = new Error("Connection failed");
    (mongoose.connect as jest.Mock).mockRejectedValue(error);

    await expect(connectDB(mongoURI)).rejects.toThrow(error);

    expect(logger.error).toHaveBeenCalledWith(
      "❌ MongoDB connection error: " + error
    );
  });

  describe("Env config", () => {
  it("should have fallback values if env vars are missing", () => {
    expect(JWT_SECRET).toBeDefined();
    expect(MONGO_URI).toBeDefined();
    expect(PORT).toBeDefined();
  });
});
});
