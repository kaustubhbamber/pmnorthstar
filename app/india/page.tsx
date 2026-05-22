"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MobileNav } from "@/components/MobileNav";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { SubscribeForm } from "@/components/SubscribeForm";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { caseStudies, getIndianCaseStudies } from "@/data/caseStudies";
import { playlists } from "@/data/learn";
import { books } from "@/data/books";
import { ArrowUpRight, Menu } from "lucide-react";

// Indian companies queued for case studies — visible roadmap so the page
// has substance even before the native India case studies are written.
const upcomingIndia = [
  { company: "Cred", angle: "Design-led onboarding & member-only positioning" },
  { company: "Razorpay", angle: "API-first pivot to infra empire" },
  { company: "Zerodha", angle: "Bootstrapped to unicorn with no PMs" },
  { company: "Paytm", angle: "Super-app strategy: brilliant or fatal?" },
  { company: "BYJU'S", angle: "The product decisions behind the downfall" },
  { company: "Swiggy", angle: "Instamart's brutal unit economics bet" },
  { company: "PhonePe", angle: "Overtaking Google Pay in India" },
  { company: "Cult.fit", angle: "Pivot from gym to subscription empire" },
  { company: "Nykaa", angle: "14 years to overnight beauty IPO" },
  { company: "Meesho", angle: "Rural commerce playbook" },
  { company: "Slice", angle: "Credit cards for Gen Z India" },
  { company: "Groww vs Zerodha", angle: "Two paths to fintech leadership" },
];

// Existing global case studies most relevant for an Indian PM audience.
// These are analogues to Indian companies (Stripe ~ Razorpay, Notion's GTM,
// Airbnb's marketplace trust, Slack's bottoms-up enterprise, etc.) plus
// pure essentials.
const globalRelevantIds = ["cs-2", "cs-5", "cs-7", "cs-27", "cs-30", "cs-3"];

export default function IndiaPage() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sidebar / mobile nav clicks on /india must navigate back to /
  // and pass the requested tab via hash so the home view opens to it.
  const handleNavChange = (nav: string) => {
    if (nav === "home" || nav === "library") {
      router.push("/");
    } else {
      router.push(`/#${nav}`);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setIsDark(true);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const globalRelevant = caseStudies.filter((c) =>
    globalRelevantIds.includes(c.id)
  );

  const publishedIndia = getIndianCaseStudies();
  const publishedCompanies = new Set(
    publishedIndia.map((c) => c.company.toLowerCase())
  );
  const stillUpcoming = upcomingIndia.filter(
    (e) =>
      !publishedCompanies.has(e.company.toLowerCase()) &&
      // "Groww vs Zerodha" is a comparison topic, treat as one entry
      !e.company.split(" vs ").every((c) => publishedCompanies.has(c.toLowerCase()))
  );

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
        {/* Header */}
        <header
          className="flex-shrink-0 px-4 sm:px-6 py-3 flex items-center justify-between gap-3"
          style={{
            background: "var(--nav-bg)",
            borderBottom: "1px solid var(--card-border)",
          }}
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
              className="text-sm font-medium"
              style={{ color: "var(--text-muted)" }}
            >
              ← Home
            </Link>
          </div>
          <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
        </header>

        <MobileNav activeNav="india" onNavChange={handleNavChange} />

        <main className="flex-1 overflow-y-auto scroll-container">
          {/* Hero */}
          <section
            className="dot-grid px-4 sm:px-8 lg:px-12 py-12 sm:py-20"
            style={{ borderBottom: "1px solid var(--card-border)" }}
          >
            <div className="max-w-3xl">
              <Breadcrumbs
                className="mb-5"
                items={[
                  { label: "northstar", href: "/" },
                  { label: "India" },
                ]}
              />
              <p className="eyebrow mb-4" style={{ color: "#FF6B35" }}>
                For builders in India
              </p>
              <h1
                className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] mb-5"
                style={{
                  color: "var(--text-primary)",
                  letterSpacing: "-0.04em",
                }}
              >
                Product management,
                <br />
                <span className="gradient-warm">for the India context.</span>
              </h1>
              <p
                className="text-base sm:text-lg leading-relaxed max-w-xl"
                style={{ color: "var(--text-muted)" }}
              >
                A curated library for Indian product managers, founders, and
                operators. The case studies you read elsewhere are written for
                the US market. northstar is being rewritten for ours.
              </p>

              <div className="flex flex-wrap items-center gap-2.5 mt-7">
                <Link href="/" className="btn-primary group">
                  Browse the library
                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.8}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
                <a href="#india-coming" className="btn-ghost">
                  See what's coming
                </a>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section
            className="px-4 sm:px-8 lg:px-12 py-8 sm:py-10 grid grid-cols-3 max-w-3xl"
            style={{ borderBottom: "1px solid var(--card-border)" }}
          >
            {[
              { value: books.length, label: "books" },
              { value: caseStudies.length, label: "case studies" },
              { value: playlists.length, label: "playlists" },
            ].map(({ value, label }, idx) => (
              <div
                key={label}
                className={`text-left px-2 sm:px-6 ${
                  idx > 0 ? "border-l" : ""
                }`}
                style={{ borderColor: "var(--card-border)" }}
              >
                <div
                  className="text-[10px] sm:text-[11px] font-medium tracking-wider uppercase mb-1 sm:mb-2"
                  style={{ color: "var(--text-faint)" }}
                >
                  {label}
                </div>
                <div
                  className="text-2xl sm:text-4xl lg:text-5xl font-bold"
                  style={{
                    color: "var(--text-primary)",
                    letterSpacing: "-0.03em",
                  }}
                >
                  {value}
                </div>
              </div>
            ))}
          </section>

          {/* Published India case studies (auto-syndicated from main library) */}
          {publishedIndia.length > 0 && (
            <section
              className="px-4 sm:px-8 lg:px-12 py-12 sm:py-16"
              style={{ borderBottom: "1px solid var(--card-border)" }}
            >
              <div className="max-w-5xl">
                <p className="eyebrow mb-3" style={{ color: "#FF6B35" }}>
                  Live now
                </p>
                <h2
                  className="text-2xl sm:text-3xl font-semibold mb-3"
                  style={{
                    color: "var(--text-primary)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Indian case studies, published
                </h2>
                <p
                  className="text-sm sm:text-base leading-relaxed mb-8 max-w-2xl"
                  style={{ color: "var(--text-muted)" }}
                >
                  Long-form analyses of the product decisions behind India's
                  biggest companies. These also live in the main library.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {publishedIndia.map((study, idx) => (
                    <CaseStudyCard key={study.id} study={study} index={idx} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* India case studies — coming */}
          {stillUpcoming.length > 0 && (
            <section
              id="india-coming"
              className="px-4 sm:px-8 lg:px-12 py-12 sm:py-16"
              style={{ borderBottom: "1px solid var(--card-border)" }}
            >
              <div className="max-w-3xl">
                <p className="eyebrow mb-3" style={{ color: "#FF6B35" }}>
                  In the works
                </p>
                <h2
                  className="text-2xl sm:text-3xl font-semibold mb-3"
                  style={{
                    color: "var(--text-primary)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {stillUpcoming.length} more deep dives ahead
                </h2>
                <p
                  className="text-sm sm:text-base leading-relaxed mb-8 max-w-2xl"
                  style={{ color: "var(--text-muted)" }}
                >
                  Long-form analyses of the product decisions behind India's
                  biggest companies — what worked, what broke, what every PM
                  here should learn from them. Published one per week.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {stillUpcoming.map((entry, idx) => (
                    <div
                      key={entry.company}
                      className="surface p-4"
                      style={{ borderRadius: 10 }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className="text-base font-semibold"
                          style={{
                            color: "var(--text-primary)",
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {entry.company}
                        </span>
                        <span
                          className="text-[10px] font-medium uppercase tracking-wider"
                          style={{ color: "var(--text-faint)" }}
                        >
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <p
                        className="text-xs leading-relaxed"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {entry.angle}
                      </p>
                    </div>
                  ))}
                </div>

                <p
                  className="text-xs mt-6"
                  style={{ color: "var(--text-faint)" }}
                >
                  Have a request for a case study not on this list? Reach out.
                </p>
              </div>
            </section>
          )}

          {/* Globally relevant for India */}
          <section
            className="px-4 sm:px-8 lg:px-12 py-12 sm:py-16"
            style={{ borderBottom: "1px solid var(--card-border)" }}
          >
            <div className="max-w-5xl">
              <p className="eyebrow mb-3" style={{ color: "#9B8FFF" }}>
                Read these first
              </p>
              <h2
                className="text-2xl sm:text-3xl font-semibold mb-3"
                style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
              >
                Global case studies most relevant for Indian PMs
              </h2>
              <p
                className="text-sm sm:text-base leading-relaxed mb-8 max-w-2xl"
                style={{ color: "var(--text-muted)" }}
              >
                The product playbooks behind these companies are the closest
                analogues to what's being built in India today. Stripe is
                Razorpay's reference. Slack is the workplace SaaS template.
                Notion is what every productivity startup gets benchmarked
                against.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {globalRelevant.map((study, idx) => (
                  <CaseStudyCard key={study.id} study={study} index={idx} />
                ))}
              </div>

              <div className="mt-8">
                <Link href="/" className="btn-ghost inline-flex">
                  See all {caseStudies.length} case studies
                  <ArrowUpRight size={12} strokeWidth={1.6} />
                </Link>
              </div>
            </div>
          </section>

          {/* Why this exists */}
          <section
            className="px-4 sm:px-8 lg:px-12 py-12 sm:py-16"
            style={{ borderBottom: "1px solid var(--card-border)" }}
          >
            <div className="max-w-2xl">
              <p className="eyebrow mb-3" style={{ color: "#50C878" }}>
                Why northstar
              </p>
              <h2
                className="text-2xl sm:text-3xl font-semibold mb-5"
                style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
              >
                Most PM resources are written for the US. This one's for here.
              </h2>
              <div
                className="text-base leading-relaxed space-y-4"
                style={{ color: "var(--text-muted)" }}
              >
                <p>
                  Lenny&apos;s Newsletter, Reforge, First Round Review — they&apos;re
                  great. They&apos;re also written for senior PMs at US tech
                  companies with US salaries, US capital markets, and US user
                  behavior.
                </p>
                <p>
                  Indian PMs read them anyway because there&apos;s nothing else.
                  But the playbooks don&apos;t fully transfer. Cred didn&apos;t scale
                  like Notion. Razorpay&apos;s API positioning is different from
                  Stripe&apos;s. BYJU&apos;s downfall has lessons no US edtech
                  case study covers.
                </p>
                <p>
                  northstar is being built around that gap — long-form Indian
                  case studies, in the same depth as the global ones, plus the
                  curated library you already get for free.
                </p>
              </div>
            </div>
          </section>

          {/* Newsletter signup */}
          <section
            className="px-4 sm:px-8 lg:px-12 py-12 sm:py-16"
            style={{ borderBottom: "1px solid var(--card-border)" }}
          >
            <div className="max-w-2xl mx-auto">
              <SubscribeForm
                variant="card"
                headline="Get every new case study in your inbox."
                subhead="Indian and global product deep dives, one every few days. Free."
              />
            </div>
          </section>

          {/* Final CTA */}
          <section className="px-4 sm:px-8 lg:px-12 py-12 sm:py-16">
            <div className="max-w-2xl text-center mx-auto">
              <p className="eyebrow mb-3">Free · Open · No paywall</p>
              <h2
                className="text-2xl sm:text-3xl font-semibold mb-5"
                style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
              >
                Start with the library you have today
              </h2>
              <Link href="/" className="btn-primary group">
                Browse all {caseStudies.length} case studies
                <ArrowUpRight
                  size={14}
                  strokeWidth={1.8}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
          </section>
          <Footer />
        </main>
      </div>
    </div>
  );
}
