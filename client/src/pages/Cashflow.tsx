import { useMemo, useState } from "react";
import { Activity, AlertTriangle, ArrowDown, ArrowRight, ArrowUpRight, Check, Clock3, Plus, RotateCcw, Save, ShieldCheck, Trash2, WalletCards } from "lucide-react";
import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { calculateCashflow, DEFAULT_SCENARIO, validateScenario, type CashflowScenario, type CashflowTransaction, type TransactionKind } from "@/lib/cashflow";
import { formatINR } from "@/lib/format";

type ScenarioWithName = { name: string; scenario: CashflowScenario };

function getSavedScenario(): ScenarioWithName | null {
  try {
    const raw = window.localStorage.getItem("capvy.cashflow.saved");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ScenarioWithName;
    if (!parsed.scenario || validateScenario(parsed.scenario).length) return null;
    return parsed;
  } catch {
    return null;
  }
}

function SummaryMetric({ label, value, tone }: { label: string; value: string; tone?: "negative" | "positive" }) {
  return <div className="metric-card"><span>{label}</span><strong className={tone === "negative" ? "negative-text" : tone === "positive" ? "positive-text" : ""}>{value}</strong></div>;
}

function EventRow({
  transaction,
  onUpdate,
  onRemove,
}: {
  transaction: CashflowTransaction;
  onUpdate: (patch: Partial<CashflowTransaction>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="transaction-row">
      <span className={`transaction-kind-mark ${transaction.kind}`} aria-hidden="true" />
      <label className="sr-only">Transaction name</label>
      <input className="field-input event-name-input" value={transaction.label} maxLength={48} onChange={(event) => onUpdate({ label: event.target.value })} aria-label={`${transaction.kind} transaction name`} />
      <label className="transaction-day-input"><span>DAY</span><input type="number" min={1} max={31} step={1} value={transaction.day} onChange={(event) => onUpdate({ day: Number(event.target.value) })} aria-label={`${transaction.label} day of month`} /></label>
      <label className="transaction-amount-input"><span>₹</span><input type="number" min={1} step={100} value={transaction.amount} onChange={(event) => onUpdate({ amount: Number(event.target.value) })} aria-label={`${transaction.label} amount in rupees`} /></label>
      <span className={`transaction-amount-label ${transaction.kind}`}>{transaction.kind === "income" ? "+" : "−"}{formatINR(transaction.amount || 0)}</span>
      <button className="icon-button remove-transaction" type="button" onClick={onRemove} aria-label={`Remove ${transaction.label}`}><Trash2 size={15} /></button>
    </div>
  );
}

export default function Cashflow() {
  const [scenario, setScenario] = useState<CashflowScenario>(() => ({ startingBalance: DEFAULT_SCENARIO.startingBalance, transactions: DEFAULT_SCENARIO.transactions.map((transaction) => ({ ...transaction })) }));
  const [alternative, setAlternative] = useState<ScenarioWithName | null>(null);
  const [savedLabel, setSavedLabel] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTransaction, setNewTransaction] = useState({ label: "Unexpected expense", kind: "expense" as TransactionKind, day: 16, amount: 1500 });
  const result = useMemo(() => calculateCashflow(scenario), [scenario]);
  const altResult = useMemo(() => alternative ? calculateCashflow(alternative.scenario) : null, [alternative]);
  const validationErrors = useMemo(() => validateScenario(scenario), [scenario]);

  const updateTransaction = (id: string, patch: Partial<CashflowTransaction>) => {
    setScenario((current) => ({ ...current, transactions: current.transactions.map((transaction) => transaction.id === id ? { ...transaction, ...patch } : transaction) }));
    setAlternative(null);
    setSaveMessage("");
  };

  const removeTransaction = (id: string) => {
    setScenario((current) => ({ ...current, transactions: current.transactions.filter((transaction) => transaction.id !== id) }));
    setAlternative(null);
    setSaveMessage("");
  };

  const resetScenario = () => {
    setScenario({ startingBalance: DEFAULT_SCENARIO.startingBalance, transactions: DEFAULT_SCENARIO.transactions.map((transaction) => ({ ...transaction })) });
    setAlternative(null);
    setSavedLabel("");
    setSaveMessage("Sample scenario restored.");
  };

  const saveScenario = () => {
    if (validationErrors.length) {
      setSaveMessage("Fix the highlighted values before saving.");
      return;
    }
    const name = savedLabel.trim() || "My cashflow scenario";
    try {
      window.localStorage.setItem("capvy.cashflow.saved", JSON.stringify({ name, scenario } satisfies ScenarioWithName));
      setSaveMessage(`“${name}” saved on this device only.`);
    } catch {
      setSaveMessage("This browser could not save the scenario. Your current calculations still work.");
    }
  };

  const addTransaction = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const entry: CashflowTransaction = { ...newTransaction, id: `event-${Date.now()}` };
    const next = { ...scenario, transactions: [...scenario.transactions, entry] };
    const errors = validateScenario(next);
    if (errors.length) {
      setSaveMessage(errors[0]);
      return;
    }
    setScenario(next);
    setAlternative(null);
    setShowAddForm(false);
    setSaveMessage("Event added. The timeline has been recalculated.");
  };

  const makeAlternative = (name: string, edit: (copy: CashflowScenario) => CashflowScenario) => {
    const copy: CashflowScenario = { startingBalance: scenario.startingBalance, transactions: scenario.transactions.map((transaction) => ({ ...transaction })) };
    setAlternative({ name, scenario: edit(copy) });
  };

  const applyAlternative = () => {
    if (!alternative) return;
    setScenario({ startingBalance: alternative.scenario.startingBalance, transactions: alternative.scenario.transactions.map((transaction) => ({ ...transaction })) });
    setAlternative(null);
    setSaveMessage("Alternative is now the current scenario.");
  };

  const chartRows = useMemo(() => {
    const closingBalance = (points: typeof result.points, day: number) => {
      let balance = points[0]?.balance ?? 0;
      for (const point of points) {
        if (point.day > day) break;
        balance = point.balance;
      }
      return balance;
    };
    return Array.from({ length: 31 }, (_, index) => {
      const day = index + 1;
      return {
        day,
        current: closingBalance(result.points, day),
        alternative: altResult ? closingBalance(altResult.points, day) : undefined,
      };
    });
  }, [result, altResult]);

  const saved = getSavedScenario();

  return (
    <div className="page-stack">
      <section className="page-intro-row">
        <div><div className="eyebrow"><span className="eyebrow-line" />SIGNATURE SIMULATION · HYPOTHETICAL</div><h2 className="page-title">See the squeeze<br className="desktop-break" /> before it happens.</h2><p className="page-lead">A month can balance on paper and still go short before payday. Move dates, test a decision, and see exactly where the pressure lands.</p></div>
        <div className="page-intro-aside"><span className="intro-aside-icon"><Activity size={17} /></span><span>DETERMINISTIC ENGINE</span><p>Every number below is calculated from the events you see. AI does not set or change the result.</p></div>
      </section>

      <div className="cashflow-layout">
        <div className="cashflow-main-column">
          <section className="panel scenario-panel">
            <div className="panel-heading-row"><div><div className="eyebrow">YOUR SCENARIO</div><h3>Build a month in motion</h3></div><button className="button-quiet" type="button" onClick={resetScenario}><RotateCcw size={14} /> Reset sample</button></div>
            <div className="starting-balance-row"><div><label htmlFor="starting-balance">Starting balance</label><p>Available before the first event</p></div><div className="amount-field"><span>₹</span><input id="starting-balance" type="number" min={0} step={500} value={scenario.startingBalance} onChange={(event) => { setScenario((current) => ({ ...current, startingBalance: Number(event.target.value) })); setAlternative(null); }} /></div></div>
            <div className="transaction-table-head"><span>TRANSACTION</span><span>TIMING</span><span>AMOUNT</span><span className="sr-only">Actions</span></div>
            <div className="transaction-list">
              {scenario.transactions.map((transaction) => <EventRow key={transaction.id} transaction={transaction} onUpdate={(patch) => updateTransaction(transaction.id, patch)} onRemove={() => removeTransaction(transaction.id)} />)}
              {scenario.transactions.length === 0 && <p className="empty-inline">No events yet. Add income or an expense to begin.</p>}
            </div>
            <button type="button" className="add-event-button" onClick={() => setShowAddForm((value) => !value)}><Plus size={15} /> Add an income or expense</button>
            {showAddForm && <form className="add-event-form" onSubmit={addTransaction}>
              <label>Event name<input required maxLength={48} className="field-input" value={newTransaction.label} onChange={(event) => setNewTransaction((current) => ({ ...current, label: event.target.value }))} /></label>
              <label>Type<select className="field-input" value={newTransaction.kind} onChange={(event) => setNewTransaction((current) => ({ ...current, kind: event.target.value as TransactionKind }))}><option value="expense">Expense</option><option value="income">Income</option></select></label>
              <label>Day<input required type="number" min={1} max={31} className="field-input" value={newTransaction.day} onChange={(event) => setNewTransaction((current) => ({ ...current, day: Number(event.target.value) }))} /></label>
              <label>Amount (₹)<input required type="number" min={1} step={100} className="field-input" value={newTransaction.amount} onChange={(event) => setNewTransaction((current) => ({ ...current, amount: Number(event.target.value) }))} /></label>
              <button className="button-primary add-event-submit" type="submit"><Plus size={15} /> Add event</button>
            </form>}
            {validationErrors.length > 0 && <div className="validation-message" role="alert"><AlertTriangle size={15} />{validationErrors[0]}</div>}
          </section>

          <section className="panel timeline-panel">
            <div className="panel-heading-row"><div><div className="eyebrow">BALANCE TIMELINE</div><h3>When money moves</h3></div><span className="tag tag-demo">Hypothetical · INR</span></div>
            <div className="timeline-legend"><span><i className="legend-line current" />Current scenario</span>{alternative && <span><i className="legend-line alternate" />{alternative.name}</span>}<span className="muted-copy">Daily closing balance · INR</span></div>
            <div className="chart-frame cashflow-chart"><ResponsiveContainer width="100%" height="100%"><LineChart data={chartRows} margin={{ top: 12, right: 18, bottom: 4, left: 6 }}>
              <CartesianGrid stroke="rgba(160,180,168,.10)" vertical={false} />
              <XAxis dataKey="day" type="number" domain={[1, 31]} ticks={[1, 5, 10, 15, 20, 25, 31]} tickFormatter={(day: number) => String(day)} tick={{ fill: "#829089", fontSize: 10 }} axisLine={{ stroke: "#29332e" }} tickLine={false} />
              <YAxis tickFormatter={(value: number) => value === 0 ? "₹0" : `${value < 0 ? "−" : ""}₹${Math.abs(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`} tick={{ fill: "#829089", fontSize: 11 }} axisLine={false} tickLine={false} width={48} />
              <Tooltip contentStyle={{ background: "#151c19", border: "1px solid #303b35", borderRadius: 9, color: "#eef5f0" }} formatter={(value, name) => [formatINR(Number(value ?? 0)), String(name) === "alternative" ? alternative?.name ?? "Alternative" : "Balance"]} labelFormatter={(day) => `Day ${day}`} labelStyle={{ color: "#98a69e", marginBottom: 5 }} />
              <ReferenceLine y={0} stroke="#db7772" strokeDasharray="4 5" />
              <Line type="linear" dataKey="current" name="Balance" stroke="#16c784" strokeWidth={2.5} dot={{ r: 3, fill: "#16c784", stroke: "#0e1411", strokeWidth: 2 }} activeDot={{ r: 5 }} connectNulls />
              {alternative && <Line type="linear" dataKey="alternative" name="Alternative" stroke="#80d8bd" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3, fill: "#80d8bd", stroke: "#0e1411", strokeWidth: 2 }} connectNulls />}
            </LineChart></ResponsiveContainer></div>
            <div className="timeline-caption"><span><span className="caption-mark" />Below ₹0 marks a projected shortfall.</span><span>Expenses precede income on a shared date.</span></div>
          </section>
          <section className="panel event-balance-panel" aria-labelledby="event-balance-heading">
            <div className="panel-heading-row"><div><div className="eyebrow">EVENT-BY-EVENT LEDGER</div><h3 id="event-balance-heading">Running balance after each move</h3></div><span className="small-count">{result.points.length - 1} EVENTS</span></div>
            <p className="event-balance-intro">Starting balance: <strong>{formatINR(scenario.startingBalance)}</strong> before the first event. Same-day expenses appear before income.</p>
            <div className="event-balance-table-wrap">
              <table className="event-balance-table">
                <thead><tr><th scope="col">Day</th><th scope="col">Event</th><th scope="col">Change</th><th scope="col">Balance after event</th></tr></thead>
                <tbody>
                  {result.points.slice(1).map((point, index) => <tr key={point.eventId ?? index}>
                    <th scope="row">Day {point.day}</th>
                    <td>{point.label}</td>
                    <td className={point.kind === "income" ? "positive-text" : "negative-text"}>{point.kind === "income" ? "+" : "−"}{formatINR(point.amount ?? 0)}</td>
                    <td className={point.balance < 0 ? "negative-text" : "balance-after-event"}>{formatINR(point.balance)}</td>
                  </tr>)}
                  {result.points.length === 1 && <tr><td colSpan={4} className="empty-inline">No events yet. The starting balance is unchanged.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <aside className="cashflow-side-column">
          <section className={`result-card ${result.firstNegativeDay !== null ? "has-shortfall" : "is-clear"}`}>
            <div className="result-card-kicker"><span>{result.firstNegativeDay !== null ? <AlertTriangle size={15} /> : <Check size={15} />}</span><span>{result.firstNegativeDay !== null ? "TIMING COLLISION FOUND" : "NO TIMING COLLISION"}</span></div>
            <div className="result-primary-label">{result.firstNegativeDay !== null ? "First balance below zero" : "Lowest balance in scenario"}</div>
            <strong className="result-primary-value">{result.firstNegativeDay !== null ? `Day ${result.firstNegativeDay}` : formatINR(result.lowestBalance)}</strong>
            <p className="result-explainer">{result.firstNegativeDay !== null ? `${formatINR(result.shortfall)} projected shortfall at the lowest point.` : "Your balance stays at or above zero throughout this hypothetical month."}</p>
            <div className="result-metrics">
              <SummaryMetric label="Lowest balance" value={formatINR(result.lowestBalance)} tone={result.lowestBalance < 0 ? "negative" : undefined} />
              <SummaryMetric label="Month-end balance" value={formatINR(result.endingBalance)} tone={result.endingBalance >= 0 ? "positive" : "negative"} />
            </div>
            <p className="recovery-dates"><Clock3 size={13} />{result.recoveryDays.length ? `Balance recovers on ${result.recoveryDays.map((day) => `Day ${day}`).join(", ")}.` : result.firstNegativeDay !== null ? "No recovery before month-end." : "No recovery event needed."}</p>
          </section>

          <section className="panel affected-panel"><div className="panel-topline"><span className="panel-label">WHAT'S AFFECTED</span><span className="small-count">{result.affectedExpenses.length}</span></div>
            {result.firstNegativeDay !== null ? <><p className="side-copy">These expense events occur while the running balance is below zero:</p><ul className="affected-list">{result.affectedExpenses.map((label) => <li key={label}><ArrowDown size={13} /><span>{label}</span></li>)}</ul></> : <p className="side-copy">No expenses are entered into a negative-balance period.</p>}
          </section>

          <section className="panel strategy-panel"><div className="panel-topline"><span className="panel-label">TEST A DIFFERENT MOVE</span><span className="strategy-spark"><ArrowUpRight size={14} /></span></div><p className="side-copy">Compare hypothetical changes. Moving money dates only works if that timing is actually flexible.</p>
            <button type="button" className="strategy-button" onClick={() => makeAlternative("Income on Day 10", (copy) => ({ ...copy, transactions: copy.transactions.map((transaction) => transaction.id === "income" ? { ...transaction, day: 10 } : transaction) }))}><span><strong>Income arrives on Day 10</strong><small>If the payment date is adjustable</small></span><ArrowRight size={15} /></button>
            <button type="button" className="strategy-button" onClick={() => makeAlternative("Commitment on Day 20", (copy) => ({ ...copy, transactions: copy.transactions.map((transaction) => transaction.id === "commitment" ? { ...transaction, day: 20 } : transaction) }))}><span><strong>Commitment moves to Day 20</strong><small>Only if the payee agrees</small></span><ArrowRight size={15} /></button>
            {alternative && altResult && <div className="comparison-box"><div className="comparison-title"><span>COMPARISON</span><span className="tag tag-alt">{alternative.name}</span></div><div className="comparison-row"><span>Current lowest</span><strong className={result.lowestBalance < 0 ? "negative-text" : ""}>{formatINR(result.lowestBalance)}</strong></div><div className="comparison-row"><span>Alternative lowest</span><strong className={altResult.lowestBalance < 0 ? "negative-text" : "positive-text"}>{formatINR(altResult.lowestBalance)}</strong></div><div className="comparison-row"><span>First shortfall</span><strong>{altResult.firstNegativeDay ? `Day ${altResult.firstNegativeDay}` : "None"}</strong></div><button type="button" className="button-primary strategy-apply" onClick={applyAlternative}>Use this scenario <ArrowRight size={14} /></button></div>}
          </section>

          <section className="panel save-panel"><div className="panel-topline"><span className="panel-label"><Save size={13} /> SAVE FOR LATER</span>{saved && <span className="tag tag-local">ON THIS DEVICE</span>}</div>
            {saved && <button className="saved-scenario-load" type="button" onClick={() => { setScenario({ startingBalance: saved.scenario.startingBalance, transactions: saved.scenario.transactions.map((transaction) => ({ ...transaction })) }); setAlternative(null); setSaveMessage(`Loaded “${saved.name}” from this device.`); }}><span><strong>{saved.name}</strong><small>Saved in this browser only</small></span><ArrowRight size={15} /></button>}
            <div className="save-controls"><input className="field-input" aria-label="Saved scenario name" placeholder="Name this scenario" maxLength={48} value={savedLabel} onChange={(event) => setSavedLabel(event.target.value)} /><button type="button" className="icon-button save-icon-button" onClick={saveScenario} disabled={validationErrors.length > 0} aria-label="Save current scenario in this browser"><Save size={16} /></button></div>
            {saveMessage && <p className="save-message" role="status">{saveMessage}</p>}
            <p className="privacy-note"><ShieldCheck size={13} /> Saved locally only. Never sent to CAPVY.</p>
          </section>

          <div className="caution-note"><Clock3 size={14} /><span>This is a timing exercise, not financial advice. Don't miss or delay a payment based solely on a simulation.</span></div>
        </aside>
      </div>
    </div>
  );
}
