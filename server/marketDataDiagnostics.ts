import type { MarketCategoryDiagnostics, MarketDataDiagnostics } from "../shared/marketData";

const unavailableMarket = (
  message: string,
  requiredSetup: string,
): MarketCategoryDiagnostics => ({
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
  message,
  requiredSetup,
});

export function getMarketDataDiagnostics(now = new Date()): MarketDataDiagnostics {
  return {
    checkedAt: now.toISOString(),
    status: "UNAVAILABLE",
    markets: {
      equities: unavailableMarket(
        "No licensed Indian-equities provider is configured; no quote or listing master is loaded.",
        "Select a feed with verified SENSEX and NSE/BSE coverage plus public educational/simulation display rights, then configure its API credential securely.",
      ),
      crypto: unavailableMarket(
        "No CAPVY runtime crypto provider is configured. Coinbase display permission is not recorded.",
        "Select a crypto provider whose terms permit public display. Coinbase requires prior written permission for CAPVY end-user use.",
      ),
      fx: unavailableMarket(
        "No licensed FX provider is configured; no INR exchange rates are loaded.",
        "Select a provider covering the required INR pairs with verified public-display rights, then configure its API credential securely.",
      ),
    },
  };
}
