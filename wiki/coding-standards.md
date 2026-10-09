# Coding standards

Conventions observed in `airbnb-sanity-frontend`, a Next.js frontend for an Airbnb clone that reads its content from Sanity.io. The structure follows the global `coding-standards.md` template. Where the repo has no convention yet, this page says so and gives a recommendation.

## Languages and formatting
- **Language:** plain JavaScript (ES modules + JSX). There is no TypeScript.
- **Runtime/framework:** Next.js `10.1.3`, React/React DOM `17.0.2`, `next-sanity` `^0.1.12`, `@react-google-maps/api` `^2.1.1` (see `package.json`).
- **Scripts:** `npm run dev` (dev server on http://localhost:3000), `npm run build`, `npm run start`. Install with `npm i`.
- **Formatter/linter:** none is configured (no ESLint or Prettier config, no `lint` script). The existing code looks Prettier-formatted: double quotes, no semicolons, 2-space indent, trailing commas in multi-line literals. Keep to that style. Adding Prettier and `next lint`/ESLint is recommended.
- **Styling:** one global stylesheet, `styles/globals.css`, imported in `pages/_app.js`. It uses plain class names (`.container`, `.card`, `.price-box`, …) and loads the Google Font *Noto Sans JP* with `@import`. There are no CSS Modules and no CSS-in-JS.

## Naming
- **Components:** PascalCase, one component per file in `components/` (`DashboardMap.js`, `Image.js`, `Map.js`, `NavBar.js`, `Review.js`). Each is an arrow function with a default export.
- **Pages:** follow Next.js file routing in `pages/`: `index.js` (home), `property/[slug].js` (dynamic property page), `_app.js` (app shell), `api/` (API routes).
- **Helpers:** camelCase named exports. Examples: `isMultiple` in `utils.js`, and `sanityClient` / `urlFor` in `sanity.js`.
- **CSS classes:** lower-case and kebab-case (`main-image`, `sub-images-section`, `review-box`).
- **Env vars:** browser-exposed Sanity settings use the `NEXT_PUBLIC_` prefix (`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`). The Google Maps key is read as `process.env.googlePlacesAPI` (see known-issues.md).
- **Branches/commits:** no convention is recorded in the repo.

## Code structure
- `sanity.js` is the only Sanity integration point. It exports `sanityClient` (for GROQ queries) and `urlFor` (an image URL builder). Do not create Sanity clients anywhere else.
- `utils.js` holds small shared pure helpers.
- `components/` holds presentational React components. Components should not fetch data.
- `pages/` fetches data server-side with `getServerSideProps` and `sanityClient.fetch(query, params)`. Pass values into GROQ as parameters (`$pageSlug`), never by string interpolation.
- Static assets: `public/` is served from `/`. `images/` holds assets referenced from CSS (`airbnb-logo.png`).
- The content schemas (property, person, traveller, review, propertyImage) are in the separate backend repo, `kubowania/airbnb-sanity-backend`. Any frontend query change must match those schemas.

## Error handling and logging
- Data fetching does very little error handling. A missing property returns `{ notFound: true }` (a 404). The home page returns `properties: []` when there are no results.
- Optional chaining (`host?.name`, `property?.location?.lat`) is used in some places to guard against missing references. Use it for any optional Sanity field.
- **Logging:** there is no logging library. Components contain leftover `console.log` debug calls. Remove them before merging new code. Never log API keys or tokens.
- Only use public identifiers (project ID, dataset) in `NEXT_PUBLIC_*` variables. Never expose a Sanity write or read token to the browser.

## Testing
- No tests and no test tooling exist yet.
- Recommended: Jest + React Testing Library for components and helpers (for example `isMultiple`), plus a smoke test that `next build` succeeds.
- Until then, test by hand with `npm run dev` against a Sanity dataset that has at least one property with images, a host, reviews and a location.

## Code review
- No formal process is recorded. Minimum checklist:
  - `npm run build` passes.
  - No stray `console.log`, and every item in a mapped list has a `key`.
  - GROQ queries use parameters, and projections match the backend schema.
  - Optional Sanity fields are guarded (`?.`, defaults).
  - No secrets committed. Required env vars are documented.
