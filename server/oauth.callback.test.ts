import express from "express";
import { describe, expect, it } from "vitest";
import { encodeOAuthState, OAUTH_STATE_COOKIE } from "../shared/const";
import { registerOAuthRoutes } from "./_core/oauth";

async function requestCallback(path: string, cookie?: string) {
  const app = express();
  registerOAuthRoutes(app);
  const server = app.listen(0, "127.0.0.1");
  await new Promise<void>((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });
  const address = server.address();
  if (!address || typeof address === "string") {
    server.close();
    throw new Error("Test server address is unavailable");
  }

  try {
    const response = await fetch(`http://127.0.0.1:${address.port}${path}`, {
      redirect: "manual",
      headers: cookie ? { Cookie: cookie } : undefined,
    });
    return { status: response.status, location: response.headers.get("location") };
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

describe("OAuth callback failure redirects", () => {
  it("returns provider cancellation to a fixed CAPVY login route", async () => {
    const result = await requestCallback("/api/oauth/callback?error=access_denied");
    expect(result).toEqual({ status: 302, location: "/login?error=cancelled" });
  });

  it("returns incomplete provider responses to a fixed CAPVY login route", async () => {
    const result = await requestCallback("/api/oauth/callback?redirectUri=https%3A%2F%2Fevil.example");
    expect(result).toEqual({ status: 302, location: "/login?error=oauth_response" });
  });

  it("returns malformed state to the fixed CAPVY login route", async () => {
    const result = await requestCallback("/api/oauth/callback?code=unused&state=not-base64");
    expect(result).toEqual({ status: 302, location: "/login?error=invalid_state" });
  });

  it("rejects a mismatched nonce without following the OAuth state's external redirect URI", async () => {
    const state = encodeOAuthState({
      redirectUri: "https://evil.example/callback",
      nonce: "expected-nonce",
    });
    const result = await requestCallback(
      `/api/oauth/callback?code=unused&state=${encodeURIComponent(state)}`,
      `${OAUTH_STATE_COOKIE}=different-nonce`,
    );
    expect(result).toEqual({ status: 302, location: "/login?error=invalid_state" });
  });
});
