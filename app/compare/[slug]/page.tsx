"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MobileNav } from "@/components/MobileNav";
import { ShareButton } from "@/components/ShareButton";
import { getCaseStudyById, getCaseStudySlug } from "@/data/caseStudies";
import { getCompanyLogoUrl } from "@/data/companyDomains";
import { getComparisonBySlug, comparisons } from "@/data/comparisons";
import { ArrowLeft, ArrowUpRight, Menu } from "lucide-react";

export default function ComparePage({ params }: { params: { slug: string } }) {
  const cmp = getComparisonBySlug(params.slug);
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aLogoFailed, setALogoFailed] = useState(false);
  const [bLogoFailed, setBLogoFailed] = useState(false);

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

  if (!cmp) notFound();

  const a = getCaseStudyById(cmp.companyA);
  const b = getCaseStudyById(cmp.companyB);
  if (!a || !b) notFound();

  const aLogo = getCompanyLogoUrl(a.company);
  const bLogo = getCompanyLogoUrl(b.company);

  const handleNavChange = (nav: string) => {
    if (nav === "home" || nav === "library") router.push("/");
    else router.push(`/#${nav}`);
  };

  const otherComps = comparisons.filter((c) => c.slug !== cmp.slug);

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
              title={`${cmp.title} — northstar comparison`}
              text={`${cmp.title}: ${cmp.intro}`}
              compact
            />
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
          </div>
        </header>

        <MobileNav activeNav="" onNavChange={handleNavChange} />

        <main className="flex-1 overflow-y-auto scroll-container">
          {/* Hero */}
          <section
            className="dot-grid px-4 sm:px-8 lg:px-12 py-10 sm:py-14"
            style={{ borderBottom: "1px solid var(--card-border)" }}
          >
            <div className="max-w-3xl">
              <p
                className="eyebrow mb-3 sm:mb-4"
                style={{ color: cmp.accentColor }}
              >
                {cmp.eyebrow}
              </p>
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] mb-4 sm:mb-5"
                style={{
                  color: "var(--text-primary)",
                  letterSpacing: "-0.03em",
                }}
              >
                {cmp.title}
              </h1>
              <p
                className="text-sm sm:text-base lg:text-lg leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                {cmp.intro}
              </p>
            </div>
          </section>

          {/* Two-column header — A vs B */}
          <section
            className="px-4 sm:px-8 lg:px-12 py-8 sm:py-10"
            style={{ borderBottom: "1px solid var(--card-border)" }}
          >
            <div className="grid grid-cols-2 gap-3 sm:gap-6 max-w-5xl">
              {[
                { study: a, logo: aLogo, failed: aLogoFailed, setFailed: setALogoFailed },
                { study: b, logo: bLogo, failed: bLogoFailed, setFailed: setBLogoFailed },
              ].map(({ study, logo, failed, setFailed }, i) => (
                <Link
                  key={i}
                  href={`/case-study/${getCaseStudySlug(study.id)}`}
                  className="surface p-4 sm:p-6 group"
                  style={{ borderRadius: 12 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    {logo && !failed ? (
                      <span
                        className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex-shrink-0 overflow-hidden"
                        style={{
                          background: "#fff",
                          border: "1px solid var(--card-border)",
                        }}
                      >
                        <img
                          src={logo}
                          alt={`${study.company} logo`}
                          loading="lazy"
                          onError={() => setFailed(true)}
                          className="max-w-full max-h-full object-contain"
                          style={{ padding: "4px" }}
                        />
                      </span>
                    ) : (
                      <span className="text-2xl sm:text-3xl">{study.logo}</span>
                    )}
                    <h2
                      className="text-lg sm:text-2xl font-semibold"
                      style={{
                        color: "var(--text-primary)",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {study.company}
                    </h2>
                  </div>
                  <p
                    className="text-xs sm:text-sm line-clamp-3"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {study.description}
                  </p>
                  <p
                    className="text-[11px] mt-3 font-medium uppercase tracking-wider inline-flex items-center gap-1"
                    style={{ color: cmp.accentColor }}
                  >
                    Read full case study
                    <ArrowUpRight
                      size={11}
                      strokeWidth={1.8}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </p>
                </Link>
              ))}
            </div>
          </section>

          {/* Comparison table */}
          <section
            className="px-4 sm:px-8 lg:px-12 py-10 sm:py-12"
            style={{ borderBottom: "1px solid var(--card-border)" }}
          >
            <div className="max-w-5xl">
              <p
                className="eyebrow mb-3"
                style={{ color: cmp.accentColor }}
              >
                Side by side
              </p>
              <h2
                className="text-xl sm:text-2xl font-semibold mb-6"
                style={{
                  color: "var(--text-primary)",
                  letterSpacing: "-0.02em",
                }}
              >
                {a.company} vs {b.company}
              </h2>

              <div
                className="surface overflow-hidden"
                style={{ borderRadius: 12 }}
              >
                {/* Header row */}
                <div
                  className="grid grid-cols-3 gap-2 sm:gap-4 px-3 sm:px-5 py-3 sm:py-4 text-[11px] sm:text-xs font-semibold uppercase tracking-wider"
                  style={{
                    color: "var(--text-muted)",
                    borderBottom: "1px solid var(--card-border)",
                    background: "var(--tag-bg)",
                  }}
                >
                  <div></div>
                  <div>{a.company}</div>
                  <div>{b.company}</div>
                </div>

                {/* Rows */}
                {cmp.rows.map((row, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-3 gap-2 sm:gap-4 px-3 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm items-start"
                    style={{
                      borderBottom:
                        i < cmp.rows.length - 1
                          ? "1px solid var(--card-border)"
                          : "none",
                    }}
                  >
                    <div
                      className="font-medium"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {row.label}
                    </div>
                    <div
                      className="leading-relaxed"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {row.a}
                    </div>
                    <div
                      className="leading-relaxed"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {row.b}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Verdict */}
          <section
            className="px-4 sm:px-8 lg:px-12 py-10 sm:py-14"
            style={{ borderBottom: "1px solid var(--card-border)" }}
          >
            <div className="max-w-3xl">
              <p
                className="eyebrow mb-3"
                style={{ color: cmp.accentColor }}
              >
                Verdict
              </p>
              <h2
                className="text-xl sm:text-2xl font-semibold mb-4"
                style={{
                  color: "var(--text-primary)",
                  letterSpacing: "-0.02em",
                }}
              >
                Which one wins?
              </h2>
              <p
                className="text-base sm:text-lg leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                {cmp.verdict}
              </p>
            </div>
          </section>

          {/* Other comparisons */}
          <section className="px-4 sm:px-8 lg:px-12 py-10 sm:py-14">
            <div className="max-w-5xl">
              <p
                className="eyebrow mb-3"
                style={{ color: "var(--text-muted)" }}
              >
                More comparisons
              </p>
              <h2
                className="text-xl sm:text-2xl font-semibold mb-5 sm:mb-6"
                style={{
                  color: "var(--text-primary)",
                  letterSpacing: "-0.02em",
                }}
              >
                Explore more head-to-heads
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {otherComps.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/compare/${c.slug}`}
                    className="playlist-card surface p-4 group"
                    style={
                      {
                        ["--accent-color" as any]: c.accentColor,
                      } as React.CSSProperties
                    }
                  >
                    <p
                      className="text-[11px] font-medium uppercase tracking-wider mb-2"
                      style={{ color: c.accentColor, opacity: 0.85 }}
                    >
                      {c.eyebrow}
                    </p>
                    <p
                      className="text-base font-semibold leading-snug"
                      style={{
                        color: "var(--text-primary)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {c.title.split(" — ")[0]}
                    </p>
                  </Link>
                ))}
              </div>

              <div className="mt-8 text-center">
                <Link href="/" className="btn-ghost inline-flex">
                  Browse the full library
                  <ArrowUpRight size={12} strokeWidth={1.6} />
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
