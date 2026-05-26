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

export type Band = "ready" | "almost" | "polish" | "vibe";

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

export function bandFor(score: number): Band {
  if (score >= 90) return "ready";
  if (score >= 70) return "almost";
  if (score >= 50) return "polish";
  return "vibe";
}

export const BAND_COPY: Record<Band, { label: string; tagline: string }> = {
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
  vibe: {
    label: "Just a vibe right now",
    tagline:
      "Get the basics in before users see this. The good news: every fix is fast.",
  },
};
