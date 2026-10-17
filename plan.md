# CAPVY Website — Implementation Plan

## Product and scope

Build a premium, responsive CAPVY web application based on the supplied master brief. Use the existing initialized React/Express/tRPC/Drizzle project rather than replacing its stack. Deliver a complete navigable product experience, prioritizing the Cashflow Collision Detector as the functional deterministic slice. Other experiences provide useful interactions with explicit data-availability labels. Sample data must never be presented as live, and external services must not be claimed deployed when they are not.

## Implementation approach

- Reuse the installed React 19, Vite, Wouter, Tailwind, Lucide, Recharts, Express/tRPC and Drizzle foundation. Keep routes and reusable components under `client/src`; keep deterministic cashflow and learning-game calculations in `client/src/lib` modules with unit tests.
- Provide a shared responsive application shell and seven primary routes: `/` dashboard, `/cashflow` simulator, `/learn` games, `/markets` market explorer, `/news` economic-news status, `/assistant` AI education, and `/premium` Coming Soon. Maintain the static route manifest in `client/public/manus-routes.json`.
- Give the cashflow simulator editable INR starting balance and dated positive/negative transactions. Apply the documented same-day rule (expenses before income, then stable input order); compute and show each transaction’s running balance, lowest balance, first deficit date, shortfall and every distinct recovery date. Support edits, separate timing alternatives, comparisons, local save/load state, validation and explanations that never alter calculations. Keep scenarios in the browser only; do not send them to a server.
- Build five playable financial-learning experiences with deterministic outcomes: Cashflow Survival, Business Builder, Investment Lab, Taxation Challenge (explicitly simplified educational assumptions unless current law has been researched and verified), and Market Reaction Lab (mechanisms and uncertainty, not forecasts).
- Provide separate Indian-equities, crypto and currency market exploration tabs, searchable instruments, interactive charts and local watchlist controls. Clearly mark the bundled indexed chart path as illustrative, not as live prices, returns or historical observations. Do not invent market data or claim a provider is connected.
- Provide an attributed news-feed surface that does not invent stories, plus explicit status for the requested Render Economic Intelligence Pipeline. The pipeline is not configured, implemented, deployed or scheduled in this preview; retain that boundary in all UI and documentation until verified.
- Build the AI education assistant as a server-side tRPC route using configured platform model-service credentials, validation, a timeout, cautious educational system guidance and a demonstration usage guardrail. Report whether service credentials are configured through a status endpoint. Accept user-authored turns only; reserve an in-process network/day reply slot and refund it when a request fails. One backend model response was successfully verified during this build; the assistant still has no news or live-market retrieval.
- Premium is explicitly Coming Soon. Do not add checkout, payment, prices, charges or fake subscription confirmation.
- Use the provisioned Manus backend only for safe, actually configured features. No Render service, news/market provider, Render Workflow, scheduler, CAPVY database schema or user-specific persistent finance-data path is configured. The starter includes generic Manus OAuth routes and a users table, but no CAPVY sign-in/profile UI or CAPVY user-data tables/ownership layer. Document limits honestly. No banking, Aadhaar/PAN, brokerage credentials or real trading.
- Add accessible controls, visible focus, mobile layouts, keyboard support, reduced-motion behavior, stable loading/error/empty/unavailable states, clear source labels, and truthful educational/financial caveats.

## Project structure

- `client/src/App.tsx`: lazy-loaded route map and shared application providers.
- `client/src/pages/`: dashboard, simulator, five learning labs, market explorer, economic-news status, assistant and Premium Coming Soon.
- `client/src/components/`: application shell, sidebar/mobile navigation and reusable UI primitives.
- `client/src/lib/cashflow.ts`: pure INR cashflow calculation, validation, event-level balances and recovery-date functions independent of UI.
- `client/src/lib/games.ts`: deterministic classroom-simulation calculations for survival, business, recurring contributions and simplified tax.
- `client/src/lib/format.ts`: shared INR and date display helpers.
- `client/public/manus-routes.json`: canonical page route manifest served at `/manus-routes.json`; `client/public/capvy-mark.svg`: site favicon.
- `server/assistant.ts`: validated server-side educational assistant endpoint, status query and response quota.
- `server/assistantQuota.ts`: testable UTC-day allowance reservations and refunds for failed requests.
- `server/routers.ts`: application tRPC router registration.
- `client/src/index.css`: CAPVY design tokens, typography, layout, responsive behavior and reduced-motion styling.
- `client/src/lib/*.test.ts` and `server/assistant*.test.ts`: deterministic calculations, request-boundary and quota tests registered with Vitest.
- `app.config.ts`: quoted project `logoUrl` branding metadata.
- `plan.md`, `TODO.md` and `README.md`: approved approach, progress/acceptance clauses and setup/known limitations.

## Design

Three visual directions considered (each intentionally sampled below 0.10):

1. **Nocturne market terminal — 0.08**: editorial charcoal data surfaces with selective emerald signal color. **Selected**, consistent with the user's explicit premium dark/emerald brief.
2. **Warm paper ledger — 0.05**: light editorial cards, muted ink and moss.
3. **Electric student lab — 0.03**: high-contrast cobalt panels and playful data graphics.

**Design movement:** Contemporary financial editorial design paired with the calm precision of a market terminal.

**Core principles:** Financial clarity before ornament; disciplined, restrained color; useful density with generous breathing room; transparent provenance for every illustrative or external value.

**Color philosophy:** Deep charcoal backgrounds communicate focus, while a distinct emerald green signals CAPVY's learning and positive movement. Warm neutral text protects readability; red signals negative financial outcomes, and amber is reserved for risk, uncertainty and missing data.

**Layout paradigm:** A compact desktop rail anchors a broad editorial workspace. The dashboard leads with a clear welcome/cashflow-status band and balances the core simulator against concise market and learning modules. On small screens, touch-sized bottom navigation and stacked content preserve chart and text readability.

**Signature elements:** A geometric CAPVY C/forward-signal mark; emerald signal dividers and compact labels; consistent status chips differentiating hypothetical, demo and unavailable values.

**Interaction philosophy:** Controls produce immediate, explainable feedback. Simulation edits recalculate deterministically; alternatives remain separate. Every data element communicates its origin. No motion should obscure a negative cash balance or caveat.

**Animation:** Short opacity/position transitions (about 140–220ms), restrained chart transitions, no persistent movement or layout shift, and nonessential motion disabled under `prefers-reduced-motion`.

**Typography system:** DM Sans for body copy and controls; Space Grotesk for editorial headings and compact amounts; DM Mono for balances, dates and data labels. Use an editorial heading scale, restrained uppercase labels and tabular numerals for rupee values.

**Brand essence:** Financial intelligence for India's next generation—learn concepts, explore markets and test decisions before risking money. Personality: clear, thoughtful, empowering.

**Brand voice:** Confident and plain-spoken; explain rather than hype. Example lines: “See the squeeze before it happens.” “A scenario, not a prediction.”

**Wordmark & logo:** CAPVY wordmark with a custom geometric C/forward-signal mark in emerald and neutral text.

**Signature brand color:** CAPVY Signal Emerald (`#16C784`).

## Frontend and backend responsibilities

The website runs in the initialized Manus Webdev environment. Core cashflow and game calculations execute in client-side deterministic modules and do not depend on AI or external data. The server-side assistant calls the configured platform model endpoint; user cashflow inputs are not sent to it. The managed database capability and generic Manus OAuth/users-table starter exist, but there are no CAPVY application tables, CAPVY sign-in/profile UI, ownership model or user-specific stored records. No news/market provider or Render service/Workflow is configured or verified. Such integrations must remain setup-required until real credentials, deployment and behavior are proven.
