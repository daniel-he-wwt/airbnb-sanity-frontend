# Known issues

Issues found while reviewing the code to bootstrap the wiki. Remove an entry once it is fixed, and link the fix.

## Google Maps API key never reaches the browser
- **Affects:** `components/Map.js`, `components/DashboardMap.js`, all environments.
- **Symptoms:** Maps fail to load or show a "development purposes only" / API key error.
- **Cause:** Both components read `process.env.googlePlacesAPI`. Next.js only inlines variables prefixed with `NEXT_PUBLIC_`, or variables declared under `env` in `next.config.js`, and this repo has no `next.config.js`.
- **Workaround:** Add a `next.config.js` with `env: { googlePlacesAPI: process.env.googlePlacesAPI }`, or rename the variable to `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` and update both components. Restrict the key by HTTP referrer in Google Cloud.
- **Tracking:** none yet.

## Home page crashes when there are no properties
- **Affects:** `pages/index.js` → `components/DashboardMap.js`.
- **Symptoms:** A runtime error (`Cannot read property 'location' of undefined`) on an empty dataset.
- **Cause:** `getServerSideProps` returns `properties: []`. That array is truthy, so the page still renders `DashboardMap`, which reads `properties[0].location` without checking that the array has elements.
- **Workaround:** Make sure the dataset has at least one property. To fix: render the map only when `properties.length > 0`, or fall back to a default center.
- **Tracking:** none yet.

## Missing or incomplete fields on Sanity documents crash rendering
- **Affects:** `pages/index.js`, `pages/property/[slug].js`, `components/Review.js`, `components/Map.js`.
- **Symptoms:** Server errors when a document has no `reviews`, `images`, `slug`, `location`, or a review has no `traveller`.
- **Cause:** The code calls `property.reviews.length`, `property.slug.current`, `images.map`, `review.traveller.name` and `location.lat` without guards. The home query `*[ _type == "property"]` also returns whole documents (including drafts if the token allows) with no projection.
- **Workaround:** Fill in every field in Sanity Studio. To fix: add a GROQ projection with defaults (`"reviews": coalesce(reviews, [])`), filter `defined(slug.current)`, and use optional chaining.
- **Tracking:** none yet.

## Map ignores center/zoom; no marker clustering
- **Affects:** `components/Map.js`, `components/DashboardMap.js`.
- **Symptoms:** On load the map may zoom out or jump instead of centring on the property or listings. The "cluster map" from the tutorial does not cluster markers.
- **Cause:** `onLoad` calls `map.fitBounds(new LatLngBounds())` with empty bounds, which overrides `center` and `zoom`. `MarkerClusterer` is never used.
- **Workaround:** Extend the bounds with each marker position before calling `fitBounds`, or remove the call. Wrap the markers in `MarkerClusterer` from `@react-google-maps/api`.
- **Tracking:** none yet.

## React key warnings and a relative link on the home feed
- **Affects:** `pages/index.js`, `components/DashboardMap.js`.
- **Symptoms:** "Each child in a list should have a unique key" warnings in the console. Card links resolve relative to the current URL.
- **Cause:** In the feed, `key` is set on the inner `<div>` instead of on the outermost mapped element (`<Link>`). The `<Marker>` elements have no `key`. `href` is `property/...` with no leading `/`. In Next 10, `<Link>` children should also be an `<a>` for accessibility.
- **Workaround:** Move `key={property._id}` to `<Link>`, add `key` to each `Marker`, use `` href={`/property/${slug}`} ``, and wrap the card in `<a>`.
- **Tracking:** none yet.

## Leftover debug logging and placeholder content
- **Affects:** `pages/index.js`, `pages/property/[slug].js`, both map components.
- **Symptoms:** Noisy `console.log` output on the server and in the browser. Static copy has a typo ("andthe"). Prices are hard-coded in £. The "Change Dates" button just links to `/`. `pages/api/hello.js` is unused boilerplate.
- **Cause:** Leftovers from the tutorial.
- **Workaround:** Ignore them for now. Clean up when the files are next touched.
- **Tracking:** none yet.

## Old dependency versions
- **Affects:** the whole app (`next` 10.1.3, `react` 17, `next-sanity` ^0.1.12).
- **Symptoms:** Possible install or build problems on current Node versions. The `next-sanity` API (`createClient`, `createImageUrlBuilder`) differs from current releases.
- **Cause:** The dependencies are pinned to the versions the tutorial was recorded with.
- **Workaround:** Use a Node LTS version that matches Next 10 (Node 14/16). Plan an upgrade, and when doing it, switch image URLs to `@sanity/image-url`.
- **Tracking:** none yet.
