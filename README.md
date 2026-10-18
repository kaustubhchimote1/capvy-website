# CAPVY — Learn Fast. Think Financially.

CAPVY is a financial-learning and simulation website for India's next generation. The current project is a responsive, interactive prototype with a deterministic Cashflow Collision Detector, five educational practice labs, an AI learning assistant, an economic-news status page and a Premium Coming Soon page. Its refreshed visual system is a scroll-led indigo/violet editorial experience; financial activity is practice-only and no real trades are made.

## Architecture

- **Frontend:** React, Vite, Wouter, Tailwind CSS, Lucide and Recharts in `client/`.
- **Deterministic cashflow engine:** `client/src/lib/cashflow.ts`; calculations are independent of AI and external data. Same-day expenses are applied before income; within the same transaction type, original input order is retained. The UI includes an event-by-event balance ledger so an intraday deficit is visible even if that same-day balance later recovers. Distinct recovery dates are recorded.
- **Learning games:** `client/src/lib/games.ts` contains tested, deterministic calculations for the classroom cashflow scenario, business scenario, monthly contributions and simplified educational-tax exercise.
- **Assistant backend:** Express/tRPC in `server/assistant.ts` uses the configured Manus OpenAI-compatible platform endpoint with server-side credentials. The browser never receives the service key. A generic assistant request successfully returned through the preview API during implementation.
- **Assistant status:** `assistant.status` reports only whether the model endpoint and key are configured (never the key itself). The dashboard and assistant show setup-required or unavailable status rather than claiming service readiness when that is not established.
- **Assistant quota/security:** `server/assistantQuota.ts` reserves up to 10 replies per network/UTC day in each running process. Only successful model replies consume a slot; failed requests refund their reservation. Requests accept user-authored turns only; client-supplied assistant turns are rejected to prevent spoofed model history. This remains an in-memory preview guardrail, not account-based or shared across production instances.
- **Account access and Overview count:** `/signup` and `/login` reuse the existing Manus OAuth provider and server-validated `webdev_app_session`; CAPVY never collects a separate password. The Overview calls tRPC `community.registeredAccounts`, which queries the existing `users` table and returns only an aggregate count and server `checkedAt` timestamp. The interface refreshes on entry, manually, on window focus and once per minute while active; it displays no personal account fields.
- **Development log privacy:** The local Vite debug collector recursively redacts authorization, cookie, API-key, token, secret and password fields, plus bearer credentials embedded in strings, before writing development logs. Avoid exporting raw `.manus-logs` files.
- **Persistence:** The project's managed database capability is provisioned, but this prototype does not add CAPVY application tables or migrations. Cashflow scenarios and watchlists are saved locally only after an explicit browser save action; they are not synchronized to the server.
- **Route list:** `client/public/manus-routes.json`, served at `/manus-routes.json`.

## Redesigned interface and motion

The site uses a sticky responsive horizontal masthead instead of the previous left sidebar. Home is a vertical editorial story with a prominently labelled fictional cashflow example, learning links and honest market-source status. Major route sections reveal as they enter view, and a slim progress line tracks scrolling. The observer checks keyboard focus so a focused section is revealed; if motion is reduced or the observer is unavailable, content remains visible without reveal transitions. Decorative hero artwork is labelled as a learning path, not market data. The core forms, games and route behavior are preserved.

## Local development and verified checks

The project uses the pinned `pnpm@10.18.0` toolchain.

```bash
pnpm dev
pnpm check
pnpm test
pnpm build
pnpm start
```

The development server honors the configured `PORT` (3000 by default). Cashflow test cases are in `client/src/lib/cashflow.test.ts`; game-calculation cases are in `client/src/lib/games.test.ts`; assistant request and quota cases are in `server/assistant.test.ts` and `server/assistantQuota.test.ts`; market-status and log-redaction cases are in `server/marketDataDiagnostics.test.ts` and `server/logRedaction.test.ts`; aggregate-user and OAuth callback cases are in `server/community.test.ts` and `server/oauth.callback.test.ts`. The latest verified check passed TypeScript, all 30 registered tests, and the production build. The registered-account tRPC query was also verified against the actual database and returns only `count` and `checkedAt`. `GET /api/market-data/diagnostics` returns truthful setup status, not evidence of a connected market feed.

## AI service configuration

The assistant calls `POST $MANUS_API_URL/v1/chat/completions` using the server-side `MANUS_API_KEY`. In the Manus-hosted development environment these values are supplied to the backend runtime. The code provides a request timeout, input limits, user-only conversation turns, a status query and a per-process UTC-day reply reservation. Failed/time-out replies are refunded and do not consume a successful-reply allowance. It does not persist chat history. If credentials are missing, the dashboard and assistant show setup required and disable submission; a failed status check is shown as unavailable.

The assistant has no live market data, news browsing, or access to user bank/brokerage accounts; it must not claim otherwise. Do not place provider keys in client code, HTML, or public platform configuration. Production quotas should be attached to authenticated users and a shared persistent rate-limit store, with a verified proxy/IP policy, before broad deployment.

## Markets and economic news

The stocks, crypto and currency tabs currently display source/permission status and no quotes, market capitalizations, company directory, or market charts. The previous illustrative chart values and incomplete hardcoded company list were removed so no sample is mistaken for live data. No NSE/BSE equities or general FX feed is connected. Official BSE/NSE market-data, subscription and listing pages are linked from the Markets screen.

Coinbase's India-facing pages show cryptocurrency prices and market statistics in INR, but not the NSE/BSE listed-company universe or a general FX feed. The public [Coinbase Market Data Terms](https://www.coinbase.com/legal/market_data) prohibit redisplaying/redistributing data to third parties and building an end-user application without Coinbase's prior express written consent. No such permission or compatible data license is available to CAPVY; the app does not scrape, embed or ingest Coinbase values. The Crypto tab links to [Coinbase's India explorer](https://www.coinbase.com/en-in/explore) and shows a permission-required state. A licensed feed must separately cover public CAPVY display and its financial-education/simulation context before any values or charts are shown. See [`market-data-notes.md`](market-data-notes.md) for sourced coverage and terms.

No verified economic news feed is connected, and no article is fabricated or shown as current. No Render Economic Intelligence Workflow has been implemented, configured or deployed in this preview. Before integrating providers, verify current terms/API schemas and Render Workflows SDK/deployment/scheduling conventions, configure protected provider credentials, implement validation and caching, then verify attribution, timestamps, idempotent persistence, retries and recovery. A deployed workflow is not inherently scheduled; configure and verify a supported scheduler/trigger separately.

## Live-feed freshness

No quote source is connected, so the Markets page has no price or provider timestamp to refresh; it explicitly describes a missing-feed state, not a stale quote. `GET /api/market-data/diagnostics` returns a no-store JSON status for equities, crypto and FX, including provider connectivity, coverage confirmation, observation/fetch timestamps, quote age, loaded-instrument count, source, delay and error/setup category. At present all three categories report `UNAVAILABLE` / `provider_not_configured`, with no provider, no last successful fetch, no quote age and zero instruments; the `checkedAt` field is only a diagnostics-check time. There is no provider-specific quote polling, cache, retry schedule or live chart until a licensed provider is selected and securely configured. When an authorized provider is configured, show the provider observation time and CAPVY fetch time, use the provider's documented refresh cadence and stale threshold, and visibly mark the last successful observation stale after that threshold. Preserve a last-good value only with its stale/error state; never label old data live or substitute fabricated values. Coinbase data additionally requires prior written permission for CAPVY's public educational/simulation use.

## Database and user data

The starter's existing `users` table is populated by Manus OAuth, and CAPVY's `/signup` and `/login` pages reuse that flow. OAuth callback cancellation, incomplete data and invalid/malformed state return to fixed, user-safe messages; a successful live provider round-trip has not been exercised. The Overview reads the actual aggregate row count through `community.registeredAccounts`; the response contains only `count` and `checkedAt`, never names, emails, open IDs or login methods. A database failure is shown as unavailable rather than zero. The managed database is shared by development and publication; no CAPVY profile, scenario, learning-progress, news, workflow-run or AI-usage tables or migrations are added. The scenario tool can use hypothetical or user-entered figures; explicit “Save” stores the current scenario in this browser's local storage only. Use the local clear/reset feature or browser storage controls to remove it. No banking or brokerage connection or financial transaction exists.

## Render deployment

This website is currently a Manus Webdev preview project. No Render account, service, domain, database, cron job or Workflow has been connected or deployed. The README and code do not represent a completed Render deployment. If deploying to Render later, verify current Workflows conventions, confirm the selected service plan, environment variables, production database schema/migrations and scheduling options first. Never publish API keys in frontend builds; expose a health endpoint and backend APIs only after the real deployment is tested.

## Education and limitations

CAPVY does not execute trades or provide a personalized financial, investment, tax or legal recommendation. Educational examples are hypothetical. The taxation game explicitly uses a simplified classroom rule rather than current Indian tax law. The investment comparison is illustrative and does not guarantee a return. Premium benefits are planned only; this site has no checkout, price or payment.
