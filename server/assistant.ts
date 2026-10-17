import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { ENV } from "./_core/env";
import { publicProcedure, router } from "./_core/trpc";
import { createDailyAllowance } from "./assistantQuota";

const DAILY_LIMIT = 10;
const MAX_MESSAGES = 12;
const allowance = createDailyAllowance(DAILY_LIMIT);

const messageSchema = z.object({
  role: z.literal("user"),
  content: z.string().trim().min(1).max(2000),
}).strict();

export const assistantRequestSchema = z.object({
  messages: z.array(messageSchema).min(1).max(MAX_MESSAGES),
}).strict();

export const assistantRouter = router({
  status: publicProcedure.query(() => ({
    configured: Boolean(ENV.forgeApiUrl && ENV.forgeApiKey),
    dailyLimit: DAILY_LIMIT,
  })),

  ask: publicProcedure.input(assistantRequestSchema).mutation(async ({ input, ctx }) => {
    const apiUrl = ENV.forgeApiUrl;
    const apiKey = ENV.forgeApiKey;
    if (!apiUrl || !apiKey) {
      throw new TRPCError({
        code: "PRECONDITION_FAILED",
        message: "The AI service is not configured for this environment yet. Other CAPVY learning tools remain available.",
      });
    }

    const identity = ctx.req.ip || ctx.req.socket.remoteAddress || "unknown-preview";
    const reservation = allowance.reserve(identity);
    if (!reservation.allowed) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: `You've reached this demo's ${DAILY_LIMIT}-reply daily limit for this network. It resets at 00:00 UTC.`,
      });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25_000);
    let succeeded = false;

    try {
      const response = await fetch(`${apiUrl.replace(/\/$/, "")}/v1/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "You are CAPVY, an educational financial-literacy assistant for Indian beginners. Use plain English unless the user asks for Hinglish. Explain concepts clearly and distinguish facts, assumptions, hypothetical examples, and uncertainty. You have no live market data, news browsing, or access to user bank/brokerage accounts; never claim otherwise. Do not promise profits, guarantee returns, or provide certain personalized investment, tax, legal, or debt advice. Market-linked returns are not guaranteed. When discussing investing, put goals, time horizon, liquidity, emergency savings, existing debt, diversification, and risk in context where relevant. Respect these boundaries and ask clarifying questions if an educational explanation needs them. Do not calculate or override the Cashflow Collision Detector's numbers; the UI uses a deterministic engine.",
            },
            ...input.messages.slice(-MAX_MESSAGES),
          ],
          temperature: 0.4,
          max_tokens: 650,
        }),
        signal: controller.signal,
      });

      let payload: {
        error?: { message?: string };
        choices?: Array<{ message?: { content?: string | null } }>;
      };
      try {
        payload = await response.json() as typeof payload;
      } catch {
        throw new TRPCError({ code: "BAD_GATEWAY", message: "The AI service returned an unreadable response. Please retry; failed requests do not use a reply." });
      }
      if (!response.ok || payload.error) {
        throw new TRPCError({ code: "BAD_GATEWAY", message: "The AI service is temporarily unavailable. Your question is still here; please retry. Failed requests do not use a reply." });
      }
      const answer = payload.choices?.[0]?.message?.content?.trim();
      if (!answer) {
        throw new TRPCError({ code: "BAD_GATEWAY", message: "No answer came back from the AI service. Your question is still here; please retry. Failed requests do not use a reply." });
      }

      succeeded = true;
      return { answer, remaining: allowance.remaining(identity), dailyLimit: DAILY_LIMIT };
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      if (controller.signal.aborted) {
        throw new TRPCError({ code: "TIMEOUT", message: "The AI response took too long. Your question is still here; please retry. Failed requests do not use a reply." });
      }
      throw new TRPCError({ code: "BAD_GATEWAY", message: "The AI service could not be reached. Your question is still here; please retry. Failed requests do not use a reply." });
    } finally {
      clearTimeout(timeout);
      if (!succeeded) reservation.refund();
    }
  }),
});
