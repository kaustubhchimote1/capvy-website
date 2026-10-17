import { useState } from "react";
import { Activity, ExternalLink, Globe2, ShieldAlert, TrendingUp } from "lucide-react";

type MarketKind = "stocks" | "crypto" | "currency";

const marketTabs: { id: MarketKind; label: string; caption: string; icon: typeof TrendingUp }[] = [
  { id: "stocks", label: "Indian stocks", caption: "NSE · BSE", icon: TrendingUp },
  { id: "crypto", label: "Crypto", caption: "DIGITAL ASSETS", icon: Activity },
  { id: "currency", label: "Currency", caption: "FX PAIRS", icon: Globe2 },
];

const categoryDetails: Record<MarketKind, {
  title: string;
  description: string;
  cards: { label: string; title: string; detail: string }[];
}> = {
  stocks: {
    title: "Live Indian equity data is unavailable.",
    description: "CAPVY will show the SENSEX value, daily point and percentage move, and searchable active NSE/BSE equities only after a licensed live feed is connected. No stock price or illustrative chart is shown here.",
    cards: [
      { label: "BENCHMARK", title: "SENSEX · no live quote", detail: "Live INR value, point move, percentage move, exchange, source and timestamp will appear when available." },
      { label: "LISTED EQUITIES", title: "Active universe not loaded", detail: "The directory must include active NSE/BSE IPO-listed equities, including SME listings, without implying coverage that a provider cannot verify." },
      { label: "STATUS", title: "Licensed feed required", detail: "The provider's rights must allow live public website display and CAPVY's educational/simulation use." },
    ],
  },
  crypto: {
    title: "Live crypto data is unavailable.",
    description: "No crypto quotes, market-cap values or history are shown until a real provider is connected and its source and update time can be displayed.",
    cards: [
      { label: "COVERAGE", title: "No provider connected", detail: "Asset prices and market metrics are not loaded." },
      { label: "DATA LABELS", title: "Source and timestamp required", detail: "Any future feed will identify provider, quote time and live/delayed status." },
      { label: "CHARTS", title: "No sample series", detail: "CAPVY does not substitute invented or normalized values for market history." },
    ],
  },
  currency: {
    title: "Live currency data is unavailable.",
    description: "No INR exchange rates or price history are shown until a real currency provider is connected and its source and update time can be displayed.",
    cards: [
      { label: "COVERAGE", title: "No provider connected", detail: "Currency-pair quotes are not loaded." },
      { label: "DATA LABELS", title: "Source and timestamp required", detail: "Any future feed will identify provider, quote time and live/delayed status." },
      { label: "CHARTS", title: "No sample series", detail: "CAPVY does not substitute invented or normalized values for market history." },
    ],
  },
};

const exchangeLinks = [
  {
    title: "BSE market-data subscriptions",
    description: "Official data products, subscription information and vendor contacts.",
    href: "https://www.bseindia.com/marketdata-products",
  },
  {
    title: "NSE real-time data subscription",
    description: "Official NSE market-data subscription options and terms.",
    href: "https://www.nseindia.com/static/market-data/real-time-data-subscription",
  },
  {
    title: "NSE securities available for trading",
    description: "Official active-for-trading securities files, including equity categories.",
    href: "https://www.nseindia.com/static/market-data/securities-available-for-trading",
  },
  {
    title: "BSE listed securities",
    description: "Official BSE security directory with status filters.",
    href: "https://www.bseindia.com/corporates/List_Scrips.html",
  },
];

export default function Markets() {
  const [market, setMarket] = useState<MarketKind>("stocks");
  const details = categoryDetails[market];

  return (
    <div className="page-stack">
      <section className="page-intro-row market-intro">
        <div>
          <div className="eyebrow"><span className="eyebrow-line" />MARKET DATA</div>
          <h2 className="page-title">Follow the market.<br />Only with verified data.</h2>
          <p className="page-lead">CAPVY will display a price only when it comes from a connected, authorized source.</p>
        </div>
        <div className="connection-banner">
          <ShieldAlert size={17} />
          <span><strong>Live feed not connected</strong><small>No market values are displayed.</small></span>
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

      <section
        className="panel market-feed-panel"
        id="market-status-panel"
        role="tabpanel"
        aria-labelledby={`market-tab-${market}`}
        aria-live="polite"
      >
        <div className="market-feed-state"><span className="market-feed-state-dot" /><span>LIVE DATA UNAVAILABLE · PROVIDER SETUP REQUIRED</span></div>
        <h3>{details.title}</h3>
        <p className="market-feed-description">{details.description}</p>
        <div className="market-coverage-grid">
          {details.cards.map((card) => (
            <article className="market-coverage-card" key={card.label}>
              <span>{card.label}</span>
              <strong>{card.title}</strong>
              <p>{card.detail}</p>
            </article>
          ))}
        </div>
      </section>

      {market === "stocks" && (
        <section className="panel market-provider-panel">
          <div className="market-provider-heading">
            <div className="eyebrow">OFFICIAL EXCHANGE SOURCES</div>
            <h3>Connect a feed with the right permissions.</h3>
            <p>Live public display and CAPVY's educational/simulation use require a suitable provider agreement. An exchange web page or personal charting key is not a redistribution license.</p>
          </div>
          <div className="market-source-grid">
            {exchangeLinks.map((source) => (
              <a className="market-source-card" href={source.href} target="_blank" rel="noopener noreferrer" key={source.href}>
                <span><strong>{source.title}</strong><ExternalLink size={14} /></span>
                <p>{source.description}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      <div className="fine-print market-feed-footnote">
        <ShieldAlert size={14} />
        <span>Until an authorized provider is configured, CAPVY intentionally shows no live quote, last-close value, company list or sample chart. When connected, every value will include its source, timestamp and live/stale/market-closed status.</span>
      </div>
    </div>
  );
}
