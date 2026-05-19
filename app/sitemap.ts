import type { MetadataRoute } from "next";
import {
  caseStudies,
  getCaseStudySlug,
  CASE_STUDIES_LAST_UPDATED,
} from "@/data/caseStudies";
import { topics } from "@/data/topics";
import { comparisons } from "@/data/comparisons";
import { books, getBookSlug, BOOKS_LAST_UPDATED } from "@/data/books";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pmnorthstar.in";

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
  ];

  for (const study of caseStudies) {
    routes.push({
      url: `${SITE_URL}/case-study/${getCaseStudySlug(study.id)}`,
      lastModified: casesUpdated,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // Topic hubs — category-level pages aggregating related case studies.
  for (const topic of topics) {
    routes.push({
      url: `${SITE_URL}/topics/${topic.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  // Comparison pages — capture "X vs Y" search queries.
  for (const cmp of comparisons) {
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

  return routes;
}
