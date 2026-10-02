# Coding Standards

The conventions this codebase follows (taken from the code as it is now), plus guidance for new code. The project is a Next.js 10 + Sanity.io AirBnB clone built for a tutorial.

## Language and tooling

- **JavaScript (ES modules + JSX)**. There is no TypeScript, ESLint, Prettier config or test runner in the repo.
- Package scripts (`package.json`): `npm run dev`, `npm run build`, `npm run start`. No `lint` or `test` script.
- Pinned runtime versions: `next` 10.1.3, `react`/`react-dom` 17.0.2, `next-sanity` ^0.1.12, `@react-google-maps/api` ^2.1.1.

## Formatting (observed)

- Double quotes for strings and no semicolons. This looks like Prettier with `semi: false`, but no config file is committed.
- 2-space indentation.
- Template literals for GROQ queries that span several lines.

## Project layout

| Path | Purpose |
|------|---------|
| `pages/` | Next.js routes. `index.js` (home feed + map) and `property/[slug].js` (property detail) |
| `pages/_app.js` | Global layout: imports `styles/globals.css` and renders `NavBar` above each page |
| `pages/api/` | API routes (only the default `hello.js` boilerplate) |
| `components/` | Presentational React components (`Image`, `Review`, `Map`, `DashboardMap`, `NavBar`) |
| `sanity.js` | One place for the Sanity config. Exports `sanityClient` and `urlFor` |
| `utils.js` | Small pure helpers (`isMultiple` for pluralising) |
| `styles/globals.css` | All styling as global CSS classes |
| `images/` | Assets referenced from CSS (`airbnb-logo.png`) |
| `public/` | Static files served at the site root |

## Components

- Function components written as arrow functions, with `export default` at the bottom of the file.
- File names use PascalCase and match the component name (`Review.js` → `Review`).
- Props are destructured in the signature (`({ review }) =>`).
- Wrap map components in `React.memo`. Use `React.useCallback` for the `onLoad`/`onUnmount` handlers.
- Render an empty fragment (`<></>`) while an async dependency (the Google Maps script) is still loading.

## Data fetching

- Fetch data **only on the server in `getServerSideProps`**, using `sanityClient.fetch(query, params)` from `sanity.js`.
- Pass values into GROQ as **parameters** (`$pageSlug`). Never build queries by string-concatenating user input.
- Resolve references in the query (`host->{...}`, `traveller->{...}`) so components get plain objects.
- When a document is missing, return `{ notFound: true }` to get a 404 page (see `property/[slug].js`).

## Images

- Always build Sanity image URLs with `urlFor(source)` from `sanity.js`, and chain `.auto("format")` (plus `.width/.height/.crop` as needed).
- Add `alt` text to new `<img>` tags. Existing ones have none (see [known-issues](known-issues.md)).

## Styling

- Plain global CSS in `styles/globals.css`, with kebab-case class names (`price-box`, `feed-container`).
- No CSS Modules or CSS-in-JS. Inline style objects are only used for the map container size.
- The font is Noto Sans JP, loaded from Google Fonts with `@import`.

## Lists and keys

- Give every element produced by `.map()` a stable `key` (`_key` for Sanity array items, `_id` for documents), and put it on the **outermost** element returned.

## Helpers

- Pluralise with `isMultiple(n)` from `utils.js` (`review{isMultiple(n)}`). It returns `"s"` for 0 or more than 1.

## Configuration and secrets

- Sanity: `NEXT_PUBLIC_SANITY_PROJECT_ID` (required) and `NEXT_PUBLIC_SANITY_DATASET` (defaults to `production`). The CDN is used only when `NODE_ENV === "production"`.
- Google Maps: read from `process.env.googlePlacesAPI`. New client-side variables should use the `NEXT_PUBLIC_` prefix (see [known-issues](known-issues.md)).
- Never commit `.env*` files.

## Guidance for new code

- Delete debugging `console.log` calls before committing.
- Use optional chaining for Sanity fields that may be missing (`host?.name`), because content editors can leave fields empty.
- Keep page components presentational and do data shaping in `getServerSideProps`.
