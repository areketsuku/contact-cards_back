// src/config/db.ts
import mongoose from "mongoose";
import { logger } from "../utils/logger";

export const connectDB = async (mongoURI: string) => {
  try {
    await mongoose.connect(mongoURI);
    logger.info("✅ MongoDB connected");
  } catch (err) {
    logger.error("❌ MongoDB connection error: "+err);
    throw err;
  }
};
