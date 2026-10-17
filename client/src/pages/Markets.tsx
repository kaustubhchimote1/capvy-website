import { useMemo, useState } from "react";
import { Activity, ArrowRight, Bookmark, Check, CircleHelp, Globe2, Search, ShieldAlert, Star, TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type MarketKind = "stocks" | "crypto" | "currency";
type Period = "1W" | "1M" | "1Y";

const instruments: Record<MarketKind, { symbol: string; name: string; descriptor: string }[]> = {
  stocks: [
    { symbol: "NIFTY 50", name: "NIFTY 50", descriptor: "Index · India" },
    { symbol: "SENSEX", name: "SENSEX", descriptor: "Index · India" },
    { symbol: "RELIANCE", name: "Reliance Industries", descriptor: "Equity · NSE" },
    { symbol: "TCS", name: "Tata Consultancy Services", descriptor: "Equity · NSE" },
    { symbol: "INFY", name: "Infosys", descriptor: "Equity · NSE" },
  ],
  crypto: [
    { symbol: "BTC", name: "Bitcoin", descriptor: "Crypto asset" },
    { symbol: "ETH", name: "Ethereum", descriptor: "Crypto asset" },
    { symbol: "SOL", name: "Solana", descriptor: "Crypto asset" },
    { symbol: "XRP", name: "XRP", descriptor: "Crypto asset" },
  ],
  currency: [
    { symbol: "USD/INR", name: "US dollar / Indian rupee", descriptor: "Currency pair" },
    { symbol: "EUR/INR", name: "Euro / Indian rupee", descriptor: "Currency pair" },
    { symbol: "GBP/INR", name: "British pound / Indian rupee", descriptor: "Currency pair" },
    { symbol: "JPY/INR", name: "Japanese yen / Indian rupee", descriptor: "Currency pair" },
  ],
};

const illustrativeSeries: Record<Period, number[]> = {
  "1W": [100, 100.8, 100.1, 101.4, 100.9, 102.1, 101.6],
  "1M": [100, 98.9, 100.4, 99.7, 101.1, 101.6, 100.8, 102.2, 101.5, 103.1, 102.4, 104.0],
  "1Y": [100, 97.5, 99.2, 96.8, 102.1, 101.0, 104.3, 103.6, 106.1, 104.8, 108.0, 107.4],
};

const marketTabs: { id: MarketKind; label: string; caption: string; icon: typeof Activity }[] = [
  { id: "stocks", label: "Indian stocks", caption: "EQUITIES", icon: TrendingUp },
  { id: "crypto", label: "Crypto", caption: "DIGITAL ASSETS", icon: Activity },
  { id: "currency", label: "Currency", caption: "FX PAIRS", icon: Globe2 },
];

function readWatchlist() {
  try { return JSON.parse(window.localStorage.getItem("capvy.watchlist") ?? "[\"NIFTY 50\"]") as string[]; }
  catch { return ["NIFTY 50"]; }
}

export default function Markets() {
  const [market, setMarket] = useState<MarketKind>("stocks");
  const [period, setPeriod] = useState<Period>("1M");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("NIFTY 50");
  const [watchlist, setWatchlist] = useState<string[]>(readWatchlist);
  const currentInstruments = instruments[market];
  const visibleInstruments = currentInstruments.filter((item) => `${item.symbol} ${item.name}`.toLowerCase().includes(query.toLowerCase()));
  const selectedInstrument = currentInstruments.find((item) => item.symbol === selected) ?? currentInstruments[0];
  const chartData = useMemo(() => illustrativeSeries[period].map((value, index) => ({ step: index + 1, value })), [period]);
  const change = chartData.at(-1)!.value - chartData[0].value;

  const changeMarket = (value: MarketKind) => {
    setMarket(value);
    setSelected(instruments[value][0].symbol);
    setQuery("");
  };

  const toggleWatchlist = (symbol: string) => {
    setWatchlist((current) => {
      const next = current.includes(symbol) ? current.filter((item) => item !== symbol) : [...current, symbol];
      try { window.localStorage.setItem("capvy.watchlist", JSON.stringify(next)); } catch { /* Watchlist remains available for this visit. */ }
      return next;
    });
  };

  return (
    <div className="page-stack">
      <section className="page-intro-row market-intro"><div><div className="eyebrow"><span className="eyebrow-line" />EXPLORE MARKETS</div><h2 className="page-title">Follow the shape.<br />Know what’s real.</h2><p className="page-lead">Explore familiar instruments and chart interactions. This prototype does not have a market-data provider connected.</p></div><div className="connection-banner"><ShieldAlert size={17} /><span><strong>Provider not connected</strong><small>No quotes shown as live or current.</small></span></div></section>

      <div className="market-tabs" role="tablist" aria-label="Market category">
        {marketTabs.map((tab) => { const Icon = tab.icon; return <button key={tab.id} role="tab" type="button" aria-selected={market === tab.id} className={`market-tab ${market === tab.id ? "active" : ""}`} onClick={() => changeMarket(tab.id)}><Icon size={16} /><span>{tab.label}</span><small>{tab.caption}</small></button>; })}
      </div>

      <section className="market-workspace">
        <aside className="panel instrument-panel">
          <div className="panel-topline"><span className="panel-label">INSTRUMENTS</span><span className="tag tag-demo">DEMO</span></div>
          <label className="search-field"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search this market" aria-label="Search instruments" /></label>
          <div className="instrument-list">{visibleInstruments.map((instrument) => <button type="button" key={instrument.symbol} className={`instrument-row ${selectedInstrument?.symbol === instrument.symbol ? "active" : ""}`} onClick={() => setSelected(instrument.symbol)}><span className="instrument-symbol">{instrument.symbol.slice(0, 2)}</span><span className="instrument-text"><strong>{instrument.symbol}</strong><small>{instrument.name}</small></span><span className="instrument-active" /></button>)}{visibleInstruments.length === 0 && <p className="empty-search">No instruments match that search.</p>}</div>
          <div className="watchlist-panel"><div className="panel-topline"><span className="panel-label"><Bookmark size={13} /> WATCHLIST</span><span className="small-count">{watchlist.length}</span></div>{watchlist.length === 0 ? <p className="side-copy">Save an instrument to keep it here on this device.</p> : watchlist.map((symbol) => <button className="watchlist-item" type="button" key={symbol} onClick={() => { if (currentInstruments.some((instrument) => instrument.symbol === symbol)) setSelected(symbol); }}><Star size={13} fill="currentColor" /><span>{symbol}</span><Check size={13} /></button>)}</div>
        </aside>

        <div className="market-detail-column">
          <section className="panel market-chart-panel">
            <div className="market-instrument-heading"><div><div className="eyebrow">{marketTabs.find((tab) => tab.id === market)?.caption}</div><h3>{selectedInstrument?.name}</h3><p>{selectedInstrument?.descriptor} <span className="dot-separator">·</span> {selectedInstrument?.symbol}</p></div><button type="button" className={`watch-toggle ${watchlist.includes(selectedInstrument?.symbol ?? "") ? "selected" : ""}`} onClick={() => selectedInstrument && toggleWatchlist(selectedInstrument.symbol)} aria-pressed={watchlist.includes(selectedInstrument?.symbol ?? "")}><Star size={15} fill={watchlist.includes(selectedInstrument?.symbol ?? "") ? "currentColor" : "none"} />{watchlist.includes(selectedInstrument?.symbol ?? "") ? "Saved" : "Add to watchlist"}</button></div>
            <div className="demo-chart-banner"><span className="demo-chart-icon"><Activity size={14} /></span><span><strong>Illustrative chart</strong> · Normalized example path, not actual market history or a live price.</span></div>
            <div className="chart-header-row"><div><span className="chart-value">100<span className="chart-value-unit">.0</span></span><span className="chart-unit-label">INDEXED BASELINE</span></div><span className={`chart-change ${change >= 0 ? "positive-text" : "negative-text"}`}>{change >= 0 ? "+" : ""}{change.toFixed(1)} illustrative points</span></div>
            <div className="period-controls" role="group" aria-label="Illustrative chart period">{(["1W", "1M", "1Y"] as const).map((value) => <button type="button" key={value} onClick={() => setPeriod(value)} className={period === value ? "active" : ""} aria-pressed={period === value}>{value}</button>)}</div>
            <div className="chart-frame market-chart"><ResponsiveContainer width="100%" height="100%"><LineChart data={chartData} margin={{ top: 12, right: 16, bottom: 2, left: 0 }}><CartesianGrid stroke="rgba(160,180,168,.09)" vertical={false} /><XAxis dataKey="step" tickLine={false} axisLine={{ stroke: "#29332e" }} tick={{ fill: "#829089", fontSize: 11 }} tickFormatter={(value: number) => `${value}`} /><YAxis domain={["dataMin - 2", "dataMax + 2"]} tickLine={false} axisLine={false} tick={{ fill: "#829089", fontSize: 11 }} width={38} /><Tooltip contentStyle={{ background: "#151c19", border: "1px solid #303b35", borderRadius: 9, color: "#eef5f0" }} formatter={(value: number) => [`${value.toFixed(1)} · illustrative index`, "Normalized value"]} labelFormatter={(label: number) => `Example point ${label}`} /><Line type="monotone" dataKey="value" stroke="#16c784" strokeWidth={2.4} dot={false} activeDot={{ r: 4, fill: "#16c784" }} /></LineChart></ResponsiveContainer></div>
            <div className="chart-source-note"><CircleHelp size={13} /><span>Source: CAPVY illustrative demo series · Baseline 100 · Not market data</span></div>
          </section>
          <section className="panel market-explainer"><span className="explainer-label">READ THE SIGNAL</span><p>{market === "currency" && selectedInstrument?.symbol.startsWith("USD") ? "For a real USD/INR quote, a rising rate generally means more rupees are needed to buy one US dollar. This demo does not show an exchange rate." : market === "crypto" ? "Crypto assets can be volatile. A chart—especially an illustrative one—cannot tell you what an asset will do next." : "Indices and stocks can move for many reasons. This normalized demo chart is for interaction practice, not a representation of actual performance."}</p><span className="market-data-footnote">Quotes, volume, high/low, market capitalization and historical market intervals require a connected data provider.</span></section>
        </div>
      </section>
      <div className="fine-print"><ShieldAlert size={14} /><span>All values in the chart are illustrative normalized points, not quotes, prices, returns or historical market observations.</span></div>
    </div>
  );
}
