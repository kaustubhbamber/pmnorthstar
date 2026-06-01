// User's personal SimulateIt stats page. Server-rendered with the
// authenticated session; redirects to /login if no session. The
// page never sees another user's data — getSession() + the API
// endpoint both gate on the cookie.

import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowUpRight,
  Brain,
  TrendingUp,
  Users,
  Flame,
  Trophy,
  Sparkles,
} from "lucide-react";
import { SidebarShell } from "@/components/SidebarShell";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDrillBySlug } from "@/data/drills";
import type { DrillDimension } from "@/data/drills";

export const dynamic = "force-dynamic";

const DIMENSION_LABEL: Record<DrillDimension, string> = {
  product: "Product thinking",
  business: "Business judgement",
  founder: "Founder thinking",
};

const DIMENSION_COLOR: Record<DrillDimension, string> = {
  product: "#2563EB",
  business: "#0F9D58",
  founder: "#D97706",
};

const DIMENSION_ICON: Record<DrillDimension, typeof Brain> = {
  product: Brain,
  business: TrendingUp,
  founder: Users,
};

function weekKey(d: Date): string {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

function isConsecutiveWeek(a: string, b: string): boolean {
  const [ay, aw] = a.split("-W").map(Number);
  const [by, bw] = b.split("-W").map(Number);
  if (ay === by && bw === aw + 1) return true;
  if (by === ay + 1 && aw >= 52 && bw === 1) return true;
  return false;
}

function computeStreaks(dates: Date[]): { current: number; best: number } {
  if (dates.length === 0) return { current: 0, best: 0 };
  const weeks = Array.from(new Set(dates.map(weekKey))).sort();
  let best = 1;
  let run = 1;
  for (let i = 1; i < weeks.length; i++) {
    if (isConsecutiveWeek(weeks[i - 1], weeks[i])) {
      run += 1;
      best = Math.max(best, run);
    } else {
      run = 1;
    }
  }
  const lastWeek = weeks[weeks.length - 1];
  const thisWeek = weekKey(new Date());
  const lastWeekKey = weekKey(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  const current = lastWeek === thisWeek || lastWeek === lastWeekKey ? run : 0;
  return { current, best };
}

function drillTitle(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function pct(n: number, d: number): number {
  return d === 0 ? 0 : n / d;
}

function dimensionVerdict(acc: number): string {
  if (acc >= 0.85) return "Stellar";
  if (acc >= 0.7) return "Strong";
  if (acc >= 0.55) return "Solid";
  if (acc >= 0.4) return "Mixed";
  return "Needs work";
}

export default async function SimulateMePage() {
  const session = await getSession();
  if (!session) {
    redirect("/login?next=/simulate/me");
  }

  const attempts = await prisma.drillAttempt.findMany({
    where: { userId: session.id },
    orderBy: { attemptedAt: "desc" },
    select: {
      id: true,
      drillSlug: true,
      score: true,
      maxPossible: true,
      productScore: true,
      productMax: true,
      businessScore: true,
      businessMax: true,
      founderScore: true,
      founderMax: true,
      attemptedAt: true,
    },
  });

  const totalAttempts = attempts.length;
  const distinctDrills = new Set(attempts.map((a) => a.drillSlug)).size;

  const sum = attempts.reduce(
    (acc, a) => {
      acc.score += a.score;
      acc.max += a.maxPossible;
      acc.productScore += a.productScore;
      acc.productMax += a.productMax;
      acc.businessScore += a.businessScore;
      acc.businessMax += a.businessMax;
      acc.founderScore += a.founderScore;
      acc.founderMax += a.founderMax;
      return acc;
    },
    {
      score: 0,
      max: 0,
      productScore: 0,
      productMax: 0,
      businessScore: 0,
      businessMax: 0,
      founderScore: 0,
      founderMax: 0,
    }
  );

  const lifetimeAccuracy = pct(sum.score, sum.max);
  const { current: currentStreak, best: bestStreak } = computeStreaks(
    attempts.map((a) => a.attemptedAt)
  );

  const dims: DrillDimension[] = ["product", "business", "founder"];
  const dimData = dims.map((d) => {
    if (d === "product") return { dim: d, score: sum.productScore, max: sum.productMax };
    if (d === "business") return { dim: d, score: sum.businessScore, max: sum.businessMax };
    return { dim: d, score: sum.founderScore, max: sum.founderMax };
  });

  const weakest = dimData
    .filter((d) => d.max > 0)
    .sort((a, b) => pct(a.score, a.max) - pct(b.score, b.max))[0];

  const recent = attempts.slice(0, 10);

  return (
    <SidebarShell>
      <div className="px-4 sm:px-6 py-8 sm:py-12 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <Link
            href="/simulate"
            className="text-[11px] font-mono uppercase hover:opacity-70"
            style={{ color: "var(--text-faint)", letterSpacing: "0.14em" }}
          >
            ← simulateit
          </Link>
          <span
            className="text-[11px] font-mono"
            style={{ color: "var(--text-faint)" }}
          >
            /
          </span>
          <span
            className="text-[11px] font-mono uppercase"
            style={{ color: "var(--brand-primary)", letterSpacing: "0.14em" }}
          >
            your stats
          </span>
        </div>

        <h1
          className="font-display font-bold mb-1"
          style={{
            color: "var(--text-primary)",
            letterSpacing: "-0.025em",
            fontSize: "clamp(28px, 4.5vw, 44px)",
          }}
        >
          {session.name?.split(" ")[0] ?? "Your"}&apos;s SimulateIt
        </h1>
        <p
          className="text-sm sm:text-base mb-6"
          style={{ color: "var(--text-muted)" }}
        >
          Lifetime stats across every drill you&apos;ve played, signed in as{" "}
          <span style={{ color: "var(--text-primary)" }}>{session.email}</span>.
        </p>

        {totalAttempts === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Top-line stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
              <StatTile
                icon={Sparkles}
                label="Drills played"
                value={String(totalAttempts)}
                sub={`${distinctDrills} unique`}
              />
              <StatTile
                icon={Trophy}
                label="Lifetime accuracy"
                value={`${Math.round(lifetimeAccuracy * 100)}%`}
                sub={`${sum.score} / ${sum.max} pts`}
              />
              <StatTile
                icon={Flame}
                label="Current streak"
                value={`${currentStreak}w`}
                sub={currentStreak > 0 ? "Active" : "Play one to start"}
                highlight={currentStreak > 0}
              />
              <StatTile
                icon={Trophy}
                label="Best streak"
                value={`${bestStreak}w`}
                sub="Consecutive weeks"
              />
            </div>

            {/* Dimensional breakdown */}
            <h3
              className="text-[11px] font-mono uppercase mb-3"
              style={{ color: "var(--text-faint)", letterSpacing: "0.14em" }}
            >
              How you score across the three dimensions
            </h3>
            <div className="space-y-2.5 mb-7">
              {dimData.map(({ dim, score, max }) => {
                const acc = pct(score, max);
                const Icon = DIMENSION_ICON[dim];
                return (
                  <div
                    key={dim}
                    className="rounded-xl px-5 py-4"
                    style={{
                      background: "var(--card-bg)",
                      border: "1.5px solid var(--card-border)",
                      borderLeft: `4px solid ${DIMENSION_COLOR[dim]}`,
                    }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Icon
                        size={16}
                        strokeWidth={2}
                        style={{ color: DIMENSION_COLOR[dim] }}
                      />
                      <span
                        className="text-sm font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {DIMENSION_LABEL[dim]}
                      </span>
                      <span
                        className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded"
                        style={{
                          background: "var(--tag-bg)",
                          color: "var(--text-faint)",
                          letterSpacing: "0.12em",
                        }}
                      >
                        {dimensionVerdict(acc)}
                      </span>
                      <span
                        className="ml-auto text-sm font-mono"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {max > 0
                          ? `${Math.round(acc * 100)}%`
                          : "—"}
                      </span>
                    </div>
                    <div
                      className="h-1.5 rounded-full overflow-hidden"
                      style={{
                        background:
                          "color-mix(in srgb, var(--text-faint) 18%, transparent)",
                      }}
                    >
                      <div
                        className="h-full"
                        style={{
                          width: `${Math.round(acc * 100)}%`,
                          background: DIMENSION_COLOR[dim],
                        }}
                      />
                    </div>
                    <p
                      className="text-[11px] mt-1.5 font-mono"
                      style={{ color: "var(--text-faint)" }}
                    >
                      {score} / {max} pts across drills that tested this
                      dimension
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Recommendation */}
            {weakest && weakest.max > 0 && (
              <div
                className="rounded-2xl px-6 py-5 mb-7"
                style={{
                  background: "var(--card-bg)",
                  border: "1.5px solid var(--card-border)",
                  borderLeft: `4px solid ${DIMENSION_COLOR[weakest.dim]}`,
                }}
              >
                <h3
                  className="text-[11px] font-mono uppercase mb-2 inline-flex items-center gap-1.5"
                  style={{
                    color: DIMENSION_COLOR[weakest.dim],
                    letterSpacing: "0.14em",
                  }}
                >
                  <Sparkles size={11} strokeWidth={2.2} />
                  Where to sharpen next
                </h3>
                <p
                  className="text-sm sm:text-base leading-relaxed"
                  style={{ color: "var(--text-primary)" }}
                >
                  Your weakest dimension is{" "}
                  <strong>{DIMENSION_LABEL[weakest.dim]}</strong> at{" "}
                  <strong>{Math.round(pct(weakest.score, weakest.max) * 100)}%</strong>.{" "}
                  <Link
                    href="/simulate"
                    className="underline"
                    style={{ color: DIMENSION_COLOR[weakest.dim] }}
                  >
                    Pick a drill that emphasizes it
                  </Link>{" "}
                  and try to beat your current score.
                </p>
              </div>
            )}

            {/* Recent attempts */}
            <h3
              className="text-[11px] font-mono uppercase mb-3"
              style={{ color: "var(--text-faint)", letterSpacing: "0.14em" }}
            >
              Recent attempts
            </h3>
            <div className="space-y-2 mb-8">
              {recent.map((a) => {
                const drill = getDrillBySlug(a.drillSlug);
                const acc = pct(a.score, a.maxPossible);
                return (
                  <Link
                    key={a.id}
                    href={`/simulate/${a.drillSlug}`}
                    className="block rounded-xl px-4 py-3 transition-colors group"
                    style={{
                      background: "var(--card-bg)",
                      border: "1.5px solid var(--card-border)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-semibold truncate group-hover:underline"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {drill ? drillTitle(drill.slug) : a.drillSlug}
                        </p>
                        <p
                          className="text-[11px] font-mono mt-0.5"
                          style={{ color: "var(--text-faint)" }}
                        >
                          {new Date(a.attemptedAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                          {drill && (
                            <>
                              {" · "}
                              {drill.type} · {drill.category}
                            </>
                          )}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <span
                          className="font-display font-bold text-lg"
                          style={{
                            color:
                              acc >= 0.85
                                ? "#0F9D58"
                                : acc >= 0.7
                                ? "#22C55E"
                                : acc >= 0.5
                                ? "#D97706"
                                : "var(--brand-primary)",
                          }}
                        >
                          {a.score}
                        </span>
                        <span
                          className="text-xs font-mono ml-0.5"
                          style={{ color: "var(--text-faint)" }}
                        >
                          /{a.maxPossible}
                        </span>
                      </div>
                      <ArrowUpRight
                        size={14}
                        strokeWidth={2}
                        style={{ color: "var(--text-faint)" }}
                        className="flex-shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </div>
                  </Link>
                );
              })}
            </div>

            <Link
              href="/simulate"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-transform hover:scale-[1.02]"
              style={{
                background: "var(--brand-primary)",
                color: "#ffffff",
              }}
            >
              Play another drill
              <ArrowUpRight size={14} strokeWidth={2} />
            </Link>
          </>
        )}
      </div>
    </SidebarShell>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  sub,
  highlight = false,
}: {
  icon: typeof Brain;
  label: string;
  value: string;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div
      className="rounded-xl px-4 py-4"
      style={{
        background: "var(--card-bg)",
        border: "1.5px solid var(--card-border)",
        borderLeft: highlight
          ? "4px solid var(--brand-primary)"
          : "1.5px solid var(--card-border)",
      }}
    >
      <Icon
        size={14}
        strokeWidth={2}
        style={{
          color: highlight ? "var(--brand-primary)" : "var(--text-faint)",
        }}
        className="mb-2"
      />
      <p
        className="text-[10px] font-mono uppercase mb-1"
        style={{ color: "var(--text-faint)", letterSpacing: "0.14em" }}
      >
        {label}
      </p>
      <p
        className="font-display text-2xl font-bold"
        style={{ color: "var(--text-primary)" }}
      >
        {value}
      </p>
      <p
        className="text-[11px] font-mono mt-0.5"
        style={{ color: "var(--text-faint)" }}
      >
        {sub}
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="rounded-2xl px-6 py-10 text-center"
      style={{
        background: "var(--card-bg)",
        border: "1.5px solid var(--card-border)",
      }}
    >
      <p
        className="text-sm mb-4"
        style={{ color: "var(--text-muted)" }}
      >
        No drills played yet. Once you complete a drill while signed in, your
        score lands here automatically.
      </p>
      <Link
        href="/simulate"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm"
        style={{
          background: "var(--brand-primary)",
          color: "#ffffff",
        }}
      >
        Play your first drill
        <ArrowUpRight size={14} strokeWidth={2} />
      </Link>
    </div>
  );
}
