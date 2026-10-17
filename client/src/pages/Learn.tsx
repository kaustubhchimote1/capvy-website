import { useMemo, useState } from "react";
import { ArrowRight, BookOpen, BriefcaseBusiness, Check, CircleHelp, Compass, RotateCcw, ShieldAlert, Sparkles, TrendingUp, WalletCards } from "lucide-react";
import { formatINR } from "@/lib/format";
import { calculateBusinessOutcome, calculateCashflowSurvival, calculateSimplifiedExerciseTax, compareMonthlyInvestments } from "@/lib/games";

type GameId = "cashflow" | "business" | "investment" | "tax" | "reaction";

const games = [
  { id: "cashflow" as const, number: "01", title: "Cashflow survival", topic: "Timing & priorities", icon: WalletCards, description: "A surprise expense arrives before the next payment. Make room without losing sight of the month." },
  { id: "business" as const, number: "02", title: "Business builder", topic: "Revenue, profit & cash", icon: BriefcaseBusiness, description: "Choose a price for a small batch and see how demand changes the money left in the till." },
  { id: "investment" as const, number: "03", title: "Investment lab", topic: "Compounding & risk", icon: TrendingUp, description: "Compare a deposit with a purely hypothetical monthly investment scenario." },
  { id: "tax" as const, number: "04", title: "Taxation challenge", topic: "Assumptions matter", icon: ShieldAlert, description: "Explore how a simplified classroom tax rule changes a calculation." },
  { id: "reaction" as const, number: "05", title: "Market reaction lab", topic: "Mechanisms & uncertainty", icon: Compass, description: "Trace possible channels from an economic change to markets—without pretending to predict the result." },
];

function GameChoice({ selected, value, title, detail, onSelect }: { selected: string; value: string; title: string; detail: string; onSelect: (value: string) => void }) {
  return <button type="button" className={`choice-card ${selected === value ? "selected" : ""}`} onClick={() => onSelect(value)} aria-pressed={selected === value}><span className="choice-radio" /><span><strong>{title}</strong><small>{detail}</small></span></button>;
}

export default function Learn() {
  const [active, setActive] = useState<GameId>("cashflow");
  const [cashChoice, setCashChoice] = useState("");
  const [businessPrice, setBusinessPrice] = useState("");
  const [monthly, setMonthly] = useState(2000);
  const [horizon, setHorizon] = useState(24);
  const [taxIncome, setTaxIncome] = useState(600000);
  const [reactionChoice, setReactionChoice] = useState("");
  const [completed, setCompleted] = useState<GameId[]>([]);
  const game = games.find((item) => item.id === active)!;
  const GameIcon = game.icon;
  const survival = useMemo(() => calculateCashflowSurvival(), []);

  const investment = useMemo(() => compareMonthlyInvestments(monthly, horizon), [monthly, horizon]);
  const illustrativeTax = calculateSimplifiedExerciseTax(taxIncome);

  const markComplete = (id: GameId) => setCompleted((current) => current.includes(id) ? current : [...current, id]);
  const replay = () => {
    setCashChoice(""); setBusinessPrice(""); setReactionChoice("");
  };

  return (
    <div className="page-stack">
      <section className="page-intro-row learn-intro">
        <div><div className="eyebrow"><span className="eyebrow-line" />LEARN BY TRYING</div><h2 className="page-title">Make a small decision.<br />Understand the bigger idea.</h2><p className="page-lead">Five short practice labs. Virtual money only, honest assumptions, and no score for taking the biggest risk.</p></div>
        <div className="lesson-progress"><div className="progress-orbit"><span>{completed.length}<small>/5</small></span></div><div><strong>{completed.length} explored</strong><span>in this visit</span></div></div>
      </section>

      <div className="learn-layout">
        <aside className="game-list" aria-label="Learning games">
          <div className="eyebrow game-list-label">CHOOSE A PRACTICE LAB</div>
          {games.map((item) => {
            const Icon = item.icon;
            return <button key={item.id} type="button" className={`game-list-item ${active === item.id ? "active" : ""}`} onClick={() => setActive(item.id)} aria-pressed={active === item.id}>
              <span className="game-number">{item.number}</span><span className="game-list-icon"><Icon size={16} /></span><span className="game-list-title">{item.title}<small>{item.topic}</small></span>{completed.includes(item.id) && <Check className="game-complete" size={15} />}
            </button>;
          })}
          <div className="game-list-note"><BookOpen size={15} /><span>No real money. No market predictions. Just a clearer way to think.</span></div>
        </aside>

        <section className="panel game-workspace">
          <div className="game-workspace-heading"><div><span className="game-kicker">PRACTICE LAB {game.number} / 05</span><h3>{game.title}</h3><p>{game.description}</p></div><span className="game-large-icon"><GameIcon size={21} /></span></div>
          <div className="game-divider" />

          {active === "cashflow" && <div className="game-body">
            <div className="scenario-strip"><span className="scenario-initial">FICTIONAL MONTH</span><strong>{formatINR(6000)} to start</strong><span className="scenario-detail">Rent Day 5 · {formatINR(4000)} · Optional purchase Day 10 · {formatINR(1500)} · Income Day 18 · {formatINR(5000)}</span></div>
            <div className="game-event-card"><div className="game-event-date">DAY 12 <span>UNEXPECTED</span></div><div><strong>A ₹2,000 repair bill arrives.</strong><p>If you pay it now, the running balance gets tight before the income date.</p></div></div>
            <div className="game-question">What would you test first?</div>
            <div className="choice-stack">
              <GameChoice value="flex" selected={cashChoice} title="Pause a ₹1,500 non-essential purchase" detail="Keep the scheduled commitments; preserve more of the buffer." onSelect={(value) => { setCashChoice(value); markComplete("cashflow"); }} />
              <GameChoice value="income" selected={cashChoice} title="Check whether income can arrive earlier" detail="Only if the payer can actually change the date." onSelect={(value) => { setCashChoice(value); markComplete("cashflow"); }} />
              <GameChoice value="borrow" selected={cashChoice} title="Assume I can borrow the difference" detail="Debt adds cost and repayment risk; test cash timing first." onSelect={(value) => { setCashChoice(value); markComplete("cashflow"); }} />
            </div>
            {!cashChoice ? <p className="game-prompt-hint">Choose one move to calculate the updated balance path.</p> : <div className="game-outcome"><div className="outcome-icon"><Check size={16} /></div><div><span className="outcome-kicker">DETERMINISTIC SCENARIO RESULT</span><strong>{cashChoice === "flex" ? `Pausing the purchase changes the lowest balance from ${formatINR(survival.base.lowestBalance)} to ${formatINR(survival.pausePurchase.lowestBalance)}.` : cashChoice === "income" ? `Moving confirmed income to Day 10 changes the lowest balance from ${formatINR(survival.base.lowestBalance)} to ${formatINR(survival.earlierIncome.lowestBalance)}.` : `Without modeling borrowing, the baseline still reaches ${formatINR(survival.base.lowestBalance)} on Day ${survival.base.firstNegativeDay}.`}</strong><p>{cashChoice === "flex" ? "The baseline first drops below zero on Day 12. Removing the optional ₹1,500 purchase leaves the balance at ₹0 at the repair bill; a zero balance is still a tight buffer." : cashChoice === "income" ? "An earlier confirmed income date avoids the shortfall in this example but leaves only ₹500 at the lowest point: the Day 10 purchase is paid before Day 10 income." : "Borrowing is not counted as available cash here because fees and repayment dates are not modeled. Do not take on debt without understanding its cost and risks."}</p></div></div>}
            {cashChoice && <button className="button-quiet replay-button" type="button" onClick={replay}>Replay this scenario <RotateCcw size={14} /></button>}
          </div>}

          {active === "business" && <div className="game-body">
            <div className="scenario-strip"><span className="scenario-initial">FICTIONAL SHOP</span><strong>100 reusable bottles</strong><span className="scenario-detail">Cost per bottle: ₹90 · Total inventory cost: ₹9,000</span></div>
            <div className="game-question">Set a price. Demand is uncertain in real life; this exercise fixes a simple classroom assumption.</div>
            <div className="choice-stack three-options">
              <GameChoice value="120" selected={businessPrice} title="₹120 · lower price" detail="Exercise assumes 100 sold" onSelect={(value) => { setBusinessPrice(value); markComplete("business"); }} />
              <GameChoice value="160" selected={businessPrice} title="₹160 · middle price" detail="Exercise assumes 80 sold" onSelect={(value) => { setBusinessPrice(value); markComplete("business"); }} />
              <GameChoice value="200" selected={businessPrice} title="₹200 · higher price" detail="Exercise assumes 50 sold" onSelect={(value) => { setBusinessPrice(value); markComplete("business"); }} />
            </div>
            {businessPrice && (() => {
              const outcome = calculateBusinessOutcome(Number(businessPrice));
              return <div className="game-outcome"><div className="outcome-icon"><Check size={16} /></div><div><span className="outcome-kicker">EXERCISE RESULT · NOT A FORECAST</span><strong>{outcome.unitsSold} sold · {formatINR(outcome.revenue)} revenue · {formatINR(outcome.grossProfit)} gross profit on sold units</strong><p>After paying ₹9,000 for all stock, the simple till balance is {formatINR(outcome.tillCashAfterInventory)}. The remaining bottles still have value; cash and accounting profit answer different questions.</p></div></div>;
            })()}
            <button className="button-quiet replay-button" type="button" onClick={replay}>Replay this exercise <RotateCcw size={14} /></button>
          </div>}

          {active === "investment" && <div className="game-body">
            <div className="scenario-strip"><span className="scenario-initial">SAME MONTHLY CONTRIBUTION</span><strong>{formatINR(monthly)} / month</strong><span className="scenario-detail">Compare a simplified deposit with an illustrative market-linked scenario.</span></div>
            <div className="sim-controls"><label>Monthly amount <span>{formatINR(monthly)}</span><input type="range" min={500} max={10000} step={500} value={monthly} onChange={(event) => setMonthly(Number(event.target.value))} /></label><label>Time horizon <select className="field-input" value={horizon} onChange={(event) => setHorizon(Number(event.target.value))}><option value={12}>1 year</option><option value={24}>2 years</option><option value={60}>5 years</option></select></label></div>
            <div className="investment-comparison"><div className="investment-result"><span>SIMPLIFIED RECURRING DEPOSIT</span><strong>{formatINR(investment.depositIllustration)}</strong><small>Assumes 6% nominal annual interest, compounded monthly; contributions at month-end. Illustrative, not a quoted rate.</small></div><div className="investment-result alt"><span>HYPOTHETICAL SIP SCENARIO</span><strong>{formatINR(investment.sipIllustration)}</strong><small>Assumes 10% nominal annualized growth, compounded monthly; contributions at month-end. Not guaranteed or a forecast.</small></div></div>
            <p className="micro-note"><Sparkles size={14} /> Total contributions: {formatINR(investment.totalContributions)}. A SIP is an investing method; it does not promise a return. Fees, tax, product terms and risk are excluded.</p>
            <button className="button-quiet replay-button" type="button" onClick={() => markComplete("investment")}>Mark idea explored <Check size={14} /></button>
          </div>}

          {active === "tax" && <div className="game-body">
            <div className="tax-disclaimer"><ShieldAlert size={15} /><span>This is a deliberately simplified classroom rule, <strong>not current Indian tax law</strong>.</span></div>
            <div className="game-question">For this exercise only: assume 10% applies to income above ₹3,00,000, with no deductions or other rules. Choose an annual income.</div>
            <div className="choice-stack three-options">
              {[400000, 600000, 800000].map((amount) => <GameChoice key={amount} value={String(amount)} selected={String(taxIncome) === String(amount) ? String(taxIncome) : ""} title={formatINR(amount)} detail="Hypothetical annual income" onSelect={(value) => { setTaxIncome(Number(value)); markComplete("tax"); }} />)}
            </div>
            <div className="tax-result"><span>EXERCISE TAX UNDER THE STATED RULE</span><strong>{formatINR(illustrativeTax)}</strong><small>Calculation: 10% × max(₹0, {formatINR(taxIncome)} − ₹3,00,000). This is not a filing estimate.</small></div>
            <button className="button-quiet replay-button" type="button" onClick={() => markComplete("tax")}>Mark idea explored <Check size={14} /></button>
          </div>}

          {active === "reaction" && <div className="game-body">
            <div className="scenario-strip"><span className="scenario-initial">HYPOTHETICAL ANNOUNCEMENT</span><strong>Choose a possible channel</strong><span className="scenario-detail">A mechanism is a way to reason, not a certain market reaction.</span></div>
            <div className="choice-stack">
              <GameChoice value="rates" selected={reactionChoice} title="A central bank raises its policy rate" detail="Consider borrowing costs, saving returns and expectations." onSelect={(value) => { setReactionChoice(value); markComplete("reaction"); }} />
              <GameChoice value="currency" selected={reactionChoice} title="The rupee weakens against the US dollar" detail="Consider import costs, exporters and inflation—among other forces." onSelect={(value) => { setReactionChoice(value); markComplete("reaction"); }} />
              <GameChoice value="earnings" selected={reactionChoice} title="A company reports earnings above expectations" detail="The market may already have priced in a different result." onSelect={(value) => { setReactionChoice(value); markComplete("reaction"); }} />
            </div>
            {reactionChoice && <div className="game-outcome"><div className="outcome-icon"><Compass size={16} /></div><div><span className="outcome-kicker">POSSIBLE CHANNELS · OUTCOME UNCERTAIN</span><strong>{reactionChoice === "rates" ? "Higher rates can lift borrowing costs and may change the appeal of savings." : reactionChoice === "currency" ? "A weaker rupee can raise some import costs while changing the rupee value of export revenues." : "An earnings surprise can matter, but expectations, guidance and wider conditions also shape a response."}</strong><p>Other conditions, timing and expectations matter. There is no guaranteed direction or return from this example.</p></div></div>}
            <button className="button-quiet replay-button" type="button" onClick={replay}>Reset the scenario <RotateCcw size={14} /></button>
          </div>}
        </section>
      </div>
      <section className="panel concept-primer-section" aria-labelledby="concept-primer-heading">
        <div className="panel-heading-row"><div><div className="eyebrow">FINANCIAL SHORTCUTS</div><h3 id="concept-primer-heading">Words worth knowing</h3></div><span className="tag tag-demo">EDUCATIONAL</span></div>
        <div className="primer-grid">{[
          { term: "Fixed deposit (FD)", copy: "A lump-sum bank deposit for stated terms. Rate, payout, early-withdrawal rules and protections depend on the product and institution." },
          { term: "Recurring deposit (RD)", copy: "A deposit that accepts regular instalments under stated terms. It is not the same as a market-linked mutual-fund investment." },
          { term: "SIP", copy: "A Systematic Investment Plan is a way to contribute regularly to a mutual fund. It does not guarantee returns or remove market risk." },
          { term: "Mutual fund", copy: "A pooled investment that holds a portfolio of assets. Strategy, costs, liquidity and risks differ across funds." },
          { term: "Stocks & bonds", copy: "A share represents equity in a company; a bond is debt from an issuer. Both can carry risk, and prices can change." },
          { term: "Compound growth", copy: "Growth can build on earlier growth when returns stay invested. Real rates, timing, fees and taxes change outcomes." },
          { term: "Inflation", copy: "When prices generally rise, the same rupee may buy less over time. The effect depends on which prices change." },
          { term: "Diversification", copy: "Spreading exposure can reduce concentration risk. It cannot eliminate all losses or make an investment safe." },
          { term: "Emergency savings", copy: "Accessible funds can help meet unexpected costs. A suitable amount and account depend on a person's circumstances." },
        ].map((item) => <article className="primer-card" key={item.term}><h4>{item.term}</h4><p>{item.copy}</p></article>)}</div>
      </section>
      <div className="fine-print"><CircleHelp size={14} /><span>These are educational examples, not personalized financial or tax advice. Market-linked returns are not guaranteed.</span></div>
    </div>
  );
}
