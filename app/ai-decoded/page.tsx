import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { getAllAIDecodedArticles } from "@/lib/ai-decoded";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SidebarShell } from "@/components/SidebarShell";
import { SubscribeForm } from "@/components/SubscribeForm";
import { solidColorFor } from "@/lib/category-colors";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pmnorthstar.in";

export const metadata: Metadata = {
  title: "AI Decoded — northstar",
  description:
    "What's actually happening in AI, and what PMs, marketers, founders, and operators should do about it. Editorial commentary on AI launches, conferences, and tools. No hype, no fluff.",
  alternates: { canonical: `${SITE_URL}/ai-decoded` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/ai-decoded`,
    title: "AI Decoded by northstar",
    description:
      "Editorial commentary on AI for PMs, marketers and founders. No hype, no fluff.",
    siteName: "northstar",
  },
};

export default function AIDecodedIndexPage() {
  const articles = getAllAIDecodedArticles();

  return (
    <SidebarShell
      backHref="/"
      backLabelDesktop="Back to the library"
      shareTitle="AI Decoded by northstar"
      shareText="What's actually happening in AI, and what PMs / marketers / founders should do about it."
    >
      {/* Hero — neutral background, green eyebrow accent ties back to
          the AI Decoded card on the home page without overwhelming. */}
      <section
        className="px-4 sm:px-8 lg:px-12 py-12 sm:py-16"
        style={{ borderBottom: "1.5px solid var(--card-border)" }}
      >
        <div className="max-w-3xl">
          <Breadcrumbs
            className="mb-5"
            items={[
              { label: "northstar", href: "/" },
              { label: "AI Decoded" },
            ]}
          />
          <div className="flex items-center gap-2.5 mb-4">
            <span
              className="w-5 h-px"
              style={{ background: "#0F9D58" }}
            />
            <span
              className="text-[10px] font-mono uppercase"
              style={{ color: "#0F9D58", letterSpacing: "0.16em" }}
            >
              AI Decoded
            </span>
          </div>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.02] mb-5"
            style={{
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
            }}
          >
            What&apos;s actually happening in AI.
          </h1>
          <p
            className="text-base sm:text-lg leading-relaxed max-w-2xl"
            style={{ color: "var(--text-muted)" }}
          >
            Editorial commentary on AI launches, conferences, and tools, plus what PMs, marketers, founders, and operators should do about them. No hype. No fluff. Just the moves worth making.
          </p>
        </div>
      </section>

      {/* Articles list */}
      <section className="px-4 sm:px-8 lg:px-12 py-10 sm:py-14">
        <div className="max-w-3xl">
          {articles.length === 0 ? (
            <div
              className="surface p-8 text-center"
              style={{ borderRadius: 12 }}
            >
              <p
                className="text-base font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                First decoded read is coming soon.
              </p>
              <p
                className="text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                Working on the inaugural batch. Subscribe to the newsletter to know when they drop.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {articles.map((a) => (
                <li key={a.frontmatter.slug}>
                  <Link
                    href={`/ai-decoded/${a.frontmatter.slug}`}
                    className="surface p-5 sm:p-6 block group transition-colors"
                    style={{ borderRadius: 12 }}
                  >
                    <div className="flex items-center gap-2.5 mb-3 flex-wrap">
                      <span
                        className="inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-md"
                        style={{
                          background: solidColorFor(a.frontmatter.category),
                          color: "#ffffff",
                          letterSpacing: "0.12em",
                        }}
                      >
                        {a.frontmatter.category}
                      </span>
                      <span className="meta-mono inline-flex items-center gap-1">
                        <Clock size={10} strokeWidth={1.6} />
                        {a.readTime} min
                      </span>
                      <span
                        className="meta-mono"
                        style={{ color: "var(--text-faint)" }}
                      >
                        {new Date(a.frontmatter.publishedAt).toLocaleDateString(
                          "en-IN",
                          { day: "numeric", month: "short", year: "numeric" }
                        )}
                      </span>
                    </div>
                    <h2
                      className="text-xl sm:text-2xl font-semibold mb-2 leading-tight group-hover:underline"
                      style={{
                        color: "var(--text-primary)",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {a.frontmatter.title}
                    </h2>
                    <p
                      className="text-sm leading-relaxed mb-3"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {a.frontmatter.excerpt}
                    </p>
                    <span
                      className="inline-flex items-center gap-1 text-xs font-semibold"
                      style={{ color: "var(--brand-primary)" }}
                    >
                      Read the decoded take
                      <ArrowUpRight size={11} strokeWidth={1.8} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section
        className="px-4 sm:px-8 lg:px-12 py-10 sm:py-14"
        style={{ borderTop: "1.5px solid var(--card-border)" }}
      >
        <div className="max-w-3xl">
          <SubscribeForm
            variant="card"
            surface="ai-decoded-index"
            headline="Get the next decoded read in your inbox."
            subhead="One sharp take on AI for PMs, marketers, founders, and operators. Every few days. Free."
          />
        </div>
      </section>

      <Footer />
    </SidebarShell>
  );
}
