import pino from "pino";

const isDev = process.env.NODE_ENV !== "production";

let loggerOptions: pino.LoggerOptions = {
  level: isDev ? "debug" : "info",
};

if (isDev) {
  loggerOptions = {
    ...loggerOptions,
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
      },
    },
  };
}

export const logger = pino(loggerOptions);
