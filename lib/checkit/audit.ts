// CheckIt orchestrator. Single HTML fetch (with TTFB capture) + parallel
// CrUX field-data lookup, then all 25 checks run in parallel. Some checks
// issue additional sub-fetches (robots.txt, sitemap.xml, favicon HEAD,
// og:image HEAD, apple-touch-icon HEAD, 404 probe); each has its own
// 5-6s timeout so the audit always completes within the route's 60s
// budget.
//
// CrUX provides real user-experience field data for Core Web Vitals
// (LCP, INP, CLS) when the site has enough Chrome traffic. Smaller
// sites without field data get honest "no field data" messages on
// those checks rather than synthetic guesses.

import * as Checks from "./checks";
import type { FetchCtx } from "./checks";
import { DIMENSIONS } from "./dimensions";
import type { AuditResult, DimensionResult } from "./types";
import { bandFor } from "./types";
import { fetchWithTimeout, normalizeUrl } from "./util";
import { fetchCrux, originOf } from "./crux";

const HTML_TIMEOUT_MS = 12_000;

export async function runAudit(rawUrl: string): Promise<AuditResult> {
  const url = normalizeUrl(rawUrl);
  if (!url) {
    return fatalResult(rawUrl, `"${rawUrl}" isn't a valid URL.`);
  }

  // 1. Fetch the HTML and the CrUX field data in parallel. CrUX is
  //    independent of the HTML response so we can save a few hundred ms.
  let html = "";
  let finalUrl = url;
  let status = 0;
  let headers = new Headers();
  let ttfbMs = 0;

  const cruxPromise = fetchCrux(originOf(url));

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

  const crux = await cruxPromise;

  const ctx: FetchCtx = {
    inputUrl: url,
    finalUrl,
    status,
    html,
    headers,
    ttfbMs,
    crux,
  };

  // 2. Run all 25 checks in parallel.
  const results = await Promise.all([
    // Brand & Identity (5)
    Checks.customDomain(ctx),
    Checks.realFavicon(ctx),
    Checks.ogCompleteness(ctx),
    Checks.realTitle(ctx),
    Checks.appleTouchIcon(ctx),
    // Performance (5)
    Checks.lcp(ctx),
    Checks.inp(ctx),
    Checks.cls(ctx),
    Checks.ttfb(ctx),
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
    // Trust & Compliance (5)
    Checks.secureTransport(ctx),
    Checks.privacyLink(ctx),
    Checks.custom404(ctx),
    Checks.identitySignal(ctx),
    Checks.cspHeader(ctx),
  ]);

  const byId = new Map(results.map((r) => [r.id, r]));

  const dimensions: DimensionResult[] = DIMENSIONS.map((d) => {
    const checks = d.checkIds.map((id) => {
      const r = byId.get(id);
      if (!r) {
        // Should be impossible — checkIds are typed against the audit set.
        throw new Error(`Missing check result for "${id}"`);
      }
      return r;
    });
    const passed = checks.filter((c) => c.pass).length;
    return {
      id: d.id,
      label: d.label,
      // 5 checks per dimension × 4 pts = 20 max per dimension.
      // 5 dimensions × 20 = 100 total.
      score: passed * 4,
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
