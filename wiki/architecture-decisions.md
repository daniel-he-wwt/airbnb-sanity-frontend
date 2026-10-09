# Architecture decisions

> One entry per decision, newest first. Never rewrite past entries. Add a new entry that supersedes them instead.
> These entries were reconstructed from the code when the wiki was bootstrapped. Dates are unknown and shown as "pre-wiki".

## ADR-005: Google Maps via `@react-google-maps/api`, one map component per view
- **Date:** pre-wiki
- **Status:** accepted
- **Context:** The home page needs a map of all listings, and the property page needs a map of a single location.
- **Decision:** Use `@react-google-maps/api` (`useJsApiLoader`, `GoogleMap`, `Marker`). There are two components wrapped in `React.memo`:
  - `components/DashboardMap.js`: full-height map with one marker per property, centred on the first property
  - `components/Map.js`: 400px map with a single marker
  
  Both use the same loader id `"google-map-script"` and a custom beach-flag marker icon.
- **Alternatives considered:** Mapbox or Leaflet. Not chosen because the tutorial uses the Google Maps API. The README mentions marker clustering, but it is not built yet.
- **Consequences:** Needs a Google Maps API key. The two components are almost identical, so a shared base component would cut the duplication. See [known-issues.md](known-issues.md) for the bugs they share (env var name, `fitBounds` on empty bounds, missing marker keys).

## ADR-004: Global stylesheet instead of CSS modules or CSS-in-JS
- **Date:** pre-wiki
- **Status:** accepted
- **Context:** The UI is small and copies Airbnb's look.
- **Decision:** All styles live in `styles/globals.css`, which is imported once in `pages/_app.js`. The Noto Sans JP font is loaded with `@import` from Google Fonts. The logo is a CSS background image from `images/airbnb-logo.png`.
- **Alternatives considered:** CSS modules (built into Next.js), styled-components or Tailwind.
- **Consequences:** Simple, but every class name is global, so names can collide as the app grows. The layout is fixed at 50/50 widths with no responsive breakpoints.

## ADR-003: Server-side rendering with `getServerSideProps` on every page
- **Date:** pre-wiki
- **Status:** accepted
- **Context:** Listing data lives in Sanity and editors change it in Sanity Studio.
- **Decision:** `pages/index.js` and `pages/property/[slug].js` fetch on every request with `getServerSideProps`. The detail page returns `notFound: true` when no document matches the slug.
- **Alternatives considered:** Static generation (`getStaticProps`/`getStaticPaths`) with ISR (`revalidate`), which would be faster and cheaper. Client-side fetching, which would hurt SEO.
- **Consequences:** Content is always fresh, but every page view costs a Sanity request plus server time. In production the Sanity CDN (`useCdn`) takes some of that load. Switching to ISR would be a cheap performance win.

## ADR-002: Sanity.io as headless CMS, accessed with GROQ via `next-sanity`
- **Date:** pre-wiki
- **Status:** accepted
- **Context:** The app needs structured content (properties, reviews, travellers and hosts) that people can edit visually.
- **Decision:** Content lives in a separate Sanity Studio backend (`kubowania/airbnb-sanity-backend`). It defines these schemas: `property`, `review`, `traveller`, `person` and the `propertyImage` type. `sanity.js` exports one `sanityClient` and a `urlFor` image builder from `next-sanity`:
  - config comes from `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` (default `production`)
  - `useCdn` is on only in production
  
  Queries are written in GROQ and expand references with `->`. Images are served through the Sanity image pipeline.
- **Alternatives considered:** A custom REST backend, or another headless CMS (Contentful, Strapi).
- **Consequences:** Schema changes have to be coordinated with the backend repo. The frontend only reads public data and needs no token.

## ADR-001: Next.js (pages router) + React as the frontend framework
- **Date:** pre-wiki
- **Status:** accepted
- **Context:** The app is an AirBnB clone built for a tutorial and needs SSR and file-based routing.
- **Decision:** Next.js 10 with the `pages/` router and React 17, in plain JavaScript.
- **Alternatives considered:** Create React App (no SSR) and Gatsby (static-first).
- **Consequences:** The versions are now old. Upgrading to a current Next.js means checking `next/link` usage (Next 13+ no longer needs a child `<a>`) and possibly moving to the app router.
