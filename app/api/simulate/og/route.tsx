import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { OG_SIZE, simulateOgTemplate } from "@/lib/og";
import { getDrillBySlug } from "@/data/drills";

// Dynamic OG image for SimulateIt result shares
// (/simulate/[slug]/result?s=&m=&b=). Renders the score + decision
// squares so a shared result unfurls as a "can you beat it?" score card
// instead of a plain link.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function drillTitle(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function clampInt(raw: string | null, min: number, max: number, fallback: number): number {
  const n = parseInt(raw || "", 10);
  if (Number.isNaN(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

export function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const slug = sp.get("slug") || "";
  const score = clampInt(sp.get("s"), 0, 999, 0);
  const max = clampInt(sp.get("m"), 1, 999, 1);
  // Only G/Y/R/W are valid square codes; strip anything else defensively.
  const blocks = (sp.get("b") || "")
    .toUpperCase()
    .replace(/[^GYRW]/g, "")
    .slice(0, 14);

  const drill = slug ? getDrillBySlug(slug) : undefined;
  const title = drill ? drillTitle(drill.slug) : "A founder decision";

  return new ImageResponse(
    simulateOgTemplate({ title, score, max, blocks }),
    {
      ...OG_SIZE,
      headers: {
        // Result is deterministic from the URL params — cache hard at the
        // edge so social crawlers don't re-render on every fetch.
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    },
  );
}
