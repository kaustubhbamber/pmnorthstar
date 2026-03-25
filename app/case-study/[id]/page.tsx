"use client";

import { useState, useEffect } from "react";
import { getCaseStudyById, caseStudies } from "@/data/caseStudies";
import { Sidebar } from "@/components/Sidebar";
import { ArrowLeft, TrendingUp, TrendingDown, Star, Clock, Tag, Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const categoryColors: Record<string, string> = {
  Product: "#9B8FFF",
  Growth: "#FF6B35",
  Strategy: "#F5C842",
  Design: "#50C878",
  Failure: "#FF4B4B",
};

export default function CaseStudyPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const study = getCaseStudyById(id);
  const router = useRouter();

  const [isDark, setIsDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setIsDark(true);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const handleNavChange = (nav: string) => {
    router.push("/");
  };

  // Get prev/next case studies for navigation
  const currentIndex = caseStudies.findIndex((c) => c.id === id);
  const prevStudy = currentIndex > 0 ? caseStudies[currentIndex - 1] : null;
  const nextStudy = currentIndex < caseStudies.length - 1 ? caseStudies[currentIndex + 1] : null;

  if (!study) {
    return (
      <div
        className="h-screen flex items-center justify-center p-4"
        style={{ background: "var(--page-bg)" }}
      >
        <div className="text-center">
          <p className="text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>
            Case study not found
          </p>
          <Link href="/" className="text-sm font-medium" style={{ color: "var(--brand-primary)" }}>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const isFailure = study.category === "Failure";
  const color = categoryColors[study.category] ?? "var(--brand-primary)";
  const paragraphs = study.content.split("\n\n").filter(Boolean);
  const readTime = Math.max(3, Math.ceil(study.content.split(" ").length / 200));

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--page-bg)" }}>
      <Sidebar
        activeNav="casestudies"
        onNavChange={handleNavChange}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header
          className="flex-shrink-0 px-4 sm:px-6 py-3 flex items-center justify-between gap-3"
          style={{ background: "var(--nav-bg)", borderBottom: "1px solid var(--card-border)" }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg lg:hidden"
              style={{ color: "var(--text-primary)" }}
            >
              <Menu size={20} />
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium"
              style={{ color: "var(--text-muted)" }}
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">All Case Studies</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star size={12} className="fill-current" style={{ color: "var(--brand-primary)" }} />
              <span className="text-xs font-bold hidden sm:inline" style={{ color: "var(--text-primary)" }}>North</span>
              <span className="text-xs font-bold hidden sm:inline" style={{ color: "var(--brand-primary)" }}>Star</span>
            </div>
            <button
              onClick={() => setIsDark(!isDark)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium flex-shrink-0"
              style={{ background: "var(--brand-soft)", border: "1px solid rgba(243,18,60,0.2)", color: "var(--brand-primary)" }}
            >
              {isDark ? "Light" : "Dark"}
            </button>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto scroll-container">
          {/* Hero section */}
          <div
            className="px-4 sm:px-8 lg:px-12 py-8 sm:py-10"
            style={{ borderBottom: "1px solid var(--card-border)" }}
          >
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span
                  className="text-xs px-2.5 py-1 rounded-full font-semibold"
                  style={{
                    background: `${color}18`,
                    color: color,
                    border: `1px solid ${color}30`,
                  }}
                >
                  {study.category}
                </span>
                <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-faint)" }}>
                  <Clock size={11} />
                  {readTime} min read
                </span>
                <span className="text-xs" style={{ color: "var(--text-faint)" }}>
                  {study.company} · {study.year}
                </span>
              </div>

              <h1
                className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-4"
                style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
              >
                <span className="mr-3">{study.logo}</span>
                {study.title}
              </h1>

              <p
                className="text-sm sm:text-base lg:text-lg leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                {study.description}
              </p>
            </div>
          </div>

          {/* Content area */}
          <div className="px-4 sm:px-8 lg:px-12 py-8 sm:py-10">
            <div className="max-w-3xl">
              {/* Outcome callout */}
              <div
                className="text-sm px-5 py-4 rounded-xl mb-10 flex items-start gap-3"
                style={{
                  background: isFailure ? "rgba(255,75,75,0.06)" : "rgba(80,200,120,0.06)",
                  border: `1px solid ${isFailure ? "rgba(255,75,75,0.15)" : "rgba(80,200,120,0.15)"}`,
                  color: isFailure ? "#FF4B4B" : "#50C878",
                }}
              >
                {isFailure ? (
                  <TrendingDown size={18} className="mt-0.5 flex-shrink-0" />
                ) : (
                  <TrendingUp size={18} className="mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wide block mb-1" style={{ opacity: 0.7 }}>
                    {isFailure ? "Outcome" : "Impact"}
                  </span>
                  {study.outcome}
                </div>
              </div>

              {/* Article body */}
              <article>
                {paragraphs.map((p, i) => (
                  <p
                    key={i}
                    className="text-sm sm:text-base lg:text-lg leading-[1.85] mb-6"
                    style={{ color: "var(--text-primary)", opacity: 0.88 }}
                  >
                    {p}
                  </p>
                ))}
              </article>

              {/* Tags */}
              <div
                className="flex flex-wrap items-center gap-2 py-6 mt-4"
                style={{ borderTop: "1px solid var(--card-border)" }}
              >
                <Tag size={13} style={{ color: "var(--text-faint)" }} />
                {study.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-lg"
                    style={{
                      background: "var(--tag-bg)",
                      color: "var(--text-muted)",
                      border: "1px solid var(--card-border)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Prev / Next navigation */}
              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-8"
                style={{ borderTop: "1px solid var(--card-border)" }}
              >
                {prevStudy ? (
                  <Link
                    href={`/case-study/${prevStudy.id}`}
                    className="p-4 rounded-xl case-card"
                    style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
                  >
                    <span className="text-xs block mb-1.5" style={{ color: "var(--text-faint)" }}>
                      ← Previous
                    </span>
                    <span className="text-sm font-semibold line-clamp-2" style={{ color: "var(--text-primary)" }}>
                      {prevStudy.logo} {prevStudy.title}
                    </span>
                  </Link>
                ) : (
                  <div />
                )}
                {nextStudy ? (
                  <Link
                    href={`/case-study/${nextStudy.id}`}
                    className="p-4 rounded-xl text-right case-card"
                    style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
                  >
                    <span className="text-xs block mb-1.5" style={{ color: "var(--text-faint)" }}>
                      Next →
                    </span>
                    <span className="text-sm font-semibold line-clamp-2" style={{ color: "var(--text-primary)" }}>
                      {nextStudy.title} {nextStudy.logo}
                    </span>
                  </Link>
                ) : (
                  <div />
                )}
              </div>

              {/* Back to all */}
              <div className="text-center pb-12">
                <Link
                  href="/"
                  className="text-xs font-medium px-4 py-2 rounded-lg inline-block"
                  style={{ background: "var(--brand-soft)", color: "var(--brand-primary)", border: "1px solid rgba(243,18,60,0.2)" }}
                >
                  Browse all case studies
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
