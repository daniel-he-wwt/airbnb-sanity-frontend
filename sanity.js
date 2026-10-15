import { createClient, createImageUrlBuilder } from "next-sanity"

const config = {
  /**
   * Find your project ID and dataset in `sanity.json` in your studio project.
   * These are considered “public”, but you can use environment variables
   * if you want differ between local dev and production.
   *
   * https://nextjs.org/docs/basic-features/environment-variables
   **/
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  useCdn: process.env.NODE_ENV === "production",
  /**
   * Set useCdn to `false` if your application require the freshest possible
   * data always (potentially slightly slower and a bit more expensive).
   * Authenticated request (like preview) will always bypass the CDN
   **/
}
/**
 * Set up a helper function for generating Image URLs with only the asset reference data in your documents.
 * Read more: https://www.sanity.io/docs/image-url
 **/
export const urlFor = (source) => createImageUrlBuilder(config).image(source)

// Set up the client for fetching data in the getProps page functions
export const sanityClient = createClient(config)

/**
 * A separate, authenticated client used for mutations (create/update/delete).
 * Requires a `SANITY_API_TOKEN` environment variable with write access to be
 * set on the server. This client should only ever be used server-side (e.g.
 * inside API routes), never exposed to the browser.
 **/
export const sanityWriteClient = createClient({
  ...config,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})
