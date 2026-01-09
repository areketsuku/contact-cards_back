import { logger } from "../../utils/logger";

describe("Given the logger utility", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call info with the correct message", () => {
    const spyInfo = jest.spyOn(logger, "info");
    logger.info("Test info message");

    expect(spyInfo).toHaveBeenCalledWith("Test info message");
  });

  it("should call error with the correct message", () => {
    const spyError = jest.spyOn(logger, "error");
    logger.error("Test error message");

    expect(spyError).toHaveBeenCalledWith("Test error message");
  });

  it("should be callable for info and error", () => {
    logger.info("test info");
    logger.error("test error");
    expect(true).toBe(true); // només assegurar execució
  });
});
