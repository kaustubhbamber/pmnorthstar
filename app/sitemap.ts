import type { MetadataRoute } from "next";
import {
  publishedCaseStudies,
  getCaseStudySlug,
  CASE_STUDIES_LAST_UPDATED,
} from "@/data/caseStudies";
import { publishedTopics } from "@/data/topics";
import { publishedComparisons } from "@/data/comparisons";
import { books, getBookSlug, BOOKS_LAST_UPDATED } from "@/data/books";
import { getAllAIDecodedArticles } from "@/lib/ai-decoded";
import { publishedDrills } from "@/data/drills";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pmnorthstar.in";

// Revalidate hourly (ISR) so scheduled (future-dated) content enters the
// sitemap on its publish date without a redeploy.
export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  // Index-level pages reflect today (they aggregate dynamic content
  // so 'now' is honest). Detail pages use a per-dataset content-updated
  // date that we manually bump when the underlying content changes —
  // emitting today's date for static content on every build lies to
  // Google about how fresh the page actually is.
  const now = new Date();
  const booksUpdated = new Date(BOOKS_LAST_UPDATED);
  const casesUpdated = new Date(CASE_STUDIES_LAST_UPDATED);

  const routes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/india`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/checkit`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/simulate`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
  ];

  for (const study of publishedCaseStudies(now)) {
    routes.push({
      url: `${SITE_URL}/case-study/${getCaseStudySlug(study.id)}`,
      lastModified: casesUpdated,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // Topic hubs — category-level pages aggregating related case studies.
  for (const topic of publishedTopics(now)) {
    routes.push({
      url: `${SITE_URL}/topics/${topic.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  // Comparison pages — capture "X vs Y" search queries.
  for (const cmp of publishedComparisons(now)) {
    routes.push({
      url: `${SITE_URL}/compare/${cmp.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.75,
    });
  }

  // Book detail pages — full 7-paragraph review + Amazon affiliate link per book.
  for (const book of books) {
    routes.push({
      url: `${SITE_URL}/book/${getBookSlug(book)}`,
      lastModified: booksUpdated,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // AI Decoded — index + per-article. Higher priority than evergreen
  // content because the section is time-sensitive; we want Google to
  // re-crawl it more often.
  routes.push({
    url: `${SITE_URL}/ai-decoded`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  });
  for (const article of getAllAIDecodedArticles()) {
    routes.push({
      url: `${SITE_URL}/ai-decoded/${article.frontmatter.slug}`,
      lastModified: new Date(
        article.frontmatter.updatedAt ?? article.frontmatter.publishedAt
      ),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  // SimulateIt drills — only those whose publishedAt has passed.
  // Future-dated drills are intentionally excluded so crawlers never
  // see them before the launch moment, matching the on-site behavior.
  for (const drill of publishedDrills(now)) {
    routes.push({
      url: `${SITE_URL}/simulate/${drill.slug}`,
      lastModified: new Date(drill.publishedAt),
      changeFrequency: "monthly",
      priority: 0.75,
    });
  }

  return routes;
}
