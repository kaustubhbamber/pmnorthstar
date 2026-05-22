import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { topics, getTopicBySlug } from "@/data/topics";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pmnorthstar.in";

export async function generateStaticParams() {
  return topics.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const topic = getTopicBySlug(params.slug);
  if (!topic) return { title: "Topic not found" };
  const url = `${SITE_URL}/topics/${topic.slug}`;
  return {
    title: topic.metaTitle,
    description: topic.metaDescription,
    keywords: topic.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: topic.metaTitle,
      description: topic.metaDescription,
      siteName: "northstar",
    },
    twitter: {
      card: "summary_large_image",
      title: topic.metaTitle,
      description: topic.metaDescription,
    },
  };
}

export default function TopicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const topic = getTopicBySlug(params.slug);
  if (!topic) notFound();
  const url = `${SITE_URL}/topics/${topic.slug}`;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: topic.title,
            description: topic.metaDescription,
            url,
            isPartOf: { "@type": "WebSite", name: "northstar", url: SITE_URL },
          }),
        }}
      />
      {/* BreadcrumbList — matches the visible breadcrumbs on the page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "northstar", item: SITE_URL },
              { "@type": "ListItem", position: 2, name: "Topics", item: `${SITE_URL}/#explore` },
              { "@type": "ListItem", position: 3, name: topic.title, item: url },
            ],
          }),
        }}
      />
      {/* FAQPage — eligible for People-Also-Ask rich snippets */}
      {topic.faqs && topic.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: topic.faqs.map((f) => ({
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
