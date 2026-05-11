import type { MetadataRoute } from "next";
import { caseStudies, getCaseStudySlug } from "@/data/caseStudies";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pmnorthstar.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

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
  ];

  for (const study of caseStudies) {
    routes.push({
      url: `${SITE_URL}/case-study/${getCaseStudySlug(study.id)}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  return routes;
}
