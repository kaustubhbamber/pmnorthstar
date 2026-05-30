// Sync markdown content → data/*.ts files.
//
// Run via: npx tsx scripts/sync-content.ts
//
// Reads every file in content/{topics,comparisons,books,case-studies}/
// and regenerates the corresponding data/*.ts file. The data files are
// auto-generated artifacts — markdown is the source of truth.
//
// Safe to re-run: deterministic output, full file regeneration.

import fs from "fs";
import path from "path";
import matter from "gray-matter";

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, "content");
const DATA = path.join(ROOT, "data");

function readAll(dir: string): Array<{ slug: string; data: any; body: string }> {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), "utf8");
      const { data, content } = matter(raw);
      return { slug: f.replace(/\.md$/, ""), data, body: content.trim() };
    });
}

// TypeScript-safe string literal — JSON.stringify handles all edge cases
// (quotes, newlines, unicode) and produces valid TS string literals.
const ts = (s: any): string =>
  s === undefined || s === null ? "null" : JSON.stringify(s);

const tsArr = (arr: any[] | undefined, indent = 2): string => {
  if (!arr || arr.length === 0) return "[]";
  const pad = " ".repeat(indent);
  return "[\n" + arr.map((x) => pad + ts(x)).join(",\n") + "\n" + " ".repeat(indent - 2) + "]";
};

const tsObjArr = (
  arr: Record<string, any>[] | undefined,
  indent = 2
): string => {
  if (!arr || arr.length === 0) return "[]";
  const pad = " ".repeat(indent);
  return (
    "[\n" +
    arr
      .map((obj) => {
        const inner = Object.entries(obj)
          .map(([k, v]) => `${pad}  ${k}: ${ts(v)}`)
          .join(",\n");
        return `${pad}{\n${inner}\n${pad}}`;
      })
      .join(",\n") +
    "\n" +
    " ".repeat(indent - 2) +
    "]"
  );
};

const HEADER = `// ⚠️  AUTO-GENERATED — DO NOT EDIT BY HAND.
// Source of truth is content/. Run \`npx tsx scripts/sync-content.ts\`
// to regenerate after editing markdown files.
`;

// ─── TOPICS ─────────────────────────────────────────────────────────────
function syncTopics() {
  const entries = readAll(path.join(CONTENT, "topics"));
  const body = entries
    .map((e) => {
      const d = e.data;
      const fields: string[] = [];
      fields.push(`    slug: ${ts(d.slug)}`);
      fields.push(`    title: ${ts(d.title)}`);
      fields.push(`    eyebrow: ${ts(d.eyebrow)}`);
      fields.push(`    intro: ${ts(e.body)}`);
      fields.push(`    metaTitle: ${ts(d.metaTitle)}`);
      fields.push(`    metaDescription: ${ts(d.metaDescription)}`);
      fields.push(`    keywords: ${tsArr(d.keywords, 6)}`);
      fields.push(`    accentColor: ${ts(d.accentColor)}`);
      fields.push(`    caseStudyIds: ${tsArr(d.caseStudyIds, 6)}`);
      if (d.publishedAt) fields.push(`    publishedAt: ${ts(d.publishedAt)}`);
      if (d.faqs) {
        fields.push(`    faqs: ${tsObjArr(d.faqs, 6)}`);
      }
      return `  {\n${fields.join(",\n")},\n  }`;
    })
    .join(",\n");

  const out = `${HEADER}
export interface TopicFAQ {
  question: string;
  answer: string;
}

export interface Topic {
  slug: string;
  title: string;
  eyebrow: string;
  intro: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  accentColor: string;
  caseStudyIds: string[];
  // ISO date. Optional: a topic with no publishedAt is always live
  // (legacy entries predate scheduling). A future date keeps the topic
  // hidden until then in production. Dev sees everything.
  publishedAt?: string;
  faqs?: TopicFAQ[];
}

export const topics: Topic[] = [
${body},
];

export const isTopicPublished = (t: Topic, now: Date = new Date()): boolean =>
  !t.publishedAt || process.env.NODE_ENV !== "production" || new Date(t.publishedAt) <= now;

export const publishedTopics = (now: Date = new Date()): Topic[] =>
  topics.filter((t) => isTopicPublished(t, now));

export const getTopicBySlug = (slug: string): Topic | undefined => {
  const t = topics.find((x) => x.slug === slug);
  return t && isTopicPublished(t) ? t : undefined;
};
`;
  fs.writeFileSync(path.join(DATA, "topics.ts"), out, "utf8");
  console.log(`✓ data/topics.ts (${entries.length} entries)`);
}

// ─── COMPARISONS ────────────────────────────────────────────────────────
function syncComparisons() {
  const entries = readAll(path.join(CONTENT, "comparisons"));
  const body = entries
    .map((e) => {
      const d = e.data;
      const fields: string[] = [];
      fields.push(`    slug: ${ts(d.slug)}`);
      fields.push(`    companyA: ${ts(d.companyA)}`);
      fields.push(`    companyB: ${ts(d.companyB)}`);
      fields.push(`    title: ${ts(d.title)}`);
      fields.push(`    eyebrow: ${ts(d.eyebrow)}`);
      fields.push(`    intro: ${ts(e.body)}`);
      fields.push(`    verdict: ${ts(d.verdict)}`);
      fields.push(`    metaTitle: ${ts(d.metaTitle)}`);
      fields.push(`    metaDescription: ${ts(d.metaDescription)}`);
      fields.push(`    keywords: ${tsArr(d.keywords, 6)}`);
      fields.push(`    accentColor: ${ts(d.accentColor)}`);
      fields.push(`    rows: ${tsObjArr(d.rows, 6)}`);
      if (d.publishedAt) fields.push(`    publishedAt: ${ts(d.publishedAt)}`);
      if (d.faqs) fields.push(`    faqs: ${tsObjArr(d.faqs, 6)}`);
      return `  {\n${fields.join(",\n")},\n  }`;
    })
    .join(",\n");

  const out = `${HEADER}
export interface ComparisonFAQ {
  question: string;
  answer: string;
}

export interface Comparison {
  slug: string;
  companyA: string;
  companyB: string;
  title: string;
  eyebrow: string;
  intro: string;
  verdict: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  accentColor: string;
  rows: Array<{ label: string; a: string; b: string }>;
  // ISO date. Optional: no publishedAt = always live. A future date
  // hides the comparison until then in production (dev sees all).
  publishedAt?: string;
  faqs?: ComparisonFAQ[];
}

export const comparisons: Comparison[] = [
${body},
];

export const isComparisonPublished = (c: Comparison, now: Date = new Date()): boolean =>
  !c.publishedAt || process.env.NODE_ENV !== "production" || new Date(c.publishedAt) <= now;

export const publishedComparisons = (now: Date = new Date()): Comparison[] =>
  comparisons.filter((c) => isComparisonPublished(c, now));

export const getComparisonBySlug = (slug: string): Comparison | undefined => {
  const c = comparisons.find((x) => x.slug === slug);
  return c && isComparisonPublished(c) ? c : undefined;
};
`;
  fs.writeFileSync(path.join(DATA, "comparisons.ts"), out, "utf8");
  console.log(`✓ data/comparisons.ts (${entries.length} entries)`);
}

// ─── BOOKS ──────────────────────────────────────────────────────────────
function syncBooks() {
  const entries = readAll(path.join(CONTENT, "books"));
  // Preserve original ordering (pm-1 → pm-10 → st-1 → st-10 → mg-1 → mg-10)
  // by sorting on the id field rather than alphabetical slug.
  entries.sort((a, b) => {
    const order = ["pm", "st", "mg"];
    const ax = order.indexOf((a.data.id as string).split("-")[0]);
    const bx = order.indexOf((b.data.id as string).split("-")[0]);
    if (ax !== bx) return ax - bx;
    const an = parseInt((a.data.id as string).split("-")[1] || "0", 10);
    const bn = parseInt((b.data.id as string).split("-")[1] || "0", 10);
    return an - bn;
  });

  const body = entries
    .map((e) => {
      const d = e.data;
      const fields: string[] = [];
      fields.push(`    id: ${ts(d.id)}`);
      if (d.amazonUrl) fields.push(`    amazonUrl: ${ts(d.amazonUrl)}`);
      fields.push(`    title: ${ts(d.title)}`);
      fields.push(`    author: ${ts(d.author)}`);
      fields.push(`    category: ${ts(d.category)}`);
      fields.push(`    thumbnailURL: ${ts(d.thumbnailURL)}`);
      fields.push(`    link: ${ts(d.link)}`);
      fields.push(`    description: ${ts(d.description)}`);
      fields.push(`    rating: ${d.rating}`);
      fields.push(`    pages: ${d.pages}`);
      fields.push(`    year: ${d.year}`);
      fields.push(`    tags: ${tsArr(d.tags, 6)}`);
      if (d.featured) fields.push(`    featured: true`);
      if (d.summary) {
        const s = d.summary;
        const sumLines: string[] = [];
        sumLines.push(`      analysis: ${tsArr(s.analysis, 8)}`);
        sumLines.push(
          `      keyConcepts: ${tsObjArr(s.keyConcepts, 8)}`
        );
        sumLines.push(`      whoShouldRead: ${ts(s.whoShouldRead)}`);
        if (s.pairsWith) sumLines.push(`      pairsWith: ${tsArr(s.pairsWith, 8)}`);
        if (s.relatedCaseStudies)
          sumLines.push(
            `      relatedCaseStudies: ${tsArr(s.relatedCaseStudies, 8)}`
          );
        fields.push(`    summary: {\n${sumLines.join(",\n")},\n    }`);
      }
      return `  {\n${fields.join(",\n")},\n  }`;
    })
    .join(",\n");

  const out = `${HEADER}
export type Category = "Product Management" | "Startups" | "Management";

// Amazon Associates India affiliate tag. All book links flow through here.
export const AMAZON_AFFILIATE_TAG = "pmnorthstar-21";

export interface BookSummary {
  analysis: string[];
  keyConcepts: Array<{ name: string; explanation: string }>;
  whoShouldRead: string;
  pairsWith?: string[];
  relatedCaseStudies?: string[];
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: Category;
  thumbnailURL: string;
  link: string;
  description: string;
  rating: number;
  pages: number;
  year: number;
  tags: string[];
  featured?: boolean;
  amazonUrl?: string;
  summary?: BookSummary;
}

// Bumped when book content has meaningful refresh. Sitemap reads this.
export const BOOKS_LAST_UPDATED = "2026-05-18";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getBookSlug(book: Book): string {
  return slugify(\`\${book.title} \${book.author.split(" ").pop()}\`);
}

export function getBookBySlug(slug: string, books: Book[]): Book | undefined {
  return books.find((b) => getBookSlug(b) === slug);
}

export function getAmazonAffiliateUrl(book: Book): string {
  if (book.amazonUrl) return book.amazonUrl;
  const query = encodeURIComponent(\`\${book.title} \${book.author}\`);
  return \`https://www.amazon.in/s?k=\${query}&tag=\${AMAZON_AFFILIATE_TAG}\`;
}

export const books: Book[] = [
${body},
];

export const categories: Category[] = [
  "Product Management",
  "Startups",
  "Management",
];

export const getBooksByCategory = (category: Category) =>
  books.filter((b) => b.category === category);

export const getFeaturedBooks = () => books.filter((b) => b.featured);
`;
  fs.writeFileSync(path.join(DATA, "books.ts"), out, "utf8");
  console.log(`✓ data/books.ts (${entries.length} entries)`);
}

// ─── CASE STUDIES ───────────────────────────────────────────────────────
function syncCaseStudies() {
  const entries = readAll(path.join(CONTENT, "case-studies"));
  // Preserve cs-N order — numeric, not alphabetical.
  entries.sort((a, b) => {
    const an = parseInt((a.data.id as string).split("-")[1] || "0", 10);
    const bn = parseInt((b.data.id as string).split("-")[1] || "0", 10);
    return an - bn;
  });

  const studyBody = entries
    .map((e) => {
      const d = e.data;
      const fields: string[] = [];
      fields.push(`    id: ${ts(d.id)}`);
      fields.push(`    company: ${ts(d.company)}`);
      fields.push(`    title: ${ts(d.title)}`);
      fields.push(`    category: ${ts(d.category)}`);
      fields.push(`    description: ${ts(d.description)}`);
      fields.push(`    outcome: ${ts(d.outcome)}`);
      fields.push(`    year: ${d.year}`);
      fields.push(`    tags: ${tsArr(d.tags, 6)}`);
      fields.push(`    content: ${ts(e.body)}`);
      fields.push(`    logo: ${ts(d.logo)}`);
      if (d.region) fields.push(`    region: ${ts(d.region)}`);
      if (d.publishedAt) fields.push(`    publishedAt: ${ts(d.publishedAt)}`);
      return `  {\n${fields.join(",\n")},\n  }`;
    })
    .join(",\n");

  // Slug map preserves the legacy hand-curated slugs (e.g. cs-51 →
  // "cred-design-fintech"). We read these from each entry's frontmatter.
  const slugEntries = entries.map(
    (e) => `  ${ts(e.data.id)}: ${ts(e.data.slug)},`
  );

  const out = `${HEADER}
// Bumped when case studies are added, edited, or have material changes.
// Sitemap reads this so Google sees an accurate lastModified date.
export const CASE_STUDIES_LAST_UPDATED = "2026-05-18";

export interface CaseStudy {
  id: string;
  company: string;
  title: string;
  category: "Product" | "Growth" | "Strategy" | "Design" | "Failure";
  description: string;
  outcome: string;
  year: number;
  tags: string[];
  content: string;
  logo: string;
  region?: "India";
  // ISO date. Optional: no publishedAt = always live (legacy entries
  // predate scheduling). A future date keeps the study hidden until then
  // in production — getCaseStudyById/BySlug return undefined for it, so it
  // also disappears from topics, comparisons and related links. Dev sees
  // everything. Detail/list pages are force-dynamic so the date takes
  // effect at request time without a redeploy (mirrors SimulateIt drills).
  publishedAt?: string;
}

export const caseStudies: CaseStudy[] = [
${studyBody},
];

export type CaseStudyCategory = "All" | "Product" | "Growth" | "Strategy" | "Design" | "Failure";

export const caseStudyCategories: CaseStudyCategory[] = [
  "All", "Product", "Growth", "Strategy", "Design", "Failure",
];

export const isCaseStudyPublished = (c: CaseStudy, now: Date = new Date()): boolean =>
  !c.publishedAt || process.env.NODE_ENV !== "production" || new Date(c.publishedAt) <= now;

// Case studies whose publishedAt has passed (or have none). Use this for
// every listing/browse surface so scheduled studies stay hidden until live.
export const publishedCaseStudies = (now: Date = new Date()): CaseStudy[] =>
  caseStudies.filter((c) => isCaseStudyPublished(c, now));

export const getCaseStudiesByCategory = (cat: CaseStudyCategory) =>
  (cat === "All" ? publishedCaseStudies() : publishedCaseStudies().filter((c) => c.category === cat));

// Resolves by id but hides not-yet-published studies, so cross-references
// (topics, comparisons, related, books) inherit the schedule for free.
export const getCaseStudyById = (id: string): CaseStudy | undefined => {
  const c = caseStudies.find((x) => x.id === id);
  return c && isCaseStudyPublished(c) ? c : undefined;
};

export const getIndianCaseStudies = (): CaseStudy[] =>
  caseStudies.filter((c) => c.region === "India" && isCaseStudyPublished(c));

// Legacy slug map — keeps URL stability after the markdown migration.
const SLUG_MAP: Record<string, string> = {
${slugEntries.join("\n")}
};

const ID_BY_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(SLUG_MAP).map(([id, slug]) => [slug, id])
);

export const getCaseStudySlug = (id: string): string =>
  SLUG_MAP[id] || id;

export const getCaseStudyBySlug = (slug: string): CaseStudy | undefined => {
  const id = ID_BY_SLUG[slug];
  return id != null ? getCaseStudyById(id) : undefined;
};

// True if param looks like a legacy cs-X identifier
export const isLegacyId = (param: string): boolean =>
  /^cs-\\d+$/.test(param);
`;
  fs.writeFileSync(path.join(DATA, "caseStudies.ts"), out, "utf8");
  console.log(`✓ data/caseStudies.ts (${entries.length} entries)`);
}

// ─── CASE STUDY FAQs ────────────────────────────────────────────────────
function syncCaseStudyFaqs() {
  const entries = readAll(path.join(CONTENT, "case-studies"));
  // Group FAQs by case study ID, preserving cs-N numerical order.
  entries.sort((a, b) => {
    const an = parseInt((a.data.id as string).split("-")[1] || "0", 10);
    const bn = parseInt((b.data.id as string).split("-")[1] || "0", 10);
    return an - bn;
  });

  const blocks = entries
    .filter((e) => e.data.faqs && e.data.faqs.length > 0)
    .map((e) => {
      const inner = (e.data.faqs as { question: string; answer: string }[])
        .map(
          (f) =>
            `    { question: ${ts(f.question)}, answer: ${ts(f.answer)} }`
        )
        .join(",\n");
      return `  ${ts(e.data.id)}: [\n${inner},\n  ]`;
    })
    .join(",\n");

  const out = `${HEADER}
export interface FAQ {
  question: string;
  answer: string;
}

// FAQ entries — sourced from each case study's markdown frontmatter
// in content/case-studies/. Regenerated by scripts/sync-content.ts.
const MANUAL_FAQS: Record<string, FAQ[]> = {
${blocks},
};

export function getCaseStudyFaqs(id: string): FAQ[] {
  if (MANUAL_FAQS[id]) return MANUAL_FAQS[id];
  return [];
}
`;
  fs.writeFileSync(path.join(DATA, "caseStudyFaqs.ts"), out, "utf8");
  const faqCount = entries.filter(
    (e) => e.data.faqs && e.data.faqs.length > 0
  ).length;
  console.log(`✓ data/caseStudyFaqs.ts (${faqCount} case studies with FAQs)`);
}

// ─── AI DECODED MANIFEST ────────────────────────────────────────────────
// AI Decoded articles live as markdown files in content/ai-decoded/
// and are read by lib/ai-decoded.ts on the server. The home page is
// a client component and can't read fs, so it needs a bundled manifest
// for search. Generated here from the same markdown source.
function syncAIDecodedManifest() {
  const DIR = path.join(CONTENT, "ai-decoded");
  if (!fs.existsSync(DIR)) {
    console.log("✓ data/aiDecodedManifest.ts (no ai-decoded folder; skipped)");
    return;
  }
  const entries = fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(DIR, f), "utf8");
      const { data, content } = matter(raw);
      return {
        slug: f.replace(/\.md$/, ""),
        data,
        body: content.trim(),
      };
    })
    .filter((e) => !!e.data.publishedAt)
    .sort(
      (a, b) =>
        new Date(b.data.publishedAt as string).getTime() -
        new Date(a.data.publishedAt as string).getTime()
    );

  const items = entries
    .map((e) => {
      const d = e.data;
      const faqText = (
        (d.faqs as { question: string; answer: string }[] | undefined) ?? []
      )
        .map((f) => `${f.question} ${f.answer}`)
        .join(" ");
      const searchableContent = `${e.body} ${faqText}`.toLowerCase();
      const fields: string[] = [];
      fields.push(`    slug: ${ts(d.slug)}`);
      fields.push(`    title: ${ts(d.title)}`);
      fields.push(`    excerpt: ${ts(d.excerpt)}`);
      fields.push(`    category: ${ts(d.category)}`);
      fields.push(`    primaryKeyword: ${ts(d.primaryKeyword)}`);
      fields.push(
        `    longTailKeywords: ${tsArr(d.longTailKeywords as string[], 6)}`
      );
      fields.push(`    publishedAt: ${ts(d.publishedAt)}`);
      fields.push(`    searchableContent: ${ts(searchableContent)}`);
      return `  {\n${fields.join(",\n")},\n  }`;
    })
    .join(",\n");

  const out = `${HEADER}
// Lightweight client-bundleable index of AI Decoded articles.
// Used by the home page search; the full content + interactive
// page rendering still goes through lib/ai-decoded.ts which reads
// the markdown files directly on the server.

export interface AIDecodedManifestEntry {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  primaryKeyword: string;
  longTailKeywords: string[];
  publishedAt: string;
  // Pre-lowercased concatenation of body + FAQ text. Used by search
  // .includes() calls so we don't lowercase per-keystroke at runtime.
  searchableContent: string;
}

export const aiDecodedManifest: AIDecodedManifestEntry[] = [
${items},
];

// Manifest entries whose publishedAt has passed, newest first. The full
// manifest includes future ("planned release") articles for build-time
// completeness; this filters them out so client surfaces (home search,
// hero "latest" link) never point at an article whose detail page is
// still gated. Dev sees everything. Client-safe (no fs) unlike
// lib/ai-decoded.ts.
export const publishedAIDecoded = (
  now: Date = new Date()
): AIDecodedManifestEntry[] =>
  aiDecodedManifest.filter(
    (a) => process.env.NODE_ENV !== "production" || new Date(a.publishedAt) <= now
  );
`;
  fs.writeFileSync(path.join(DATA, "aiDecodedManifest.ts"), out, "utf8");
  console.log(`✓ data/aiDecodedManifest.ts (${entries.length} entries)`);
}

// ─── DRILLS (SimulateIt) ────────────────────────────────────────────────
// Branching decision drills. Each drill is a node graph with typed
// options leading to other nodes or terminal outcome nodes. Validated
// at build time so authoring errors (orphan nodes, typo'd leadsTo refs,
// missing prompts) fail loudly here instead of at runtime.
function validateDrillGraph(drill: any, slug: string) {
  const nodes = drill.nodes as Record<string, any>;
  if (!nodes || typeof nodes !== "object") {
    throw new Error(`Drill ${slug}: missing or invalid 'nodes' object`);
  }
  if (!nodes.start) {
    throw new Error(`Drill ${slug}: missing 'start' node`);
  }
  const nodeIds = Object.keys(nodes);
  for (const [nodeId, node] of Object.entries(nodes)) {
    if ((node as any).isOutcome) continue;
    if (!(node as any).prompt) {
      throw new Error(`Drill ${slug} node "${nodeId}": missing prompt`);
    }
    const opts = (node as any).options as any[] | undefined;
    if (!opts || opts.length < 2) {
      throw new Error(`Drill ${slug} node "${nodeId}": needs at least 2 options`);
    }
    for (const opt of opts) {
      if (!opt.leadsTo) {
        throw new Error(
          `Drill ${slug} node "${nodeId}": option "${opt.text}" missing leadsTo`
        );
      }
      if (!nodeIds.includes(opt.leadsTo)) {
        throw new Error(
          `Drill ${slug} node "${nodeId}": option leads to non-existent node "${opt.leadsTo}"`
        );
      }
      if (typeof opt.points !== "number") {
        throw new Error(
          `Drill ${slug} node "${nodeId}": option "${opt.text}" missing numeric points`
        );
      }
      if (!opt.rationale || !opt.consequence) {
        throw new Error(
          `Drill ${slug} node "${nodeId}": option "${opt.text}" missing rationale or consequence`
        );
      }
    }
  }
  // Reachability check: every node must be reachable from "start".
  const reachable = new Set<string>(["start"]);
  let added = true;
  while (added) {
    added = false;
    for (const nodeId of Array.from(reachable)) {
      const node = nodes[nodeId];
      const opts = (node as any).options as any[] | undefined;
      if (opts) {
        for (const opt of opts) {
          if (!reachable.has(opt.leadsTo)) {
            reachable.add(opt.leadsTo);
            added = true;
          }
        }
      }
    }
  }
  for (const nodeId of nodeIds) {
    if (!reachable.has(nodeId)) {
      throw new Error(`Drill ${slug}: node "${nodeId}" is unreachable from start`);
    }
  }
}

function syncDrills() {
  const DIR = path.join(CONTENT, "drills");
  if (!fs.existsSync(DIR)) {
    fs.writeFileSync(
      path.join(DATA, "drills.ts"),
      `${HEADER}
export type DrillDimension = "product" | "business" | "founder";
export type DrillType = "historical" | "current" | "hypothetical";

export interface DrillOption {
  text: string;
  points: number;
  pattern: string;
  rationale: string;
  consequence: string;
  leadsTo: string;
}

export interface DrillNode {
  dimension?: DrillDimension;
  prompt?: string;
  options?: DrillOption[];
  isOutcome?: boolean;
  summary?: string;
}

export interface Drill {
  slug: string;
  caseStudySlug?: string;
  type: DrillType;
  category: string;
  publishedAt: string;
  year?: number;
  estimatedMinutes: number;
  principle: string;
  intro: string;
  nodes: Record<string, DrillNode>;
  outroBody: string;
}

export const drills: Drill[] = [];

export const publishedDrills = (now: Date = new Date()): Drill[] =>
  drills
    .filter((d) => new Date(d.publishedAt) <= now)
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));

export const getDrillBySlug = (slug: string): Drill | undefined =>
  drills.find((d) => d.slug === slug);

export const getFeaturedDrill = (): Drill | undefined =>
  publishedDrills()[0];
`,
      "utf8"
    );
    console.log("✓ data/drills.ts (no drills folder; empty stub)");
    return;
  }

  const entries = readAll(DIR);
  for (const e of entries) {
    try {
      validateDrillGraph(e.data, e.slug);
    } catch (err) {
      console.error(`\n✗ Drill validation failed for ${e.slug}:`);
      console.error(`  ${(err as Error).message}\n`);
      throw err;
    }
  }

  // Sort by publishedAt descending so generated array order ≈ display order.
  entries.sort(
    (a, b) =>
      new Date(b.data.publishedAt as string).getTime() -
      new Date(a.data.publishedAt as string).getTime()
  );

  const items = entries
    .map((e) => {
      const d = e.data;
      const fields: string[] = [];
      fields.push(`    slug: ${ts(d.slug)}`);
      if (d.caseStudySlug) fields.push(`    caseStudySlug: ${ts(d.caseStudySlug)}`);
      fields.push(`    type: ${ts(d.type)}`);
      fields.push(`    category: ${ts(d.category)}`);
      fields.push(`    publishedAt: ${ts(d.publishedAt)}`);
      if (d.year !== undefined) fields.push(`    year: ${d.year}`);
      fields.push(`    estimatedMinutes: ${d.estimatedMinutes ?? 8}`);
      fields.push(`    principle: ${ts(d.principle)}`);
      fields.push(`    intro: ${ts(d.intro)}`);
      // Nodes is a deep object — JSON.stringify produces a valid TS literal.
      fields.push(`    nodes: ${ts(d.nodes)}`);
      fields.push(`    outroBody: ${ts(e.body)}`);
      return `  {\n${fields.join(",\n")},\n  }`;
    })
    .join(",\n");

  const out = `${HEADER}
export type DrillDimension = "product" | "business" | "founder";
export type DrillType = "historical" | "current" | "hypothetical";

export interface DrillOption {
  text: string;
  points: number;
  pattern: string;
  rationale: string;
  consequence: string;
  leadsTo: string;
}

export interface DrillNode {
  dimension?: DrillDimension;
  prompt?: string;
  options?: DrillOption[];
  isOutcome?: boolean;
  summary?: string;
}

export interface Drill {
  slug: string;
  caseStudySlug?: string;
  type: DrillType;
  category: string;
  publishedAt: string;
  year?: number;
  estimatedMinutes: number;
  principle: string;
  intro: string;
  nodes: Record<string, DrillNode>;
  outroBody: string;
}

export const drills: Drill[] = [
${items},
];

// Returns drills whose publishedAt is in the past, newest first.
// Future-dated drills are invisible until their timestamp passes — no
// rebuild needed, the comparison happens server-side at each request.
export const publishedDrills = (now: Date = new Date()): Drill[] =>
  drills
    .filter((d) => new Date(d.publishedAt) <= now)
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));

export const getDrillBySlug = (slug: string): Drill | undefined =>
  drills.find((d) => d.slug === slug);

export const getFeaturedDrill = (): Drill | undefined =>
  publishedDrills()[0];
`;
  fs.writeFileSync(path.join(DATA, "drills.ts"), out, "utf8");
  console.log(`✓ data/drills.ts (${entries.length} entries)`);

  // Standalone count for the home banner — importing drills.ts adds
  // ~260kB to the home page bundle just to read .length.
  const countOut = `// Auto-generated by scripts/sync-content.ts — do not edit.
// Standalone drill count for the home banner. Importing drills.ts
// pulls ~260kB of scenario content into the home page bundle.
export const DRILL_COUNT = ${entries.length};
`;
  fs.writeFileSync(path.join(DATA, "drillsCount.ts"), countOut, "utf8");
  console.log(`✓ data/drillsCount.ts (${entries.length})`);
}

function main() {
  console.log("Syncing markdown content → data/*.ts...\n");
  syncTopics();
  syncComparisons();
  syncBooks();
  syncCaseStudies();
  syncCaseStudyFaqs();
  syncAIDecodedManifest();
  syncDrills();
  console.log("\nDone. Review the diff before committing.");
}

main();
