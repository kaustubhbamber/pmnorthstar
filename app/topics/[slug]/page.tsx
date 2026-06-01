import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SidebarShell } from "@/components/SidebarShell";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { caseStudies } from "@/data/caseStudies";
import { getTopicBySlug, topics, publishedTopics } from "@/data/topics";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SubscribeForm } from "@/components/SubscribeForm";
import { Footer } from "@/components/Footer";
import {
  CASE_STUDY_COUNT,
} from "@/data/inventory-counts";

export const revalidate = 3600;

export function generateStaticParams() {
  return publishedTopics().map((t) => ({ slug: t.slug }));
}

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const topic = getTopicBySlug(params.slug);
  if (!topic) return {};

  return {
    title: `${topic.title} — northstar Topics`,
    description: topic.intro,
  };
}

export default function TopicPage({ params }: PageProps) {
  const topic = getTopicBySlug(params.slug);
  if (!topic) notFound();

  const cases = topic.caseStudyIds
    .map((id) => caseStudies.find((c) => c.id === id))
    .filter(Boolean) as typeof caseStudies;

  const otherTopics = topics.filter((t) => t.slug !== topic.slug);

  return (
    <SidebarShell
      activeNav="home"
      backHref="/"
      backLabelDesktop="Home"
      backLabelMobile="Home"
      shareTitle={`${topic.title} on northstar`}
      shareText={`${topic.title}: ${topic.intro}`}
    >
      <div className="flex flex-col min-w-0">
        {/* Hero */}
        <section
          className="px-4 sm:px-8 lg:px-12 py-10 sm:py-16 flex justify-center"
          style={{ borderBottom: "1.5px solid var(--card-border)" }}
        >
          <div className="w-full max-w-4xl">
            <Breadcrumbs
              className="mb-6"
              items={[
                { label: "northstar", href: "/" },
                { label: "Topics" },
                { label: topic.title },
              ]}
            />
            <span
              className="inline-block text-[10px] sm:text-xs font-bold uppercase px-2.5 py-1 rounded-md mb-4 sm:mb-5"
              style={{
                background: topic.accentColor,
                color: "#ffffff",
                letterSpacing: "0.12em",
              }}
            >
              {topic.eyebrow}
            </span>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] mb-5 sm:mb-6"
              style={{
                color: "var(--text-primary)",
                letterSpacing: "-0.03em",
              }}
            >
              {topic.title}
            </h1>
            <p
              className="text-base sm:text-lg lg:text-xl leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              {topic.intro}
            </p>
          </div>
        </section>

        {/* Case studies grid */}
        <section
          className="px-4 sm:px-8 lg:px-12 py-10 sm:py-14"
          style={{ borderBottom: "1.5px solid var(--card-border)" }}
        >
          <div className="flex items-baseline gap-3 mb-6 sm:mb-8">
            <h2
              className="text-xl sm:text-2xl font-semibold"
              style={{
                color: topic.accentColor,
                letterSpacing: "-0.02em",
              }}
            >
              {cases.length} case studies
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {cases.map((study, idx) => (
              <CaseStudyCard key={study.id} study={study} index={idx} />
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <section
          className="px-4 sm:px-8 lg:px-12 py-8 sm:py-10"
          style={{ borderBottom: "1.5px solid var(--card-border)" }}
        >
          <div className="max-w-2xl mx-auto">
            <SubscribeForm
              variant="card"
              surface="topic"
              headline={`More case studies on ${topic.title.toLowerCase()}, in your inbox.`}
              subhead="One product deep dive every few days. Free. No paywall."
            />
          </div>
        </section>

        {/* FAQ */}
        {topic.faqs && topic.faqs.length > 0 && (
          <section
            className="px-4 sm:px-8 lg:px-12 py-10 sm:py-14 flex justify-center"
            style={{ borderBottom: "1.5px solid var(--card-border)" }}
          >
            <div className="w-full max-w-4xl">
              <h2
                className="text-2xl sm:text-3xl font-semibold mb-6"
                style={{
                  color: "var(--text-primary)",
                  letterSpacing: "-0.02em",
                }}
              >
                Frequently asked
              </h2>
              <div className="space-y-5">
                {topic.faqs.map((faq, i) => (
                  <div key={i}>
                    <h3
                      className="text-base sm:text-lg font-semibold mb-2"
                      style={{
                        color: "var(--text-primary)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {faq.question}
                    </h3>
                    <p
                      className="text-base sm:text-lg leading-relaxed"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Other topics */}
        <section className="px-4 sm:px-8 lg:px-12 py-10 sm:py-14">
          <div className="max-w-5xl">
            <p
              className="eyebrow mb-3"
              style={{ color: "var(--text-muted)" }}
            >
              Other topics
            </p>
            <h2
              className="text-xl sm:text-2xl font-semibold mb-5 sm:mb-6"
              style={{
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
              }}
            >
              Explore more
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {otherTopics.map((t) => (
                <Link
                  key={t.slug}
                  href={`/topics/${t.slug}`}
                  className="playlist-card surface p-4 group"
                  style={
                    {
                      ["--accent-color" as any]: t.accentColor,
                    } as React.CSSProperties
                  }
                >
                  <span
                    className="inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-md mb-2"
                    style={{
                      background: t.accentColor,
                      color: "#ffffff",
                      letterSpacing: "0.12em",
                    }}
                  >
                    {t.eyebrow}
                  </span>
                  <p
                    className="text-base font-semibold leading-snug mb-1.5"
                    style={{
                      color: "var(--text-primary)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {t.title}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {t.caseStudyIds.length} case studies
                  </p>
                </Link>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link href="/" className="btn-ghost inline-flex">
                Browse all {CASE_STUDY_COUNT} case studies
                <ArrowUpRight size={12} strokeWidth={1.6} />
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </SidebarShell>
  );
}
