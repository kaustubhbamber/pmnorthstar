"use client";

// SimulatePlayer — the interactive drill engine.
//
// State machine: intro → decision → reveal → decision → reveal → outcome.
// Each "decision" node shows the prompt + N options. After picking,
// "reveal" shows the consequence of the choice + the rationales for every
// option (educational, not punitive). The terminal "outcome" node
// surfaces the final score, dimensional breakdown, principle, and the
// markdown reveal section ("What actually happened").
//
// Mid-drill state lives in localStorage so a refresh doesn't lose
// progress. Auth-bound persistence (streaks, lifetime stats) is layered
// on later — for now it's anonymous play only.

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  X,
  RotateCcw,
  Share2,
  Sparkles,
  Brain,
  TrendingUp,
  Users,
} from "lucide-react";
import type {
  Drill,
  DrillDimension,
  DrillNode,
  DrillOption,
} from "@/data/drills";
import { track } from "@/lib/track";
import { SubscribeForm } from "@/components/SubscribeForm";

type Phase = "intro" | "decision" | "reveal" | "outcome";

interface HistoryEntry {
  nodeId: string;
  optionIndex: number;
  points: number;
  dimension?: DrillDimension;
}

interface PlayState {
  phase: Phase;
  currentNodeId: string;
  history: HistoryEntry[];
  startedAt: number;
}

const DIMENSION_LABEL: Record<DrillDimension, string> = {
  product: "Product thinking",
  business: "Business judgement",
  founder: "Founder thinking",
};

// Three dimensions, three distinct hues — kept readable on both
// light + dark cards. Founder color softened from brand-red to amber
// so the result screen doesn't feel saturated with red.
const DIMENSION_COLOR: Record<DrillDimension, string> = {
  product: "#2563EB",
  business: "#0F9D58",
  founder: "#D97706",
};

const DIMENSION_ICON: Record<
  DrillDimension,
  typeof Brain
> = {
  product: Brain,
  business: TrendingUp,
  founder: Users,
};

function storageKey(slug: string): string {
  return `simulateit:play:${slug}`;
}

export function SimulatePlayer({ drill }: { drill: Drill }) {
  const [state, setState] = useState<PlayState>(() => ({
    phase: "intro",
    currentNodeId: "start",
    history: [],
    startedAt: Date.now(),
  }));

  // Restore mid-drill state from localStorage if a session exists.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(storageKey(drill.slug));
      if (!raw) return;
      const parsed = JSON.parse(raw) as PlayState;
      // Sanity-check: node must still exist (drills can be edited).
      if (parsed.currentNodeId && drill.nodes[parsed.currentNodeId]) {
        setState(parsed);
      }
    } catch {
      /* swallow */
    }
  }, [drill.slug, drill.nodes]);

  // Persist on every state change.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(storageKey(drill.slug), JSON.stringify(state));
    } catch {
      /* swallow */
    }
  }, [state, drill.slug]);

  const currentNode = drill.nodes[state.currentNodeId];

  // Guards a single completion-log per drill run. Reset whenever a run
  // (re)starts. Prevents a double-tap on "Continue" from logging two
  // attempts into the usage counter.
  const loggedCompletionRef = useRef(false);

  const begin = useCallback(() => {
    track({ name: "simulateit_drill_started", drill_slug: drill.slug });
    loggedCompletionRef.current = false;
    setState({
      phase: "decision",
      currentNodeId: "start",
      history: [],
      startedAt: Date.now(),
    });
  }, [drill.slug]);

  const selectOption = useCallback(
    (optionIndex: number) => {
      if (!currentNode || !currentNode.options) return;
      // Ignore taps that arrive after we've already left the decision
      // phase (slow double-click).
      if (state.phase !== "decision") return;
      const opt = currentNode.options[optionIndex];
      const entry: HistoryEntry = {
        nodeId: state.currentNodeId,
        optionIndex,
        points: opt.points,
        dimension: currentNode.dimension,
      };
      track({
        name: "simulateit_option_picked",
        drill_slug: drill.slug,
        node_id: state.currentNodeId,
        option_index: optionIndex,
        points: opt.points,
      });
      setState((s) => {
        // Atomic guard against a rapid double-tap firing this twice before
        // re-render. Without it, the second tap appends a duplicate history
        // entry, so the reveal header reads "Decision 2" while the body is
        // still Decision 1's content.
        if (s.phase !== "decision") return s;
        return { ...s, phase: "reveal", history: [...s.history, entry] };
      });
    },
    [currentNode, state.currentNodeId, state.phase, drill.slug]
  );

  const advance = useCallback(() => {
    if (!currentNode || !currentNode.options) return;
    // Ignore a Continue tap that lands after we've already advanced.
    if (state.phase !== "reveal") return;
    const last = state.history[state.history.length - 1];
    if (!last) return;
    const nextId = currentNode.options[last.optionIndex].leadsTo;
    const nextNode = drill.nodes[nextId];
    if (!nextNode) return;
    if (nextNode.isOutcome) {
      // Side effects (analytics + usage-counter log) run once per run,
      // even if Continue is double-tapped, via the ref guard.
      if (!loggedCompletionRef.current) {
        loggedCompletionRef.current = true;
        track({
          name: "simulateit_drill_completed",
          drill_slug: drill.slug,
          node_id: nextId,
          decisions: state.history.length,
        });
        // Log an anonymous completion for the usage counter (mirrors
        // CheckIt). Fire-and-forget — the browser keeps the request alive
        // and a logging failure must never interrupt the outcome screen.
        const finalScore = state.history.reduce((sum, h) => sum + h.points, 0);
        const finalMax = state.history.reduce((sum, h) => {
          const node = drill.nodes[h.nodeId];
          if (!node?.options) return sum;
          return sum + Math.max(...node.options.map((o) => o.points));
        }, 0);
        fetch("/api/simulate/log-attempt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            drillSlug: drill.slug,
            score: finalScore,
            maxPossible: finalMax,
          }),
          keepalive: true,
        }).catch(() => {
          /* swallow */
        });
      }
      setState((s) => (s.phase !== "reveal" ? s : { ...s, phase: "outcome", currentNodeId: nextId }));
    } else {
      setState((s) => (s.phase !== "reveal" ? s : { ...s, phase: "decision", currentNodeId: nextId }));
    }
  }, [currentNode, state.history, state.phase, drill.nodes, drill.slug]);

  const restart = useCallback(() => {
    track({ name: "simulateit_drill_restarted", drill_slug: drill.slug });
    loggedCompletionRef.current = false;
    if (typeof window !== "undefined") {
      localStorage.removeItem(storageKey(drill.slug));
    }
    setState({
      phase: "intro",
      currentNodeId: "start",
      history: [],
      startedAt: Date.now(),
    });
  }, [drill.slug]);

  // Running score. Sums points earned and the max points that *could*
  // have been earned across every decision already locked in. Doesn't
  // include the current (unanswered) node. Visible during decision +
  // reveal so the player can track how they're tracking.
  const runningTotals = useMemo(() => {
    let score = 0;
    let max = 0;
    for (const h of state.history) {
      const node = drill.nodes[h.nodeId];
      if (!node?.options) continue;
      score += h.points;
      max += Math.max(...node.options.map((o) => o.points));
    }
    return { score, max };
  }, [state.history, drill.nodes]);

  const showRunningScore =
    (state.phase === "decision" || state.phase === "reveal") &&
    runningTotals.max > 0;

  return (
    <div className="px-4 sm:px-6 py-8 sm:py-12 max-w-3xl mx-auto">
      {/* Top breadcrumb */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <Link
          href="/simulate"
          className="text-[11px] font-mono uppercase hover:opacity-70"
          style={{
            color: "var(--text-faint)",
            letterSpacing: "0.14em",
          }}
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
          style={{
            color: "var(--brand-primary)",
            letterSpacing: "0.14em",
          }}
        >
          {drill.type}
        </span>
        {showRunningScore && (
          <span
            className="ml-auto inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-1 rounded-md"
            style={{
              background: "var(--card-bg)",
              border: "1.5px solid var(--card-border)",
              color: "var(--text-muted)",
              letterSpacing: "0.08em",
            }}
            title="Your score so far across locked-in decisions"
          >
            <span
              className="uppercase"
              style={{ color: "var(--text-faint)" }}
            >
              Score
            </span>
            <span
              style={{
                color: scoreColor(runningTotals.score / runningTotals.max),
                fontWeight: 600,
              }}
            >
              {runningTotals.score}
            </span>
            <span style={{ color: "var(--text-faint)" }}>
              / {runningTotals.max}
            </span>
          </span>
        )}
      </div>

      {state.phase === "intro" && (
        <IntroView drill={drill} onBegin={begin} />
      )}
      {state.phase === "decision" && currentNode && (
        <DecisionView
          drill={drill}
          node={currentNode}
          nodeId={state.currentNodeId}
          step={state.history.length + 1}
          onSelect={selectOption}
        />
      )}
      {state.phase === "reveal" && currentNode && (
        <RevealView
          drill={drill}
          node={currentNode}
          nodeId={state.currentNodeId}
          step={state.history.length}
          selectedIndex={
            state.history[state.history.length - 1]?.optionIndex ?? 0
          }
          onAdvance={advance}
        />
      )}
      {state.phase === "outcome" && currentNode && (
        <OutcomeView
          drill={drill}
          finalNode={currentNode}
          history={state.history}
          onRestart={restart}
        />
      )}
    </div>
  );
}

// ── Phase: Intro ──────────────────────────────────────────────────────

function IntroView({
  drill,
  onBegin,
}: {
  drill: Drill;
  onBegin: () => void;
}) {
  // Per-drill play count for social proof at the point of attempt —
  // the SimulateIt analog to CheckIt's "X sites scored" hero line.
  // Best-effort: if the endpoint fails or returns zero, the line just
  // doesn't render.
  const [plays, setPlays] = useState<number | null>(null);
  useEffect(() => {
    fetch(`/api/simulate/stats?slug=${encodeURIComponent(drill.slug)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && typeof d.total === "number" && setPlays(d.total))
      .catch(() => {
        /* swallow */
      });
  }, [drill.slug]);

  return (
    <div>
      <h1
        className="font-display font-bold leading-[1.05] mb-5"
        style={{
          color: "var(--text-primary)",
          letterSpacing: "-0.025em",
          fontSize: "clamp(28px, 4.5vw, 44px)",
        }}
      >
        {drillTitle(drill)}
      </h1>

      <div
        className="text-[10px] font-mono uppercase mb-5 inline-flex items-center gap-2 flex-wrap"
        style={{
          color: "var(--text-faint)",
          letterSpacing: "0.14em",
        }}
      >
        <span>~{drill.estimatedMinutes} minutes</span>
        <span>•</span>
        <span>{drill.category}</span>
        {plays !== null && plays > 0 && (
          <>
            <span>•</span>
            <span style={{ color: "var(--brand-primary)" }}>
              {plays.toLocaleString()} {plays === 1 ? "play" : "plays"}
            </span>
          </>
        )}
      </div>

      {drill.intro.split("\n\n").map((para, i) => (
        <p
          key={i}
          className="text-base sm:text-lg leading-relaxed mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          {para}
        </p>
      ))}

      <button
        onClick={onBegin}
        className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-base transition-transform hover:scale-[1.02]"
        style={{
          background: "var(--brand-primary)",
          color: "#ffffff",
        }}
      >
        <Sparkles size={16} strokeWidth={2} />
        Begin the drill
        <ArrowRight size={16} strokeWidth={2} />
      </button>
    </div>
  );
}

// ── Phase: Decision ───────────────────────────────────────────────────

function DecisionView({
  drill,
  node,
  nodeId,
  step,
  onSelect,
}: {
  drill: Drill;
  node: DrillNode;
  nodeId: string;
  step: number;
  onSelect: (index: number) => void;
}) {
  const Icon = node.dimension ? DIMENSION_ICON[node.dimension] : Brain;
  const dimColor = node.dimension
    ? DIMENSION_COLOR[node.dimension]
    : "var(--brand-primary)";
  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className="text-[10px] font-mono uppercase px-2 py-1 rounded inline-flex items-center gap-1.5"
          style={{
            background: `color-mix(in srgb, ${dimColor} 14%, transparent)`,
            color: dimColor,
            letterSpacing: "0.14em",
          }}
        >
          <Icon size={11} strokeWidth={2.2} />
          Decision {step} · {node.dimension ? DIMENSION_LABEL[node.dimension] : ""}
        </span>
      </div>

      {/* Prompt */}
      <div
        className="rounded-2xl px-5 py-6 sm:px-7 sm:py-7 mb-6"
        style={{
          background: "var(--card-bg)",
          border: "1.5px solid var(--card-border)",
          borderLeft: `4px solid ${dimColor}`,
        }}
      >
        {node.prompt!.split("\n\n").map((para, i) => (
          <p
            key={i}
            className="text-base sm:text-lg leading-relaxed mb-3 last:mb-0"
            style={{ color: "var(--text-primary)" }}
          >
            {para}
          </p>
        ))}
      </div>

      {/* Options */}
      <div className="space-y-2.5">
        {node.options!.map((opt, i) => (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className="block w-full text-left rounded-xl px-5 py-4 transition-all hover:scale-[1.005] group"
            style={{
              background: "var(--card-bg)",
              border: "1.5px solid var(--card-border)",
            }}
          >
            <div className="flex items-start gap-3">
              <span
                className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-mono font-semibold mt-0.5"
                style={{
                  background: "color-mix(in srgb, var(--brand-primary) 10%, transparent)",
                  color: "var(--brand-primary)",
                }}
              >
                {String.fromCharCode(65 + i)}
              </span>
              <span
                className="text-sm sm:text-base leading-relaxed font-medium group-hover:underline"
                style={{ color: "var(--text-primary)" }}
              >
                {opt.text}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Phase: Reveal ─────────────────────────────────────────────────────

function RevealView({
  drill,
  node,
  nodeId,
  step,
  selectedIndex,
  onAdvance,
}: {
  drill: Drill;
  node: DrillNode;
  nodeId: string;
  step: number;
  selectedIndex: number;
  onAdvance: () => void;
}) {
  const opts = node.options!;
  const selectedOpt = opts[selectedIndex];
  const maxPoints = Math.max(...opts.map((o) => o.points));
  const isOptimal = selectedOpt.points === maxPoints;
  const dimColor = node.dimension
    ? DIMENSION_COLOR[node.dimension]
    : "var(--brand-primary)";

  return (
    <div>
      {/* Score banner for this decision */}
      <div
        className="rounded-2xl px-5 py-5 sm:px-6 sm:py-6 mb-5"
        style={{
          background: isOptimal
            ? "color-mix(in srgb, #22C55E 14%, transparent)"
            : selectedOpt.points >= maxPoints / 2
            ? "color-mix(in srgb, #F59E0B 14%, transparent)"
            : "color-mix(in srgb, var(--brand-primary) 12%, transparent)",
          border: `1.5px solid ${
            isOptimal
              ? "#22C55E"
              : selectedOpt.points >= maxPoints / 2
              ? "#F59E0B"
              : "var(--brand-primary)"
          }`,
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          <span
            className="text-[10px] font-mono uppercase"
            style={{
              color: "var(--text-faint)",
              letterSpacing: "0.14em",
            }}
          >
            Decision {step} · Your pick
          </span>
          <span
            className="text-[10px] font-mono ml-auto px-2 py-0.5 rounded"
            style={{
              background: "var(--card-bg)",
              color: "var(--text-primary)",
              border: "1px solid var(--card-border)",
            }}
          >
            {selectedOpt.points} / {maxPoints} pts
          </span>
        </div>
        <p
          className="text-base sm:text-lg leading-relaxed font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          {selectedOpt.consequence}
        </p>
      </div>

      {/* All option rationales — the educational meat */}
      <h3
        className="text-[11px] font-mono uppercase mb-3"
        style={{
          color: "var(--text-faint)",
          letterSpacing: "0.14em",
        }}
      >
        How every option played
      </h3>
      <div className="space-y-2.5 mb-7">
        {opts.map((opt, i) => {
          const isPicked = i === selectedIndex;
          const isBest = opt.points === maxPoints;
          return (
            <div
              key={i}
              className="rounded-xl px-5 py-4"
              style={{
                background: isPicked
                  ? "color-mix(in srgb, var(--brand-primary) 6%, var(--card-bg))"
                  : "var(--card-bg)",
                border: `1.5px solid ${
                  isPicked ? dimColor : "var(--card-border)"
                }`,
              }}
            >
              {/* Meta row: letter badge + pattern tag + points score.
                  Lives on its own row so long pattern slugs can't squeeze
                  the option text into a narrow column on mobile. */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-mono font-semibold"
                  style={{
                    background: isBest
                      ? "rgba(34,197,94,0.15)"
                      : opt.points === 0
                      ? "rgba(243,18,60,0.12)"
                      : "color-mix(in srgb, var(--text-faint) 14%, transparent)",
                    color: isBest
                      ? "#22C55E"
                      : opt.points === 0
                      ? "var(--brand-primary)"
                      : "var(--text-muted)",
                  }}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                  style={{
                    background: "var(--tag-bg)",
                    color: "var(--text-faint)",
                    wordBreak: "break-all",
                  }}
                  title="Mental-model pattern"
                >
                  {opt.pattern}
                </span>
                <span
                  className="ml-auto text-[11px] font-mono font-semibold flex-shrink-0"
                  style={{
                    color: isBest
                      ? "#22C55E"
                      : opt.points === 0
                      ? "var(--brand-primary)"
                      : "var(--text-muted)",
                  }}
                >
                  {opt.points} pts
                </span>
              </div>
              {/* Option text — full width, not squeezed by adjacent chips */}
              <p
                className="text-sm font-semibold mb-2 leading-snug"
                style={{ color: "var(--text-primary)" }}
              >
                {opt.text}
              </p>
              <p
                className="text-xs sm:text-sm leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                {opt.rationale}
              </p>
            </div>
          );
        })}
      </div>

      <button
        onClick={onAdvance}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-transform hover:scale-[1.02]"
        style={{
          background: "var(--brand-primary)",
          color: "#ffffff",
        }}
      >
        Continue
        <ArrowRight size={16} strokeWidth={2} />
      </button>
    </div>
  );
}

// ── Phase: Outcome ────────────────────────────────────────────────────
//
// The auto-save / stats-tracking flow was reverted. The save-attempt
// endpoint, /simulate/me page, and DrillAttempt model are still in
// the codebase but not wired into the outcome view. Re-enable by
// adding back a useEffect that POSTs to /api/simulate/save-attempt
// when /api/auth/me confirms a session.

function OutcomeView({
  drill,
  finalNode,
  history,
  onRestart,
}: {
  drill: Drill;
  finalNode: DrillNode;
  history: HistoryEntry[];
  onRestart: () => void;
}) {
  // Score math — per-dimension and total.
  const dims: DrillDimension[] = ["product", "business", "founder"];
  const scoreByDim = useMemo(() => {
    const result: Record<DrillDimension, { score: number; max: number }> = {
      product: { score: 0, max: 0 },
      business: { score: 0, max: 0 },
      founder: { score: 0, max: 0 },
    };
    for (const entry of history) {
      if (!entry.dimension) continue;
      result[entry.dimension].score += entry.points;
      // Max for this node = highest option points
      const node = drill.nodes[entry.nodeId];
      if (node?.options) {
        result[entry.dimension].max += Math.max(
          ...node.options.map((o) => o.points)
        );
      }
    }
    return result;
  }, [history, drill.nodes]);

  const totalScore = history.reduce((sum, h) => sum + h.points, 0);
  const totalMax = dims.reduce((sum, d) => sum + scoreByDim[d].max, 0);

  const dominantDim = useMemo(() => {
    let best: DrillDimension = "product";
    let bestPct = -1;
    for (const d of dims) {
      const s = scoreByDim[d];
      if (s.max === 0) continue;
      const pct = s.score / s.max;
      if (pct > bestPct) {
        bestPct = pct;
        best = d;
      }
    }
    return best;
  }, [scoreByDim]);

  const weakestDim = useMemo(() => {
    let worst: DrillDimension = "product";
    let worstPct = 2;
    for (const d of dims) {
      const s = scoreByDim[d];
      if (s.max === 0) continue;
      const pct = s.score / s.max;
      if (pct < worstPct) {
        worstPct = pct;
        worst = d;
      }
    }
    return worst;
  }, [scoreByDim]);

  // Wordle-style emoji string for share.
  const shareString = useMemo(() => {
    const blocks = history
      .map((h) => {
        const node = drill.nodes[h.nodeId];
        if (!node?.options) return "⬜";
        const max = Math.max(...node.options.map((o) => o.points));
        if (h.points === max) return "🟩";
        if (h.points >= max / 2) return "🟨";
        return "🟥";
      })
      .join("");
    return `SimulateIt — ${drillTitle(drill)}\n${blocks} ${totalScore}/${totalMax}`;
  }, [history, drill, totalScore, totalMax]);

  const handleShare = useCallback(() => {
    track({ name: "simulateit_shared", drill_slug: drill.slug });
    const text = shareString + `\n\nnorthstar — pmnorthstar.in/simulate/${drill.slug}`;
    if (navigator.share) {
      navigator
        .share({ title: `SimulateIt — ${drillTitle(drill)}`, text })
        .catch(() => {
          /* user cancelled */
        });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert("Result copied to clipboard");
    }
  }, [shareString, drill]);

  return (
    <div>
      {/* Title */}
      <h1
        className="font-display font-bold mb-2"
        style={{
          color: "var(--text-primary)",
          letterSpacing: "-0.025em",
          fontSize: "clamp(28px, 4.5vw, 40px)",
        }}
      >
        Result
      </h1>
      <p
        className="text-sm mb-6"
        style={{ color: "var(--text-muted)" }}
      >
        {drillTitle(drill)}
      </p>

      {/* Big score — score color shifts on percentage band, surface stays
          neutral so the page doesn't feel like a stop-sign. */}
      <div
        className="rounded-2xl px-6 py-8 sm:px-8 sm:py-10 mb-6"
        style={{
          background: "var(--card-bg)",
          border: "1.5px solid var(--card-border)",
          borderLeft: `4px solid ${scoreColor(totalScore / totalMax)}`,
        }}
      >
        <div
          className="text-[10px] font-mono uppercase mb-1"
          style={{
            color: "var(--text-faint)",
            letterSpacing: "0.16em",
          }}
        >
          Your score
        </div>
        <div className="flex items-baseline gap-2 mb-3">
          <span
            className="font-display font-bold"
            style={{
              color: scoreColor(totalScore / totalMax),
              fontSize: "clamp(48px, 9vw, 80px)",
            }}
          >
            {totalScore}
          </span>
          <span
            className="text-2xl font-mono"
            style={{ color: "var(--text-faint)" }}
          >
            / {totalMax}
          </span>
        </div>
        <div
          className="text-base sm:text-lg leading-relaxed mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          {pctVerdict(totalScore / totalMax)}
        </div>
      </div>

      {/* Dimensional breakdown */}
      <h3
        className="text-[11px] font-mono uppercase mb-3"
        style={{
          color: "var(--text-faint)",
          letterSpacing: "0.14em",
        }}
      >
        How you scored across dimensions
      </h3>
      <div className="space-y-2.5 mb-7">
        {dims.map((d) => {
          const s = scoreByDim[d];
          if (s.max === 0) return null;
          const pct = s.score / s.max;
          const Icon = DIMENSION_ICON[d];
          return (
            <div
              key={d}
              className="rounded-xl px-5 py-4"
              style={{
                background: "var(--card-bg)",
                border: "1.5px solid var(--card-border)",
                borderLeft: `4px solid ${DIMENSION_COLOR[d]}`,
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon
                  size={16}
                  strokeWidth={2}
                  style={{ color: DIMENSION_COLOR[d] }}
                />
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {DIMENSION_LABEL[d]}
                </span>
                <span
                  className="ml-auto text-sm font-mono"
                  style={{ color: "var(--text-primary)" }}
                >
                  {s.score} / {s.max}
                </span>
              </div>
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{
                  background: "color-mix(in srgb, var(--text-faint) 18%, transparent)",
                }}
              >
                <div
                  className="h-full"
                  style={{
                    width: `${Math.round(pct * 100)}%`,
                    background: DIMENSION_COLOR[d],
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Final outcome summary from the terminal node */}
      {finalNode.summary && (
        <div
          className="rounded-2xl px-6 py-6 mb-6"
          style={{
            background: "var(--card-bg)",
            border: "1.5px solid var(--card-border)",
          }}
        >
          <h3
            className="text-[11px] font-mono uppercase mb-3"
            style={{
              color: "var(--text-faint)",
              letterSpacing: "0.14em",
            }}
          >
            Where your decisions led
          </h3>
          {finalNode.summary.split("\n\n").map((p, i) => (
            <p
              key={i}
              className="text-sm sm:text-base leading-relaxed mb-3 last:mb-0"
              style={{ color: "var(--text-primary)" }}
            >
              {p}
            </p>
          ))}
        </div>
      )}

      {/* The principle */}
      <div
        className="rounded-2xl px-6 py-6 mb-6"
        style={{
          background: "var(--card-bg)",
          border: "1.5px solid var(--card-border)",
          borderLeft: "4px solid var(--brand-primary)",
        }}
      >
        <h3
          className="text-[11px] font-mono uppercase mb-3 inline-flex items-center gap-1.5"
          style={{
            color: "var(--brand-primary)",
            letterSpacing: "0.14em",
          }}
        >
          <Sparkles size={11} strokeWidth={2.2} />
          The principle this drill teaches
        </h3>
        {drill.principle.split("\n\n").map((p, i) => (
          <p
            key={i}
            className="text-sm sm:text-base leading-relaxed mb-2 last:mb-0"
            style={{ color: "var(--text-primary)" }}
          >
            {p}
          </p>
        ))}
      </div>

      {/* What actually happened — the reveal */}
      {drill.outroBody && (
        <details
          className="rounded-2xl px-6 py-5 mb-6 group"
          style={{
            background: "var(--card-bg)",
            border: "1.5px solid var(--card-border)",
          }}
        >
          <summary
            className="cursor-pointer text-sm font-semibold flex items-center gap-2 list-none"
            style={{ color: "var(--text-primary)" }}
          >
            <span
              className="inline-flex items-center justify-center w-5 h-5 rounded-full transition-transform group-open:rotate-45"
              style={{
                background: "color-mix(in srgb, var(--brand-primary) 14%, transparent)",
                color: "var(--brand-primary)",
                fontSize: 14,
                lineHeight: 1,
              }}
            >
              +
            </span>
            Reveal — what actually happened
          </summary>
          <div
            className="mt-4 article-prose"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(drill.outroBody) }}
          />
        </details>
      )}

      {/* Stats tracking is paused — anonymous-play only for now. The
          API endpoints (/api/simulate/save-attempt, /api/simulate/me)
          and the /simulate/me page exist but aren't called from here.
          When we re-enable, swap this back to the state-aware SaveBanner. */}

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-transform hover:scale-[1.02]"
          style={{
            background: "var(--brand-primary)",
            color: "#ffffff",
          }}
        >
          <Share2 size={14} strokeWidth={2} />
          Share result
        </button>
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors"
          style={{
            background: "var(--card-bg)",
            color: "var(--text-primary)",
            border: "1.5px solid var(--card-border)",
          }}
        >
          <RotateCcw size={14} strokeWidth={2} />
          Try a different path
        </button>
        <Link
          href="/simulate"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors"
          style={{
            background: "var(--card-bg)",
            color: "var(--text-primary)",
            border: "1.5px solid var(--card-border)",
          }}
        >
          More drills
          <ArrowUpRight size={14} strokeWidth={2} />
        </Link>
      </div>

      <div className="mt-8">
        <SubscribeForm
          variant="card"
          surface="simulateit_result"
          headline="Get a new drill every week."
          subhead="Branching decision drills from real startup moments, straight to your inbox. Free. No paywall."
        />
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────

function drillTitle(drill: Drill): string {
  return drill.slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// Score-color gradient — green at the top, amber in the middle, red
// reserved only for genuinely poor results so the page doesn't shout
// at someone who got 60% right.
function scoreColor(pct: number): string {
  if (pct >= 0.85) return "#0F9D58";
  if (pct >= 0.7) return "#22C55E";
  if (pct >= 0.5) return "#D97706";
  if (pct >= 0.3) return "#EA580C";
  return "var(--brand-primary)";
}

function pctVerdict(pct: number): string {
  if (pct >= 0.85) return "Top-shelf reasoning. The founders who built it walked your exact path.";
  if (pct >= 0.7) return "Strong call. You nailed the principle even if a step or two diverged.";
  if (pct >= 0.5) return "Solid instincts. Mixed at the harder trade-offs.";
  if (pct >= 0.3) return "You took the defensive path. Sometimes the right call, mostly not here.";
  return "You optimized for the wrong thing. Worth replaying with the rationales in mind.";
}

// Minimal markdown renderer — handles headers, paragraphs, bold, italic,
// and links. Good enough for the outro body; not a full markdown engine.
// Output is wrapped by `article-prose` class which inherits from globals.css.
function renderMarkdown(md: string): string {
  // Escape HTML first.
  let s = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Headers (## → h3 to fit the prose hierarchy inside the details panel)
  s = s.replace(/^## (.+)$/gm, "<h3>$1</h3>");

  // Bold + italic
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/\*([^*]+)\*/g, "<em>$1</em>");

  // Links [text](url) — internal links keep relative URL, externals open in
  // same tab (the case study link in the outro is internal).
  s = s.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2">$1</a>'
  );

  // Paragraphs (double newlines)
  const paras = s.split(/\n\n+/).filter((p) => p.trim());
  return paras
    .map((p) => {
      if (p.startsWith("<h3")) return p;
      return `<p>${p.trim().replace(/\n/g, " ")}</p>`;
    })
    .join("\n");
}
