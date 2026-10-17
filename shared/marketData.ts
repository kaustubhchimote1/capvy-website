import { z } from "zod";

export const MarketCategorySchema = z.enum(["equities", "crypto", "fx"]);
export type MarketCategory = z.infer<typeof MarketCategorySchema>;

export const MarketDataStatusSchema = z.enum(["LIVE", "DELAYED", "STALE", "UNAVAILABLE"]);
export type MarketDataStatus = z.infer<typeof MarketDataStatusSchema>;

const marketErrorCategorySchema = z.enum([
  "provider_not_configured",
  "display_rights_unverified",
  "unsupported_market",
  "authentication_failed",
  "rate_limited",
  "timeout",
  "upstream_error",
  "invalid_response",
  "unknown",
]);

const marketCategoryDiagnosticsSchema = z.object({
  dataStatus: MarketDataStatusSchema,
  providerName: z.string().nullable(),
  providerConnectivity: z.enum(["connected", "disconnected", "not_configured", "unknown"]),
  supportsRequestedMarket: z.boolean().nullable(),
  displayRights: z.enum(["verified", "unverified"]),
  providerObservationAt: z.string().nullable(),
  lastSuccessfulFetchAt: z.string().nullable(),
  quoteAgeSeconds: z.number().nonnegative().nullable(),
  instrumentsLoaded: z.number().int().nonnegative(),
  source: z.string().nullable(),
  delaySeconds: z.number().nonnegative().nullable(),
  errorCategory: marketErrorCategorySchema.nullable(),
  message: z.string(),
  requiredSetup: z.string(),
});

export const MarketDataDiagnosticsSchema = z.object({
  checkedAt: z.string().min(1),
  status: z.enum(["AVAILABLE", "PARTIAL", "UNAVAILABLE"]),
  markets: z.object({
    equities: marketCategoryDiagnosticsSchema,
    crypto: marketCategoryDiagnosticsSchema,
    fx: marketCategoryDiagnosticsSchema,
  }),
});

export type MarketDataDiagnostics = z.infer<typeof MarketDataDiagnosticsSchema>;
export type MarketCategoryDiagnostics = z.infer<typeof marketCategoryDiagnosticsSchema>;
