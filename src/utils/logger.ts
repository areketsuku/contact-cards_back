import pino from "pino";

const isDev = process.env.NODE_ENV !== "production";

const devTransport = isDev
  ? {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:dd-mm-yy HH:MM:ss",
      },
    }
  : undefined;

export const logger = pino({
  level: isDev ? "debug" : "info",
  ...(devTransport && { transport: devTransport }),
});
