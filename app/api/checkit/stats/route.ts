import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Aggregate CheckIt usage stats. Public endpoint — counts only, no
// per-host or per-user data leaks here. Used by the /checkit hero to
// surface a "X sites scored this week" line.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [total, week, today] = await Promise.all([
      prisma.checkitAudit.count(),
      prisma.checkitAudit.count({ where: { fetchedAt: { gte: weekAgo } } }),
      prisma.checkitAudit.count({ where: { fetchedAt: { gte: dayAgo } } }),
    ]);

    return NextResponse.json(
      { total, week, today },
      {
        // Cache for 60s so a busy /checkit page doesn't hammer the DB.
        // The numbers are eventually-consistent for social-proof use.
        headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
      },
    );
  } catch (error) {
    console.error("CheckIt stats error:", error);
    // Return zeroes rather than failing — the UI hides the line when
    // counts are zero, so a DB hiccup just suppresses the line.
    return NextResponse.json({ total: 0, week: 0, today: 0 });
  }
}
