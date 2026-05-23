// CheckIt orchestrator. Single HTML fetch (with TTFB capture), then all
// 20 checks run in parallel. Some checks issue additional sub-fetches
// (robots.txt, sitemap.xml, favicon HEAD, og:image HEAD, 404 probe);
// each has its own 5-6s timeout so the audit always completes within
// the route's 60s budget.
//
// No external API dependency. The performance dimension uses TTFB +
// HTML payload size + image dimensions + font-display as deterministic
// proxies for LCP/CLS/page-weight, fast, reliable, more actionable.

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

  // 1. Fetch the page HTML. Capture wall-clock duration as TTFB , 
  //    not strictly TTFB (it includes the full body download), but
  //    close enough for the purposes of "is your server fast."
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

  // 2. Run all 20 checks in parallel.
  const results = await Promise.all([
    Checks.customDomain(ctx),
    Checks.realFavicon(ctx),
    Checks.ogCompleteness(ctx),
    Checks.realTitle(ctx),
    Checks.ttfb(ctx),
    Checks.layoutShiftPrevention(ctx),
    Checks.htmlPayload(ctx),
    Checks.modernImages(ctx),
    Checks.metaDescription(ctx),
    Checks.robotsTxt(ctx),
    Checks.sitemapXml(ctx),
    Checks.structuredData(ctx),
    Checks.viewportMeta(ctx),
    Checks.primaryCta(ctx),
    Checks.h1ValueProp(ctx),
    Checks.placeholderText(ctx),
    Checks.secureTransport(ctx),
    Checks.privacyLink(ctx),
    Checks.custom404(ctx),
    Checks.identitySignal(ctx),
  ]);

  const byId = new Map(results.map((r) => [r.id, r]));

  const dimensions: DimensionResult[] = DIMENSIONS.map((d) => {
    const checks = d.checkIds.map((id) => {
      const r = byId.get(id);
      if (!r) {
        // Should be impossible, checkIds are typed against the audit set.
        throw new Error(`Missing check result for "${id}"`);
      }
      return r;
    });
    const passed = checks.filter((c) => c.pass).length;
    return {
      id: d.id,
      label: d.label,
      score: passed * 5,
      checks,
    };
  });

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
