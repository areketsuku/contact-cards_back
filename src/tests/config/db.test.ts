import { connectDB } from "../../config/db";
import mongoose from "mongoose";
import { logger } from "../../utils/logger";
import { MONGO_URI } from "../../config/env";

jest.mock("mongoose", () => ({
  connect: jest.fn(),
}));

jest.mock("../../utils/logger", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe("Given connectDB function", () => {
  const mockedConnect = mongoose.connect as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call mongoose.connect with MONGO_URI and log success", async () => {
    mockedConnect.mockResolvedValueOnce({});

    await connectDB();

    expect(mockedConnect).toHaveBeenCalledWith(MONGO_URI);
    expect(logger.info).toHaveBeenCalledWith("✅ MongoDB connected");
  });

  it("should log error and throw if mongoose.connect fails", async () => {
    const error = new Error("Connection failed");
    mockedConnect.mockRejectedValueOnce(error);

    await expect(connectDB()).rejects.toThrow(error);

    expect(mockedConnect).toHaveBeenCalledWith(MONGO_URI);
    expect(logger.error).toHaveBeenCalledWith("❌ MongoDB connection error: " + error);
  });
});
