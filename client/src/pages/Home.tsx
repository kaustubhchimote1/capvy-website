import { ArrowDownRight, ArrowRight, ArrowUpRight, BookOpen, CircleHelp, Clock3, Compass, ShieldCheck, Sparkles, WalletCards } from "lucide-react";
import { Link } from "wouter";
import { calculateCashflow, DEFAULT_SCENARIO } from "@/lib/cashflow";
import { formatINR } from "@/lib/format";
import { trpc } from "@/lib/trpc";

const demoResult = calculateCashflow(DEFAULT_SCENARIO);

function SectionHeading({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) {
  return <div className="section-heading"><div><div className="eyebrow">{eyebrow}</div><h2>{title}</h2></div>{action}</div>;
}

export default function Home() {
  const assistantStatus = trpc.assistant.status.useQuery(undefined, { staleTime: 30_000 });
  const assistantLabel = assistantStatus.isLoading
    ? "CHECKING AI"
    : assistantStatus.data?.configured
      ? "AI SERVICE ONLINE"
      : assistantStatus.isError
        ? "STATUS UNAVAILABLE"
        : "SETUP REQUIRED";
  return (
    <div className="page-stack">
      <section className="welcome-row">
        <div>
          <div className="eyebrow"><span className="eyebrow-line" />YOUR FINANCIAL LEARNING SPACE</div>
          <h2 className="welcome-title">Build the instinct<br className="desktop-break" /> behind the numbers.</h2>
          <p className="welcome-copy">Practice decisions, explore what moves money, and understand the timing—not just the totals.</p>
          <div className="welcome-actions">
            <Link href="/cashflow" className="button-primary"><WalletCards size={16} /> Open cashflow lab <ArrowRight size={15} /></Link>
            <Link href="/learn" className="button-secondary"><BookOpen size={16} /> Explore lessons</Link>
          </div>
        </div>
        <div className="welcome-side-note">
          <span className="note-index">01 / 05</span>
          <span className="note-rule" />
          <p>Understand the<br />space between<br /><strong>income and outflow.</strong></p>
          <span className="note-coordinate">CAPVY FIELD NOTE</span>
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="panel featured-panel">
          <div className="panel-topline">
            <span className="panel-label"><span className="status-square" />SIGNATURE SIMULATION</span>
            <span className="tag tag-demo">Hypothetical scenario</span>
          </div>
          <div className="feature-main">
            <div>
              <p className="feature-title">Cashflow collision detector</p>
              <p className="muted-copy">A monthly total can look fine while the timing still gets tight.</p>
            </div>
            <div className="feature-callout">
              <span className="callout-label">FIRST PROJECTED DIP</span>
              <strong>Day {demoResult.firstNegativeDay ?? "—"}</strong>
              <span className="negative-value">{demoResult.firstNegativeDay ? `${formatINR(demoResult.shortfall)} below zero` : "No shortfall"}</span>
            </div>
          </div>
          <div className="event-ribbon" aria-label="Example transaction sequence">
            {DEFAULT_SCENARIO.transactions.map((transaction, index) => (
              <div className="event-step" key={transaction.id}>
                <span className={`event-dot ${transaction.kind}`} />
                <div><span className="event-day">DAY {transaction.day}</span><span className="event-name">{transaction.label}</span></div>
                <span className={`event-amount ${transaction.kind}`}>{transaction.kind === "income" ? "+" : "−"}{formatINR(transaction.amount)}</span>
                {index < DEFAULT_SCENARIO.transactions.length - 1 && <span className="event-connector" />}
              </div>
            ))}
          </div>
          <div className="panel-bottom-row"><span className="micro-note"><Clock3 size={14} /> Income lands after the Day 12 commitment.</span><Link href="/cashflow" className="inline-arrow">Change the timing <ArrowRight size={15} /></Link></div>
        </article>

        <article className="panel balance-panel">
          <div className="panel-topline"><span className="panel-label">YOUR PRACTICE BALANCE</span><span className="tiny-status">LOCAL DEMO</span></div>
          <p className="balance-amount">{formatINR(DEFAULT_SCENARIO.startingBalance)}</p>
          <p className="balance-description">Starting balance in the sample scenario</p>
          <div className="balance-divider" />
          <div className="balance-stat-row"><span>Lowest projected balance</span><strong className={demoResult.lowestBalance < 0 ? "negative-text" : ""}>{formatINR(demoResult.lowestBalance)}</strong></div>
          <div className="balance-stat-row"><span>Balance recovers</span><strong>{demoResult.recoveryDay ? `Day ${demoResult.recoveryDay}` : "Not needed"}</strong></div>
          <div className="hypothetical-note"><ShieldCheck size={14} /> Figures are fictional and stay in this browser.</div>
        </article>
      </section>

      <section className="section-block">
        <SectionHeading eyebrow="EXPLORE WITH CONTEXT" title="A clearer view of money" />
        <div className="explore-grid">
          <Link href="/markets" className="explore-card"><div className="explore-icon market-icon"><Compass size={18} /></div><div className="explore-copy"><h3>Markets, without the noise</h3><p>Learn the language of stocks, crypto and currency. Live data is not connected in this demo.</p></div><span className="connection-state">SETUP REQUIRED</span><ArrowUpRight className="explore-arrow" size={17} /></Link>
          <Link href="/news" className="explore-card"><div className="explore-icon news-icon"><BookOpen size={18} /></div><div className="explore-copy"><h3>Economy in plain language</h3><p>Understand financial developments with source attribution, when a verified feed is connected.</p></div><span className="connection-state">FEED NOT CONNECTED</span><ArrowUpRight className="explore-arrow" size={17} /></Link>
          <Link href="/assistant" className="explore-card"><div className="explore-icon assistant-icon"><Sparkles size={18} /></div><div className="explore-copy"><h3>Ask the “why”</h3><p>Get a beginner-friendly explanation of financial concepts and hypothetical scenarios.</p></div><span className={`connection-state ${assistantStatus.data?.configured ? "connected" : ""}`}><span />{assistantLabel}</span><ArrowUpRight className="explore-arrow" size={17} /></Link>
        </div>
      </section>

      <section className="dashboard-bottom-grid">
        <article className="panel learning-panel">
          <SectionHeading eyebrow="SMALL STEPS, SOLID FOUNDATIONS" title="Pick up a useful idea" action={<Link href="/learn" className="inline-arrow">All lessons <ArrowRight size={15} /></Link>} />
          <div className="lesson-row"><span className="lesson-number">01</span><div className="lesson-info"><strong>Revenue, profit and cash are not the same</strong><span>Business basics · 4 min</span></div><Link href="/learn" className="lesson-open" aria-label="Open business basics lesson"><ArrowRight size={16} /></Link></div>
          <div className="lesson-row"><span className="lesson-number">02</span><div className="lesson-info"><strong>Why the date matters in a budget</strong><span>Cashflow · 3 min</span></div><Link href="/cashflow" className="lesson-open" aria-label="Try the cashflow exercise"><ArrowRight size={16} /></Link></div>
          <div className="lesson-row"><span className="lesson-number">03</span><div className="lesson-info"><strong>What diversification can—and can't—do</strong><span>Risk &amp; return · 5 min</span></div><Link href="/learn" className="lesson-open" aria-label="Open the investment lesson"><ArrowRight size={16} /></Link></div>
        </article>
        <article className="panel news-status-panel">
          <div className="panel-topline"><span className="panel-label">ECONOMIC INTELLIGENCE</span><span className="tiny-status muted-status"><span />NO VERIFIED FEED</span></div>
          <div className="news-empty-mark"><ArrowDownRight size={18} /></div>
          <h3>Better context starts with a real source.</h3>
          <p>No verified news provider is connected yet. CAPVY will not invent headlines or summarize stories it has not retrieved.</p>
          <Link href="/news" className="inline-arrow">View feed status <ArrowRight size={15} /></Link>
        </article>
      </section>

      <div className="fine-print"><ShieldCheck size={14} /><span>CAPVY is an educational demo. Market and news providers are not connected. Simulations are hypothetical; this is not investment, tax or legal advice.</span></div>
    </div>
  );
}
