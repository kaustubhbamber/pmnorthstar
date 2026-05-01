"use client";

import { useState, useEffect } from "react";
import { getCaseStudyById, caseStudies } from "@/data/caseStudies";
import { Sidebar } from "@/components/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowLeft, ArrowUpRight, TrendingUp, TrendingDown, Clock, Menu } from "lucide-react";
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

  const handleNavChange = () => router.push("/");

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
          <p className="eyebrow mb-2">// 404</p>
          <p className="text-lg font-bold mb-3" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            Case study not found
          </p>
          <Link href="/" className="btn-ghost">
            <ArrowLeft size={12} strokeWidth={1.6} /> Back home
          </Link>
        </div>
      </div>
    );
  }

  const isFailure = study.category === "Failure";
  const color = categoryColors[study.category] ?? "var(--brand-primary)";
  const paragraphs = study.content.split("\n\n").filter(Boolean);
  const readTime = Math.max(3, Math.ceil(study.content.split(" ").length / 200));
  const indexLabel = String(currentIndex + 1).padStart(2, "0");

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--page-bg)" }}>
      <Sidebar
        activeNav="casestudies"
        onNavChange={handleNavChange}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
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
            <Link href="/" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider"
              style={{ color: "var(--text-muted)", letterSpacing: "0.12em" }}>
              <ArrowLeft size={12} strokeWidth={1.6} />
              <span className="hidden sm:inline">Case studies</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px]" style={{ color: "var(--text-faint)", letterSpacing: "0.08em" }}>
              {indexLabel} / {String(caseStudies.length).padStart(2, "0")}
            </span>
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} className="hidden sm:inline-flex" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto scroll-container">
          {/* Hero */}
          <div
            className="dot-grid px-4 sm:px-8 lg:px-12 py-10 sm:py-14"
            style={{ borderBottom: "1px solid var(--card-border)" }}
          >
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span
                  className="font-mono text-[10px] tracking-[0.18em] uppercase"
                  style={{ color }}
                >
                  // {study.category.toLowerCase()}
                </span>
                <span className="w-px h-3" style={{ background: "var(--card-border)" }} />
                <span className="meta-mono inline-flex items-center gap-1">
                  <Clock size={11} strokeWidth={1.6} />
                  {readTime} min
                </span>
                <span className="w-px h-3" style={{ background: "var(--card-border)" }} />
                <span className="meta-mono">{study.company} · {study.year}</span>
              </div>

              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.05] mb-5"
                style={{ color: "var(--text-primary)", letterSpacing: "-0.03em" }}
              >
                <span className="mr-3 align-middle text-2xl sm:text-3xl">{study.logo}</span>
                {study.title}
              </h1>

              <p
                className="text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl"
                style={{ color: "var(--text-muted)" }}
              >
                {study.description}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 sm:px-8 lg:px-12 py-10 sm:py-12">
            <div className="max-w-3xl">
              {/* Outcome callout */}
              <div
                className="text-sm px-5 py-4 rounded-xl mb-10 flex items-start gap-3"
                style={{
                  background: "transparent",
                  border: `1px solid ${isFailure ? "rgba(255,75,75,0.25)" : "rgba(80,200,120,0.25)"}`,
                  color: isFailure ? "#FF4B4B" : "#50C878",
                }}
              >
                {isFailure ? (
                  <TrendingDown size={16} strokeWidth={1.6} className="mt-0.5 flex-shrink-0" />
                ) : (
                  <TrendingUp size={16} strokeWidth={1.6} className="mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <span
                    className="font-mono text-[10px] tracking-[0.18em] uppercase block mb-1"
                    style={{ opacity: 0.8 }}
                  >
                    // {isFailure ? "outcome" : "impact"}
                  </span>
                  <span style={{ color: "var(--text-primary)" }}>{study.outcome}</span>
                </div>
              </div>

              {/* Article body */}
              <article>
                {paragraphs.map((p, i) => (
                  <p
                    key={i}
                    className="text-sm sm:text-base lg:text-lg leading-[1.85] mb-6"
                    style={{ color: "var(--text-primary)", opacity: 0.9 }}
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
                <span className="eyebrow mr-2">// tags</span>
                {study.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[10px] px-2 py-1 rounded"
                    style={{
                      background: "var(--tag-bg)",
                      color: "var(--text-muted)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Prev / Next */}
              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-8"
                style={{ borderTop: "1px solid var(--card-border)" }}
              >
                {prevStudy ? (
                  <Link
                    href={`/case-study/${prevStudy.id}`}
                    className="playlist-card surface p-4 group"
                    style={{ ["--accent-color" as any]: "var(--text-muted)" } as React.CSSProperties}
                  >
                    <p className="eyebrow mb-2">← Prev</p>
                    <p className="text-sm font-semibold line-clamp-2" style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                      {prevStudy.title}
                    </p>
                  </Link>
                ) : (
                  <div />
                )}
                {nextStudy ? (
                  <Link
                    href={`/case-study/${nextStudy.id}`}
                    className="playlist-card surface p-4 text-right group"
                    style={{ ["--accent-color" as any]: "var(--text-muted)" } as React.CSSProperties}
                  >
                    <p className="eyebrow mb-2">Next →</p>
                    <p className="text-sm font-semibold line-clamp-2" style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                      {nextStudy.title}
                    </p>
                  </Link>
                ) : (
                  <div />
                )}
              </div>

              {/* Back to all */}
              <div className="text-center pb-12">
                <Link href="/" className="btn-ghost inline-flex">
                  Browse all
                  <ArrowUpRight size={12} strokeWidth={1.6} />
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
