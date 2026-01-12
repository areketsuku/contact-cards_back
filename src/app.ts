import express from "express";
import cors, { CorsOptions } from "cors";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();
app.disable("x-powered-by");

app.use(express.json());

const devOrigins = ["http://localhost:5173"];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || devOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

if (process.env.NODE_ENV === "development") {
  app.use(cors(corsOptions));
} else {
  app.use(cors({ origin: ["https://midomini.com"] }));
}

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(errorMiddleware);

export default app;
