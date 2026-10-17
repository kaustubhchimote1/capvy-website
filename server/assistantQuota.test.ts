import { describe, expect, it } from "vitest";
import { createDailyAllowance } from "./assistantQuota";

describe("daily assistant allowance reservations", () => {
  it("refunds a failed request and makes that reply slot available again", () => {
    const allowance = createDailyAllowance(2);
    const day = new Date("2026-10-17T08:00:00.000Z");
    const failed = allowance.reserve("network-a", day);
    expect(failed).toMatchObject({ allowed: true, remaining: 1 });
    failed.refund();
    failed.refund();

    expect(allowance.remaining("network-a", day)).toBe(2);
    expect(allowance.reserve("network-a", day)).toMatchObject({ allowed: true, remaining: 1 });
  });

  it("enforces a separate allowance per network and resets at UTC midnight", () => {
    const allowance = createDailyAllowance(1);
    const beforeMidnight = new Date("2026-10-17T23:59:59.000Z");
    const afterMidnight = new Date("2026-10-18T00:00:00.000Z");

    expect(allowance.reserve("network-a", beforeMidnight).allowed).toBe(true);
    expect(allowance.reserve("network-a", beforeMidnight).allowed).toBe(false);
    expect(allowance.reserve("network-b", beforeMidnight).allowed).toBe(true);
    expect(allowance.reserve("network-a", afterMidnight).allowed).toBe(true);
  });

  it("does not let a late refund from yesterday change today's quota", () => {
    const allowance = createDailyAllowance(1);
    const yesterday = new Date("2026-10-17T23:59:59.000Z");
    const today = new Date("2026-10-18T00:00:00.000Z");
    const pendingYesterday = allowance.reserve("network-a", yesterday);
    expect(allowance.reserve("network-a", today).allowed).toBe(true);
    pendingYesterday.refund();
    expect(allowance.remaining("network-a", today)).toBe(0);
  });
});
