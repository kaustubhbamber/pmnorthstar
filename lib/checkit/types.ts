// CheckIt, public-facing audit result shapes.
//
// One AuditResult per URL. Seven DimensionResults, each with 5 CheckResults.
// Checks are weighted by importance (not evenly split). Dimension scores
// sum to 100. The weight of each check is set in dimensions.ts.

export type DimensionId =
  | "brand"
  | "performance"
  | "seo"
  | "ux"
  | "trust"
  | "polish"
  | "standards";

// Ten bands, one per 10-point bucket on the 0-100 scale. Ordered
// high to low so the bandFor function below maps cleanly: stellar
// at the top, missing at the bottom. The labels are intentionally
// distinct so the result card never says "vibe" for both a 35 and
// a 55 — those are very different sites.
export type Band =
  | "stellar"
  | "ready"
  | "almost"
  | "polish"
  | "rough"
  | "vibe"
  | "draft"
  | "skeleton"
  | "raw"
  | "missing";

// Raw output of an individual check function. Points are stamped on in
// audit.ts using the weight from dimensions.ts, producing CheckResult.
export interface RawCheckResult {
  id: string;
  label: string;
  pass: boolean;
  // Site-specific one-liner: "your <title> is 'Create Next App'", not generic
  // "use a real title". Renders under the check row in the result card.
  detail: string;
}

export interface CheckResult extends RawCheckResult {
  // Weight assigned in dimensions.ts. Sum of all weights = 100.
  points: number;
}

export interface LinkedResource {
  type: "case-study" | "book";
  slug: string;
  title: string;
  hook: string; // one-line tease shown next to the link
}

export interface DimensionResult {
  id: DimensionId;
  label: string;
  score: number; // sum of points from passed checks
  maxScore: number; // sum of points for all checks in this dimension
  checks: CheckResult[];
}

export interface AuditResult {
  url: string;
  finalUrl: string;
  fetchedAt: string; // ISO timestamp
  totalScore: number; // 0-100
  band: Band;
  dimensions: DimensionResult[];
  // Set when the audit itself failed (DNS, timeout, blocked, etc).
  fatalError?: string;
}

// Band thresholds break in 10-point steps across the 100-point scale.
// Each band carries distinct copy in BAND_COPY below.
export function bandFor(score: number): Band {
  if (score >= 90) return "stellar";
  if (score >= 80) return "ready";
  if (score >= 70) return "almost";
  if (score >= 60) return "polish";
  if (score >= 50) return "rough";
  if (score >= 40) return "vibe";
  if (score >= 30) return "draft";
  if (score >= 20) return "skeleton";
  if (score >= 10) return "raw";
  return "missing";
}

export const BAND_COPY: Record<Band, { label: string; tagline: string }> = {
  stellar: {
    label: "Stellar",
    tagline: "Top-shelf. The site itself is a competitive moat.",
  },
  ready: {
    label: "Production-ready",
    tagline: "This isn't a vibe, it's a product.",
  },
  almost: {
    label: "Almost there",
    tagline: "The bones are right. A few polish moves and you're shipping.",
  },
  polish: {
    label: "Needs polish",
    tagline: "The idea works. The execution still reads as a side project.",
  },
  rough: {
    label: "Rough edges",
    tagline: "Effort is showing. Polish is not.",
  },
  vibe: {
    label: "Just a vibe",
    tagline:
      "Get the basics in before users see this. The good news: every fix is fast.",
  },
  draft: {
    label: "Draft mode",
    tagline: "Visible cracks everywhere. Most users bounce before the hero loads.",
  },
  skeleton: {
    label: "Skeleton",
    tagline: "It loads. That's about the only kind thing to say.",
  },
  raw: {
    label: "Raw URL",
    tagline: "Just enough to register a domain. Almost nothing else works.",
  },
  missing: {
    label: "Barely there",
    tagline: "There's almost nothing here. Did you actually ship?",
  },
};
