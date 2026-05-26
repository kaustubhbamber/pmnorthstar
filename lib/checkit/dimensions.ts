// Static configuration for the 5 CheckIt dimensions.
//
// `whyItMatters` is the predefined essay shown on the result card.
// Per the spec, the audit doesn't generate this. It's editorial content
// that explains why the dimension makes or breaks a product.
//
// `linkedResources` are northstar case studies / books that prove the
// point with real examples. Slugs match files in /content/{case-studies,books}.
// If you rename a content file, update the slug here too.

import type { DimensionId, LinkedResource } from "./types";

export interface DimensionCheck {
  id: string; // must match an ID returned by lib/checkit/checks.ts
  points: number; // weight by importance; sum across all dimensions = 100
}

export interface DimensionConfig {
  id: DimensionId;
  label: string;
  oneLiner: string; // shown next to the score number on the card header
  whyItMatters: string;
  // 5 checks in display order, each with its weight.
  checks: [DimensionCheck, DimensionCheck, DimensionCheck, DimensionCheck, DimensionCheck];
  linkedResources: LinkedResource[];
}

export const DIMENSIONS: DimensionConfig[] = [
  {
    id: "brand",
    label: "Brand & Identity",
    oneLiner: "Does it look credible in the first 3 seconds?",
    whyItMatters:
      "The first three seconds decide if a user trusts you with their email, their card, their time. A *.vercel.app URL and a default favicon tell users 'this is a side project,' even when the product underneath is brilliant. Brand isn't logos and color palettes. It's the dozen tiny signals (a custom domain, a real title tag, an OG image that doesn't render as a blank box in Slack) that say 'a real team built this.' Skip these and even your best users will treat you as disposable.",
    // Brand totals 15. Custom domain is the loudest signal; apple-touch-icon is a small polish.
    checks: [
      { id: "custom-domain", points: 5 },
      { id: "real-favicon", points: 3 },
      { id: "og-completeness", points: 3 },
      { id: "real-title", points: 3 },
      { id: "apple-touch-icon", points: 1 },
    ],
    linkedResources: [
      {
        type: "case-study",
        slug: "razorpay-pivot-fintech",
        title: "Razorpay's brand polish at fintech scale",
        hook: "How tiny trust signals decided who they could sell to.",
      },
      {
        type: "case-study",
        slug: "notion-all-in-one-workspace",
        title: "Notion: identity through every surface",
        hook: "Consistency turned a doc tool into a movement.",
      },
      {
        type: "book",
        slug: "obviously-awesome-dunford",
        title: "Obviously Awesome by April Dunford",
        hook: "Positioning is the layer above your features.",
      },
    ],
  },
  {
    id: "performance",
    label: "Performance",
    oneLiner: "Does it load before users give up?",
    whyItMatters:
      "Every 100ms of load time costs roughly 1% of conversions. On mobile 4G, where 60%+ of your traffic lives, a 4-second page loses more than half its visitors before they ever see your hero image. Performance isn't engineering vanity. It's the most direct lever on revenue you have. We measure the causes of slow load: server response time (TTFB), how much markup ships before render (HTML payload), how aggressively JS delays paint (render-blocking scripts), whether images and fonts cause layout shift, and whether images use modern formats. Fix the causes and the user-perceived metrics improve predictably.",
    // Performance totals 18. TTFB is the closest proxy to LCP; modern images are easy to ignore.
    checks: [
      { id: "ttfb", points: 5 },
      { id: "layout-shift-prevention", points: 4 },
      { id: "html-payload", points: 3 },
      { id: "render-blocking-scripts", points: 4 },
      { id: "modern-images", points: 2 },
    ],
    linkedResources: [
      {
        type: "case-study",
        slug: "pinterest-waitlist",
        title: "Pinterest: performance as growth lever",
        hook: "40% load-time cut → 15% conversion lift in a week.",
      },
      {
        type: "case-study",
        slug: "vercel-developer-first",
        title: "Vercel: speed as a product feature",
        hook: "Built an entire company on 'your site should be fast.'",
      },
      {
        type: "book",
        slug: "hacking-growth-ellis",
        title: "Hacking Growth by Sean Ellis",
        hook: "Why technical fundamentals out-earn marketing tricks.",
      },
    ],
  },
  {
    id: "seo",
    label: "SEO & Discoverability",
    oneLiner: "Can Google actually find you?",
    whyItMatters:
      "If Google can't crawl you, you don't exist. Most vibe-coded sites have zero of the four things that matter (a sitemap, a meta description, canonical tags, a proper H1), then wonder why traffic is flat after launch. SEO isn't a marketing afterthought. It's plumbing you wire on day one, takes an hour to get right, and compounds for years. The sites that get organic traffic aren't necessarily better than yours. They're the ones that didn't skip the boring 1990s-era HTML basics.",
    // SEO totals 15. Meta description and sitemap have the biggest crawl/SERP impact.
    checks: [
      { id: "meta-description", points: 4 },
      { id: "robots-txt", points: 2 },
      { id: "sitemap-xml", points: 4 },
      { id: "structured-data", points: 3 },
      { id: "alt-text-coverage", points: 2 },
    ],
    linkedResources: [
      {
        type: "case-study",
        slug: "hubspot-inbound-marketing",
        title: "HubSpot: SEO as the entire growth engine",
        hook: "Built a $30B company on free content + crawlable pages.",
      },
      {
        type: "case-study",
        slug: "notion-all-in-one-workspace",
        title: "Notion's template SEO moat",
        hook: "Why their /templates pages still convert in 2026.",
      },
      {
        type: "book",
        slug: "traction-weinberg",
        title: "Traction by Gabriel Weinberg",
        hook: "SEO is one of 19 channels. Pick on purpose.",
      },
    ],
  },
  {
    id: "ux",
    label: "UX & Conversion",
    oneLiner: "Do users know what to do next?",
    whyItMatters:
      "A beautiful site with no clear next action is a museum, not a product. Users need to know within 5 seconds what this is, who it's for, what to do. Mobile responsiveness isn't optional. Phones are where the audit happens before anyone touches a laptop, and a site that requires sideways scrolling on a 375px screen is dead before it's seen. Most failed launches don't fail because the product was bad. They fail because the hero didn't name the value and the button didn't say what would happen when clicked.",
    // UX totals 20 (highest). Viewport + primary CTA are conversion-blockers on mobile.
    checks: [
      { id: "viewport-meta", points: 5 },
      { id: "primary-cta", points: 5 },
      { id: "h1-value-prop", points: 4 },
      { id: "placeholder-text", points: 3 },
      { id: "form-labels", points: 3 },
    ],
    linkedResources: [
      {
        type: "case-study",
        slug: "stripe-developer-first",
        title: "Stripe: clarity at every step",
        hook: "Why their homepage outsold a sales team.",
      },
      {
        type: "case-study",
        slug: "superhuman-product-market-fit",
        title: "Superhuman engineered the 'wow' moment",
        hook: "Every screen had one CTA and one only.",
      },
      {
        type: "book",
        slug: "the-mom-test-fitzpatrick",
        title: "The Mom Test by Rob Fitzpatrick",
        hook: "Find out what users actually want before designing.",
      },
    ],
  },
  {
    id: "polish",
    label: "Polish & Foundations",
    oneLiner: "Are the small details handled?",
    whyItMatters:
      "The five-minute fixes a vibe-coded site never gets around to. Each one is invisible when it's done right and embarrassing when it's not. theme-color tints the mobile browser chrome to your brand. <html lang=\"...\"> tells screen readers what language to speak. HTTP compression saves 60-80% of bandwidth at zero engineering cost. Canonical URLs protect your SEO ranking from duplicate-content splits. HSTS preload locks browsers into HTTPS-only for your origin forever. None of these are flashy. All of them signal whether a real team built this.",
    // Polish totals 8. Compression has real perf impact; the rest are quiet polish wins.
    checks: [
      { id: "theme-color", points: 1 },
      { id: "lang-attribute", points: 2 },
      { id: "compression", points: 3 },
      { id: "canonical-url", points: 1 },
      { id: "hsts-preload", points: 1 },
    ],
    linkedResources: [
      {
        type: "case-study",
        slug: "stripe-developer-first",
        title: "Stripe: details as marketing",
        hook: "Why every micro-decision in their dev experience shows up in their valuation.",
      },
      {
        type: "case-study",
        slug: "vercel-developer-first",
        title: "Vercel: speed as identity",
        hook: "Built a billion-dollar company on caring about details no one else did.",
      },
      {
        type: "book",
        slug: "the-lean-product-playbook-olsen",
        title: "The Lean Product Playbook by Dan Olsen",
        hook: "Why MVP without polish ships features but not products.",
      },
    ],
  },
  {
    id: "standards",
    label: "Modern Web Standards",
    oneLiner: "Does this site speak modern web?",
    whyItMatters:
      "Standards-compliant sites get free wins. A web app manifest unlocks Add to Home Screen and offline support. A proper Twitter card means link previews on X render the way you designed them, not the way X guesses. Title length in the 30-60 char sweet spot means Google doesn't truncate or rewrite it. ARIA landmarks let screen reader users navigate by section. Heading hierarchy is the spine of your content's accessibility. Most vibe-coded sites skip these because they're invisible to the developer who shipped them. Standards make sites work for users who aren't the developer.",
    // Standards totals 7 (lowest). Twitter card and ARIA landmarks have the most visible payoff.
    checks: [
      { id: "manifest-json", points: 1 },
      { id: "twitter-card", points: 2 },
      { id: "title-length", points: 1 },
      { id: "aria-landmarks", points: 2 },
      { id: "heading-hierarchy", points: 1 },
    ],
    linkedResources: [
      {
        type: "case-study",
        slug: "notion-all-in-one-workspace",
        title: "Notion: semantic structure as moat",
        hook: "Why their content compounds in search rankings year after year.",
      },
      {
        type: "case-study",
        slug: "figma-browser-design",
        title: "Figma: standards-first design",
        hook: "Browser-native design tools that work because the standards were respected.",
      },
      {
        type: "book",
        slug: "the-mom-test-fitzpatrick",
        title: "The Mom Test by Rob Fitzpatrick",
        hook: "Build for the user you actually have, not the user that looks like you.",
      },
    ],
  },
  {
    id: "trust",
    label: "Trust & Compliance",
    oneLiner: "Will users hand over their email?",
    whyItMatters:
      "The moment a user enters their email or their card, they're betting on you. HTTPS, a real privacy policy, a way to contact a human, a 404 page that isn't the framework's default. These aren't legal box-checks. They're trust signals. Skipping them tells users this is a project, not a product, and they'll behave accordingly. They bounce. They don't subscribe. They screenshot the broken 404 and post it. Trust takes years to build and 10 minutes to lose. The basics here cost a single afternoon.",
    // Trust totals 17. HTTPS is non-negotiable; CSP and custom 404 are quieter signals.
    checks: [
      { id: "secure-transport", points: 5 },
      { id: "privacy-link", points: 4 },
      { id: "custom-404", points: 2 },
      { id: "identity-signal", points: 4 },
      { id: "csp-header", points: 2 },
    ],
    linkedResources: [
      {
        type: "case-study",
        slug: "stripe-developer-first",
        title: "Stripe: trust as architecture",
        hook: "Why developers ship with Stripe before they're paid.",
      },
      {
        type: "case-study",
        slug: "theranos-fraud",
        title: "Theranos: what happens when trust is staged",
        hook: "The collapse was a trust failure, not a tech failure.",
      },
      {
        type: "book",
        slug: "this-is-marketing-godin",
        title: "This Is Marketing by Seth Godin",
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
