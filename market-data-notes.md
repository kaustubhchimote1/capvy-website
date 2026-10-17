# CAPVY Market Data Source Notes

Checked 17 October 2026 (Asia/Kolkata). These notes are a source/rights record, not a live feed. They do not themselves authorize data redistribution.

## Latest SENSEX reference

BSE's market-data page reports the latest completed session close as **74,729.27**, up **413.66 points (+0.56%)**, at **16 Oct 2026, 16:00 IST**. Thus on Saturday 17 Oct the latest official close available is 74,729.27, not 72,729.27. Do not hard-code this as a permanently current quote; a production screen must show provider/source and quote timestamp and refresh from a licensed feed.

## Active Indian-listed equities

NSE's official securities-available-for-trading page offers separate downloadable equity and SME equity lists, along with separate files for ETFs, REITs, debt, preference shares and other categories. BSE's official List of Securities page exposes Active, Suspended and Delisted security-status filters. A complete listed-equity directory should define its scope explicitly, preserve exchange/symbol identity and exclude unrelated instrument types. Public display of exchange-supplied names/identifiers remains subject to the relevant data terms and agreements.

## Widget option and its limits

TradingView advertises free embeddable widgets for websites and a screener widget. Its official widget-specific market list (Asia/Pacific) currently lists **BSE: EOD stocks, indices and futures** and **MSEI: real-time stocks**, but does not list NSE. The separate TradingView platform data-coverage page lists different NSE/BSE subscription details; that should not be confused with data availability in a website widget. TradingView's widget FAQ says upgraded TradingView subscriptions do not make website widgets real-time; real-time website display requires contacting the exchange. Therefore an official TradingView embed is a plausible source for real BSE end-of-day values, not a verified source for all active NSE+BSE stocks or live Indian quotes. If used, disclose EOD cadence and provider coverage rather than claiming complete/real-time India coverage.

## Licensed feed option and published restrictions

NSE's data policy requires a subscriber agreement defining intended use and dissemination. BSE's Market Data Products page says customers can subscribe directly or through vendors; it lists Accord Fintech and C-MOTS as delayed-feed providers for website/mobile use. Accord's ACE Datafeed page says it provides API/FTP market/equity data and is an authorized BSE/NSE/MCX vendor, but its public marketing page does not provide the actual API/authentication schema or confirm CAPVY's redistribution entitlement.

Global Datafeeds (GFDL) publicly documents real-time, historical, snapshot, delayed and EOD WebSocket/REST APIs for NSE and BSE stocks/indices; its page says one-second updates and web/mobile delivery are supported, and BSE and NSE vendor pages list it among real-time data vendors. However, GFDL's published API terms also say data is for one subscriber's charting/analysis use and prohibit gaming, virtual-trading and simulation applications without exchange/SEBI approval. CAPVY includes financial simulations, so these published terms are not sufficient authority for a CAPVY integration. Written permission/appropriate subscriber rights covering public display and CAPVY's educational simulation use would need verification before use. No licensed exchange feed or compatible provider credential is currently configured in CAPVY.

## Sources

- BSE SENSEX quote: https://www.bseindia.com/sensex/code/16
- BSE market-data products, vendors and tariffs: https://www.bseindia.com/marketdata-products
- NSE securities available for trading: https://www.nseindia.com/static/market-data/securities-available-for-trading
- NSE data sharing and usage policy: https://www.nseindia.com/static/market-data/nse-data-policy
- NSE real-time data subscription: https://www.nseindia.com/static/market-data/real-time-data-subscription
- Accord Fintech ACE Datafeed: https://www.accordfintech.com/market-data-feed
- Global Datafeeds APIs and terms: https://globaldatafeeds.in/apis/
- TradingView free website widgets: https://www.tradingview.com/widget/
- TradingView widget-specific available markets: https://www.tradingview.com/widget-docs/markets/asia-pacific/
- TradingView general platform data coverage: https://www.tradingview.com/data-coverage/
