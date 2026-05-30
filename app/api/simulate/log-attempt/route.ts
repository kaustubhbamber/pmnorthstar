// Log an anonymous SimulateIt drill completion for the usage counter.
// Mirrors CheckIt's audit logging: one row per completion, no auth, no
// user relation. Distinct from save-attempt (which persists a logged-in
// user's scored history with server-side validation). This endpoint only
// feeds the "X people have played this drill" social-proof line, so it
// stays cheap — it validates the slug exists and clamps the numbers, but
// doesn't re-derive scores from a path.
//
// Body: { drillSlug: string, score?: number, maxPossible?: number }

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDrillBySlug } from "@/data/drills";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { drillSlug, score, maxPossible } = body as {
      drillSlug?: string;
      score?: number;
      maxPossible?: number;
    };

    if (!drillSlug || !getDrillBySlug(drillSlug)) {
      return NextResponse.json({ error: "Unknown drill" }, { status: 400 });
    }

    // Coerce to non-negative ints — the count is the point, not the
    // scores, so a malformed score shouldn't reject the row.
    const safeScore = Number.isFinite(score) ? Math.max(0, Math.trunc(score!)) : 0;
    const safeMax = Number.isFinite(maxPossible)
      ? Math.max(0, Math.trunc(maxPossible!))
      : 0;

    await prisma.simulateAttempt.create({
      data: { drillSlug, score: safeScore, maxPossible: safeMax },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("simulate/log-attempt error:", err);
    // Never block the player on a logging failure.
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
