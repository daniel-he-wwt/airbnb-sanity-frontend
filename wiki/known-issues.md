# Known issues

Issues found by reading the code while bootstrapping this wiki. None is tracked in an issue tracker yet. Remove an entry once it is fixed and link the fix.

## Google Maps API key is not available in the browser
- **Affects:** `components/Map.js`, `components/DashboardMap.js`
- **Symptoms:** Maps show a "for development purposes only" overlay or fail to load. The console reports a missing or invalid API key.
- **Cause:** The key is read from `process.env.googlePlacesAPI`. Next.js only inlines env vars into client code when they are prefixed with `NEXT_PUBLIC_` or declared in `next.config.js` `env`, and the repo has no `next.config.js`.
- **Workaround:** Add a `next.config.js` with `env: { googlePlacesAPI: process.env.googlePlacesAPI }`, or rename the variable to `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` and update both components.
- **Tracking:** none yet.

## Home page crashes when there are no properties
- **Affects:** `/` (`pages/index.js` → `DashboardMap`)
- **Symptoms:** The page throws `Cannot read property 'location' of undefined` when the dataset has no `property` documents.
- **Cause:** `getServerSideProps` returns `properties: []`, and `[]` is truthy, so the page still renders `DashboardMap`. That component reads `properties[0].location` without checking the array is non-empty.
- **Workaround:** Render the map only when `properties.length > 0`, or guard inside `DashboardMap`.
- **Tracking:** none yet.

## Pages crash on missing optional content
- **Affects:** `pages/index.js`, `pages/property/[slug].js`, `components/Review.js`
- **Symptoms:** Server-side rendering errors when a property has no `reviews` or `images`, or when a review has no `traveller`.
- **Cause:** The code calls `property.reviews.length`, `reviews.length`, `images.map` and `review.traveller.name` without null checks.
- **Workaround:** Give every property document at least one review and one image in Sanity. To fix, default to `[]` and use optional chaining.
- **Tracking:** none yet.

## React "missing key" warnings in lists
- **Affects:** `pages/index.js`, `components/DashboardMap.js`
- **Symptoms:** The console warns that each child in a list should have a unique "key" prop.
- **Cause:** On the home page, `key` is set on the inner `<div>` instead of the outer `<Link>`. Markers in `DashboardMap` have no `key` at all.
- **Workaround:** Move `key={property._id}` onto `<Link>`, and add `key={property._id}` to each `<Marker>`.
- **Tracking:** none yet.

## Map ignores its center and zoom (fitBounds on empty bounds)
- **Affects:** `components/Map.js`, `components/DashboardMap.js`
- **Symptoms:** After loading, the map may jump to an unexpected viewport instead of staying centred on the property or properties.
- **Cause:** `onLoad` calls `map.fitBounds(new LatLngBounds())` with bounds that contain no points. This is boilerplate copied from the library README.
- **Workaround:** Remove the `fitBounds` call. For the dashboard, `extend` the bounds with every property location before fitting.
- **Tracking:** none yet.

## Leftover debug logging
- **Affects:** `pages/index.js`, `pages/property/[slug].js`, `components/Map.js`, `components/DashboardMap.js`
- **Symptoms:** The browser and server consoles fill with property data and duplicated `location.lat` logs.
- **Cause:** `console.log` calls were left over from the tutorial.
- **Workaround:** Ignore them for now. Remove them as part of any change to these files.
- **Tracking:** none yet.

## Minor UI and content problems
- **Affects:** `pages/property/[slug].js`, `components/*`
- **Symptoms and cause:**
  - The house-rules copy contains the typo "andthe".
  - The "Change Dates" button only links back to `/`.
  - `<img>` tags have no `alt` text (an accessibility gap).
  - The layout is not responsive.
  - `pages/api/hello.js` is unused boilerplate.
- **Workaround:** None needed. These are cosmetic.
- **Tracking:** none yet.

## Outdated dependencies and missing env documentation
- **Affects:** whole project
- **Symptoms:**
  - The project pins Next.js 10.1.3, React 17 and `next-sanity` 0.1.x, which are well behind current releases and may not install cleanly on newer Node versions.
  - There is no `.env.example`, so new developers have to work out which env vars are required.
- **Cause:** The project is a tutorial snapshot.
- **Workaround:** Create `.env.local` with:
  - `NEXT_PUBLIC_SANITY_PROJECT_ID` (required)
  - `NEXT_PUBLIC_SANITY_DATASET` (optional, default `production`)
  - the Google Maps key (see the first issue)

  Use a Node LTS version that Next 10 supports (for example Node 14 or 16).
- **Tracking:** none yet.
