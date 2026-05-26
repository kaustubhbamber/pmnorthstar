// CheckIt orchestrator. Single HTML fetch (with TTFB capture), then all
// 35 checks run in parallel. Some checks issue additional sub-fetches
// (robots.txt, sitemap.xml, favicon HEAD, og:image HEAD, apple-touch-icon
// HEAD, manifest.json, 404 probe); each has its own 5-6s timeout so the
// audit always completes within the route's 60s budget.
//
// No external APIs (no PSI, no CrUX). Every check is fully deterministic
// so the audit always returns full data regardless of site size or
// Google API quota. Field-data signals like CWV would belong in a
// separate informational surface, not in the 100-point scorecard.
//
// Scoring is weighted: each check carries a `points` value (set in
// dimensions.ts) reflecting how much it matters. Dimension totals are
// intentionally uneven — UX & Conversion is worth 20, Standards is
// worth 7. The seven dimension scores sum to 100.

import * as Checks from "./checks";
import type { FetchCtx } from "./checks";
import { DIMENSIONS } from "./dimensions";
import type { AuditResult, DimensionResult } from "./types";
import { bandFor } from "./types";
import { fetchWithTimeout, normalizeUrl } from "./util";

const HTML_TIMEOUT_MS = 12_000;

export async function runAudit(rawUrl: string): Promise<AuditResult> {
  const url = normalizeUrl(rawUrl);
  if (!url) {
    return fatalResult(rawUrl, `"${rawUrl}" isn't a valid URL.`);
  }

  let html = "";
  let finalUrl = url;
  let status = 0;
  let headers = new Headers();
  let ttfbMs = 0;

  try {
    const start = Date.now();
    const res = await fetchWithTimeout(url.toString(), {}, HTML_TIMEOUT_MS);
    ttfbMs = Date.now() - start;
    status = res.status;
    headers = res.headers;
    finalUrl = new URL(res.url);
    html = await res.text();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "fetch failed";
    return fatalResult(url.toString(), `Could not load the URL (${msg}).`);
  }

  if (status >= 400 || !html) {
    return fatalResult(url.toString(), `Site returned HTTP ${status}. Audit needs a page that loads.`);
  }

  const ctx: FetchCtx = {
    inputUrl: url,
    finalUrl,
    status,
    html,
    headers,
    ttfbMs,
  };

  // 2. Run all 35 checks in parallel. All fully deterministic.
  const results = await Promise.all([
    // Brand & Identity (5)
    Checks.customDomain(ctx),
    Checks.realFavicon(ctx),
    Checks.ogCompleteness(ctx),
    Checks.realTitle(ctx),
    Checks.appleTouchIcon(ctx),
    // Performance (5) — all deterministic, no CWV field data
    Checks.ttfb(ctx),
    Checks.layoutShiftPrevention(ctx),
    Checks.htmlPayload(ctx),
    Checks.renderBlockingScripts(ctx),
    Checks.modernImages(ctx),
    // SEO & Discoverability (5)
    Checks.metaDescription(ctx),
    Checks.robotsTxt(ctx),
    Checks.sitemapXml(ctx),
    Checks.structuredData(ctx),
    Checks.altTextCoverage(ctx),
    // UX & Conversion (5)
    Checks.viewportMeta(ctx),
    Checks.primaryCta(ctx),
    Checks.h1ValueProp(ctx),
    Checks.placeholderText(ctx),
    Checks.formLabels(ctx),
    // Polish & Foundations (5)
    Checks.themeColor(ctx),
    Checks.langAttribute(ctx),
    Checks.compression(ctx),
    Checks.canonicalUrl(ctx),
    Checks.hstsPreload(ctx),
    // Modern Web Standards (5)
    Checks.manifestJson(ctx),
    Checks.twitterCard(ctx),
    Checks.titleLength(ctx),
    Checks.ariaLandmarks(ctx),
    Checks.headingHierarchy(ctx),
    // Trust & Compliance (5)
    Checks.secureTransport(ctx),
    Checks.privacyLink(ctx),
    Checks.custom404(ctx),
    Checks.identitySignal(ctx),
    Checks.cspHeader(ctx),
  ]);

  const byId = new Map(results.map((r) => [r.id, r]));

  const dimensions: DimensionResult[] = DIMENSIONS.map((d) => {
    const checks = d.checks.map(({ id, points }) => {
      const r = byId.get(id);
      if (!r) {
        // Should be impossible — IDs are typed against the audit set.
        throw new Error(`Missing check result for "${id}"`);
      }
      // Stamp the weight onto the result so the UI can show /points.
      return { ...r, points };
    });
    const score = checks.reduce((s, c) => (c.pass ? s + c.points : s), 0);
    const maxScore = checks.reduce((s, c) => s + c.points, 0);
    return {
      id: d.id,
      label: d.label,
      score,
      maxScore,
      checks,
    };
  });

  // Weights across all dimensions sum to 100, so totalScore is already 0-100.
  const total = dimensions.reduce((sum, d) => sum + d.score, 0);

  return {
    url: rawUrl,
    finalUrl: finalUrl.toString(),
    fetchedAt: new Date().toISOString(),
    totalScore: total,
    band: bandFor(total),
    dimensions,
  };
}

function fatalResult(url: string, message: string): AuditResult {
  return {
    url,
    finalUrl: url,
    fetchedAt: new Date().toISOString(),
    totalScore: 0,
    band: "vibe",
    dimensions: [],
    fatalError: message,
  };
}
