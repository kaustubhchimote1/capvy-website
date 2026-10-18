import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

vi.mock("./db", () => ({ getRegisteredAccountCount: vi.fn() }));

import * as db from "./db";
import { appRouter } from "./routers";

const mockedCount = vi.mocked(db.getRegisteredAccountCount);

function createCaller() {
  const ctx: TrpcContext = {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
  return appRouter.createCaller(ctx);
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("community.registeredAccounts", () => {
  it("returns only the real aggregate count and backend check time", async () => {
    mockedCount.mockResolvedValue(1);

    const result = await createCaller().community.registeredAccounts();

    expect(result.count).toBe(1);
    expect(new Date(result.checkedAt).toISOString()).toBe(result.checkedAt);
    expect(Object.keys(result).sort()).toEqual(["checkedAt", "count"]);
    expect(mockedCount).toHaveBeenCalledOnce();
  });

  it("does not misrepresent an unavailable database as zero or expose its error", async () => {
    mockedCount.mockRejectedValue(new Error("private database connection details"));

    await expect(createCaller().community.registeredAccounts()).rejects.toMatchObject({
      code: "INTERNAL_SERVER_ERROR",
      message: "Registered account count is temporarily unavailable.",
    });
  });
});
