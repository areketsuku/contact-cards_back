import express, { Application } from "express";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.middleware";

const app: Application = express();

// Middleware globals
app.use(cors());
app.use(express.json());

// Rutes (encara no hi ha controllers reals)
// Exemple placeholder:
// app.use("/users", userRouter);

// Middleware d’errors al final
app.use(errorMiddleware);

export default app;
