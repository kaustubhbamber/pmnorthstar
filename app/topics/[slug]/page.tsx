"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MobileNav } from "@/components/MobileNav";
import { ShareButton } from "@/components/ShareButton";
import { Footer } from "@/components/Footer";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { caseStudies } from "@/data/caseStudies";
import { getTopicBySlug, topics } from "@/data/topics";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArrowLeft, ArrowUpRight, Menu } from "lucide-react";

export default function TopicPage({ params }: { params: { slug: string } }) {
  const topic = getTopicBySlug(params.slug);
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setIsDark(true);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light"
    );
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  if (!topic) {
    notFound();
  }

  const handleNavChange = (nav: string) => {
    if (nav === "home" || nav === "library") router.push("/");
    else router.push(`/#${nav}`);
  };

  const cases = topic.caseStudyIds
    .map((id) => caseStudies.find((c) => c.id === id))
    .filter(Boolean) as typeof caseStudies;

  // Related topics for cross-linking (everything except current)
  const otherTopics = topics.filter((t) => t.slug !== topic.slug);

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "var(--page-bg)" }}
    >
      <Sidebar
        activeNav="home"
        onNavChange={handleNavChange}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header
          className="flex-shrink-0 px-4 sm:px-6 py-3 flex items-center justify-between gap-3"
          style={{
            background: "var(--nav-bg)",
            borderBottom: "1px solid var(--card-border)",
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg lg:hidden flex-shrink-0"
              style={{ color: "var(--text-primary)" }}
            >
              <Menu size={20} />
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium flex-shrink-0"
              style={{ color: "var(--text-muted)" }}
            >
              <ArrowLeft size={14} strokeWidth={1.6} />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <ShareButton
              title={`${topic.title} — northstar topic`}
              text={`${topic.title}: ${topic.intro}`}
              compact
            />
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
          </div>
        </header>

        <MobileNav activeNav="" onNavChange={handleNavChange} />

        <main className="flex-1 overflow-y-auto scroll-container">
          {/* Hero */}
          <section
            className="dot-grid px-4 sm:px-8 lg:px-12 py-10 sm:py-16"
            style={{ borderBottom: "1px solid var(--card-border)" }}
          >
            <div className="max-w-3xl">
              <Breadcrumbs
                className="mb-5"
                items={[
                  { label: "northstar", href: "/" },
                  { label: "Topics" },
                  { label: topic.title },
                ]}
              />
              <p
                className="eyebrow mb-3 sm:mb-4"
                style={{ color: topic.accentColor }}
              >
                {topic.eyebrow}
              </p>
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] mb-4 sm:mb-5"
                style={{
                  color: "var(--text-primary)",
                  letterSpacing: "-0.03em",
                }}
              >
                {topic.title}
              </h1>
              <p
                className="text-sm sm:text-base lg:text-lg leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                {topic.intro}
              </p>
            </div>
          </section>

          {/* Case studies grid */}
          <section
            className="px-4 sm:px-8 lg:px-12 py-10 sm:py-14"
            style={{ borderBottom: "1px solid var(--card-border)" }}
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

          {/* FAQ — captures category-level long-tail queries.
              FAQPage JSON-LD eligible for People-Also-Ask rich snippets. */}
          {topic.faqs && topic.faqs.length > 0 && (
            <section
              className="px-4 sm:px-8 lg:px-12 py-10 sm:py-14"
              style={{ borderBottom: "1px solid var(--card-border)" }}
            >
              <div className="max-w-3xl">
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
                        className="text-sm sm:text-base leading-relaxed"
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

          {/* Other topics — cross-link for internal SEO */}
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
                    <p
                      className="text-[11px] font-medium uppercase tracking-wider mb-2"
                      style={{ color: t.accentColor, opacity: 0.85 }}
                    >
                      {t.eyebrow}
                    </p>
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
                  Browse all {caseStudies.length} case studies
                  <ArrowUpRight size={12} strokeWidth={1.6} />
                </Link>
              </div>
            </div>
          </section>
          <Footer />
        </main>
      </div>
    </div>
  );
}
