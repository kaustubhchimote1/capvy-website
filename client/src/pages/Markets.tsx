import { useState } from "react";
import { Activity, ExternalLink, Globe2, ShieldAlert, TrendingUp } from "lucide-react";

type MarketKind = "stocks" | "crypto" | "currency";

const marketTabs: { id: MarketKind; label: string; caption: string; icon: typeof TrendingUp }[] = [
  { id: "stocks", label: "Indian stocks", caption: "NSE · BSE", icon: TrendingUp },
  { id: "crypto", label: "Crypto", caption: "INR MARKETS", icon: Activity },
  { id: "currency", label: "Currency", caption: "FX PAIRS", icon: Globe2 },
];

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

export default function Markets() {
  const [market, setMarket] = useState<MarketKind>("stocks");
  const details = categoryDetails[market];
  const sources = market === "stocks" ? equitySources : market === "crypto" ? coinbaseSources : [];

  return (
    <div className="page-stack market-page">
      <section className="page-intro-row market-intro">
        <div>
          <div className="eyebrow"><span className="eyebrow-line" />MARKET DATA · SOURCE FIRST</div>
          <h2 className="page-title">A chart is only as good as its source.</h2>
          <p className="page-lead">CAPVY will not display a market value unless the source, observation time and right to display it are clear.</p>
        </div>
        <div className="connection-banner market-permission-banner">
          <ShieldAlert size={18} />
          <span><strong>Market feeds unavailable</strong><small>No quotes, market caps or charts are shown.</small></span>
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
        <div className="market-feed-state"><span className="market-feed-state-dot" /><span>{market === "crypto" ? "COINBASE DATA · WRITTEN DISPLAY CONSENT REQUIRED" : "LIVE DATA UNAVAILABLE · SOURCE SETUP REQUIRED"}</span></div>
        <h3>{details.title}</h3>
        <p className="market-feed-description">{details.description}</p>
        <div className="market-coverage-grid">
          {details.cards.map((card) => (
            <article className="market-coverage-card" key={card.label}>
              <span>{card.label}</span><strong>{card.title}</strong><p>{card.detail}</p>
            </article>
          ))}
        </div>
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
