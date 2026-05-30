import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import {
  caseStudies,
  getCaseStudyById,
  getCaseStudyBySlug,
  getCaseStudySlug,
  isLegacyId,
} from "@/data/caseStudies";
import { getCaseStudyFaqs } from "@/data/caseStudyFaqs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pmnorthstar.in";

// ISR: refresh hourly so a scheduled (future-dated) case study's page +
// metadata go live on its publishedAt date without a redeploy.
export const revalidate = 3600;

// Prerender every case study at its slug URL (not cs-X).
// The [id] route param now holds a slug; legacy cs-X params are
// 301-redirected by the layout component below.
export async function generateStaticParams() {
  return caseStudies.map((c) => ({ id: getCaseStudySlug(c.id) }));
}

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  // Resolve the study by slug first; fall back to ID for legacy URLs.
  const study =
    getCaseStudyBySlug(params.id) ||
    (isLegacyId(params.id) ? getCaseStudyById(params.id) : undefined);

  if (!study) {
    return { title: "Case study not found" };
  }
  const slug = getCaseStudySlug(study.id);
  const url = `${SITE_URL}/case-study/${slug}`;
  // If the natural title is already long, drop the ' | northstar'
  // template suffix so the SERP title stays under 60 chars and doesn't
  // get truncated mid-word. Brand is still in the URL, OG, and JSON-LD.
  const SUFFIX_LEN = " | northstar".length;
  const titleField =
    study.title.length + SUFFIX_LEN > 60
      ? { absolute: study.title }
      : study.title;
  return {
    title: titleField,
    description: study.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: study.title,
      description: study.description,
      siteName: "northstar",
      publishedTime: `${study.year}-01-01`,
      tags: study.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: study.title,
      description: study.description,
    },
  };
}

export default function CaseStudyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  // Legacy cs-X URL? 301-redirect to the slug URL for SEO equity transfer.
  if (isLegacyId(params.id)) {
    const study = getCaseStudyById(params.id);
    if (study) {
      const slug = getCaseStudySlug(study.id);
      // permanentRedirect issues a 308 (which Google treats as 301 equivalent).
      permanentRedirect(`/case-study/${slug}`);
    }
  }

  const study = getCaseStudyBySlug(params.id);
  const slug = study ? getCaseStudySlug(study.id) : params.id;
  const faqs = study ? getCaseStudyFaqs(study.id) : [];

  return (
    <>
      {study && (
        <>
          <script
            id="ld-article"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                headline: study.title,
                description: study.description,
                datePublished: `${study.year}-01-01`,
                author: { "@type": "Organization", name: "northstar" },
                publisher: {
                  "@type": "Organization",
                  name: "northstar",
                  url: SITE_URL,
                },
                about: study.company,
                keywords: study.tags.join(", "),
                articleSection: study.category,
                mainEntityOfPage: {
                  "@type": "WebPage",
                  "@id": `${SITE_URL}/case-study/${slug}`,
                },
              }),
            }}
          />
          {/* Only emit FAQPage when the study actually has FAQs. An
              empty mainEntity[] is malformed JSON-LD and Google was
              flagging case studies as "Duplicate field FAQPage". Stable
              id lets Google dedupe if React's RSC stream surfaces the
              same content twice during hydration. */}
          {faqs.length > 0 && (
            <script
              id="ld-faq"
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: faqs.map((f) => ({
                    "@type": "Question",
                    name: f.question,
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: f.answer,
                    },
                  })),
                }),
              }}
            />
          )}
          <script
            id="ld-breadcrumbs"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "northstar",
                    item: SITE_URL,
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Case Studies",
                    item: `${SITE_URL}/#casestudies`,
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: study.title,
                    item: `${SITE_URL}/case-study/${slug}`,
                  },
                ],
              }),
            }}
          />
        </>
      )}
      {children}
    </>
  );
}
