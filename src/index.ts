// src/index.ts
import app from "./app";
import { logger } from "./utils/logger";
import { PORT } from "./config/env";

const server = app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});

server.on("error", (err) => {
  logger.fatal({ err }, "Server failed to start");
  process.exit(1);
});
