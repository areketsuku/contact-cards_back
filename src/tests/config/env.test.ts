// src/tests/config/env.test.ts
import { JWT_SECRET, MONGO_URI, PORT, SONAR_TOKEN } from "../../config/env";

describe("Env config fallbacks", () => {
  it("should provide default values if env vars are missing", () => {
    expect(JWT_SECRET).toBeDefined();
    expect(JWT_SECRET).toBe("supersecretjwtkey"); // fallback
    expect(MONGO_URI).toBeDefined();
    expect(MONGO_URI).toBe("mongodb://localhost:27017/contact-cards"); // fallback
    expect(PORT).toBeDefined();
    expect(PORT).toBe(3000); // fallback
    expect(SONAR_TOKEN).toBeDefined();
  });
});
