// Brand-level editorial identity. We deliberately credit the site,
// not an individual — every piece is hand-curated and edited but the
// prose is AI-assisted, and faking a personal byline would be
// dishonest. 'northstar editorial' attaches accountability to the
// brand without inventing a person.

export const SITE_INFO = {
  brand: "northstar",
  byline: "northstar editorial",
  shortDescription:
    "Curated free product management library — case studies, book reviews, and playlists. Hand-picked, edited, opinionated. No paywall.",
  // Optional brand-level channels (not personal). Filled-in URLs are
  // rendered on the About page contact block.
  twitter: "", // e.g. "https://twitter.com/pmnorthstar"
  email: "", // e.g. "hello@pmnorthstar.in"
};

// Bumped manually when editorial content gets a meaningful refresh.
// Surfaces as the "Updated X" line in the byline.
export const SITE_LAST_REVIEWED = "2026-05-18";
