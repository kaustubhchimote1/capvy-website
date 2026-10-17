import { describe, expect, it } from "vitest";
import {
  calculateCashflow,
  DEFAULT_SCENARIO,
  validateScenario,
  type CashflowScenario,
} from "./cashflow";

describe("calculateCashflow", () => {
  it("includes the starting balance and computes the first shortfall and recovery", () => {
    const result = calculateCashflow(DEFAULT_SCENARIO);
    expect(result.points[0]).toMatchObject({ day: 1, balance: 5000 });
    expect(result.firstNegativeDay).toBe(12);
    expect(result.lowestBalance).toBe(-1000);
    expect(result.shortfall).toBe(1000);
    expect(result.recoveryDay).toBe(18);
    expect(result.recoveryDays).toEqual([18]);
    expect(result.endingBalance).toBe(500);
  });

  it("applies expenses before income on the same date", () => {
    const scenario: CashflowScenario = {
      startingBalance: 500,
      transactions: [
        { id: "salary", label: "Income", day: 5, amount: 500, kind: "income" },
        { id: "bill", label: "Bill", day: 5, amount: 700, kind: "expense" },
      ],
    };
    const result = calculateCashflow(scenario);
    expect(result.points.slice(1).map((point) => point.eventId)).toEqual(["bill", "salary"]);
    expect(result.points.slice(1).map((point) => point.balance)).toEqual([-200, 300]);
    expect(result.points.slice(1).map((point) => point.kind)).toEqual(["expense", "income"]);
    expect(result.firstNegativeDay).toBe(5);
    expect(result.lowestBalance).toBe(-200);
    expect(result.recoveryDay).toBe(5);
    expect(result.recoveryDays).toEqual([5]);
    expect(result.endingBalance).toBe(300);
  });

  it("lists each date on which a projected deficit recovers", () => {
    const result = calculateCashflow({
      startingBalance: 0,
      transactions: [
        { id: "bill-a", label: "First bill", day: 3, amount: 200, kind: "expense" },
        { id: "income-a", label: "First income", day: 7, amount: 300, kind: "income" },
        { id: "bill-b", label: "Second bill", day: 11, amount: 250, kind: "expense" },
        { id: "income-b", label: "Second income", day: 20, amount: 150, kind: "income" },
      ],
    });
    expect(result.firstNegativeDay).toBe(3);
    expect(result.recoveryDays).toEqual([7, 20]);
  });

  it("does not report a shortfall for a non-negative timeline", () => {
    const result = calculateCashflow({
      startingBalance: 1000,
      transactions: [{ id: "income", label: "Income", day: 10, amount: 250, kind: "income" }],
    });
    expect(result.firstNegativeDay).toBeNull();
    expect(result.shortfall).toBe(0);
    expect(result.recoveryDay).toBeNull();
  });

  it("rejects invalid balances, dates, and amounts", () => {
    expect(validateScenario({
      startingBalance: -1,
      transactions: [
        { id: "x", label: "", day: 32, amount: 0, kind: "expense" },
      ],
    })).toHaveLength(4);
  });
});
