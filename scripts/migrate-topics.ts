// One-time migration: convert data/topics.ts entries into per-topic
// markdown files in content/topics/. Run via:
//   npx tsx scripts/migrate-topics.ts
//
// Idempotent — re-runs overwrite existing files. Output files use
// YAML frontmatter (parsed by gray-matter at runtime) for structured
// fields + plain markdown body for the intro prose.

import fs from "fs";
import path from "path";
import { topics } from "../data/topics";

const OUT_DIR = path.join(process.cwd(), "content", "topics");

function yamlEscape(s: string): string {
  // Use folded scalar style (>-) for multi-line, otherwise quote
  // single-line strings that contain risky characters.
  if (s.includes("\n")) {
    const lines = s.trim().split("\n").map((l) => "  " + l);
    return ">\n" + lines.join("\n");
  }
  // Quote if contains special chars
  if (/[:#&*!?{}[\],|"'%@`]/.test(s)) {
    return JSON.stringify(s);
  }
  return s;
}

function arrayToYaml(arr: string[], indent = 2): string {
  return arr.map((item) => " ".repeat(indent) + "- " + yamlEscape(item)).join("\n");
}

function migrateOne(topic: typeof topics[number]): { path: string; bytes: number } {
  const lines: string[] = [];
  lines.push("---");
  lines.push(`slug: ${topic.slug}`);
  lines.push(`title: ${yamlEscape(topic.title)}`);
  lines.push(`eyebrow: ${yamlEscape(topic.eyebrow)}`);
  lines.push(`metaTitle: ${yamlEscape(topic.metaTitle)}`);
  lines.push(`metaDescription: ${yamlEscape(topic.metaDescription)}`);
  lines.push(`accentColor: ${yamlEscape(topic.accentColor)}`);
  lines.push(`keywords:`);
  lines.push(arrayToYaml(topic.keywords));
  lines.push(`caseStudyIds:`);
  lines.push(arrayToYaml(topic.caseStudyIds));
  if (topic.faqs && topic.faqs.length > 0) {
    lines.push(`faqs:`);
    for (const faq of topic.faqs) {
      lines.push(`  - question: ${yamlEscape(faq.question)}`);
      lines.push(`    answer: ${yamlEscape(faq.answer)}`);
    }
  }
  lines.push("---");
  lines.push("");
  lines.push(topic.intro);
  lines.push("");
  const content = lines.join("\n");

  const outPath = path.join(OUT_DIR, `${topic.slug}.md`);
  fs.writeFileSync(outPath, content, "utf8");
  return { path: outPath, bytes: Buffer.byteLength(content, "utf8") };
}

function main() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }
  console.log(`Migrating ${topics.length} topics to ${OUT_DIR}...`);
  const results = topics.map(migrateOne);
  results.forEach((r) => {
    console.log(`  ✓ ${path.basename(r.path)} (${r.bytes} bytes)`);
  });
  console.log(`Done. ${results.length} files written.`);
}

main();
