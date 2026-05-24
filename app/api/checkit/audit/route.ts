import { NextRequest, NextResponse } from "next/server";
import { runAudit } from "@/lib/checkit/audit";
import { cacheKey, getCached, setCached } from "@/lib/checkit/cache";
import { normalizeUrl } from "@/lib/checkit/util";
import { prisma } from "@/lib/prisma";

// Vercel's default 10s timeout isn't enough — PSI alone can take 20s+.
// 60 is the max on Hobby. If the audit ever creeps near that, move
// PSI off-path and stream results.
export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("url");
  if (!raw) {
    return NextResponse.json({ error: "Missing ?url= param" }, { status: 400 });
  }

  const url = normalizeUrl(raw);
  if (!url) {
    return NextResponse.json(
      { error: `"${raw}" isn't a valid URL.` },
      { status: 400 },
    );
  }

  const key = cacheKey(url);
  const cached = getCached(key);
  if (cached) {
    logAudit(cached.finalUrl || url.toString(), cached.totalScore, cached.band, true);
    return NextResponse.json({ result: cached, cached: true });
  }

  try {
    const result = await runAudit(url.toString());
    // Only cache successful audits — a transient fetch failure shouldn't
    // poison the cache for 24h.
    if (!result.fatalError) {
      setCached(key, result);
      logAudit(result.finalUrl || url.toString(), result.totalScore, result.band, false);
    }
    return NextResponse.json({ result, cached: false });
  } catch (error) {
    console.error("CheckIt audit error:", error);
    return NextResponse.json(
      { error: "Audit failed. Please try again." },
      { status: 500 },
    );
  }
}

// Fire-and-forget Postgres insert so we can answer "how many CheckIts
// have been run?" via Supabase SQL Editor. Never throws. Same pattern
// as lastLoginAt: failure here must not block the audit response.
function logAudit(finalUrl: string, score: number, band: string, cached: boolean) {
  let host = finalUrl;
  try {
    host = new URL(finalUrl).hostname;
  } catch {
    /* keep the raw string as a fallback */
  }
  prisma.checkitAudit
    .create({
      data: { host, score, band, cached },
    })
    .catch((err) => console.error("Failed to log CheckIt audit:", err));
}
