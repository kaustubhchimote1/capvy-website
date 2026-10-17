export type DailyReservation = {
  allowed: boolean;
  remaining: number;
  refund: () => void;
};

export function createDailyAllowance(limit: number) {
  if (!Number.isInteger(limit) || limit < 1) throw new Error("Daily allowance must be a positive integer.");

  const buckets = new Map<string, { day: string; count: number }>();
  let lastPrunedDay = "";
  const getDay = (now: Date) => now.toISOString().slice(0, 10);
  const keyFor = (identity: string, day: string) => `${day}:${identity}`;

  const pruneOldDays = (day: string) => {
    if (lastPrunedDay === day) return;
    for (const [key, value] of buckets) {
      if (value.day !== day) buckets.delete(key);
    }
    lastPrunedDay = day;
  };

  return {
    reserve(identity: string, now = new Date()): DailyReservation {
      const day = getDay(now);
      pruneOldDays(day);
      const key = keyFor(identity, day);
      const existing = buckets.get(key);
      if (existing && existing.count >= limit) {
        return { allowed: false, remaining: 0, refund: () => undefined };
      }

      const nextCount = (existing?.count ?? 0) + 1;
      buckets.set(key, { day, count: nextCount });
      let refunded = false;

      return {
        allowed: true,
        remaining: Math.max(0, limit - nextCount),
        refund: () => {
          if (refunded) return;
          refunded = true;
          const current = buckets.get(key);
          if (!current || current.day !== day) return;
          if (current.count <= 1) buckets.delete(key);
          else buckets.set(key, { day, count: current.count - 1 });
        },
      };
    },

    remaining(identity: string, now = new Date()): number {
      const day = getDay(now);
      const count = buckets.get(keyFor(identity, day))?.count ?? 0;
      return Math.max(0, limit - count);
    },
  };
}
