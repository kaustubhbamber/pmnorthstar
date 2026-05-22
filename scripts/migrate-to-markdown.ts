// One-time migration: convert all data/*.ts entries into per-entity
// markdown files in content/. Run via:
//   npx tsx scripts/migrate-to-markdown.ts
//
// Idempotent — re-runs overwrite existing files. Output uses YAML
// frontmatter for structured fields + markdown body for prose.

import fs from "fs";
import path from "path";
import { topics } from "../data/topics";
import { comparisons } from "../data/comparisons";
import { books } from "../data/books";
import { caseStudies } from "../data/caseStudies";
import { getCaseStudyFaqs } from "../data/caseStudyFaqs";

const ROOT = process.cwd();

function ensure(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// Always-quoted YAML string. Safer than ad-hoc escape logic.
function yamlStr(s: string | number | boolean | null | undefined): string {
  if (s === null || s === undefined) return '""';
  if (typeof s === "boolean" || typeof s === "number") return String(s);
  return JSON.stringify(s);
}

function yamlArr(arr: (string | number)[] | undefined, indent = 2): string {
  if (!arr || arr.length === 0) return "[]";
  return (
    "\n" + arr.map((x) => " ".repeat(indent) + "- " + yamlStr(x)).join("\n")
  );
}

function yamlObj(obj: Record<string, unknown>, indent = 2): string {
  const pad = " ".repeat(indent);
  return (
    "\n" +
    Object.entries(obj)
      .map(([k, v]) => `${pad}${k}: ${yamlStr(v as string)}`)
      .join("\n")
  );
}

function yamlObjArr(
  arr: Record<string, unknown>[] | undefined,
  indent = 2
): string {
  if (!arr || arr.length === 0) return "[]";
  const pad = " ".repeat(indent);
  return (
    "\n" +
    arr
      .map(
        (item) =>
          Object.entries(item)
            .map(
              ([k, v], i) =>
                (i === 0 ? pad + "- " : pad + "  ") +
                `${k}: ${yamlStr(v as string)}`
            )
            .join("\n")
      )
      .join("\n")
  );
}

// ─── TOPICS ─────────────────────────────────────────────────────────────
function migrateTopics() {
  const OUT = path.join(ROOT, "content", "topics");
  ensure(OUT);
  for (const t of topics) {
    const fm: string[] = [];
    fm.push("---");
    fm.push(`slug: ${yamlStr(t.slug)}`);
    fm.push(`title: ${yamlStr(t.title)}`);
    fm.push(`eyebrow: ${yamlStr(t.eyebrow)}`);
    fm.push(`metaTitle: ${yamlStr(t.metaTitle)}`);
    fm.push(`metaDescription: ${yamlStr(t.metaDescription)}`);
    fm.push(`accentColor: ${yamlStr(t.accentColor)}`);
    fm.push(`keywords:${yamlArr(t.keywords)}`);
    fm.push(`caseStudyIds:${yamlArr(t.caseStudyIds)}`);
    if (t.faqs && t.faqs.length > 0)
      fm.push(
        `faqs:${yamlObjArr(t.faqs as unknown as Record<string, unknown>[])}`
      );
    fm.push("---");
    fm.push("");
    fm.push(t.intro);
    fm.push("");
    fs.writeFileSync(path.join(OUT, `${t.slug}.md`), fm.join("\n"), "utf8");
  }
  console.log(`✓ topics: ${topics.length} files`);
}

// ─── COMPARISONS ────────────────────────────────────────────────────────
function migrateComparisons() {
  const OUT = path.join(ROOT, "content", "comparisons");
  ensure(OUT);
  for (const c of comparisons) {
    const fm: string[] = [];
    fm.push("---");
    fm.push(`slug: ${yamlStr(c.slug)}`);
    fm.push(`companyA: ${yamlStr(c.companyA)}`);
    fm.push(`companyB: ${yamlStr(c.companyB)}`);
    fm.push(`title: ${yamlStr(c.title)}`);
    fm.push(`eyebrow: ${yamlStr(c.eyebrow)}`);
    fm.push(`verdict: ${yamlStr(c.verdict)}`);
    fm.push(`metaTitle: ${yamlStr(c.metaTitle)}`);
    fm.push(`metaDescription: ${yamlStr(c.metaDescription)}`);
    fm.push(`accentColor: ${yamlStr(c.accentColor)}`);
    fm.push(`keywords:${yamlArr(c.keywords)}`);
    fm.push(`rows:${yamlObjArr(c.rows as unknown as Record<string, unknown>[])}`);
    if (c.faqs && c.faqs.length > 0)
      fm.push(
        `faqs:${yamlObjArr(c.faqs as unknown as Record<string, unknown>[])}`
      );
    fm.push("---");
    fm.push("");
    fm.push(c.intro);
    fm.push("");
    fs.writeFileSync(path.join(OUT, `${c.slug}.md`), fm.join("\n"), "utf8");
  }
  console.log(`✓ comparisons: ${comparisons.length} files`);
}

// ─── BOOKS ──────────────────────────────────────────────────────────────
function getBookSlug(b: typeof books[number]): string {
  const s = `${b.title} ${b.author.split(" ").pop()}`;
  return s
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
function migrateBooks() {
  const OUT = path.join(ROOT, "content", "books");
  ensure(OUT);
  for (const b of books) {
    const slug = getBookSlug(b);
    const fm: string[] = [];
    fm.push("---");
    fm.push(`id: ${yamlStr(b.id)}`);
    fm.push(`slug: ${yamlStr(slug)}`);
    fm.push(`title: ${yamlStr(b.title)}`);
    fm.push(`author: ${yamlStr(b.author)}`);
    fm.push(`category: ${yamlStr(b.category)}`);
    fm.push(`thumbnailURL: ${yamlStr(b.thumbnailURL)}`);
    fm.push(`link: ${yamlStr(b.link)}`);
    if (b.amazonUrl) fm.push(`amazonUrl: ${yamlStr(b.amazonUrl)}`);
    fm.push(`description: ${yamlStr(b.description)}`);
    fm.push(`rating: ${b.rating}`);
    fm.push(`pages: ${b.pages}`);
    fm.push(`year: ${b.year}`);
    fm.push(`tags:${yamlArr(b.tags)}`);
    if (b.featured) fm.push(`featured: true`);
    if (b.summary) {
      fm.push(`summary:`);
      fm.push(`  analysis:`);
      for (const para of b.summary.analysis) {
        fm.push(`    - ${yamlStr(para)}`);
      }
      fm.push(`  keyConcepts:`);
      for (const kc of b.summary.keyConcepts) {
        fm.push(`    - name: ${yamlStr(kc.name)}`);
        fm.push(`      explanation: ${yamlStr(kc.explanation)}`);
      }
      fm.push(`  whoShouldRead: ${yamlStr(b.summary.whoShouldRead)}`);
      if (b.summary.pairsWith && b.summary.pairsWith.length > 0) {
        fm.push(`  pairsWith:`);
        for (const p of b.summary.pairsWith) {
          fm.push(`    - ${yamlStr(p)}`);
        }
      }
      if (
        b.summary.relatedCaseStudies &&
        b.summary.relatedCaseStudies.length > 0
      ) {
        fm.push(`  relatedCaseStudies:`);
        for (const r of b.summary.relatedCaseStudies) {
          fm.push(`    - ${yamlStr(r)}`);
        }
      }
    }
    fm.push("---");
    fm.push("");
    fm.push(`${b.title} by ${b.author}.`);
    fm.push("");
    fs.writeFileSync(path.join(OUT, `${slug}.md`), fm.join("\n"), "utf8");
  }
  console.log(`✓ books: ${books.length} files`);
}

// ─── CASE STUDIES ───────────────────────────────────────────────────────
function getCaseStudySlug(c: typeof caseStudies[number]): string {
  // Mirror getCaseStudySlug logic from data/caseStudies.ts —
  // we'll need to import that helper if it isn't deterministic from
  // the title alone. For migration we use the same algorithm.
  // (The current helper hand-curates many slugs; we read from
  // data/caseStudies.ts via the helper to guarantee identity.)
  return ""; // populated below by injection
}

function migrateCaseStudies(
  slugForId: (id: string) => string
) {
  const OUT = path.join(ROOT, "content", "case-studies");
  ensure(OUT);
  for (const c of caseStudies) {
    const slug = slugForId(c.id);
    const faqs = getCaseStudyFaqs(c.id);
    const fm: string[] = [];
    fm.push("---");
    fm.push(`id: ${yamlStr(c.id)}`);
    fm.push(`slug: ${yamlStr(slug)}`);
    fm.push(`company: ${yamlStr(c.company)}`);
    fm.push(`title: ${yamlStr(c.title)}`);
    fm.push(`category: ${yamlStr(c.category)}`);
    fm.push(`description: ${yamlStr(c.description)}`);
    fm.push(`outcome: ${yamlStr(c.outcome)}`);
    fm.push(`year: ${c.year}`);
    fm.push(`tags:${yamlArr(c.tags)}`);
    fm.push(`logo: ${yamlStr(c.logo)}`);
    if (c.region) fm.push(`region: ${yamlStr(c.region)}`);
    if (faqs && faqs.length > 0) {
      fm.push(
        `faqs:${yamlObjArr(faqs as unknown as Record<string, unknown>[])}`
      );
    }
    fm.push("---");
    fm.push("");
    fm.push(c.content.trim());
    fm.push("");
    fs.writeFileSync(path.join(OUT, `${slug}.md`), fm.join("\n"), "utf8");
  }
  console.log(`✓ case studies: ${caseStudies.length} files`);
}

async function main() {
  console.log("Migrating content to markdown...\n");
  migrateTopics();
  migrateComparisons();
  migrateBooks();
  // Use the existing slug helper from caseStudies.ts to ensure URL
  // identity post-migration.
  const { getCaseStudySlug } = await import("../data/caseStudies");
  migrateCaseStudies(getCaseStudySlug);
  console.log("\nDone. Verify content/ folder before committing.");
}

main();
