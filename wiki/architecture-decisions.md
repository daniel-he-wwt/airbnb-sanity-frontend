# Architecture decisions

Decisions inferred from the existing code of `airbnb-sanity-frontend` while bootstrapping the wiki. They are listed newest first, but because they are reconstructed, they are numbered in logical order and all have the same bootstrap date. Do not edit past entries. To change a decision, add a new entry that supersedes it.

## ADR-005: Google Maps through @react-google-maps/api
- **Date:** bootstrap (reconstructed)
- **Status:** accepted
- **Context:** The home page needs a map with every listing, and each property page needs a map of that property's location.
- **Decision:** Use `@react-google-maps/api` (`useJsApiLoader`, `GoogleMap`, `Marker`). `components/DashboardMap.js` draws one marker per property, centred on the first property. `components/Map.js` draws a single marker. Both use a beach-flag icon and wrap the component in `React.memo`.
- **Alternatives considered:** Not recorded. Leaflet/Mapbox would remove the need for a Google API key.
- **Consequences:** A Google Maps API key is required. The two components are almost identical, so they should be merged into one. The tutorial calls the home map a "cluster map", but no marker clustering is implemented (see known-issues.md).

## ADR-004: A single global stylesheet
- **Date:** bootstrap (reconstructed)
- **Status:** accepted
- **Context:** A small tutorial app needs simple styling.
- **Decision:** All styles go in `styles/globals.css`, imported once in `pages/_app.js`. The font is Noto Sans JP from Google Fonts.
- **Alternatives considered:** CSS Modules or styled-jsx (both built into Next.js) were not used.
- **Consequences:** Simple to work with, but all class names share one global namespace. As the app grows, consider moving to CSS Modules.

## ADR-003: Server-side rendering with getServerSideProps
- **Date:** bootstrap (reconstructed)
- **Status:** accepted
- **Context:** Pages show content edited in Sanity Studio, and edits should show up without a rebuild.
- **Decision:** `pages/index.js` and `pages/property/[slug].js` fetch data on every request with `getServerSideProps`. The property page fetches by `slug.current` using a GROQ parameter, and returns `notFound: true` if no property matches.
- **Alternatives considered:** `getStaticProps`/`getStaticPaths` with ISR (`revalidate`) would be cheaper and faster but show slightly stale content.
- **Consequences:** Content is always fresh. The cost is one Sanity round-trip per page view. `useCdn` is turned on in production to reduce that cost.

## ADR-002: All Sanity access through sanity.js and next-sanity
- **Date:** bootstrap (reconstructed)
- **Status:** accepted
- **Context:** Pages and components need a Sanity client and image URLs.
- **Decision:** `sanity.js` builds one config from `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` (default `production`), with `useCdn` set when `NODE_ENV === "production"`. It exports `sanityClient` (from `createClient`) and `urlFor` (from `createImageUrlBuilder`). Images are rendered as plain `<img>` with `urlFor(...).auto("format")`, and the review avatars are cropped to 50×50 around the focal point.
- **Alternatives considered:** Using `@sanity/client` and `@sanity/image-url` directly. `next/image` is not used.
- **Consequences:** Configuration lives in one place. The early `next-sanity` 0.1.x API used here differs from current releases, so upgrading will require code changes.

## ADR-001: Headless CMS (Sanity) with a separate Next.js frontend
- **Date:** bootstrap (reconstructed)
- **Status:** accepted
- **Context:** This repo supports a tutorial on building an Airbnb clone from structured content.
- **Decision:** Content (property, person/host, traveller, review, propertyImage) is modelled and edited in Sanity Studio, in the separate repo `kubowania/airbnb-sanity-backend`. This repo is the Next.js frontend and queries that content with GROQ. References are expanded in projections (`host->{...}`, `reviews[]{..., traveller->{...}}`).
- **Alternatives considered:** Not recorded.
- **Consequences:** Schema changes have to be coordinated across both repos. The frontend has no write path and no auth. The `pages/api/hello.js` API route is unused Next.js boilerplate.
