import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { assistantRouter } from "./assistant";
import { TRPCError } from "@trpc/server";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  community: router({
    registeredAccounts: publicProcedure.query(async () => {
      try {
        const count = await db.getRegisteredAccountCount();
        return { count, checkedAt: new Date().toISOString() };
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Registered account count is temporarily unavailable.",
        });
      }
    }),
  }),
  assistant: assistantRouter,
});

export type AppRouter = typeof appRouter;
