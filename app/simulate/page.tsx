// SimulateIt landing page. Server component — pulls the latest
// published drill from the auto-generated data/drills.ts and renders
// a featured card plus a short pitch. Future-dated drills are filtered
// out by publishedDrills() at request time.

import Link from "next/link";
import { ArrowUpRight, Brain, Clock, Target } from "lucide-react";
import { SidebarShell } from "@/components/SidebarShell";
import { publishedDrills, type Drill } from "@/data/drills";

export const dynamic = "force-dynamic";

const TYPE_BADGE: Record<Drill["type"], { label: string; color: string }> = {
  historical: { label: "Historical", color: "#9B8FFF" },
  current: { label: "Current", color: "#26A69A" },
  hypothetical: { label: "Hypothetical", color: "#F5C842" },
};

export default function SimulatePage() {
  // In dev, surface every drill regardless of publishedAt so authoring
  // doesn't require date-juggling. Production respects the schedule.
  const isDev = process.env.NODE_ENV !== "production";
  const cutoff = isDev ? new Date("2099-12-31") : new Date();
  const all = publishedDrills(cutoff);
  const featured = all[0];

  return (
    <SidebarShell>
      <div className="px-4 sm:px-6 py-10 sm:py-16 max-w-4xl mx-auto">
        {/* Eyebrow */}
        <div className="flex items-center gap-2.5 mb-5">
          <span
            className="w-5 h-px"
            style={{ background: "var(--brand-primary)" }}
          />
          <span
            className="text-[10px] font-mono uppercase"
            style={{
              color: "var(--brand-primary)",
              letterSpacing: "0.16em",
            }}
          >
            simulateit · northstar
          </span>
        </div>

        {/* Hero */}
        <h1
          className="font-display font-bold leading-[1.02] mb-4"
          style={{
            color: "var(--text-primary)",
            letterSpacing: "-0.035em",
            fontSize: "clamp(32px, 5vw, 56px)",
          }}
        >
          Practice the decisions that built<br className="hidden sm:block" />
          {" "}(and killed) every company you know.
        </h1>

        <p
          className="text-base sm:text-lg leading-relaxed mb-8 max-w-2xl"
          style={{ color: "var(--text-muted)" }}
        >
          Branching decision drills based on real startup moments. You make
          the calls, you see the consequences, you score across product
          thinking, business judgement, and founder instinct. Two new drills
          every week.
        </p>

        {/* Featured drill card */}
        {featured ? (
          <FeaturedDrillCard drill={featured} />
        ) : (
          <NoDrillYet />
        )}

        {/* What this is — 3 column explainer */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-10 mb-12">
          <ExplainerTile
            icon={Brain}
            title="No memorization"
            body="Scenarios are anonymized. You can't pattern-match — you have to reason."
          />
          <ExplainerTile
            icon={Target}
            title="Three dimensions"
            body="Every drill scores you on product thinking, business judgement, and founder calls."
          />
          <ExplainerTile
            icon={Clock}
            title="~10 minutes"
            body="Branching scenarios with rationales for every choice. Free, no signup."
          />
        </div>

        {/* Archive — all published drills */}
        {all.length > 1 && (
          <section className="mt-12">
            <h2
              className="font-display text-xl font-semibold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Past drills
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {all.slice(1).map((d) => (
                <ArchiveCard key={d.slug} drill={d} />
              ))}
            </div>
          </section>
        )}
      </div>
    </SidebarShell>
  );
}

function FeaturedDrillCard({ drill }: { drill: Drill }) {
  const badge = TYPE_BADGE[drill.type];
  return (
    <Link
      href={`/simulate/${drill.slug}`}
      className="block rounded-2xl overflow-hidden transition-all hover:opacity-95 group"
      style={{
        background: "var(--card-bg)",
        border: "1.5px solid var(--card-border)",
        borderLeft: "4px solid var(--brand-primary)",
      }}
    >
      <div className="px-6 py-8 sm:px-10 sm:py-12">
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span
            className="text-[10px] font-mono uppercase px-2 py-1 rounded"
            style={{
              background: "color-mix(in srgb, var(--brand-primary) 12%, transparent)",
              color: "var(--brand-primary)",
              letterSpacing: "0.14em",
            }}
          >
            Featured drill
          </span>
          <span
            className="text-[10px] font-mono uppercase px-2 py-1 rounded"
            style={{
              background: `color-mix(in srgb, ${badge.color} 14%, transparent)`,
              color: badge.color,
              letterSpacing: "0.14em",
            }}
          >
            {badge.label}
          </span>
          <span
            className="text-[10px] font-mono"
            style={{ color: "var(--text-faint)" }}
          >
            ~{drill.estimatedMinutes} min
          </span>
        </div>

        <h2
          className="font-display text-2xl sm:text-3xl font-bold mb-3"
          style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
        >
          {drillTitle(drill)}
        </h2>

        <p
          className="text-sm sm:text-base leading-relaxed mb-5 line-clamp-4"
          style={{ color: "var(--text-muted)" }}
        >
          {drill.intro.split("\n\n")[0]}
        </p>

        <span className="btn-primary group">
          Play this drill
          <ArrowUpRight
            size={14}
            strokeWidth={1.8}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </div>
    </Link>
  );
}

function ArchiveCard({ drill }: { drill: Drill }) {
  const badge = TYPE_BADGE[drill.type];
  return (
    <Link
      href={`/simulate/${drill.slug}`}
      className="block rounded-xl px-5 py-5 transition-colors group"
      style={{
        background: "var(--card-bg)",
        border: "1.5px solid var(--card-border)",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded"
          style={{
            background: `color-mix(in srgb, ${badge.color} 18%, transparent)`,
            color: badge.color,
            letterSpacing: "0.12em",
          }}
        >
          {badge.label}
        </span>
        <span
          className="text-[10px] font-mono"
          style={{ color: "var(--text-faint)" }}
        >
          ~{drill.estimatedMinutes} min
        </span>
      </div>
      <h3
        className="font-display text-base font-semibold mb-1 group-hover:underline"
        style={{ color: "var(--text-primary)" }}
      >
        {drillTitle(drill)}
      </h3>
      <p
        className="text-xs leading-relaxed line-clamp-2"
        style={{ color: "var(--text-muted)" }}
      >
        {drill.intro.split("\n\n")[0]}
      </p>
    </Link>
  );
}

function ExplainerTile({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Brain;
  title: string;
  body: string;
}) {
  return (
    <div
      className="rounded-xl px-4 py-4"
      style={{
        background: "var(--card-bg)",
        border: "1.5px solid var(--card-border)",
      }}
    >
      <Icon
        size={18}
        strokeWidth={1.8}
        style={{ color: "var(--brand-primary)" }}
        className="mb-2"
      />
      <h3
        className="text-sm font-semibold mb-1"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </h3>
      <p
        className="text-xs leading-relaxed"
        style={{ color: "var(--text-muted)" }}
      >
        {body}
      </p>
    </div>
  );
}

function NoDrillYet() {
  return (
    <div
      className="rounded-2xl px-6 py-10 text-center"
      style={{
        background: "var(--card-bg)",
        border: "1.5px solid var(--card-border)",
      }}
    >
      <p
        className="text-sm"
        style={{ color: "var(--text-muted)" }}
      >
        First drill drops Monday, June 1 at 8:30pm IST.
      </p>
    </div>
  );
}

function drillTitle(drill: Drill): string {
  // Derive a human-readable title from the slug. Eventually drills can
  // carry their own `title` field; for now slug-based is fine.
  return drill.slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
