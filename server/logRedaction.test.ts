import { describe, expect, it } from "vitest";
import { redactSensitiveLogData } from "./logRedaction";

describe("development log redaction", () => {
  it("redacts nested authorization, cookie, API-key and token fields", () => {
    const sanitized = redactSensitiveLogData({
      request: {
        headers: {
          authorization: "Bearer fake-session-token",
          "X-API-Key": "fake-provider-key",
          cookie: "session=fake-cookie",
        },
        body: { accessToken: "fake-access-token", question: "Explain inflation." },
      },
      url: "https://example.test/data?api_key=fake-query-key",
    });

    expect(sanitized).toEqual({
      request: {
        headers: {
          authorization: "[REDACTED]",
          "X-API-Key": "[REDACTED]",
          cookie: "[REDACTED]",
        },
        body: { accessToken: "[REDACTED]", question: "Explain inflation." },
      },
      url: "https://example.test/data?api_key=[REDACTED]",
    });

    const serialized = JSON.stringify(sanitized);
    expect(serialized).not.toContain("fake-session-token");
    expect(serialized).not.toContain("fake-provider-key");
    expect(serialized).not.toContain("fake-query-key");
  });

  it("redacts bearer credentials embedded in logged string values", () => {
    expect(redactSensitiveLogData("Authorization: Bearer fake-inline-token"))
      .toBe("Authorization: Bearer [REDACTED]");
  });
});
