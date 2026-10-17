import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MarketDataDiagnosticsSchema, type MarketCategory, type MarketDataDiagnostics, type MarketDataStatus } from "@shared/marketData";
import { Activity, ExternalLink, Globe2, ShieldAlert, TrendingUp } from "lucide-react";

type MarketKind = "stocks" | "crypto" | "currency";

const marketTabs: { id: MarketKind; label: string; caption: string; icon: typeof TrendingUp }[] = [
  { id: "stocks", label: "Indian stocks", caption: "NSE · BSE", icon: TrendingUp },
  { id: "crypto", label: "Crypto", caption: "INR MARKETS", icon: Activity },
  { id: "currency", label: "Currency", caption: "FX PAIRS", icon: Globe2 },
];

const diagnosticsCategory: Record<MarketKind, MarketCategory> = {
  stocks: "equities",
  crypto: "crypto",
  currency: "fx",
};

const statusLabel: Record<MarketDataStatus, string> = {
  LIVE: "Live provider status",
  DELAYED: "Market data delayed",
  STALE: "Last successful quote is stale",
  UNAVAILABLE: "Live feed not connected",
};

const categoryDetails: Record<MarketKind, {
  title: string;
  description: string;
  cards: { label: string; title: string; detail: string }[];
}> = {
  stocks: {
    title: "Indian equities need an exchange-approved feed.",
    description: "Coinbase India offers crypto markets, not the full NSE/BSE listed-company universe. CAPVY will show SENSEX and active listed equities only when a licensed live equity source is connected.",
    cards: [
      { label: "BENCHMARK", title: "SENSEX · no live quote", detail: "No current INR value, point move or percentage change is shown." },
      { label: "LISTED EQUITIES", title: "Active universe not loaded", detail: "A verified NSE/BSE equity master must cover active mainboard and SME listings." },
      { label: "STATUS", title: "Feed and display rights required", detail: "No exchange source or license is configured for public live display." },
    ],
  },
  crypto: {
    title: "Coinbase India has INR crypto markets—but CAPVY cannot republish them yet.",
    description: "Coinbase’s India site shows crypto-market information in INR. Its Market Data Terms restrict displaying or redistributing those data to other end users without prior express written consent. CAPVY has no such permission, so no Coinbase price, market cap or chart is copied here.",
    cards: [
      { label: "COUNTRY / ASSET CLASS", title: "India · cryptocurrency", detail: "This is crypto-market coverage, not NSE/BSE-listed companies or a general foreign-exchange feed." },
      { label: "CAPVY DISPLAY", title: "Written consent required", detail: "Coinbase must explicitly authorize public display of prices, market caps and charts in this app." },
      { label: "DATA SHOWN HERE", title: "None until authorized", detail: "No Coinbase feed, scraped page, embedded market values or illustrative crypto series is used." },
    ],
  },
  currency: {
    title: "Currency data is not connected.",
    description: "Coinbase’s crypto-INR markets do not replace a general FX feed for USD/INR, EUR/INR, GBP/INR or JPY/INR. CAPVY will not substitute crypto prices for currency-exchange rates.",
    cards: [
      { label: "COVERAGE", title: "No FX provider configured", detail: "No INR exchange rates or historical FX series are loaded." },
      { label: "DATA LABELS", title: "Source and quote time required", detail: "Any future FX feed must identify its source, observation time and live/delayed status." },
      { label: "CHARTS", title: "No sample series", detail: "No invented values or normalized illustrations are presented as market observations." },
    ],
  },
};

const equitySources = [
  { title: "BSE market-data products", description: "Official data products, subscription information and vendor contacts.", href: "https://www.bseindia.com/marketdata-products" },
  { title: "NSE real-time data subscription", description: "Official NSE market-data subscription options and terms.", href: "https://www.nseindia.com/static/market-data/real-time-data-subscription" },
  { title: "NSE securities available for trading", description: "Official active-for-trading securities files, including equity categories.", href: "https://www.nseindia.com/static/market-data/securities-available-for-trading" },
  { title: "BSE listed securities", description: "Official BSE security directory with status filters.", href: "https://www.bseindia.com/corporates/List_Scrips.html" },
];

const coinbaseSources = [
  { title: "Coinbase India crypto explorer", description: "Open Coinbase’s own INR crypto market page; data stays on Coinbase.", href: "https://www.coinbase.com/en-in/explore" },
  { title: "Coinbase Market Data Terms", description: "Review the written permissions required before displaying Coinbase data in another app.", href: "https://www.coinbase.com/legal/market_data" },
];

async function fetchMarketDataDiagnostics(): Promise<MarketDataDiagnostics> {
  const response = await fetch("/api/market-data/diagnostics", {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Market diagnostics request failed (${response.status}).`);

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new Error("Market diagnostics returned invalid JSON.");
  }
  const parsed = MarketDataDiagnosticsSchema.safeParse(payload);
  if (!parsed.success) throw new Error("Market diagnostics response did not match the expected shape.");
  return parsed.data;
}

function formatMarketTime(value: string | null, emptyValue = "Never"): string {
  if (!value) return emptyValue;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Timestamp unavailable";
  return `${date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })} IST`;
}

function formatQuoteAge(seconds: number | null): string {
  if (seconds === null || !Number.isFinite(seconds) || seconds < 0) return "No quote";
  if (seconds < 60) return `${Math.floor(seconds)} sec`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min`;
  return `${Math.floor(seconds / 3600)} hr ${Math.floor((seconds % 3600) / 60)} min`;
}

export default function Markets() {
  const [market, setMarket] = useState<MarketKind>("stocks");
  const details = categoryDetails[market];
  const sources = market === "stocks" ? equitySources : market === "crypto" ? coinbaseSources : [];
  const diagnosticsQuery = useQuery({
    queryKey: ["market-data-diagnostics"],
    queryFn: fetchMarketDataDiagnostics,
    staleTime: 30_000,
    retry: false,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });
  const selectedDiagnostics = diagnosticsQuery.data?.markets[diagnosticsCategory[market]];
  const bannerTitle = diagnosticsQuery.isPending
    ? "Checking market status"
    : diagnosticsQuery.isError
      ? "Market diagnostics unavailable"
      : selectedDiagnostics
        ? statusLabel[selectedDiagnostics.dataStatus]
        : "Market status unavailable";
  const bannerDescription = diagnosticsQuery.isPending
    ? "No quote is shown while provider status is checked."
    : diagnosticsQuery.isError
      ? "No quote is shown because diagnostics could not be loaded."
      : selectedDiagnostics?.dataStatus === "UNAVAILABLE"
        ? "No value is loaded, so there is no stale quote to refresh."
        : selectedDiagnostics?.message ?? "No market value is available.";
  const marketFeedState = diagnosticsQuery.isPending
    ? "CHECKING MARKET-DATA STATUS"
    : diagnosticsQuery.isError
      ? "STATUS CHECK FAILED · NO QUOTE SHOWN"
      : selectedDiagnostics
        ? `${selectedDiagnostics.dataStatus} · ${selectedDiagnostics.providerConnectivity.replaceAll("_", " ").toUpperCase()}`
        : "UNAVAILABLE · PROVIDER STATUS UNKNOWN";
  const diagnosticRows = [
    { label: "DATA STATUS", value: selectedDiagnostics?.dataStatus ?? (diagnosticsQuery.isPending ? "Checking" : "Unknown") },
    { label: "PROVIDER", value: selectedDiagnostics ? selectedDiagnostics.providerName ?? "Not configured" : diagnosticsQuery.isPending ? "Checking" : "Unknown" },
    { label: "SOURCE", value: selectedDiagnostics ? selectedDiagnostics.source ?? "Not configured" : diagnosticsQuery.isPending ? "Checking" : "Unknown" },
    { label: "PROVIDER OBSERVATION TIME", value: selectedDiagnostics ? formatMarketTime(selectedDiagnostics.providerObservationAt, "No quote timestamp") : diagnosticsQuery.isPending ? "Checking" : "Unknown" },
    { label: "LAST SUCCESSFUL FETCH", value: selectedDiagnostics ? formatMarketTime(selectedDiagnostics.lastSuccessfulFetchAt) : diagnosticsQuery.isPending ? "Checking" : "Unknown" },
    { label: "QUOTE AGE", value: selectedDiagnostics ? formatQuoteAge(selectedDiagnostics.quoteAgeSeconds) : diagnosticsQuery.isPending ? "Checking" : "Unknown" },
    { label: "INSTRUMENTS LOADED", value: selectedDiagnostics ? selectedDiagnostics.instrumentsLoaded.toLocaleString("en-IN") : diagnosticsQuery.isPending ? "Checking" : "Unknown" },
    { label: "MARKET SUPPORT", value: selectedDiagnostics ? selectedDiagnostics.supportsRequestedMarket === null ? "Not verified" : selectedDiagnostics.supportsRequestedMarket ? "Supported" : "Not supported" : diagnosticsQuery.isPending ? "Checking" : "Unknown" },
    { label: "ERROR CATEGORY", value: selectedDiagnostics?.errorCategory?.replaceAll("_", " ") ?? (diagnosticsQuery.isPending ? "Checking" : "None reported") },
  ];

  return (
    <div className="page-stack market-page">
      <section className="page-intro-row market-intro">
        <div>
          <div className="eyebrow"><span className="eyebrow-line" />MARKET DATA · SOURCE FIRST</div>
          <h2 className="page-title">A chart is only as good as its source.</h2>
          <p className="page-lead">CAPVY will not display a market value unless the source, observation time and right to display it are clear.</p>
        </div>
        <div className="connection-banner market-permission-banner" role="status" aria-live="polite">
          <ShieldAlert size={18} />
          <span><strong>{bannerTitle}</strong><small>{bannerDescription}</small></span>
        </div>
      </section>

      <div className="market-tabs" role="tablist" aria-label="Market category">
        {marketTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              id={`market-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={market === tab.id}
              aria-controls="market-status-panel"
              className={`market-tab ${market === tab.id ? "active" : ""}`}
              onClick={() => setMarket(tab.id)}
            >
              <Icon size={16} /><span>{tab.label}</span><small>{tab.caption}</small>
            </button>
          );
        })}
      </div>

      <section className="panel market-feed-panel" id="market-status-panel" role="tabpanel" aria-labelledby={`market-tab-${market}`} aria-live="polite">
        <div className="market-feed-state"><span className="market-feed-state-dot" />{marketFeedState}</div>
        <h3>{details.title}</h3>
        <p className="market-feed-description">{details.description}</p>
        <div className="market-coverage-grid">
          {details.cards.map((card) => (
            <article className="market-coverage-card" key={card.label}>
              <span>{card.label}</span><strong>{card.title}</strong><p>{card.detail}</p>
            </article>
          ))}
        </div>
        <dl className="market-diagnostics-grid" role="status" aria-live="polite" aria-label="Market data diagnostics">
          {diagnosticRows.map((row) => (
            <div key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>
          ))}
        </dl>
        <p className="market-diagnostics-note">
          {diagnosticsQuery.data
            ? `Diagnostics checked ${formatMarketTime(diagnosticsQuery.data.checkedAt)}. This is a status-check time, not a market quote timestamp.`
            : "Diagnostics status is not available; CAPVY continues to show no quote."}
        </p>
      </section>

      {sources.length > 0 && (
        <section className="panel market-provider-panel">
          <div className="market-provider-heading">
            <div className="eyebrow">{market === "crypto" ? "COINBASE · OFFICIAL PAGES" : "OFFICIAL EXCHANGE SOURCES"}</div>
            <h3>{market === "crypto" ? "Visit the source or review its terms." : "Connect a feed with the right permissions."}</h3>
            <p>{market === "crypto" ? "These links open Coinbase’s own pages. CAPVY does not copy or embed their market data." : "Live public display and CAPVY's educational/simulation use require a suitable provider agreement. An exchange web page or personal charting key is not a redistribution license."}</p>
          </div>
          <div className="market-source-grid">
            {sources.map((source) => (
              <a className="market-source-card" href={source.href} target="_blank" rel="noopener noreferrer" key={source.href}>
                <span><strong>{source.title}</strong><ExternalLink size={14} /></span><p>{source.description}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      <div className="fine-print market-feed-footnote">
        <ShieldAlert size={14} />
        <span>Until the required rights and feeds are in place, CAPVY intentionally shows no current SENSEX value, crypto quote, market capitalization, FX rate, company list or sample market chart. Cashflow and game figures are separate hypothetical simulations.</span>
      </div>
    </div>
  );
}
