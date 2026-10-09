# Architecture decisions

Decisions reconstructed from the existing code. Dates are unknown because the decisions predate this wiki. Newest first; supersede entries rather than rewriting them.

## ADR-005: Google Maps through @react-google-maps/api, one component per use
- **Date:** unknown (initial build)
- **Status:** accepted
- **Context:** The home page shows every property on one map, and the detail page shows a single location.
- **Decision:** Use `@react-google-maps/api` (`useJsApiLoader`, `GoogleMap`, `Marker`) in two near-duplicate components. `components/DashboardMap.js` takes a `properties` array and draws a full-viewport map. `components/Map.js` takes one `location` and draws a 400px-high map. Both use the same loader id `google-map-script`, a beach-flag marker icon and `React.memo`.
- **Alternatives considered:** No alternatives are recorded. The tutorial mentions marker clustering, but the code does not implement it.
- **Consequences:** The setup is simple, but logic is duplicated across the two components. Bug fixes (see known-issues.md) must be applied to both, or the components should be merged into one.

## ADR-004: Single global stylesheet
- **Date:** unknown (initial build)
- **Status:** accepted
- **Context:** The app is small and was written for a tutorial.
- **Decision:** All styles live in `styles/globals.css`, imported once in `pages/_app.js`. The Noto Sans JP font loads through a Google Fonts `@import`. The logo is a CSS background image from `images/airbnb-logo.png`.
- **Alternatives considered:** CSS Modules, styled-jsx and Tailwind were not used.
- **Consequences:** Setup cost is zero, but every class name is global, so names can collide as the app grows. There are no responsive breakpoints.

## ADR-003: Shared layout via custom `_app.js`
- **Date:** unknown (initial build)
- **Status:** accepted
- **Context:** Every page needs the navigation bar.
- **Decision:** `pages/_app.js` renders `<NavBar />` above every page component.
- **Alternatives considered:** No alternatives are recorded. A per-page layout component would also work.
- **Consequences:** Every page gets the same chrome. Pages cannot opt out of the NavBar without changing `_app.js`.

## ADR-002: Server-side rendering with getServerSideProps and GROQ
- **Date:** unknown (initial build)
- **Status:** accepted
- **Context:** Listing data lives in Sanity and should be fresh on every request.
- **Decision:** Both routes fetch data in `getServerSideProps`:
  - `/` (`pages/index.js`) runs `*[ _type == "property"]`, which returns full documents.
  - `/property/[slug]` (`pages/property/[slug].js`) runs a parameterised query on `slug.current == $pageSlug`. It projects only the fields it needs and dereferences `host->` and `reviews[].traveller->`.
  - A missing slug returns `notFound: true` (404).
- **Alternatives considered:** Static generation (`getStaticProps`/`getStaticPaths` with ISR) was not used.
- **Consequences:** Data is always current, but every page view queries Sanity (the CDN is used in production). The home page query over-fetches because it has no projection, and it does not dereference relations.

## ADR-001: Sanity.io as headless CMS via next-sanity
- **Date:** unknown (initial build)
- **Status:** accepted
- **Context:** Properties, people, travellers and reviews need structured content and a visual editor. The schema lives in the separate backend repo (https://github.com/kubowania/airbnb-sanity-backend).
- **Decision:** `sanity.js` is the single place that configures `next-sanity`'s `createClient` and `createImageUrlBuilder`:
  - `projectId` comes from `NEXT_PUBLIC_SANITY_PROJECT_ID`.
  - `dataset` comes from `NEXT_PUBLIC_SANITY_DATASET` (default `production`).
  - `useCdn` is true only in production.
  - The file exports `sanityClient` and `urlFor`.
- **Alternatives considered:** No alternatives are recorded.
- **Consequences:** The frontend depends on the backend's schema shape: `property` documents with `slug`, `location{lat,lng}`, `mainImage`, `images[]`, `host` and `reviews[]`. A schema change in the backend can break pages silently.
