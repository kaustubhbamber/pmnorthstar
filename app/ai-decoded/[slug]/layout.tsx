import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAIDecodedArticleBySlug,
  getAllAIDecodedSlugs,
} from "@/lib/ai-decoded";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pmnorthstar.in";

// ISR: refresh metadata/JSON-LD hourly so a scheduled article's SEO data
// appears on its publish date without a redeploy.
export const revalidate = 3600;

export async function generateStaticParams() {
  return getAllAIDecodedSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = getAIDecodedArticleBySlug(params.slug);
  if (!article) return { title: "AI Decoded — not found" };
  const fm = article.frontmatter;
  const url = `${SITE_URL}/ai-decoded/${fm.slug}`;
  const seoTitle = fm.metaTitle ?? fm.title;
  // Drop the ' | northstar' suffix if the natural title is already long.
  const titleField =
    seoTitle.length + " | northstar".length > 60
      ? { absolute: seoTitle }
      : seoTitle;
  return {
    title: titleField,
    description: fm.excerpt,
    keywords: [fm.primaryKeyword, ...fm.longTailKeywords],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: fm.title,
      description: fm.excerpt,
      siteName: "northstar",
      publishedTime: fm.publishedAt,
      modifiedTime: fm.updatedAt ?? fm.publishedAt,
      tags: fm.tags,
      ...(fm.heroImage ? { images: [{ url: fm.heroImage.src }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fm.title,
      description: fm.excerpt,
      ...(fm.heroImage ? { images: [fm.heroImage.src] } : {}),
    },
  };
}

export default function AIDecodedArticleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const article = getAIDecodedArticleBySlug(params.slug);
  if (!article) notFound();
  const fm = article.frontmatter;
  const url = `${SITE_URL}/ai-decoded/${fm.slug}`;
  return (
    <>
      {/* Article schema — AEO/GEO citation hook */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: fm.title,
            description: fm.excerpt,
            datePublished: fm.publishedAt,
            dateModified: fm.updatedAt ?? fm.publishedAt,
            author: { "@type": "Organization", name: "northstar" },
            publisher: {
              "@type": "Organization",
              name: "northstar",
              url: SITE_URL,
            },
            articleSection: fm.category,
            keywords: [fm.primaryKeyword, ...fm.longTailKeywords].join(", "),
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
            ...(fm.heroImage ? { image: fm.heroImage.src } : {}),
            wordCount: article.wordCount,
            timeRequired: `PT${article.readTime}M`,
          }),
        }}
      />
      {/* BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "northstar", item: SITE_URL },
              { "@type": "ListItem", position: 2, name: "AI Decoded", item: `${SITE_URL}/ai-decoded` },
              { "@type": "ListItem", position: 3, name: fm.title, item: url },
            ],
          }),
        }}
      />
      {/* FAQPage — eligible for People-Also-Ask rich snippets */}
      {fm.faqs && fm.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: fm.faqs.map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer },
              })),
            }),
          }}
        />
      )}
      {children}
    </>
  );
}
