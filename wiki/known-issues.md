# Known Issues

Bugs, risks and tech debt found in a code review when the wiki was bootstrapped. Severity: **High** (crash or broken feature), **Medium** (incorrect behaviour or a risk), **Low** (cleanup).

## High

### Google Maps API key does not reach the browser
- **Where:** `components/Map.js`, `components/DashboardMap.js` (`process.env.googlePlacesAPI`)
- **Problem:** Next.js only inlines env vars into client bundles if they start with `NEXT_PUBLIC_` or are mapped in `next.config.js`. The repo has no `next.config.js`, so in the browser the key is `undefined` and the maps fail to load or show a "development purposes only" watermark.
- **Fix:** Rename the variable to `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (or add an `env` mapping in `next.config.js`) and document it.

### Home page crashes when there are no properties
- **Where:** `components/DashboardMap.js` (`properties[0].location`), `pages/index.js`
- **Problem:** `getServerSideProps` returns `properties: []` when there is no content. `[]` is truthy, so `DashboardMap` still renders and `properties[0].location` throws a TypeError.
- **Fix:** Render the feed and map only when `properties.length > 0`, and fall back to a default map center.

### Crashes on missing optional Sanity fields
- **Where:** `pages/index.js` (`property.reviews.length`, `property.slug.current`), `pages/property/[slug].js` (`reviews.length`, `images.map`), `components/Review.js` (`review.traveller.name`), `components/Map.js` (`location.lat`)
- **Problem:** A property saved without reviews, images, a slug or a location, or a review without a traveller, crashes rendering.
- **Fix:** Default the arrays (`reviews ?? []`), use optional chaining, and filter out incomplete documents in GROQ (`defined(slug.current)`).

## Medium

### Map `onLoad` overrides center and zoom with empty bounds
- **Where:** `Map.js`, `DashboardMap.js` (`map.fitBounds(new LatLngBounds())`)
- **Problem:** The bounds object never gets any points, so `fitBounds` can override `center`/`zoom={10}` and leave the map badly positioned.
- **Fix:** Extend the bounds with each marker position before calling `fitBounds`, or drop `fitBounds` and rely on `center`/`zoom`.

### Missing or misplaced React keys
- **Where:** `DashboardMap.js` (`<Marker>` in `properties.map` has no key), `pages/index.js` (key is on the inner `div` instead of the outer `<Link>`)
- **Fix:** Put `key={property._id}` on the outermost element returned from `map`.

### Links and accessibility
- **Where:** `pages/index.js`, `pages/property/[slug].js`
- **Problem:** `<Link>` wraps a `<div>` instead of an `<a>`, so the cards are not real links for keyboard and screen-reader users. The home link uses a relative `property/${slug}` with no leading `/`. No `<img>` has `alt` text.
- **Fix:** Use `<Link href={`/property/${slug}`}><a>…</a></Link>` and add `alt` attributes.

### No marker clustering
- **Where:** `DashboardMap.js`
- **Problem:** The README lists "Clustering Markers", but every property gets its own marker.
- **Fix:** Use `MarkerClusterer` from `@react-google-maps/api`.

### Outdated dependencies
- **Problem:** Next 10.1.3, React 17 and `next-sanity` 0.1.x are several major versions behind. `createImageUrlBuilder` from `next-sanity` has since been replaced by `@sanity/image-url`.
- **Fix:** Plan an upgrade, and expect API changes in `sanity.js`.

### No linting, tests or CI
- **Problem:** `package.json` has only `dev`/`build`/`start`. Nothing catches regressions like the ones above.

## Low

- **Leftover `console.log` calls** in `index.js`, `[slug].js`, `Map.js` and `DashboardMap.js`, some duplicated.
- **Unused code:** the `map` state in both map components, the `index`/`image` callback params, and the boilerplate `pages/api/hello.js`.
- **Duplicated map components:** `Map` and `DashboardMap` are nearly identical and could be merged into one component that takes a list of locations.
- **Global `google` reference:** `new google.maps.Point(...)` relies on a global. Use `window.google` for consistency.
- **Hardcoded content:** the amenities, cleaning and house-rules text and the `£` currency are hardcoded. The "Change Dates" button just links to `/`.
- **Typo:** "andthe" in the house rules text in `[slug].js`.
- **CSS:** `.nav` has `position: sticky` but no `top`, so it doesn't stick. There are no media queries, so the layout isn't responsive. The home query `*[_type == "property"]` fetches every field when a projection would be enough.
