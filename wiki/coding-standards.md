# Coding standards

Conventions observed in `airbnb-sanity-frontend` (a Next.js + Sanity.io AirBnB clone built for a tutorial). Where the code has no established convention, that is stated explicitly so the gap is visible.

## Languages and formatting
- **Language:** JavaScript (ES modules, JSX). No TypeScript.
- **Runtime / framework:** Next.js `10.1.3`, React `17.0.2`, `next-sanity ^0.1.12`, `@react-google-maps/api ^2.1.1` (see `package.json`). The Node version is not pinned (no `.nvmrc` or `engines` field).
- **Formatting:** The code looks Prettier-formatted: double quotes, no semicolons, 2-space indent, trailing commas in multi-line objects. There is no Prettier config or script in the repo, so this is convention only. `pages/api/hello.js` still uses single quotes and semicolons from the Next.js boilerplate.
- **Linting:** No ESLint config. Next 10 does not run lint during `next build`.
- **Scripts:** `npm run dev` (dev server on :3000), `npm run build`, `npm run start`.

## Naming
- **Components:** PascalCase file and identifier, one default-exported component per file in `components/` (e.g. `DashboardMap.js`, `Review.js`).
- **Pages:** Next.js file-system routing under `pages/`. Dynamic segments use bracket names (`pages/property/[slug].js`).
- **Helpers:** camelCase named exports (`isMultiple` in `utils.js`, `urlFor` / `sanityClient` in `sanity.js`).
- **CSS classes:** lowercase kebab-case in one global stylesheet (`.feed-container`, `.price-box`, `.main-image`).
- **Env vars:** Sanity vars use the `NEXT_PUBLIC_SANITY_*` prefix. The Google Maps key is read as `process.env.googlePlacesAPI`, which breaks the convention (see known-issues.md).
- **Branches / commits:** No convention is documented in the repo.

## Code structure
```
pages/            Next.js routes (data fetching via getServerSideProps)
  _app.js         Global layout: imports globals.css, renders <NavBar/>
  index.js        Home feed + dashboard map
  property/[slug].js  Property detail page
  api/hello.js    Unused Next.js boilerplate API route
components/       Presentational React components
sanity.js         Sanity client + image URL builder (single source of config)
utils.js          Small pure helpers
styles/globals.css  All styling (global CSS, Google Fonts import)
images/           Assets referenced from CSS (logo)
public/           Static files served at /
```
- **Data access:** Only page-level `getServerSideProps` talks to Sanity, through `sanityClient` from `sanity.js`. Components get data as props and must not fetch.
- **Images:** Build Sanity image URLs with `urlFor(source)` from `sanity.js`, and chain `.auto("format")` and size/crop modifiers where useful.
- **Imports:** Use relative imports (`../sanity`, `../../components/Map`). No path aliases are configured.
- **Styling:** Use plain global CSS. No CSS modules or CSS-in-JS. Inline style objects appear only for Google Map container sizing.

## Error handling and logging
- **Not found:** The property page returns `{ notFound: true }` when the GROQ query matches no document. That is the only explicit error handling.
- **Empty data:** The home page returns `properties: []` when the query matches nothing (the UI does not handle this case; see known-issues.md).
- **Logging:** Only ad-hoc `console.log` calls are used, several left over from the tutorial (in `index.js`, `[slug].js`, `Map.js`, `DashboardMap.js`). Expected practice: remove debug logs before merging. Never log API keys or tokens.
- **Secrets:** The Sanity project ID and dataset are public by design. A Sanity read token, if one is ever added, must not get a `NEXT_PUBLIC_` prefix.

## Testing
- **No tests exist** and there is no test runner configured. At minimum, check changes manually with `npm run dev` against a populated Sanity dataset (backend: https://github.com/kubowania/airbnb-sanity-backend).
- If tests are added, suggested placement: `__tests__/` next to the code, using Jest + React Testing Library.

## Code review
- No CI, CODEOWNERS or PR template in the repo.
- Reviewer checklist (suggested):
  - `npm run build` succeeds.
  - Each item in a rendered list has a stable `key` on its outermost element.
  - No leftover `console.log`.
  - New env vars are documented and correctly prefixed.
  - GROQ projections only fetch the fields the page needs.
- Definition of done: builds, pages render with real Sanity data, and the wiki is updated if behaviour or configuration changed.
