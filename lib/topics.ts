import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Topics are now stored as markdown files in content/topics/ — one
// per topic. Frontmatter holds the structured fields; the body is
// the intro prose. Read at build time via generateStaticParams +
// the route components.
//
// This replaces the previous data/topics.ts module. Helpers below
// keep the same shapes so consumer routes don't need to change.

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
  faqs?: TopicFAQ[];
}

const CONTENT_DIR = path.join(process.cwd(), "content", "topics");

function readOne(slug: string): Topic | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return {
    slug: (data.slug as string) ?? slug,
    title: data.title as string,
    eyebrow: data.eyebrow as string,
    metaTitle: data.metaTitle as string,
    metaDescription: data.metaDescription as string,
    accentColor: data.accentColor as string,
    keywords: (data.keywords as string[]) ?? [],
    caseStudyIds: (data.caseStudyIds as string[]) ?? [],
    faqs: data.faqs as TopicFAQ[] | undefined,
    intro: content.trim(),
  };
}

function allSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export const topics: Topic[] = allSlugs()
  .map((slug) => readOne(slug))
  .filter((t): t is Topic => t !== null);

export const getTopicBySlug = (slug: string): Topic | undefined =>
  topics.find((t) => t.slug === slug);
