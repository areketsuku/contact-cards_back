import express from "express";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();
app.disable("x-powered-by");

app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(cors());
} else {
  const allowedOrigins = ["https://midomini.com"];
  app.use(cors({ origin: allowedOrigins }));
}

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(errorMiddleware);

export default app;
