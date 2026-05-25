// The 20 CheckIt checks. Each is a pure async function that takes a
// FetchCtx (the page we already fetched, plus any precomputed PSI data)
// and returns a CheckResult. The orchestrator in audit.ts runs them all
// in parallel and assembles the per-dimension scorecard.
//
// Why regex over a real HTML parser: keeps the dependency surface zero
// (we don't ship cheerio) and the misses we'd catch with a real parser
//, malformed tags, weird quoting, also tell us a site is broken.

import { fetchWithTimeout, stripTags, truncate } from "./util";
import type { CheckResult } from "./types";
import type { CruxData } from "./crux";

// TTFB is captured during the orchestrator's HTML fetch and passed in
// here so the perf checks stay pure (no extra network IO).
// CrUX (Chrome UX Report) field data is fetched once in the orchestrator
// and passed to the LCP/INP/CLS checks. If GOOGLE_API_KEY isn't set OR
// the site has too little traffic for field data, crux.hasData is false
// and those checks return a "no field data" detail.
export interface FetchCtx {
  inputUrl: URL;
  finalUrl: URL;
  status: number;
  html: string;
  headers: Headers;
  ttfbMs: number;
  crux: CruxData;
}

// Subdomains that scream "vibe-coded side project." Order matters for
// matching, we use endsWith so longer matches naturally win.
const PLATFORM_HOSTS = [
  ".vercel.app",
  ".netlify.app",
  ".netlify.com",
  ".github.io",
  ".gitlab.io",
  ".pages.dev",
  ".workers.dev",
  ".herokuapp.com",
  ".firebaseapp.com",
  ".web.app",
  ".replit.dev",
  ".repl.co",
  ".lovable.app",
  ".bolt.new",
  ".bolt.diy",
  ".onrender.com",
  ".fly.dev",
  ".railway.app",
  ".surge.sh",
  ".wixsite.com",
  ".weebly.com",
  ".webflow.io",
  ".framer.app",
  ".framer.website",
  ".carrd.co",
  ".typedream.com",
];

const TITLE_BLOCKLIST = new Set([
  "",
  "create next app",
  "vite + react",
  "vite + react + ts",
  "vite + vue",
  "vite app",
  "react app",
  "document",
  "untitled",
  "home",
  "page",
  "index",
  "next.js",
  "new project",
  "my app",
  "hello world",
]);

// ── Brand & Identity ──────────────────────────────────────────────────────

export async function customDomain(ctx: FetchCtx): Promise<CheckResult> {
  const host = ctx.finalUrl.hostname.toLowerCase();
  const platform = PLATFORM_HOSTS.find((p) => host.endsWith(p));
  return {
    id: "custom-domain",
    label: "Custom domain",
    pass: !platform,
    detail: platform
      ? `Your URL ends in ${platform}. Users read this as a side project, not a product.`
      : `Custom domain ${host}. Reads as a real product.`,
  };
}

export async function realFavicon(ctx: FetchCtx): Promise<CheckResult> {
  // Look for any <link rel="icon" ...> (also matches "shortcut icon").
  let faviconUrl: URL | null = null;
  const linkRe = /<link\b[^>]*rel=["'][^"']*\bicon\b[^"']*["'][^>]*>/gi;
  let m: RegExpExecArray | null;
  while ((m = linkRe.exec(ctx.html))) {
    const href = m[0].match(/href=["']([^"']+)["']/i)?.[1];
    if (href) {
      try {
        faviconUrl = new URL(href, ctx.finalUrl);
        break;
      } catch {
        /* keep looking */
      }
    }
  }
  if (!faviconUrl) {
    faviconUrl = new URL("/favicon.ico", ctx.finalUrl);
  }

  try {
    const res = await fetchWithTimeout(faviconUrl.toString(), { method: "HEAD" }, 5000);
    if (res.ok) {
      return {
        id: "real-favicon",
        label: "Favicon present",
        pass: true,
        detail: `Favicon loads from ${faviconUrl.pathname}.`,
      };
    }
    return {
      id: "real-favicon",
      label: "Favicon present",
      pass: false,
      detail: `Favicon at ${faviconUrl.pathname} returned ${res.status}.`,
    };
  } catch {
    return {
      id: "real-favicon",
      label: "Favicon present",
      pass: false,
      detail: `Could not load favicon from ${faviconUrl.pathname}.`,
    };
  }
}

// og:image alone isn't enough for a usable link preview. Slack and
// Twitter need title + description + image; type is conventional. We
// require all four to score this slot.
export async function ogCompleteness(ctx: FetchCtx): Promise<CheckResult> {
  const html = ctx.html;
  const ogMatch = (prop: string): string | null => {
    const re = new RegExp(
      `<meta\\s+(?:property|name)=["']og:${prop}["']\\s+content=["']([^"']+)["']`,
      "i",
    );
    const re2 = new RegExp(
      `<meta\\s+content=["']([^"']+)["']\\s+(?:property|name)=["']og:${prop}["']`,
      "i",
    );
    return html.match(re)?.[1] ?? html.match(re2)?.[1] ?? null;
  };

  const ogTitle = ogMatch("title");
  const ogDesc = ogMatch("description");
  const ogType = ogMatch("type");
  const ogImg = ogMatch("image");

  const present = [ogTitle, ogDesc, ogType, ogImg].filter(Boolean).length;

  // Image still needs to actually load — render as blank box otherwise.
  let imageReachable = false;
  if (ogImg) {
    try {
      const imgUrl = new URL(ogImg, ctx.finalUrl);
      const res = await fetchWithTimeout(imgUrl.toString(), { method: "HEAD" }, 5000);
      imageReachable = res.ok;
    } catch {
      /* leave false */
    }
  }

  const pass = present === 4 && imageReachable;

  let detail: string;
  if (present === 0) {
    detail = `No Open Graph tags. Links to this page render as a blank box on Slack, Twitter, WhatsApp.`;
  } else if (!ogImg) {
    detail = `Missing og:image. ${present} of 4 OG tags present.`;
  } else if (!imageReachable) {
    detail = `og:image is set but doesn't load. Link previews render blank.`;
  } else if (present < 4) {
    const missing = [
      !ogTitle && "title",
      !ogDesc && "description",
      !ogType && "type",
    ]
      .filter(Boolean)
      .join(", ");
    detail = `og:image works but missing og:${missing}. Link previews will show fallback values.`;
  } else {
    detail = `All four OG tags present and og:image loads.`;
  }

  return {
    id: "og-completeness",
    label: "Open Graph link preview",
    pass,
    detail,
  };
}

export async function realTitle(ctx: FetchCtx): Promise<CheckResult> {
  const match = ctx.html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = match ? stripTags(match[1]).trim() : "";
  const lower = title.toLowerCase();
  const isDefault = TITLE_BLOCKLIST.has(lower) || !title || title.length < 5;
  return {
    id: "real-title",
    label: "Descriptive page title",
    pass: !isDefault,
    detail: !title
      ? `No <title> tag. Google and browser tabs show your URL instead.`
      : isDefault
      ? `Title is "${title}". Looks like a framework default.`
      : `Title is "${truncate(title, 60)}".`,
  };
}

// ── Performance (deterministic proxies, no external API) ──────────────────
//
// We deliberately don't use Google PageSpeed Insights here. PSI takes
// 10-30s, depends on Google's rate limits, and silently returns empty
// data for low-traffic sites (no CrUX). For a "30-second audit on any
// URL" we measure causes, TTFB, payload size, image dims + font-display
//, which are deterministic, fast, and more actionable than an opaque
// CLS score ("add width/height to your imgs" beats "your CLS is 0.18").

export async function ttfb(ctx: FetchCtx): Promise<CheckResult> {
  const ms = ctx.ttfbMs;
  const pass = ms < 600;
  return {
    id: "ttfb",
    label: "Server responds in under 600ms",
    pass,
    detail: pass
      ? `Server responded in ${ms}ms. Fast first byte.`
      : ms < 1000
      ? `Server took ${ms}ms. Borderline. Add a CDN or cache the response.`
      : `Server took ${ms}ms. Slow first byte. Every visitor waits this long before anything loads.`,
  };
}

// ── Core Web Vitals (from Chrome UX Report field data) ────────────────────
// These three checks read real-user data from CrUX (the dataset Google
// uses for Search ranking). If the site doesn't have enough Chrome
// traffic to be in CrUX, we honestly mark "no field data" rather than
// guess from synthetic measurement. Pair these with TTFB and
// modern-images for the full Performance dimension.

export async function lcp(ctx: FetchCtx): Promise<CheckResult> {
  const ms = ctx.crux.lcpMs;
  if (ms === undefined) {
    return {
      id: "lcp",
      label: "LCP under 2.5s (real-user data)",
      pass: false,
      detail: `No field data yet. Sites need enough Chrome traffic for Google CrUX to report. Synthetic LCP would be misleading.`,
    };
  }
  const sec = (ms / 1000).toFixed(1);
  const pass = ms < 2500;
  return {
    id: "lcp",
    label: "LCP under 2.5s (real-user data)",
    pass,
    detail: pass
      ? `LCP is ${sec}s at the 75th percentile (Chrome UX Report, last 28 days). Real users see content fast.`
      : ms < 4000
      ? `LCP is ${sec}s at the 75th percentile. Slow but not critical. Target is under 2.5s.`
      : `LCP is ${sec}s at the 75th percentile. Most users see a blank page far too long.`,
  };
}

export async function inp(ctx: FetchCtx): Promise<CheckResult> {
  const ms = ctx.crux.inpMs;
  if (ms === undefined) {
    return {
      id: "inp",
      label: "INP under 200ms (real-user data)",
      pass: false,
      detail: `No field data yet. INP needs real user interactions to measure; small sites haven't accumulated enough yet.`,
    };
  }
  const pass = ms < 200;
  return {
    id: "inp",
    label: "INP under 200ms (real-user data)",
    pass,
    detail: pass
      ? `INP is ${Math.round(ms)}ms at the 75th percentile. Interactions feel responsive.`
      : ms < 500
      ? `INP is ${Math.round(ms)}ms. Borderline. Heavy JavaScript handlers are blocking the main thread.`
      : `INP is ${Math.round(ms)}ms. Users feel the page is unresponsive. Heavy JS is the usual culprit.`,
  };
}

export async function cls(ctx: FetchCtx): Promise<CheckResult> {
  const v = ctx.crux.cls;
  if (v === undefined) {
    return {
      id: "cls",
      label: "CLS under 0.1 (real-user data)",
      pass: false,
      detail: `No field data yet. CLS needs enough Chrome traffic for CrUX to aggregate.`,
    };
  }
  const pass = v < 0.1;
  return {
    id: "cls",
    label: "CLS under 0.1 (real-user data)",
    pass,
    detail: pass
      ? `CLS is ${v.toFixed(3)} at the 75th percentile. Layout stays put as the page loads.`
      : v < 0.25
      ? `CLS is ${v.toFixed(3)}. Some shift. Add width+height to images and use font-display:swap.`
      : `CLS is ${v.toFixed(3)}. Significant layout shift. Page feels broken on slow connections.`,
  };
}

export async function modernImages(ctx: FetchCtx): Promise<CheckResult> {
  const tags = Array.from(ctx.html.matchAll(/<img\b[^>]*>/gi)).map((m) => m[0]);
  if (tags.length === 0) {
    return {
      id: "modern-images",
      label: "Modern image formats or lazy loading",
      pass: true,
      detail: `No <img> tags on the page. Nothing to optimize.`,
    };
  }
  let good = 0;
  for (const tag of tags) {
    const src = tag.match(/src=["']([^"']+)["']/i)?.[1] ?? "";
    const isModern = /\.(webp|avif)(\?|#|$)/i.test(src);
    const isLazy = /loading=["']?lazy["']?/i.test(tag);
    const isInline = /^data:/i.test(src);
    if (isModern || isLazy || isInline) good++;
  }
  const ratio = good / tags.length;
  const pass = ratio >= 0.8;
  return {
    id: "modern-images",
    label: "Modern image formats or lazy loading",
    pass,
    detail: pass
      ? `${good} of ${tags.length} images use webp/avif or lazy-load.`
      : `Only ${good} of ${tags.length} images optimized. The rest block initial paint.`,
  };
}

// ── SEO & Discoverability ─────────────────────────────────────────────────

export async function metaDescription(ctx: FetchCtx): Promise<CheckResult> {
  const match =
    ctx.html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i) ||
    ctx.html.match(/<meta\s+content=["']([^"']*)["']\s+name=["']description["']/i);
  const desc = match ? match[1].trim() : "";
  const pass = desc.length >= 50 && desc.length <= 160;
  return {
    id: "meta-description",
    label: "Meta description (50 to 160 chars)",
    pass,
    detail: !desc
      ? `No meta description. Google guesses what your page is about.`
      : desc.length < 50
      ? `Meta description is only ${desc.length} chars. Too short to be useful.`
      : desc.length > 160
      ? `Meta description is ${desc.length} chars. Google truncates after about 160.`
      : `Meta description is ${desc.length} chars and sets clear expectations.`,
  };
}

export async function robotsTxt(ctx: FetchCtx): Promise<CheckResult> {
  const url = new URL("/robots.txt", ctx.finalUrl).toString();
  try {
    const res = await fetchWithTimeout(url, {}, 5000);
    if (!res.ok) {
      return {
        id: "robots-txt",
        label: "robots.txt accessible",
        pass: false,
        detail: `/robots.txt returned ${res.status}. Crawlers don't know what to do.`,
      };
    }
    const body = await res.text();
    const hasSitemap = /sitemap\s*:/i.test(body);
    return {
      id: "robots-txt",
      label: "robots.txt accessible",
      pass: true,
      detail: hasSitemap
        ? `robots.txt found and points crawlers to your sitemap.`
        : `robots.txt found. Consider adding a "Sitemap:" line.`,
    };
  } catch {
    return {
      id: "robots-txt",
      label: "robots.txt accessible",
      pass: false,
      detail: `Could not reach /robots.txt.`,
    };
  }
}

export async function sitemapXml(ctx: FetchCtx): Promise<CheckResult> {
  const candidates = ["/sitemap.xml", "/sitemap_index.xml", "/sitemap-index.xml"];
  for (const path of candidates) {
    try {
      const url = new URL(path, ctx.finalUrl).toString();
      const res = await fetchWithTimeout(url, {}, 5000);
      if (!res.ok) continue;
      const body = await res.text();
      const count = (body.match(/<loc>/g) || []).length;
      return {
        id: "sitemap-xml",
        label: "sitemap.xml present",
        pass: count > 0,
        detail:
          count > 0
            ? `Found ${path} with ${count} URLs.`
            : `${path} loads but is empty.`,
      };
    } catch {
      /* try next */
    }
  }
  return {
    id: "sitemap-xml",
    label: "sitemap.xml present",
    pass: false,
    detail: `No sitemap found. Google has to guess which pages exist.`,
  };
}

// JSON-LD structured data is what Google uses for rich results and what
// LLM-powered search (Perplexity, ChatGPT, Google AI Overviews) leans on
// most heavily. A site without any schema is invisible to Answer Engines.
export async function structuredData(ctx: FetchCtx): Promise<CheckResult> {
  const blocks = Array.from(
    ctx.html.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi),
  );

  if (blocks.length === 0) {
    return {
      id: "structured-data",
      label: "Structured data (JSON-LD)",
      pass: false,
      detail: `No JSON-LD schema on the page. Invisible to Google rich results and AI answer engines.`,
    };
  }

  const types: string[] = [];
  for (const [, json] of blocks) {
    try {
      const parsed = JSON.parse(json.trim());
      const items = Array.isArray(parsed) ? parsed : [parsed];
      for (const item of items) {
        const t = item?.["@type"];
        if (typeof t === "string") types.push(t);
        else if (Array.isArray(t)) types.push(...t.filter((x) => typeof x === "string"));
      }
    } catch {
      /* malformed, skip */
    }
  }

  if (types.length === 0) {
    return {
      id: "structured-data",
      label: "Structured data (JSON-LD)",
      pass: false,
      detail: `Found ${blocks.length} JSON-LD block(s) but none parse to valid schema.`,
    };
  }

  const unique = Array.from(new Set(types));
  return {
    id: "structured-data",
    label: "Structured data (JSON-LD)",
    pass: true,
    detail: `Found ${unique.length} schema type${unique.length === 1 ? "" : "s"}: ${unique.slice(0, 4).join(", ")}${unique.length > 4 ? "…" : ""}.`,
  };
}

// ── UX & Conversion ───────────────────────────────────────────────────────

export async function viewportMeta(ctx: FetchCtx): Promise<CheckResult> {
  const match = ctx.html.match(/<meta\s+name=["']viewport["']\s+content=["']([^"']+)["']/i);
  const content = match ? match[1] : "";
  const pass = /width=device-width/i.test(content);
  return {
    id: "viewport-meta",
    label: "Mobile viewport configured",
    pass,
    detail: !match
      ? `No <meta name="viewport">. Page renders zoomed-out on phones.`
      : pass
      ? `Viewport tag set for mobile.`
      : `Viewport tag exists but is missing width=device-width.`,
  };
}

export async function primaryCta(ctx: FetchCtx): Promise<CheckResult> {
  const buttonCount = (ctx.html.match(/<button\b/gi) || []).length;
  const ctaLinkCount = (
    ctx.html.match(/<a\b[^>]*class=["'][^"']*(?:btn|button|cta)[^"']*["'][^>]*>/gi) || []
  ).length;
  const total = buttonCount + ctaLinkCount;
  const pass = total >= 2;
  return {
    id: "primary-cta",
    label: "Clear call-to-action",
    pass,
    detail: pass
      ? `Found ${total} button-like elements. Visitors have clear actions.`
      : `Only ${total} clear CTA${total === 1 ? "" : "s"}. Visitors don't know what to do next.`,
  };
}

export async function h1ValueProp(ctx: FetchCtx): Promise<CheckResult> {
  const match = ctx.html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  if (!match) {
    return {
      id: "h1-value-prop",
      label: "H1 names the value proposition",
      pass: false,
      detail: `No <h1>. Visitors have to read the whole page to learn what this is.`,
    };
  }
  const text = stripTags(match[1]).trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  const pass = words >= 4 && words <= 20;
  return {
    id: "h1-value-prop",
    label: "H1 names the value proposition",
    pass,
    detail: words < 4
      ? `H1 "${text}" is only ${words} word${words === 1 ? "" : "s"}. Not enough to explain the product.`
      : words > 20
      ? `H1 has ${words} words. Too long to scan in 5 seconds.`
      : `H1 is "${truncate(text, 80)}".`,
  };
}

// The single most embarrassing failure mode for a vibe-coded site:
// shipping with template placeholder text still in the page. We strip
// HTML, lowercase, and look for known boilerplate phrases.
const PLACEHOLDER_PATTERNS: RegExp[] = [
  /\blorem ipsum\b/i,
  /\bdolor sit amet\b/i,
  /\byour headline here\b/i,
  /\byour text here\b/i,
  /\byour tagline here\b/i,
  /\b\[your [a-z ]+\]/i,
  /\bedit (?:src\/|pages\/|app\/)/i, // Next/CRA boilerplate copy
  /\bget started by editing\b/i, // Next.js default
  /\bvite \+ react\b/i,
  /\bvite \+ vue\b/i,
  /\bdeploy succeeded\b/i, // Vercel default placeholder
  /\bplaceholder text\b/i,
  /\bcoming soon\.{0,3}$/im, // standalone "coming soon" line, not a future-tense mention
  /\btodo:?\s/i,
];

export async function placeholderText(ctx: FetchCtx): Promise<CheckResult> {
  const visible = stripTags(ctx.html).replace(/\s+/g, " ").trim();
  const hits: string[] = [];
  for (const re of PLACEHOLDER_PATTERNS) {
    const m = visible.match(re);
    if (m) hits.push(m[0].slice(0, 40));
  }
  const pass = hits.length === 0;
  return {
    id: "placeholder-text",
    label: "No placeholder text",
    pass,
    detail: pass
      ? `No template boilerplate found. Site reads as finished.`
      : `Found leftover placeholder text: "${hits[0]}"${hits.length > 1 ? ` (and ${hits.length - 1} more)` : ""}.`,
  };
}

// ── Trust & Compliance ────────────────────────────────────────────────────

// HTTPS by itself isn't enough for "secure transport". HSTS instructs
// browsers to never speak HTTP to this origin again, and
// X-Content-Type-Options stops MIME sniffing attacks. Both ship as
// response headers we already have from the audit fetch.
export async function secureTransport(ctx: FetchCtx): Promise<CheckResult> {
  const isHttps = ctx.finalUrl.protocol === "https:";
  const hsts = ctx.headers.get("strict-transport-security");
  const noSniff = ctx.headers.get("x-content-type-options");

  const passes = [isHttps, !!hsts, /^nosniff$/i.test(noSniff ?? "")];
  const passCount = passes.filter(Boolean).length;
  const pass = passCount === 3;

  if (!isHttps) {
    return {
      id: "secure-transport",
      label: "Secure transport (HTTPS + headers)",
      pass: false,
      detail: `Site loads over ${ctx.finalUrl.protocol}. Browsers show a "Not Secure" warning.`,
    };
  }

  if (pass) {
    return {
      id: "secure-transport",
      label: "Secure transport (HTTPS + headers)",
      pass: true,
      detail: `HTTPS enforced with HSTS and nosniff headers. Strong transport security.`,
    };
  }

  const missing = [
    !hsts && "Strict-Transport-Security",
    !/^nosniff$/i.test(noSniff ?? "") && "X-Content-Type-Options: nosniff",
  ]
    .filter(Boolean)
    .join(" and ");

  return {
    id: "secure-transport",
    label: "Secure transport (HTTPS + headers)",
    pass: false,
    detail: `HTTPS works but missing ${missing}. Easy fix in your hosting config.`,
  };
}

export async function privacyLink(ctx: FetchCtx): Promise<CheckResult> {
  const links = Array.from(ctx.html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi));
  const re = /privacy|terms|legal|policy|tos/i;
  const found = links.find(([, href, inner]) => re.test(href) || re.test(stripTags(inner)));
  return {
    id: "privacy-link",
    label: "Privacy / Terms link",
    pass: !!found,
    detail: found
      ? `Found link to "${truncate(stripTags(found[2]).trim() || found[1], 40)}".`
      : `No privacy or terms link on the page. Required once you collect any user data.`,
  };
}

export async function custom404(ctx: FetchCtx): Promise<CheckResult> {
  const randomPath = `/checkit-probe-${Math.random().toString(36).slice(2, 10)}`;
  const url = new URL(randomPath, ctx.finalUrl).toString();
  try {
    const res = await fetchWithTimeout(url, {}, 6000);
    // 200 → SPA serving a catch-all shell (Next.js, Vite SPA, etc.)
    if (res.status === 200) {
      return {
        id: "custom-404",
        label: "Custom 404 handling",
        pass: true,
        detail: `Unknown path returns 200. Handled by your client-side router.`,
      };
    }
    if (res.status === 404) {
      const body = await res.text();
      const visible = stripTags(body).replace(/\s+/g, " ").trim();
      const pass = visible.length > 80;
      return {
        id: "custom-404",
        label: "Custom 404 handling",
        pass,
        detail: pass
          ? `404 page returns ${visible.length} chars of content. Looks custom.`
          : `404 returns ${visible.length} chars. Looks like the framework default.`,
      };
    }
    return {
      id: "custom-404",
      label: "Custom 404 handling",
      pass: false,
      detail: `Unknown path returned ${res.status} instead of 404.`,
    };
  } catch {
    return {
      id: "custom-404",
      label: "Custom 404 handling",
      pass: false,
      detail: `Could not test 404 behavior.`,
    };
  }
}

// ── Brand & Identity: Apple touch icon ────────────────────────────────────
// iOS uses apple-touch-icon when a user adds your site to the home
// screen. Without it, iOS picks a screenshot of the page which looks
// embarrassing. 180x180 PNG is the recommended size.
export async function appleTouchIcon(ctx: FetchCtx): Promise<CheckResult> {
  const html = ctx.html;
  const match = html.match(/<link\b[^>]*rel=["']apple-touch-icon["'][^>]*>/i);
  if (!match) {
    return {
      id: "apple-touch-icon",
      label: "Apple touch icon present",
      pass: false,
      detail: `No <link rel="apple-touch-icon">. iOS users adding your site to home screen see a screenshot, not your icon.`,
    };
  }
  const href = match[0].match(/href=["']([^"']+)["']/i)?.[1];
  if (!href) {
    return {
      id: "apple-touch-icon",
      label: "Apple touch icon present",
      pass: false,
      detail: `apple-touch-icon link tag found but has no href.`,
    };
  }
  // Verify the file actually loads.
  try {
    const url = new URL(href, ctx.finalUrl).toString();
    const res = await fetchWithTimeout(url, { method: "HEAD" }, 5000);
    return {
      id: "apple-touch-icon",
      label: "Apple touch icon present",
      pass: res.ok,
      detail: res.ok
        ? `apple-touch-icon loads from ${new URL(url).pathname}.`
        : `apple-touch-icon URL returned ${res.status}.`,
    };
  } catch {
    return {
      id: "apple-touch-icon",
      label: "Apple touch icon present",
      pass: false,
      detail: `Could not load apple-touch-icon at ${href}.`,
    };
  }
}

// ── SEO: Alt text coverage on images ──────────────────────────────────────
// Alt text is the single highest-leverage accessibility + SEO check
// most vibe-coded sites fail. Pass if 80%+ of <img> tags have a
// non-empty alt attribute.
export async function altTextCoverage(ctx: FetchCtx): Promise<CheckResult> {
  const tags = Array.from(ctx.html.matchAll(/<img\b[^>]*>/gi)).map((m) => m[0]);
  if (tags.length === 0) {
    return {
      id: "alt-text-coverage",
      label: "Image alt text coverage",
      pass: true,
      detail: `No <img> tags on the page. Nothing to caption.`,
    };
  }
  let withAlt = 0;
  for (const tag of tags) {
    const m = tag.match(/\balt=["']([^"']*)["']/i);
    if (m && m[1].trim().length > 0) withAlt++;
  }
  const ratio = withAlt / tags.length;
  const pass = ratio >= 0.8;
  return {
    id: "alt-text-coverage",
    label: "Image alt text coverage",
    pass,
    detail: pass
      ? `${withAlt} of ${tags.length} images have alt text. Accessible + SEO-friendly.`
      : `Only ${withAlt} of ${tags.length} images have alt text. Hurts accessibility and image SEO.`,
  };
}

// ── UX: Form labels associated with inputs ────────────────────────────────
// Every <input> should have a <label> or aria-label. Without it, screen
// readers don't know what the field is for, and the form is hard to use
// for anyone navigating with keyboard or assistive tech.
export async function formLabels(ctx: FetchCtx): Promise<CheckResult> {
  const html = ctx.html;
  // Pull inputs that need labels — text-like and select/textarea. Skip
  // submit/button/hidden/image which don't need labels.
  const inputRe = /<(?:input|select|textarea)\b[^>]*>/gi;
  const inputs = Array.from(html.matchAll(inputRe)).map((m) => m[0]);
  // Filter out input types that don't need labels.
  const needsLabel = inputs.filter((tag) => {
    if (!tag.toLowerCase().startsWith("<input")) return true; // select/textarea always need labels
    const type = tag.match(/\btype=["']?(\w+)["']?/i)?.[1]?.toLowerCase();
    return !type || !["submit", "button", "hidden", "image", "reset"].includes(type);
  });

  if (needsLabel.length === 0) {
    return {
      id: "form-labels",
      label: "Form inputs are labeled",
      pass: true,
      detail: `No form inputs on the page. Nothing to label.`,
    };
  }

  let labeled = 0;
  for (const tag of needsLabel) {
    const id = tag.match(/\bid=["']([^"']+)["']/i)?.[1];
    const hasAriaLabel = /\baria-label=["'][^"']+["']/i.test(tag);
    const hasAriaLabelledBy = /\baria-labelledby=["'][^"']+["']/i.test(tag);
    const hasTitle = /\btitle=["'][^"']+["']/i.test(tag);
    let hasLabelFor = false;
    if (id) {
      const labelRe = new RegExp(`<label\\b[^>]*for=["']${id}["']`, "i");
      hasLabelFor = labelRe.test(html);
    }
    if (hasAriaLabel || hasAriaLabelledBy || hasLabelFor || hasTitle) {
      labeled++;
    }
  }

  const ratio = labeled / needsLabel.length;
  const pass = ratio >= 0.8;
  return {
    id: "form-labels",
    label: "Form inputs are labeled",
    pass,
    detail: pass
      ? `${labeled} of ${needsLabel.length} form inputs have associated labels.`
      : `Only ${labeled} of ${needsLabel.length} form inputs have labels. Forms are hard to use with a screen reader.`,
  };
}

// ── Trust: Content-Security-Policy header set ─────────────────────────────
// CSP is the modern XSS defense. Sites that ship without it are
// vulnerable to script injection. Most modern frameworks make CSP easy
// to configure; the absence usually signals security wasn't considered.
export async function cspHeader(ctx: FetchCtx): Promise<CheckResult> {
  const csp = ctx.headers.get("content-security-policy");
  const cspReportOnly = ctx.headers.get("content-security-policy-report-only");
  if (csp) {
    return {
      id: "csp-header",
      label: "Content-Security-Policy set",
      pass: true,
      detail: `CSP header is set. Modern XSS defenses are in place.`,
    };
  }
  if (cspReportOnly) {
    return {
      id: "csp-header",
      label: "Content-Security-Policy set",
      pass: false,
      detail: `Only CSP-Report-Only is set. Reports violations but doesn't block them. Promote to enforcing when ready.`,
    };
  }
  return {
    id: "csp-header",
    label: "Content-Security-Policy set",
    pass: false,
    detail: `No CSP header. Modern XSS defenses aren't in place. Add via your hosting config.`,
  };
}

const SOCIAL_HOSTS = [
  "twitter.com",
  "x.com",
  "linkedin.com",
  "github.com",
  "instagram.com",
  "facebook.com",
  "youtube.com",
  "threads.net",
  "mastodon.social",
  "bsky.app",
];

export async function identitySignal(ctx: FetchCtx): Promise<CheckResult> {
  const html = ctx.html;
  const hasAboutContact = /<a\b[^>]*href=["'][^"']*(?:\/about|\/contact|mailto:)/i.test(html);
  const hasSocial = SOCIAL_HOSTS.some((h) =>
    new RegExp(`href=["'][^"']*${h.replace(/\./g, "\\.")}`, "i").test(html),
  );
  const pass = hasAboutContact || hasSocial;
  return {
    id: "identity-signal",
    label: "Identity or contact signal",
    pass,
    detail: pass
      ? hasAboutContact
        ? `Found About, Contact, or email link.`
        : `Found social media link in the page.`
      : `No About, Contact, or social link. Visitors can't tell who's behind this.`,
  };
}
