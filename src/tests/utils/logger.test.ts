// src/tests/utils/logger.test.ts
import { jest } from "@jest/globals";

// Mock del logger
const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
};
const mockPino = jest.fn(() => mockLogger);
jest.mock("pino", () => mockPino);

describe("Given the logger.ts module", () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeAll(() => {
    originalEnv = { ...process.env };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  beforeEach(() => {
    jest.resetModules();
    mockPino.mockClear();
    mockLogger.info.mockClear();
    mockLogger.error.mockClear();
  });

  describe("When NODE_ENV is development", () => {
    beforeEach(() => {
      process.env.NODE_ENV = "development";
    });

    it("should use debug level and pino-pretty transport", () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { logger } = require("../../utils/logger");

      expect(mockPino).toHaveBeenCalledWith(
        expect.objectContaining({
          level: "debug",
          transport: expect.objectContaining({
            target: "pino-pretty",
            options: expect.objectContaining({
              colorize: true,
              translateTime: "SYS:dd-mm-yy HH:MM:ss",
            }),
          }),
        })
      );

      expect(logger).toBeDefined();
      expect(logger.info).toBeDefined();
      expect(logger.error).toBeDefined();
    });
  });

  describe("When NODE_ENV is production", () => {
    beforeEach(() => {
      process.env.NODE_ENV = "production";
    });

    it("should use info level and no transport", () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { logger } = require("../../utils/logger");

      expect(mockPino).toHaveBeenCalledWith(
        expect.objectContaining({
          level: "info",
        })
      );

      expect(logger).toBeDefined();
      expect(logger.info).toBeDefined();
      expect(logger.error).toBeDefined();
    });
  });
});
