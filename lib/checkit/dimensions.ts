// Static configuration for the 5 CheckIt dimensions.
//
// `whyItMatters` is the predefined essay shown on the result card —
// per the spec, the audit doesn't generate this, it's editorial content
// that explains why the dimension makes or breaks a product.
//
// `linkedResources` are northstar case studies / books that prove the
// point with real examples. Slugs match files in /content/{case-studies,books}.
// If you rename a content file, update the slug here too.

import type { DimensionId, LinkedResource } from "./types";

export interface DimensionConfig {
  id: DimensionId;
  label: string;
  oneLiner: string; // shown next to the score number on the card header
  whyItMatters: string;
  // 4 check IDs in display order — must match IDs returned by lib/checkit/checks.ts
  checkIds: [string, string, string, string];
  linkedResources: LinkedResource[];
}

export const DIMENSIONS: DimensionConfig[] = [
  {
    id: "brand",
    label: "Brand & Identity",
    oneLiner: "Does it look credible in the first 3 seconds?",
    whyItMatters:
      "The first three seconds decide if a user trusts you with anything — their email, their card, their time. A *.vercel.app URL and a default favicon tell users 'this is a side project,' even when the product underneath is brilliant. Brand isn't logos and color palettes. It's the dozen tiny signals — a custom domain, a real title tag, an OG image that doesn't render as a blank box in Slack — that say 'a real team built this.' Skip these and even your best users will treat you as disposable.",
    checkIds: ["custom-domain", "real-favicon", "og-image", "real-title"],
    linkedResources: [
      {
        type: "case-study",
        slug: "razorpay-pivot-fintech",
        title: "Razorpay — brand polish at fintech scale",
        hook: "How tiny trust signals decided who they could sell to.",
      },
      {
        type: "case-study",
        slug: "notion-all-in-one-workspace",
        title: "Notion — identity through every surface",
        hook: "Consistency turned a doc tool into a movement.",
      },
      {
        type: "book",
        slug: "obviously-awesome-dunford",
        title: "Obviously Awesome — April Dunford",
        hook: "Positioning is the layer above your features.",
      },
    ],
  },
  {
    id: "performance",
    label: "Performance",
    oneLiner: "Does it load before users give up?",
    whyItMatters:
      "Every 100ms of load time costs roughly 1% of conversions. On mobile 4G — where 60%+ of your traffic lives — a 4-second page loses more than half its visitors before they ever see your hero image. Performance isn't engineering vanity; it's the most direct lever on revenue you have. We measure the *causes* of slow load — how fast your server responds (TTFB), how much HTML it ships, whether your images and fonts are configured to prevent layout shift, and whether images use modern formats. Fix the causes and the user-perceived speed improves predictably; chasing a Lighthouse number rarely does.",
    checkIds: ["ttfb", "layout-shift-prevention", "html-payload", "modern-images"],
    linkedResources: [
      {
        type: "case-study",
        slug: "pinterest-waitlist",
        title: "Pinterest — performance as growth lever",
        hook: "40% load-time cut → 15% conversion lift in a week.",
      },
      {
        type: "case-study",
        slug: "vercel-developer-first",
        title: "Vercel — speed as a product feature",
        hook: "Built an entire company on 'your site should be fast.'",
      },
      {
        type: "book",
        slug: "hacking-growth-ellis",
        title: "Hacking Growth — Sean Ellis",
        hook: "Why technical fundamentals out-earn marketing tricks.",
      },
    ],
  },
  {
    id: "seo",
    label: "SEO & Discoverability",
    oneLiner: "Can Google actually find you?",
    whyItMatters:
      "If Google can't crawl you, you don't exist. Most vibe-coded sites have zero of the four things that matter — a sitemap, a meta description, canonical tags, a proper H1 — then wonder why traffic is flat after launch. SEO isn't a marketing afterthought. It's plumbing you wire on day one, takes an hour to get right, and compounds for years. The sites that get organic traffic aren't necessarily better than yours; they're the ones that didn't skip the boring 1990s-era HTML basics.",
    checkIds: ["meta-description", "robots-txt", "sitemap-xml", "single-h1"],
    linkedResources: [
      {
        type: "case-study",
        slug: "hubspot-inbound-marketing",
        title: "HubSpot — SEO as the entire growth engine",
        hook: "Built a $30B company on free content + crawlable pages.",
      },
      {
        type: "case-study",
        slug: "notion-all-in-one-workspace",
        title: "Notion — the template SEO moat",
        hook: "Why their /templates pages still convert in 2026.",
      },
      {
        type: "book",
        slug: "traction-weinberg",
        title: "Traction — Gabriel Weinberg",
        hook: "SEO is one of 19 channels. Pick on purpose.",
      },
    ],
  },
  {
    id: "ux",
    label: "UX & Conversion",
    oneLiner: "Do users know what to do next?",
    whyItMatters:
      "A beautiful site with no clear next action is a museum, not a product. Users need to know within 5 seconds: what is this, who is it for, what do I do. Mobile responsiveness isn't optional — phones are where the audit happens before anyone touches a laptop, and a site that requires sideways scrolling on a 375px screen is dead before it's seen. Most failed launches don't fail because the product was bad. They fail because the hero didn't name the value and the button didn't say what would happen when clicked.",
    checkIds: ["viewport-meta", "primary-cta", "h1-value-prop", "navigation"],
    linkedResources: [
      {
        type: "case-study",
        slug: "stripe-developer-first",
        title: "Stripe — clarity at every step",
        hook: "Why their homepage outsold a sales team.",
      },
      {
        type: "case-study",
        slug: "superhuman-product-market-fit",
        title: "Superhuman — engineered the 'wow' moment",
        hook: "Every screen had one CTA and one only.",
      },
      {
        type: "book",
        slug: "the-mom-test-fitzpatrick",
        title: "The Mom Test — Rob Fitzpatrick",
        hook: "Find out what users actually want before designing.",
      },
    ],
  },
  {
    id: "trust",
    label: "Trust & Compliance",
    oneLiner: "Will users hand over their email?",
    whyItMatters:
      "The moment a user enters their email — or their card — they're betting on you. HTTPS, a real privacy policy, a way to contact a human, a 404 page that isn't the framework's default: these aren't legal box-checks, they're trust signals. Skipping them tells users this is a project, not a product, and they'll behave accordingly — they bounce, they don't subscribe, they screenshot the broken 404 and post it. Trust takes years to build and 10 minutes to lose; the basics here cost a single afternoon.",
    checkIds: ["https-enforced", "privacy-link", "custom-404", "identity-signal"],
    linkedResources: [
      {
        type: "case-study",
        slug: "stripe-developer-first",
        title: "Stripe — trust as architecture",
        hook: "Why developers ship with Stripe before they're paid.",
      },
      {
        type: "case-study",
        slug: "theranos-fraud",
        title: "Theranos — what happens when trust is staged",
        hook: "The collapse was a trust failure, not a tech failure.",
      },
      {
        type: "book",
        slug: "this-is-marketing-godin",
        title: "This Is Marketing — Seth Godin",
        hook: "Permission is the currency the modern web runs on.",
      },
    ],
  },
];

export function dimensionById(id: DimensionId): DimensionConfig {
  const found = DIMENSIONS.find((d) => d.id === id);
  if (!found) throw new Error(`Unknown dimension: ${id}`);
  return found;
}
