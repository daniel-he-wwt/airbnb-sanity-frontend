# Architecture Decisions

A lightweight ADR log for the AirBnB clone frontend. Each entry gives the context, the decision and its consequences. The decisions below were inferred from the code and README when the wiki was bootstrapped.

---

## ADR-001: Next.js as the frontend framework

- **Status:** Accepted
- **Context:** The app needs server-rendered pages backed by a headless CMS, with dynamic routes per property.
- **Decision:** Use Next.js 10 (pages router) with React 17. File-based routing gives `/` (`pages/index.js`) and `/property/[slug]` (`pages/property/[slug].js`).
- **Consequences:** Routing and SSR need little code. The project is tied to the pages-router APIs (`getServerSideProps`, `_app.js`). Moving to newer Next.js versions will mean migration work.

## ADR-002: Sanity.io as a headless CMS

- **Status:** Accepted
- **Context:** Property, person, traveller and review data must be editable through a UI, with relationships between documents.
- **Decision:** Store the content in Sanity. The schemas live in a separate backend repo ([kubowania/airbnb-sanity-backend](https://github.com/kubowania/airbnb-sanity-backend)). The frontend reaches Sanity through `next-sanity`.
- **Consequences:** Schema changes happen in the backend repo and must be reflected by hand in the GROQ queries and components. This repo has no type safety between the schema and the UI.

## ADR-003: One Sanity client module

- **Status:** Accepted
- **Decision:** `sanity.js` holds the config (project ID and dataset from env vars) and exports `sanityClient` (data fetching) and `urlFor` (image URL builder). Everything else imports from it.
- **Consequences:** Configuration lives in one place. `useCdn` is turned on only in production, so development reads fresh data and production reads cached data.

## ADR-004: Server-side rendering on every request (`getServerSideProps`)

- **Status:** Accepted
- **Context:** Content should show up as soon as it is edited in Sanity Studio.
- **Decision:** Both pages fetch from Sanity in `getServerSideProps` with GROQ queries. The property page passes the slug as a query parameter and resolves the `host` and `reviews[].traveller` references inside the query. A missing slug returns `notFound: true`.
- **Consequences:** Content is always fresh and no rebuilds are needed. The trade-off is a Sanity round-trip per request and no static caching. Static generation (`getStaticProps`/ISR) would be the alternative if performance becomes a concern.

## ADR-005: Google Maps through `@react-google-maps/api`

- **Status:** Accepted
- **Decision:** `components/Map.js` shows a single property's location with one marker. `components/DashboardMap.js` shows a marker for every property on the home page. Both load the script with `useJsApiLoader` (shared id `google-map-script`) and are wrapped in `React.memo`.
- **Consequences:** The two components are nearly identical, so it would make sense to merge them into one. Marker clustering is mentioned in the README but not implemented. A Google Maps API key is required.

## ADR-006: Global CSS for styling

- **Status:** Accepted
- **Decision:** All styles live in `styles/globals.css` (imported once in `_app.js`), with the Noto Sans JP font from Google Fonts.
- **Consequences:** Simple, but every class name is global and can collide. There are no media queries, so the layout is not responsive.

## ADR-007: Layout shell in `_app.js`

- **Status:** Accepted
- **Decision:** `_app.js` renders `NavBar` (a logo shown as a CSS background image) above every page.
- **Consequences:** The same header appears on every page. Per-page layouts would need a layout pattern.
