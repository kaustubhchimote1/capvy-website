import { calculateCashflow, type CashflowResult, type CashflowScenario } from "./cashflow";

export type BusinessOutcome = {
  unitsSold: number;
  price: number;
  revenue: number;
  costOfSoldUnits: number;
  grossProfit: number;
  tillCashAfterInventory: number;
};

const assumedDemand: Record<number, number> = { 120: 100, 160: 80, 200: 50 };
const unitCost = 90;
const batchSize = 100;

export function calculateBusinessOutcome(price: number): BusinessOutcome {
  const unitsSold = assumedDemand[price];
  if (!unitsSold) throw new RangeError("Choose one of the stated exercise prices.");
  const revenue = price * unitsSold;
  const costOfSoldUnits = unitCost * unitsSold;
  return {
    unitsSold,
    price,
    revenue,
    costOfSoldUnits,
    grossProfit: revenue - costOfSoldUnits,
    tillCashAfterInventory: revenue - unitCost * batchSize,
  };
}

export type InvestmentComparison = {
  totalContributions: number;
  depositIllustration: number;
  sipIllustration: number;
};

function endOfMonthFutureValue(contribution: number, months: number, nominalAnnualRate: number) {
  const monthlyRate = nominalAnnualRate / 12;
  return contribution * (((1 + monthlyRate) ** months - 1) / monthlyRate);
}

/** Monthly end-of-period contributions, with nominal annual rate converted to monthly compounding. */
export function compareMonthlyInvestments(monthlyContribution: number, months: number): InvestmentComparison {
  if (!Number.isFinite(monthlyContribution) || monthlyContribution <= 0) throw new RangeError("Monthly contribution must be positive.");
  if (!Number.isInteger(months) || months < 1 || months > 120) throw new RangeError("Time horizon must be from 1 to 120 months.");
  return {
    totalContributions: monthlyContribution * months,
    depositIllustration: Math.round(endOfMonthFutureValue(monthlyContribution, months, 0.06)),
    sipIllustration: Math.round(endOfMonthFutureValue(monthlyContribution, months, 0.10)),
  };
}

/** A made-up classroom rule, never current Indian tax law. */
export function calculateSimplifiedExerciseTax(annualIncome: number) {
  if (!Number.isFinite(annualIncome) || annualIncome < 0) throw new RangeError("Annual income must be zero or more.");
  return Math.round(Math.max(0, annualIncome - 300_000) * 0.1);
}

export const CASHFLOW_SURVIVAL_SCENARIO: CashflowScenario = {
  startingBalance: 6000,
  transactions: [
    { id: "rent", label: "Rent", day: 5, amount: 4000, kind: "expense" },
    { id: "purchase", label: "Optional purchase", day: 10, amount: 1500, kind: "expense" },
    { id: "repair", label: "Repair bill", day: 12, amount: 2000, kind: "expense" },
    { id: "income", label: "Expected income", day: 18, amount: 5000, kind: "income" },
  ],
};

export function calculateCashflowSurvival() {
  const base = calculateCashflow(CASHFLOW_SURVIVAL_SCENARIO);
  const pausePurchase = calculateCashflow({
    ...CASHFLOW_SURVIVAL_SCENARIO,
    transactions: CASHFLOW_SURVIVAL_SCENARIO.transactions.filter((transaction) => transaction.id !== "purchase"),
  });
  const earlierIncome = calculateCashflow({
    ...CASHFLOW_SURVIVAL_SCENARIO,
    transactions: CASHFLOW_SURVIVAL_SCENARIO.transactions.map((transaction) => transaction.id === "income" ? { ...transaction, day: 10 } : transaction),
  });
  return { base, pausePurchase, earlierIncome } satisfies Record<string, CashflowResult>;
}
