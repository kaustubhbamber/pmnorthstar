// Aggregate SimulateIt usage stats. Public endpoint — counts only, no
// per-user data. Mirrors /api/checkit/stats. Pass ?slug= to scope the
// counts to a single drill (used by the drill intro); omit it for the
// site-wide total (used by the /simulate landing hero).

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug") || undefined;
  try {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const base = slug ? { drillSlug: slug } : {};

    const [total, week, today] = await Promise.all([
      prisma.simulateAttempt.count({ where: base }),
      prisma.simulateAttempt.count({
        where: { ...base, completedAt: { gte: weekAgo } },
      }),
      prisma.simulateAttempt.count({
        where: { ...base, completedAt: { gte: dayAgo } },
      }),
    ]);

    return NextResponse.json(
      { total, week, today },
      {
        // Cache for 60s so a busy page doesn't hammer the DB. The numbers
        // are eventually-consistent for social-proof use.
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      },
    );
  } catch (error) {
    console.error("SimulateIt stats error:", error);
    // Return zeroes rather than failing — the UI hides the line when
    // counts are zero, so a DB hiccup just suppresses the line.
    return NextResponse.json({ total: 0, week: 0, today: 0 });
  }
}
