# Known issues

> One entry per issue. Remove an entry once it is fixed and link the fix.
> These were found by reading the code when the wiki was bootstrapped. None of them has a tracking issue yet.

## Google Maps API key does not reach the browser
- **Affects:** `components/Map.js` and `components/DashboardMap.js`, in every environment.
- **Symptoms:** The maps fail to load or show a "For development purposes only" / API-key error.
- **Cause:** The key is read as `process.env.googlePlacesAPI`. Next.js only inlines variables prefixed with `NEXT_PUBLIC_`, or ones declared in the `env` field of `next.config.js`, into client bundles. The repo has no `next.config.js`.
- **Workaround:** Add a `next.config.js` with `env: { googlePlacesAPI: process.env.googlePlacesAPI }`, or rename the variable to `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in both components. Either way, put the key in `.env.local`.
- **Tracking:** none yet.

## Home page crashes when Sanity has no properties
- **Affects:** `pages/index.js` and `components/DashboardMap.js`.
- **Symptoms:** A `TypeError: Cannot read property 'location' of undefined` when the dataset is empty or the project ID is wrong.
- **Cause:** `getServerSideProps` returns `properties: []`. The `properties && …` guard is still true for an empty array, so `DashboardMap` reads `properties[0].location`.
- **Workaround:** Guard with `properties?.length > 0`, or use `properties[0]?.location` in `DashboardMap`. Make sure the dataset has at least one `property`.
- **Tracking:** none yet.

## Crashes when optional Sanity fields are missing
- **Affects:** `pages/index.js`, `pages/property/[slug].js` and `components/Review.js`.
- **Symptoms:** Server errors on a property that has no reviews, no `images`, no `location` or a review with no traveller.
- **Cause:** The code calls fields directly with no null checks:
  - `property.reviews.length` and `reviews.length` with no fallback
  - `images.map(...)`
  - `location.lat` in `Map`
  - `review.traveller.name` in `Review`
- **Workaround:** Make these fields required in the Sanity schema, or default them (`reviews = []`, `images = []`) and use optional chaining.
- **Tracking:** none yet.

## Maps ignore the given center and zoom
- **Affects:** `Map.js` and `DashboardMap.js`.
- **Symptoms:** The map can open zoomed out or centred in the wrong place instead of on the listing(s).
- **Cause:** `onLoad` calls `map.fitBounds(new LatLngBounds())` with empty bounds (code copied from the library example). This overrides `center` and `zoom={10}`.
- **Workaround:** Remove the `fitBounds` call, or call `bounds.extend(...)` for each marker position before fitting.
- **Tracking:** none yet.

## React `key` warnings in list renders
- **Affects:** `pages/index.js` and `components/DashboardMap.js`.
- **Symptoms:** "Each child in a list should have a unique key prop" warnings in the console.
- **Cause:** In `index.js` the `key` is on the inner `<div>` instead of the outer `<Link>`. The `Marker`s in `DashboardMap` have no `key` at all.
- **Workaround:** Move `key={property._id}` to `<Link>` and add `key={property._id}` to each `Marker`.
- **Tracking:** none yet.

## Debug logging and leftover boilerplate
- **Affects:** `pages/index.js`, `pages/property/[slug].js`, `Map.js`, `DashboardMap.js` and `pages/api/hello.js`.
- **Symptoms:** Noisy server and browser consoles. Some lines are logged twice. A sample `/api/hello` endpoint is publicly reachable.
- **Cause:** Leftovers from the tutorial.
- **Workaround:** Remove the `console.log` calls and `pages/api/hello.js`. These are harmless meanwhile.
- **Tracking:** none yet.

## Accessibility and content gaps
- **Affects:** UI components and the property page.
- **Symptoms:**
  - `<img>` tags have no `alt`
  - `<Link>` wraps a `<div>` instead of an `<a>`, so links are not proper anchors in Next 10
  - the "Enhanced Clean", amenities and house-rules text is hardcoded (with the typo "andthe")
  - "Change Dates" just links home
  - prices are hardcoded in £
- **Cause:** This is tutorial-level UI.
- **Workaround:** None needed for development. Fix these before using the app as a real product.
- **Tracking:** none yet.

## Performance: SSR on every request and over-fetching
- **Affects:** `pages/index.js`.
- **Symptoms:** Slow page loads as the dataset grows.
- **Cause:** The query `*[_type == "property"]` returns every field of every property, with no projection or pagination. It runs on each request through `getServerSideProps` (see ADR-003 in [architecture-decisions.md](architecture-decisions.md)).
- **Workaround:** Project only the fields the cards need (`_id, title, slug, mainImage, pricePerNight, location, "reviewCount": count(reviews)`). Consider `getStaticProps` with `revalidate`.
- **Tracking:** none yet.

## Outdated dependencies
- **Affects:** The whole project (Next.js `10.1.3`, React `17.0.2`, `next-sanity ^0.1.12`).
- **Symptoms:** Install warnings, possible security advisories, and incompatibility with newer Node versions.
- **Cause:** The versions were pinned when the tutorial was recorded.
- **Workaround:** Use Node 14/16 for local development. Plan a planned upgrade. Note that newer `next-sanity` releases removed `createImageUrlBuilder` in favour of `@sanity/image-url`.
- **Tracking:** none yet.
