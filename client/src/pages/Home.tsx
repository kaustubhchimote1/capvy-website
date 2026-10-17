import { ArrowDownRight, ArrowRight, ArrowUpRight, BookOpen, CircleHelp, Clock3, Compass, ExternalLink, ShieldCheck, Sparkles, WalletCards } from "lucide-react";
import { Link } from "wouter";
import { calculateCashflow, DEFAULT_SCENARIO } from "@/lib/cashflow";
import { formatINR } from "@/lib/format";
import { trpc } from "@/lib/trpc";

const demoResult = calculateCashflow(DEFAULT_SCENARIO);
const learningLabs = ["Cashflow Survival", "Business Builder", "Investment Lab", "Taxation Challenge", "Market Reaction Lab"];

export default function Home() {
  const assistantStatus = trpc.assistant.status.useQuery(undefined, { staleTime: 30_000 });
  const assistantLabel = assistantStatus.isLoading
    ? "Checking setup"
    : assistantStatus.data?.configured
      ? "Service configured"
      : assistantStatus.isError
        ? "Status unavailable"
        : "Setup required";

  return (
    <div className="page-stack home-story">
      <section className="story-hero">
        <div className="hero-copy">
          <div className="hero-topline">
            <span className="hero-kicker"><span className="hero-kicker-dot" /> THE FINANCIAL PRACTICE SPACE</span>
            <span className="hero-location">BUILT FOR INDIA’S NEXT GENERATION</span>
          </div>
          <h2 className="hero-title">Money moves.<br /><span>Learn to move with it.</span></h2>
          <p className="hero-lead">Build your financial instincts by doing. Explore ideas, test decisions and understand the timing before real money is involved.</p>
          <div className="hero-actions">
            <Link href="/learn" className="button-primary">Explore the labs <ArrowRight size={16} /></Link>
            <Link href="/cashflow" className="button-secondary">Try the cashflow simulator <ArrowUpRight size={15} /></Link>
          </div>
          <div className="hero-principles" aria-label="CAPVY principles">
            <span><ShieldCheck size={14} /> Practice, not trading</span>
            <span><Compass size={14} /> Context over hype</span>
          </div>
        </div>

        <div className="hero-art" aria-label="Decorative illustration of a learning path, not a market chart">
          <div className="hero-orbit hero-orbit-one" />
          <div className="hero-orbit hero-orbit-two" />
          <div className="hero-orbit hero-orbit-three" />
          <div className="hero-art-card">
            <div className="hero-card-top"><span>NOT MARKET DATA</span><span>01 — 05</span></div>
            <svg className="hero-signal" viewBox="0 0 430 210" fill="none" aria-hidden="true">
              <path d="M6 154C54 151 51 75 105 82S157 152 208 122 263 51 310 77 365 165 424 45" stroke="url(#signal-gradient)" strokeWidth="4" strokeLinecap="round" />
              <path d="M5 176H425" stroke="currentColor" strokeOpacity=".14" strokeDasharray="4 8" />
              <path d="M5 116H425" stroke="currentColor" strokeOpacity=".1" strokeDasharray="4 8" />
              <circle cx="208" cy="122" r="7" fill="#B69CFF" />
              <circle cx="208" cy="122" r="15" stroke="#B69CFF" strokeOpacity=".28" />
              <defs><linearGradient id="signal-gradient" x1="6" y1="105" x2="424" y2="102" gradientUnits="userSpaceOnUse"><stop stopColor="#B69CFF" /><stop offset="1" stopColor="#C9FF73" /></linearGradient></defs>
            </svg>
            <div className="hero-art-caption"><span>FINANCIAL FLUENCY</span><strong>Built by<br />understanding.</strong></div>
          </div>
          <div className="hero-float hero-float-one"><span>SIMULATE</span><strong>before you spend</strong></div>
          <div className="hero-float hero-float-two"><span>LEARN</span><strong>by doing</strong></div>
          <div className="hero-scroll-cue"><span>SCROLL TO EXPLORE</span><ArrowDownRight size={15} /></div>
        </div>
      </section>

      <div className="story-marquee" aria-label="CAPVY learning approach">
        <span>MAKE IT CLEAR</span><i /> <span>MAKE IT PRACTICAL</span><i /> <span>MAKE IT YOURS</span><i /> <span>NO REAL TRADES</span>
      </div>

      <section className="story-section story-cashflow">
        <div className="story-section-index"><span>01</span><span>SEE THE TIMING</span></div>
        <div className="story-section-body">
          <div className="story-copy">
            <p className="eyebrow">CASHFLOW COLLISION DETECTOR</p>
            <h2>A monthly total can look fine. The calendar can tell another story.</h2>
            <p>Move income dates and expenses around. See the running balance after every event, find the first shortfall and compare a safer alternative.</p>
            <Link href="/cashflow" className="story-link">Build a scenario <ArrowRight size={16} /></Link>
          </div>

          <article className="panel preview-cashflow-card">
            <div className="preview-card-top"><span><span className="preview-status-dot" /> FICTIONAL PRACTICE SCENARIO</span><Clock3 size={15} /></div>
            <div className="preview-card-title-row"><h3>One month, four events</h3><span>DEMO ONLY</span></div>
            <div className="preview-balance-line">
              <span>Lowest projected balance</span>
              <strong className={demoResult.lowestBalance < 0 ? "negative-text" : ""}>{formatINR(demoResult.lowestBalance)}</strong>
              <small>{demoResult.firstNegativeDay ? `First projected dip: Day ${demoResult.firstNegativeDay}` : "No projected shortfall"}</small>
            </div>
            <div className="story-event-list" aria-label="Fictional scenario transactions">
              {DEFAULT_SCENARIO.transactions.slice(0, 4).map((transaction) => (
                <div className="story-event-row" key={transaction.id}>
                  <span className={`story-event-dot ${transaction.kind}`} />
                  <span className="story-event-day">DAY {transaction.day}</span>
                  <span className="story-event-name">{transaction.label}</span>
                  <strong className={transaction.kind === "income" ? "positive-text" : "negative-value"}>{transaction.kind === "income" ? "+" : "−"}{formatINR(transaction.amount)}</strong>
                </div>
              ))}
            </div>
            <p className="preview-footnote"><ShieldCheck size={13} /> This is a fictional simulation—not a market quote or a recommendation.</p>
          </article>
        </div>
      </section>

      <section className="story-section story-learning">
        <div className="story-section-index"><span>02</span><span>LEARN BY DOING</span></div>
        <div className="story-section-body story-learning-grid">
          <div className="story-copy">
            <p className="eyebrow">FIVE INTERACTIVE LABS</p>
            <h2>Try the decision. Then unpack why it worked.</h2>
            <p>Practice everyday money choices, business basics, investment concepts, taxation and market reactions with clearly labelled virtual scenarios.</p>
            <Link href="/learn" className="story-link">Open the learning labs <ArrowRight size={16} /></Link>
          </div>
          <div className="lab-stack" aria-label="Five learning labs">
            {learningLabs.map((lab, index) => (
              <Link href="/learn" className="lab-item" key={lab}>
                <span className="lab-index">0{index + 1}</span><span>{lab}</span><ArrowUpRight size={15} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="story-section story-markets">
        <div className="story-section-index"><span>03</span><span>FOLLOW WITH CONTEXT</span></div>
        <div className="story-section-body">
          <div className="story-copy">
            <p className="eyebrow">MARKET DATA HAS TO EARN ITS PLACE</p>
            <h2>Every chart starts with a source you can trust.</h2>
            <p>Coinbase’s India market pages cover crypto in INR. Its data terms require written permission before another app can republish those values, so CAPVY shows no copied quotes or sample market charts.</p>
            <Link href="/markets" className="story-link">See market data status <ArrowRight size={16} /></Link>
          </div>
          <article className="market-status-card">
            <div className="market-status-topline"><span>DATA ACCESS</span><span className="permission-chip"><span /> PERMISSION REQUIRED</span></div>
            <div className="market-status-item"><span>CRYPTO / INR</span><strong>Coinbase display consent pending</strong></div>
            <div className="market-status-item"><span>NSE / BSE EQUITIES</span><strong>Separate live feed required</strong></div>
            <div className="market-status-item"><span>CURRENCY / FX</span><strong>Separate provider required</strong></div>
            <a className="external-market-link" href="https://www.coinbase.com/en-in/explore" target="_blank" rel="noopener noreferrer">Open Coinbase India crypto explorer <ExternalLink size={14} /></a>
          </article>
        </div>
      </section>

      <section className="story-section story-tools">
        <div className="story-section-index"><span>04</span><span>KEEP EXPLORING</span></div>
        <div className="story-tools-grid">
          <Link href="/news" className="story-tool-card">
            <span className="tool-icon"><BookOpen size={17} /></span><span className="tool-label">ECONOMY</span><h3>News with the source attached.</h3><p>No verified news feed is connected, and no headlines are invented.</p><span className="tool-status">FEED NOT CONNECTED</span><ArrowUpRight className="tool-arrow" size={16} />
          </Link>
          <Link href="/assistant" className="story-tool-card">
            <span className="tool-icon"><Sparkles size={17} /></span><span className="tool-label">AI EDUCATION</span><h3>Ask the question behind the question.</h3><p>Get beginner-friendly explanations of concepts and hypothetical scenarios.</p><span className="tool-status">{assistantLabel.toUpperCase()}</span><ArrowUpRight className="tool-arrow" size={16} />
          </Link>
          <Link href="/premium" className="story-tool-card">
            <span className="tool-icon"><WalletCards size={17} /></span><span className="tool-label">CAPVY PLUS</span><h3>More room to practise.</h3><p>Planned features are marked as upcoming. There is no checkout.</p><span className="tool-status">COMING SOON</span><ArrowUpRight className="tool-arrow" size={16} />
          </Link>
        </div>
      </section>

      <section className="story-endcap">
        <div className="endcap-orb" aria-hidden="true" />
        <div><p className="eyebrow">CAPVY · LEARN FAST. THINK FINANCIALLY.</p><h2>Start with a choice.<br /><span>Leave with better questions.</span></h2></div>
        <Link href="/assistant" className="button-primary">Ask CAPVY <CircleHelp size={15} /><ArrowRight size={15} /></Link>
      </section>

      <div className="fine-print"><ShieldCheck size={14} /><span>CAPVY is for financial education. Simulations are hypothetical, no real trades are made, and market data is withheld until its source and display rights are verified.</span></div>
    </div>
  );
}
