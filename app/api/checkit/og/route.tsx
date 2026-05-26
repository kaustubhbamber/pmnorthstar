import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  OG_SIZE,
  checkitOgTemplate,
  checkitPromoTemplate,
} from "@/lib/og";
import { BAND_COPY } from "@/lib/checkit/types";
import type { Band } from "@/lib/checkit/types";
import { normalizeUrl } from "@/lib/checkit/util";

// Dynamic OG image for /checkit?url=X share links. Resolves the host
// from the query string, pulls the most recent audit from the
// checkit_audits log, and renders a band-colored score card. If no
// audit exists for the host yet, falls back to a generic CheckIt
// promo card so the share still looks intentional.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BANDS = [
  "stellar",
  "ready",
  "almost",
  "polish",
  "rough",
  "vibe",
  "draft",
  "skeleton",
  "raw",
  "missing",
] as const;
function asBand(s: string): Band {
  return (BANDS as readonly string[]).includes(s) ? (s as Band) : "missing";
}

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("url");
  const url = raw ? normalizeUrl(raw) : null;

  if (!url) {
    return new ImageResponse(checkitPromoTemplate(), {
      ...OG_SIZE,
      headers: {
        // Promo card is static — cache aggressively at the edge.
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    });
  }

  const host = url.hostname;

  let score: number | null = null;
  let band: Band = "missing";
  try {
    const latest = await prisma.checkitAudit.findFirst({
      where: { host },
      orderBy: { fetchedAt: "desc" },
      select: { score: true, band: true },
    });
    if (latest) {
      score = latest.score;
      band = asBand(latest.band);
    }
  } catch (err) {
    console.error("CheckIt OG lookup failed:", err);
  }

  if (score === null) {
    return new ImageResponse(checkitPromoTemplate(), {
      ...OG_SIZE,
      headers: {
        // No audit yet — short cache so it picks up the result quickly
        // once someone runs the audit.
        "Cache-Control": "public, max-age=300, s-maxage=600",
      },
    });
  }

  const copy = BAND_COPY[band];
  return new ImageResponse(
    checkitOgTemplate({
      host,
      score,
      band,
      bandLabel: copy.label,
      bandTagline: copy.tagline,
    }),
    {
      ...OG_SIZE,
      headers: {
        // The score changes when the site improves. 1 hour edge cache
        // is a good balance between freshness and avoiding hot DB hits
        // from social-platform crawlers.
        "Cache-Control": "public, max-age=600, s-maxage=3600",
      },
    },
  );
}
