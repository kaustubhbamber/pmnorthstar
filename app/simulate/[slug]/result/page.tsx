// Share-landing page for a SimulateIt result. This route exists purely
// so a shared result unfurls with a score-bearing OG card (set in
// generateMetadata → /api/simulate/og). Keeping the score logic on this
// dynamic route means the main /simulate/[slug] drill page can stay
// statically generated (ISR) for performance. The page itself is a thin
// "you scored X — now play it yourself" interstitial; it is noindex'd so
// it never competes with the canonical drill page in search.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { getDrillBySlug } from "@/data/drills";
import { SidebarShell } from "@/components/SidebarShell";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pmnorthstar.in";

interface PageProps {
  params: { slug: string };
  searchParams: { s?: string; m?: string; b?: string };
}

function drillTitle(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const drill = getDrillBySlug(params.slug);
  if (!drill) return { robots: { index: false, follow: false } };

  const title = drillTitle(drill.slug);
  const s = searchParams.s ?? "0";
  const m = searchParams.m ?? "0";
  const b = searchParams.b ?? "";

  const ogUrl =
    `${SITE_URL}/api/simulate/og?slug=${encodeURIComponent(drill.slug)}` +
    `&s=${encodeURIComponent(s)}&m=${encodeURIComponent(m)}&b=${encodeURIComponent(b)}`;
  const headline = `I scored ${s}/${m} on "${title}"`;
  const description = `${headline} — a real founder decision on SimulateIt. Can you beat it?`;

  return {
    title: `${s}/${m} on ${title} — SimulateIt`,
    description,
    // The share interstitial should never be indexed — the drill page is
    // canonical — but crawlers should still follow through to it.
    robots: { index: false, follow: true },
    openGraph: {
      type: "website",
      title: headline,
      description,
      url: `${SITE_URL}/simulate/${drill.slug}/result`,
      siteName: "northstar",
      images: [
        {
          url: ogUrl,
          width: 1200,
          height: 630,
          alt: `SimulateIt score for ${title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: headline,
      description,
      images: [ogUrl],
    },
  };
}

export default function ResultSharePage({ params, searchParams }: PageProps) {
  const drill = getDrillBySlug(params.slug);
  if (!drill) notFound();

  const title = drillTitle(drill.slug);
  const s = searchParams.s ?? "—";
  const m = searchParams.m ?? "—";

  return (
    <SidebarShell>
      <div className="px-4 sm:px-6 py-16 sm:py-24 max-w-2xl mx-auto text-center">
        <p
          className="text-[10px] font-mono uppercase mb-5"
          style={{ color: "var(--brand-primary)", letterSpacing: "0.16em" }}
        >
          simulateit · result
        </p>
        <p
          className="font-display font-bold mb-3"
          style={{
            color: "var(--text-primary)",
            letterSpacing: "-0.03em",
            fontSize: "clamp(40px, 8vw, 72px)",
            lineHeight: 1,
          }}
        >
          {s}
          <span style={{ color: "var(--text-faint)" }}>/{m}</span>
        </p>
        <h1
          className="font-display text-xl sm:text-2xl font-semibold mb-2"
          style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
        >
          {title}
        </h1>
        <p
          className="text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto"
          style={{ color: "var(--text-muted)" }}
        >
          A branching decision drill from a real startup moment. You make the
          calls, you see the consequences. Think you&apos;d have done better?
        </p>
        <Link href={`/simulate/${drill.slug}`} className="btn-primary">
          Play this drill
          <ArrowUpRight size={14} strokeWidth={1.8} />
        </Link>
        <div className="mt-4">
          <Link
            href="/simulate"
            className="text-sm font-medium"
            style={{ color: "var(--text-muted)" }}
          >
            See all drills →
          </Link>
        </div>
      </div>
    </SidebarShell>
  );
}
