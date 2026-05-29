// One-off: shift every drill's publishedAt by -3 days so the original
// Mon-Jun-1 launch becomes Fri-May-29 (today), and the whole cadence
// stays the same Fri + Mon rhythm (same 3-4-3-4 spacing as the
// original Mon + Thu).
//
// Run via: node scripts/shift-drill-schedule.mjs
// Then run: npx tsx scripts/sync-content.ts

import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";

const DIR = "/Users/Amber_User/Downloads/northstar/content/drills";
const SHIFT_DAYS = -3;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const files = readdirSync(DIR).filter((f) => f.endsWith(".md"));
let shifted = 0;

for (const file of files) {
  const path = join(DIR, file);
  const raw = readFileSync(path, "utf8");

  // Find the publishedAt line in frontmatter. Pattern is:
  //   publishedAt: "2026-06-01T20:30:00+05:30"
  const m = raw.match(/^publishedAt:\s*"([^"]+)"/m);
  if (!m) {
    console.log(`✗ ${file}: no publishedAt found, skipping`);
    continue;
  }

  const oldIso = m[1];
  const oldDate = new Date(oldIso);
  const newDate = new Date(oldDate.getTime() + SHIFT_DAYS * MS_PER_DAY);

  // Rebuild the ISO string preserving the +05:30 offset.
  // Format: YYYY-MM-DDTHH:mm:ss+05:30
  const offsetMin = 5 * 60 + 30; // IST
  const local = new Date(newDate.getTime() + offsetMin * 60 * 1000);
  const yyyy = local.getUTCFullYear();
  const mm = String(local.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(local.getUTCDate()).padStart(2, "0");
  const HH = String(local.getUTCHours()).padStart(2, "0");
  const MM = String(local.getUTCMinutes()).padStart(2, "0");
  const SS = String(local.getUTCSeconds()).padStart(2, "0");
  const newIso = `${yyyy}-${mm}-${dd}T${HH}:${MM}:${SS}+05:30`;

  const updated = raw.replace(
    /^publishedAt:\s*"[^"]+"/m,
    `publishedAt: "${newIso}"`
  );
  writeFileSync(path, updated, "utf8");
  console.log(`✓ ${file}: ${oldIso} → ${newIso}`);
  shifted++;
}

console.log(`\nShifted ${shifted} drill(s) by ${SHIFT_DAYS} day(s).`);
console.log("Now run: npx tsx scripts/sync-content.ts");
