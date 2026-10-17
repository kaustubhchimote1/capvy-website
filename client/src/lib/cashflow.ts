export type TransactionKind = "income" | "expense";

export type CashflowTransaction = {
  id: string;
  label: string;
  day: number;
  amount: number;
  kind: TransactionKind;
};

export type CashflowScenario = {
  startingBalance: number;
  transactions: CashflowTransaction[];
};

export type BalancePoint = {
  day: number;
  label: string;
  balance: number;
  eventId?: string;
  kind?: TransactionKind;
  amount?: number;
};

export type CashflowResult = {
  points: BalancePoint[];
  lowestBalance: number;
  firstNegativeDay: number | null;
  shortfall: number;
  recoveryDay: number | null;
  recoveryDays: number[];
  affectedExpenses: string[];
  endingBalance: number;
};

/**
 * Calculate a hypothetical scenario without AI or external services.
 * Same-day ordering is deliberate: expenses are applied before income, and
 * transactions of the same kind retain their original input order.
 */
export function calculateCashflow(scenario: CashflowScenario): CashflowResult {
  const ordered = scenario.transactions
    .map((transaction, index) => ({ transaction, index }))
    .sort((a, b) =>
      a.transaction.day - b.transaction.day ||
      (a.transaction.kind === b.transaction.kind
        ? a.index - b.index
        : a.transaction.kind === "expense"
          ? -1
          : 1),
    );

  let balance = scenario.startingBalance;
  let lowestBalance = balance;
  let firstNegativeDay: number | null = balance < 0 ? 1 : null;
  let recoveryDay: number | null = null;
  const recoveryDays: number[] = [];
  let wasNegative = balance < 0;
  const affectedExpenses: string[] = [];
  const points: BalancePoint[] = [
    { day: 1, label: "Start", balance },
  ];

  for (const { transaction } of ordered) {
    balance += transaction.kind === "income" ? transaction.amount : -transaction.amount;
    lowestBalance = Math.min(lowestBalance, balance);

    if (balance < 0 && firstNegativeDay === null) {
      firstNegativeDay = transaction.day;
    }
    if (balance < 0 && transaction.kind === "expense") {
      affectedExpenses.push(transaction.label);
    }
    if (wasNegative && balance >= 0) {
      if (recoveryDay === null) recoveryDay = transaction.day;
      if (recoveryDays.at(-1) !== transaction.day) recoveryDays.push(transaction.day);
    }
    wasNegative = balance < 0;

    points.push({
      day: transaction.day,
      label: transaction.label,
      balance,
      eventId: transaction.id,
      kind: transaction.kind,
      amount: transaction.amount,
    });
  }

  return {
    points,
    lowestBalance,
    firstNegativeDay,
    shortfall: Math.max(0, -lowestBalance),
    recoveryDay,
    recoveryDays,
    affectedExpenses: [...new Set(affectedExpenses)],
    endingBalance: balance,
  };
}

export function validateScenario(scenario: CashflowScenario): string[] {
  const errors: string[] = [];
  if (!Number.isFinite(scenario.startingBalance) || scenario.startingBalance < 0) {
    errors.push("Starting balance must be zero or more.");
  }
  scenario.transactions.forEach((transaction, index) => {
    if (!transaction.label.trim()) errors.push(`Transaction ${index + 1} needs a label.`);
    if (!Number.isInteger(transaction.day) || transaction.day < 1 || transaction.day > 31) {
      errors.push(`${transaction.label || `Transaction ${index + 1}`} must use a day from 1 to 31.`);
    }
    if (!Number.isFinite(transaction.amount) || transaction.amount <= 0) {
      errors.push(`${transaction.label || `Transaction ${index + 1}`} must be greater than ₹0.`);
    }
  });
  return errors;
}

export const DEFAULT_SCENARIO: CashflowScenario = {
  startingBalance: 5000,
  transactions: [
    { id: "fee", label: "College fees", day: 5, amount: 4000, kind: "expense" },
    { id: "commitment", label: "Family commitment", day: 12, amount: 2000, kind: "expense" },
    { id: "income", label: "Expected income", day: 18, amount: 5000, kind: "income" },
    { id: "travel", label: "Travel expense", day: 25, amount: 3500, kind: "expense" },
  ],
};
