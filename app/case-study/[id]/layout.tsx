import type { Metadata } from "next";
import { getCaseStudyById, caseStudies } from "@/data/caseStudies";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pmnorthstar.vercel.app";

export async function generateStaticParams() {
  return caseStudies.map((c) => ({ id: c.id }));
}

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const study = getCaseStudyById(params.id);
  if (!study) {
    return { title: "Case study not found" };
  }
  const url = `${SITE_URL}/case-study/${study.id}`;
  return {
    title: study.title,
    description: study.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: study.title,
      description: study.description,
      siteName: "NorthStar",
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
  const study = getCaseStudyById(params.id);

  return (
    <>
      {study && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                headline: study.title,
                description: study.description,
                datePublished: `${study.year}-01-01`,
                author: { "@type": "Organization", name: "NorthStar" },
                publisher: {
                  "@type": "Organization",
                  name: "NorthStar",
                  url: SITE_URL,
                },
                about: study.company,
                keywords: study.tags.join(", "),
                articleSection: study.category,
                mainEntityOfPage: {
                  "@type": "WebPage",
                  "@id": `${SITE_URL}/case-study/${study.id}`,
                },
              }),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "NorthStar",
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
                    item: `${SITE_URL}/case-study/${study.id}`,
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
