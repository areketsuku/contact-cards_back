// src/tests/config/env.test.ts
describe("Given env.ts configuration", () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeAll(() => {
    originalEnv = { ...process.env };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  beforeEach(() => {
    jest.resetModules();
    delete process.env.PORT;
    delete process.env.JWT_SECRET;
    delete process.env.MONGO_URI;
    delete process.env.SONAR_TOKEN;
  });

  it("Should use fallback values when process.env is undefined", () => {


    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const env = require("../../config/env");

    expect(env.PORT).toBe(3000);
    expect(env.JWT_SECRET).toBe("dev-secret");
    expect(env.MONGO_URI).toBe("mongodb://localhost:27017/contact-cards");
    expect(env.SONAR_TOKEN).toBe("dev-token");
  });

  it("Should use process.env values if they are defined", () => {
    process.env.PORT = "5000";
    process.env.JWT_SECRET = "dev-secret";
    process.env.MONGO_URI = "mongodb://test:27017/testdb";
    process.env.SONAR_TOKEN = "dev-token";

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const env = require("../../config/env");

    expect(env.PORT).toBe(5000);
    expect(env.JWT_SECRET).toBe("dev-secret");
    expect(env.MONGO_URI).toBe("mongodb://test:27017/testdb");
    expect(env.SONAR_TOKEN).toBe("dev-token");
  });
});
