// config/env.ts
import dotenv from "dotenv";
dotenv.config();

export const JWT_SECRET: string = process.env.JWT_SECRET || "supersecretjwtkey";
export const MONGO_URI: string = process.env.MONGO_URI || "mongodb://localhost:27017/contact-cards";
export const PORT: number = Number(process.env.PORT) || 3000;
export const SONAR_TOKEN: string = process.env.SONAR_TOKEN || "";
