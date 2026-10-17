# CAPVY Website — Updated Implementation Plan

## Product and scope

Continue the existing CAPVY financial-learning website in its initialized React 19/Vite/Express/tRPC project. The user requested a complete visual redesign and scroll-animated experience, plus Coinbase India market data. Coinbase India covers INR-denominated cryptocurrency markets, not NSE/BSE-listed equities or general FX. Coinbase's Market Data Terms prohibit redisplaying or redistributing data to third parties and building an application for other end users without prior express written consent. No such written permission is available. Therefore, do not integrate or display Coinbase quotes, market caps, candles or derived charts in CAPVY until written permission explicitly covers public end-user website display. Do not scrape or iframe Coinbase pages. Keep a simple outbound link to Coinbase's official India crypto explorer. Keep NSE/BSE and FX data clearly unavailable until separately licensed sources are supplied. Never invent or hardcode market data.

## Implementation approach

- Preserve the working calculator, games, AI education assistant, news status, routes and accessibility behavior; redesign their shared shell and visual language rather than replacing product logic. Maintain the seven client routes and the static route manifest at `client/public/manus-routes.json`.
- Replace the left-rail workspace with a sticky horizontal brand/navigation bar, clear education-only status, mobile navigation and a scroll-led editorial landing page. Keep dense task pages functional and responsive.
- Create a cinematic but legible Home narrative with a hero, a clearly fictional cashflow sample, a market-data permission/status section, learning/game links, and calls to action. Provide a real user path to every existing feature; do not imply any unconnected feed is live.
- Apply a new high-contrast indigo/violet and acid-lime visual system across all routes while retaining a dark editorial canvas, coral negative-risk color, amber uncertainty states, DM Sans/Space Grotesk/DM Mono and CAPVY branding.
- Implement site-wide fade-and-rise section reveals using IntersectionObserver and CSS transitions: about 18px travel, subtle blur clearing as sections enter, a light stagger and smooth, brief easing. Keep a slim scroll-progress indicator and restrained decorative hero motion. Reveal focused sections on keyboard focus. If IntersectionObserver is unavailable, or reduced motion is requested, keep all content immediately visible without motion. Respect `prefers-reduced-motion`; do not animate financial figures in a way that could be mistaken for changing quotes.
- Rework the market page to explain Coinbase India crypto coverage and its data-display permission requirement, link to Coinbase's official explorer, and keep crypto prices/market caps/charts blank until written redistribution permission is available. Label NSE/BSE equities and general FX separately as unavailable; Coinbase is not their data source. No live feed is connected, so no market value is currently stale or refreshable. After a licensed source is configured, follow its supported polling/stream cadence, show source quote time and CAPVY fetch time, label staleness against the provider's freshness contract, and never display stale values as live.
- Keep core cashflow and learning-game calculations in their current deterministic client modules. Keep the assistant server-side with its existing schema validation, status and success-only quota accounting. No market-data API key, customer trading connection, or account/trading permission is needed for the visual redesign.
- Continue honest statuses for the unimplemented Render news pipeline, market providers, app-specific authentication/persistence and Premium page; do not add a checkout, quote feed, or claiming language.

## Project structure

- `client/src/App.tsx`: lazy route map and providers.
- `client/src/components/CAPVYShell.tsx`: sticky responsive navigation, education-only status, scroll progress, scroll reveal observer and site footer.
- `client/src/pages/Home.tsx`: long-scroll CAPVY editorial landing narrative with a labeled fictional simulator preview and provider status.
- `client/src/pages/Markets.tsx`: category-specific source/permission status, one backend diagnostics query, and official outbound data links; no copied Coinbase data.
- `client/src/pages/`: existing cashflow simulator, learning games, economic-news status, assistant and Premium routes; preserve behavior while applying the shared skin.
- `client/src/lib/`: deterministic cashflow, game and formatting helpers plus tests.
- `server/assistant.ts`, `server/assistantQuota.ts`, `server/routers.ts`: existing server-side education assistant, status/quota and API registration.
- `server/_core/index.ts`, `server/marketDataDiagnostics.ts`: Express health/API routes and the safe no-provider market diagnostics response.
- `server/logRedaction.ts`: recursive masking of sensitive values in local development request logs.
- `shared/marketData.ts`: Zod diagnostics response contract shared by server and client.
- `server/marketDataDiagnostics.test.ts`, `server/logRedaction.test.ts`: deterministic tests for unavailable market status, secret-safe diagnostics, and development-log redaction.
- `client/src/index.css`: global indigo/lime palette, responsive design, page/layout systems, scroll-reveal and reduced-motion styles.
- `client/public/manus-routes.json`, `client/public/capvy-mark.svg`, `app.config.ts`: route manifest and CAPVY website/project identity.
- `README.md`, `TODO.md`, `plan.md`, `market-data-notes.md`: setup, truthful delivery status, acceptance clauses and sourced provider-rights facts.

## Design

Three directions considered (each intentionally sampled below 0.10):

1. **Kinetic ink editorial — 0.08 (selected)**: a dark indigo financial-learning journal with oversized type, electric violet, acid-lime signals and scroll-led sections.
2. **Warm paper ledger — 0.05**: an ivory journal with gentle plum and orange marks.
3. **Minimal market terminal — 0.03**: a restrained navy interface with small mono data labels.

**Design movement:** Neo-brutalist editorial design blended with digital collage and scrollytelling.

**Core principles:** Strong editorial hierarchy; honest data provenance; action before decoration; accessible motion and controls.

**Color philosophy:** Deep ink-indigo remains the calm canvas, while electric violet makes CAPVY memorable and signals exploration. Acid lime highlights selected actions and learning cues. Coral communicates negative financial outcomes; amber signals missing data or risk. The palette is deliberately distinct from the previous restrained emerald terminal.

**Layout paradigm:** A sticky horizontal masthead frames a vertical, story-driven Home page. Each scroll section has a clear narrative purpose and asymmetrical geometry. Interior routes reuse this generous editorial rhythm while keeping forms and charts compact enough for work. Mobile navigation stays thumb-friendly and every page reads in a single column.

**Signature elements:** A CAPVY forward-signal C mark; large chapter numerals and thin orbit/radar lines; violet/citrus status lozenges for live, hypothetical, blocked and setup-required states.

**Interaction philosophy:** Motion reveals structure rather than hiding it. Buttons and simulator controls respond immediately. Data states never imitate a live ticker. Keyboard focus reveals any off-screen section so animation cannot conceal a focused control.

**Animation:** Use an IntersectionObserver to reveal major sections once as they enter the viewport (about 18–24px travel over 450–650ms with a restrained stagger). Show a slim scroll-progress line. Allow a very slow decorative orbital float in the hero only. Do not continuously animate quote values, do not create parallax that shifts content away from the pointer, and do not delay controls. When `prefers-reduced-motion` is enabled, disable reveal transforms, parallax and smooth scrolling; render all content in its final visible position. Unsupported observers leave content visible.

**Typography system:** Space Grotesk for headlines and bold chapter numerals; DM Sans for body copy and controls; DM Mono for dates, rupee values and source/status labels. Use a large, responsive hero scale, concise body line lengths, and tabular numerals for simulation values.

**Brand essence:** Financial intelligence for India's next generation—learn concepts, explore markets and test decisions before risking money. Personality: bold, clear, responsible.

**Brand voice:** Direct, motivating and grounded; never promise returns or describe missing data as live. Example lines: “Money moves. Learn to read the moment.” “A scenario, not a prediction.”

**Wordmark & logo:** Retain CAPVY's geometric C/forward-signal mark, recolored in electric violet with an acid-lime signal detail; pair it with a bold custom-feeling wordmark treatment rather than a default nav label.

**Signature brand color:** CAPVY Electric Violet (`#B69CFF`).

## Frontend and backend responsibilities

The visual redesign preserves deterministic client-side cashflow/game math and the server-side education assistant. The diagnostics-only follow-up adds a shared Zod response contract, a safe Express status endpoint, one React Query status fetch and separate provider-observation/fetch timestamps; it does not fetch or manufacture prices. The local Vite development log collector recursively redacts credential-like headers, fields and bearer strings before writing request logs. Actual provider adapters, quote polling, live charts and provider-specific caching/retry behavior remain blocked until API access, market coverage, rate limits, public display/education/simulation rights and credentials are verified. Coinbase is not an NSE/BSE equity or general FX feed. Render, news-source, user-authentication and CAPVY persistence limitations remain unchanged.

## Market-data diagnosis and verified diagnostics implementation

Source and network inspection confirmed that Markets previously made no quote/chart fetches and that the project had no market adapter, symbol mapping, quote cache, polling, timeout or retry behavior. The project runtime has no market-provider credentials, and production logs cannot be read because the project is not published. Enabled session-side crypto data connectors do not provision the CAPVY server or establish public display rights. Before this follow-up, `/api/market-data/diagnostics` fell through to the Vite HTML fallback; it now returns HTTP 200 JSON with `Cache-Control: no-store`. The response and Markets UI report equities, crypto and FX as unavailable and provider-not-configured, with no provider, no verified market support, null observation/fetch timestamps and quote age, and zero loaded instruments. The UI clearly says no value is loaded, so there is no stale quote to refresh; the `checkedAt` field is a diagnostics time, not a market quote time. This verifies only an honest status response, not a live provider. When a provider is selected, verify its documented API, coverage, rights, rate limits and secure credentials before adding a server adapter and provider-specific refresh/cache/fallback behavior.
