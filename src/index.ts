// src/index.ts
import app from "./app";
import { logger } from "./utils/logger";
import { PORT } from "./config/env";

app.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
});
