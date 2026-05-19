import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Mail, Twitter, LucideIcon } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SITE_INFO } from "@/lib/site";
import { caseStudies } from "@/data/caseStudies";
import { books } from "@/data/books";
import { playlists } from "@/data/learn";

export default function AboutPage() {
  const socials: Array<{ href: string; label: string; icon: LucideIcon }> = [];
  if (SITE_INFO.twitter)
    socials.push({ href: SITE_INFO.twitter, label: "Twitter", icon: Twitter });
  if (SITE_INFO.email)
    socials.push({
      href: `mailto:${SITE_INFO.email}`,
      label: "Email",
      icon: Mail,
    });

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--page-bg)" }}
    >
      <main className="flex-1">
        {/* Hero */}
        <section
          className="px-4 sm:px-8 lg:px-12 py-10 sm:py-14 relative overflow-hidden"
          style={{ borderBottom: "1px solid var(--card-border)" }}
        >
          <div
            aria-hidden
            className="absolute pointer-events-none"
            style={{
              top: -120,
              left: -100,
              width: 360,
              height: 360,
              borderRadius: 9999,
              background: "rgba(243,18,60,0.14)",
              filter: "blur(100px)",
            }}
          />
          <div className="max-w-3xl relative z-10">
            <Breadcrumbs
              className="mb-5"
              items={[
                { label: "northstar", href: "/" },
                { label: "About" },
              ]}
            />
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium mb-6"
              style={{ color: "var(--text-muted)" }}
            >
              <ArrowLeft size={14} strokeWidth={1.6} />
              Back to the library
            </Link>
            <p
              className="text-xs font-semibold uppercase tracking-[0.18em] mb-4"
              style={{ color: "var(--brand-primary)" }}
            >
              About
            </p>
            <h1
              className="text-4xl sm:text-5xl font-bold leading-[1.05] mb-5"
              style={{
                color: "var(--text-primary)",
                letterSpacing: "-0.03em",
              }}
            >
              northstar is a curated PM library. Free, hand-picked, opinionated.
            </h1>
            <p
              className="text-base sm:text-lg leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              {caseStudies.length} long-form case studies. {books.length} original book reviews with takeaways. {playlists.length} hand-picked YouTube playlists. No paywall, no signup wall, no ads.
            </p>
          </div>
        </section>

        {/* Why this exists */}
        <section
          className="px-4 sm:px-8 lg:px-12 py-10 sm:py-14"
          style={{ borderBottom: "1px solid var(--card-border)" }}
        >
          <div className="max-w-3xl">
            <p
              className="eyebrow mb-3"
              style={{ color: "var(--brand-primary)", opacity: 0.85 }}
            >
              Why this exists
            </p>
            <h2
              className="text-2xl sm:text-3xl font-semibold mb-5"
              style={{
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
              }}
            >
              Most PM resources are either paywalled, ad-stuffed, or scattered.
            </h2>
            <div
              className="space-y-4 text-base sm:text-lg leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              <p>
                Serious PM content lives behind paywalls. Lenny&apos;s Newsletter at $150 a year. Reforge at $2,000+. Medium hiding articles after a few free reads.
              </p>
              <p>
                What&apos;s free is usually either ad-stuffed listicles ranking the same ten books on every site, or YouTube videos that turn out to be 20-minute ads. There&apos;s no single curated place where someone new to product can land and actually learn — for free, without trading an email up front.
              </p>
              <p>
                northstar is the resource we wished existed. The companies that built modern product, documented as case studies. The essential PM books, with takeaways pulled out and honest reads on who they&apos;re really for. Playlists curated by topic, not by algorithm. All free. All in one place.
              </p>
            </div>
          </div>
        </section>

        {/* How the editorial works */}
        <section
          className="px-4 sm:px-8 lg:px-12 py-10 sm:py-14"
          style={{ borderBottom: "1px solid var(--card-border)" }}
        >
          <div className="max-w-3xl">
            <p
              className="eyebrow mb-3"
              style={{ color: "var(--brand-primary)", opacity: 0.85 }}
            >
              How the editorial works
            </p>
            <h2
              className="text-2xl sm:text-3xl font-semibold mb-5"
              style={{
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
              }}
            >
              Curated by humans. AI-assisted prose. Edited line by line.
            </h2>
            <div
              className="space-y-4 text-base sm:text-lg leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              <p>
                Every book on northstar was chosen because it&apos;s worth a PM&apos;s time — not because an algorithm ranked it. Every case study is selected for the specific decision it documents: the pivot, the moat, the failure, the bet.
              </p>
              <p>
                The prose is AI-assisted (Claude does most of the heavy drafting). The angle, the take, the structure, and the editorial pass are human. We deliberately don&apos;t fake a personal byline on top of AI-assisted writing — that&apos;s the trust-theater every other content site is doing in 2026, and we don&apos;t want to add to it.
              </p>
              <p>
                Book reviews are deliberately not summaries. They&apos;re meta-commentary: what the book got right, who it&apos;s actually for, what gets commonly misread, and whether the assumptions hold for PMs working outside Silicon Valley. Case studies are 7-paragraph deep dives, not bullet listicles.
              </p>
              <p>
                If a piece reads like a Wikipedia summary, it gets rewritten before it ships. If a take feels generic, it doesn&apos;t ship at all.
              </p>
            </div>
          </div>
        </section>

        {/* What's deliberately NOT here */}
        <section
          className="px-4 sm:px-8 lg:px-12 py-10 sm:py-14"
          style={{ borderBottom: "1px solid var(--card-border)" }}
        >
          <div className="max-w-3xl">
            <p
              className="eyebrow mb-3"
              style={{ color: "var(--brand-primary)", opacity: 0.85 }}
            >
              What&apos;s not here
            </p>
            <h2
              className="text-2xl sm:text-3xl font-semibold mb-5"
              style={{
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
              }}
            >
              Things northstar deliberately doesn&apos;t do.
            </h2>
            <ul
              className="space-y-3 text-base sm:text-lg leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              <li>
                <strong style={{ color: "var(--text-primary)" }}>No paywall.</strong> Every case study, every book review, every playlist is free.
              </li>
              <li>
                <strong style={{ color: "var(--text-primary)" }}>No signup wall.</strong> Browsing requires no account. The newsletter is opt-in only.
              </li>
              <li>
                <strong style={{ color: "var(--text-primary)" }}>No display ads.</strong> The only monetization is Amazon affiliate links on book pages, which help fund continued work.
              </li>
              <li>
                <strong style={{ color: "var(--text-primary)" }}>No fake personal byline.</strong> Every piece is credited to &quot;northstar editorial&quot; — the brand, not a person. The prose is AI-assisted; the curation and editing is human. We&apos;d rather be honest than mint a fictional author headshot for trust.
              </li>
              <li>
                <strong style={{ color: "var(--text-primary)" }}>No SEO-stuffed listicles.</strong> The site doesn&apos;t chase &quot;top 10 PM books 2026&quot; ranking traffic. Each page exists because it&apos;s actually useful.
              </li>
              <li>
                <strong style={{ color: "var(--text-primary)" }}>No reselling your data.</strong> We don&apos;t collect emails for resale. Analytics is privacy-friendly (Vercel Analytics, no third-party trackers).
              </li>
            </ul>
          </div>
        </section>

        {/* Contact */}
        {socials.length > 0 && (
          <section
            className="px-4 sm:px-8 lg:px-12 py-10 sm:py-14"
            style={{ borderBottom: "1px solid var(--card-border)" }}
          >
            <div className="max-w-3xl">
              <p
                className="eyebrow mb-3"
                style={{ color: "var(--brand-primary)", opacity: 0.85 }}
              >
                Get in touch
              </p>
              <h2
                className="text-2xl sm:text-3xl font-semibold mb-5"
                style={{
                  color: "var(--text-primary)",
                  letterSpacing: "-0.02em",
                }}
              >
                Spotted something wrong? Have a case study to suggest?
              </h2>
              <p
                className="text-base sm:text-lg leading-relaxed mb-6"
                style={{ color: "var(--text-muted)" }}
              >
                northstar is a living project. Corrections, suggestions, and book / case study requests are all welcome.
              </p>
              <div className="flex flex-wrap gap-3">
                {socials.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      target={s.href.startsWith("mailto:") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                      style={{
                        background: "var(--tag-bg)",
                        color: "var(--text-primary)",
                        border: "1px solid var(--card-border)",
                      }}
                    >
                      <Icon size={14} strokeWidth={1.8} />
                      {s.label}
                      {!s.href.startsWith("mailto:") && (
                        <ArrowUpRight size={11} strokeWidth={1.8} />
                      )}
                    </a>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        <Footer />
      </main>
    </div>
  );
}
