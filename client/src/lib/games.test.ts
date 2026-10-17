import { describe, expect, it } from "vitest";
import { calculateBusinessOutcome, calculateCashflowSurvival, calculateSimplifiedExerciseTax, compareMonthlyInvestments } from "./games";

describe("learning game calculations", () => {
  it("keeps business revenue, gross profit and till cash distinct", () => {
    expect(calculateBusinessOutcome(160)).toMatchObject({
      unitsSold: 80,
      revenue: 12800,
      costOfSoldUnits: 7200,
      grossProfit: 5600,
      tillCashAfterInventory: 3800,
    });
  });

  it("compounds monthly contributions using the stated nominal annual assumptions", () => {
    const result = compareMonthlyInvestments(2000, 24);
    expect(result.totalContributions).toBe(48000);
    expect(result.depositIllustration).toBeGreaterThan(48000);
    expect(result.sipIllustration).toBeGreaterThan(result.depositIllustration);
  });

  it("applies only the explicitly simplified classroom tax rule", () => {
    expect(calculateSimplifiedExerciseTax(600000)).toBe(30000);
    expect(calculateSimplifiedExerciseTax(250000)).toBe(0);
  });

  it("shows how optional spending or a confirmed income date changes the shortfall", () => {
    const result = calculateCashflowSurvival();
    expect(result.base.firstNegativeDay).toBe(12);
    expect(result.base.shortfall).toBe(1500);
    expect(result.pausePurchase.lowestBalance).toBe(0);
    expect(result.earlierIncome.firstNegativeDay).toBeNull();
    expect(result.earlierIncome.lowestBalance).toBe(500);
  });
});
