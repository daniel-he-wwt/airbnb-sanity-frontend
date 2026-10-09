# Coding standards

Conventions in `airbnb-sanity-frontend`, a Next.js + Sanity.io AirBnB clone that started as a tutorial project. These are taken from the code as it is today. Where the code has no convention yet, this page says so and gives a recommendation.

## Languages and formatting
- **Language:** plain JavaScript (ES modules + JSX). The repo has no TypeScript.
- **Runtime/framework:** Next.js `10.1.3` with React `17.0.2` (pinned in `package.json`). Other dependencies: `next-sanity ^0.1.12` and `@react-google-maps/api ^2.1.1`.
- **Package manager:** `npm i`. The README also mentions `yarn dev`. No lockfile convention is set.
- **Scripts:** `npm run dev` (dev server on :3000), `npm run build`, `npm start`.
- **Formatter/linter:** none is configured (no ESLint, Prettier or `.editorconfig`). The existing code follows Prettier defaults with no semicolons, double quotes, 2-space indent and trailing commas in multi-line literals. Keep to that style. Adding Prettier with `semi: false` is recommended.

## Naming
- **Components:** PascalCase file and identifier, one component per file, default export (`components/DashboardMap.js`, `components/Review.js`).
- **Pages:** Next.js file-based routing under `pages/`. Dynamic segments use brackets (`pages/property/[slug].js`).
- **Helpers:** camelCase named exports (`isMultiple` in `utils.js`, `sanityClient` and `urlFor` in `sanity.js`).
- **CSS classes:** kebab-case global classes (`.price-box`, `.feed-container`, `.sub-images-section`).
- **Env vars:** use `NEXT_PUBLIC_*` for values the browser needs (`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`). The Google Maps key is read as `process.env.googlePlacesAPI`, which breaks this rule (see [known-issues.md](known-issues.md)).
- **Branches/commits:** no convention set yet.

## Code structure
- `pages/`: route components. Data is fetched in each page's `getServerSideProps` with `sanityClient.fetch(groqQuery, params)`.
- `pages/api/`: Next.js API routes. Only the boilerplate `hello.js` is there.
- `components/`: presentational React components (`NavBar`, `Image`, `Review`, `Map`, `DashboardMap`).
- `sanity.js`: the only place the Sanity client and image-URL builder are set up. Import `sanityClient` and `urlFor` from here. Never create another client.
- `utils.js`: small pure helpers (e.g. `isMultiple(n)` returns `"s"` for pluralization).
- `styles/globals.css`: all styling, imported once in `pages/_app.js`. The project does not use CSS modules.
- `images/`: assets referenced from CSS (`airbnb-logo.png`). `public/`: static files served at `/`.
- **GROQ queries:** pass user input as query parameters (`{ pageSlug }` → `$pageSlug`). Do not interpolate it into the query string. Expand references with `->` and project only the fields you need.
- **Images from Sanity:** always go through `urlFor(source)` and chain `.auto("format")` and sizing (`.width().height().crop("focalpoint")`) where you can.
- **Dependencies:** components may import from `sanity.js` and `utils.js`. Only pages talk to Sanity through `sanityClient`.

## Error handling and logging
- Pages handle a missing document by returning `{ notFound: true }` from `getServerSideProps` (see `[slug].js`). Use this pattern for any new detail page.
- Use optional chaining for optional Sanity fields (`host?.name`, `property?.location?.lat`). Assume any CMS field can be missing.
- The code has stray `console.log` calls (in `index.js`, `[slug].js`, `Map.js` and `DashboardMap.js`). Don't add new ones, and remove existing ones when you touch those files.
- Never log or commit API keys, Sanity tokens or traveller/host personal data. Put secrets in `.env.local`, which is not committed.

## Testing
- No test framework or tests exist yet.
- For now, before merging: run `npm run build` (it catches SSR/import errors), then manually check `/` and a `/property/<slug>` page against a populated Sanity dataset.
- Recommended next step: Jest + React Testing Library for components and helpers (`isMultiple`), with tests in `__tests__/` or next to the file as `*.test.js`.

## Code review
- Reviewers check that:
  - GROQ queries are parameterized and project only the fields they need
  - list renders have stable `key`s
  - optional CMS fields are null-safe
  - no secrets or `console.log`s are left in
  - `npm run build` passes
- At least one approval is needed before merging to `main`.
- **Definition of done:** the build passes, both pages were checked by hand, and the wiki is updated (add a decision to [architecture-decisions.md](architecture-decisions.md) or an issue to [known-issues.md](known-issues.md)) when relevant.
