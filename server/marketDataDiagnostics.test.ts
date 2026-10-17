import { describe, expect, it } from "vitest";
import { MarketDataDiagnosticsSchema } from "../shared/marketData";
import { getMarketDataDiagnostics } from "./marketDataDiagnostics";

describe("market data diagnostics", () => {
  it("reports all markets unavailable when no application providers are configured", () => {
    const diagnostics = getMarketDataDiagnostics(new Date("2026-10-17T10:00:00.000Z"));

    expect(MarketDataDiagnosticsSchema.safeParse(diagnostics).success).toBe(true);
    expect(diagnostics.checkedAt).toBe("2026-10-17T10:00:00.000Z");
    expect(diagnostics.status).toBe("UNAVAILABLE");
    expect(diagnostics.markets.equities).toMatchObject({
      dataStatus: "UNAVAILABLE",
      providerName: null,
      providerConnectivity: "not_configured",
      supportsRequestedMarket: null,
      displayRights: "unverified",
      providerObservationAt: null,
      lastSuccessfulFetchAt: null,
      quoteAgeSeconds: null,
      instrumentsLoaded: 0,
      source: null,
      delaySeconds: null,
      errorCategory: "provider_not_configured",
    });
    expect(diagnostics.markets.crypto.message).toContain("Coinbase display permission is not recorded");
    expect(diagnostics.markets.fx.message).toContain("No licensed FX provider is configured");
  });

  it("does not include credential values or imply market coverage without a provider", () => {
    const diagnostics = getMarketDataDiagnostics();
    const markets = [diagnostics.markets.equities, diagnostics.markets.crypto, diagnostics.markets.fx];

    for (const market of markets) {
      expect(market.providerName).toBeNull();
      expect(market.supportsRequestedMarket).toBeNull();
      expect(market.instrumentsLoaded).toBe(0);
      expect(market).not.toHaveProperty("apiKey");
      expect(market).not.toHaveProperty("token");
      expect(market).not.toHaveProperty("secret");
    }
  });
});
