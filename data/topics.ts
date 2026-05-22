// Topic hubs — thematic pages that aggregate related case studies.
// Captures category-level search queries (e.g. "Indian fintech case studies")
// that individual case studies can't target on their own.

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
  // 3-4 FAQ entries per topic. Each Q is a real search query for the
  // category. Eligible for FAQPage rich snippets + AEO citations.
  faqs?: TopicFAQ[];
}

export const topics: Topic[] = [
  {
    slug: "indian-fintech",
    title: "Indian Fintech Case Studies",
    eyebrow: "The companies redefining money in India",
    intro:
      "From Razorpay's API-first wedge to Paytm's super-app collapse and recovery, Indian fintech has produced more product strategy lessons in the last decade than almost any other category globally. These are the long-form deep dives on the companies that built it.",
    metaTitle: "Indian Fintech Case Studies — northstar",
    metaDescription:
      "Long-form case studies on India's biggest fintech companies: Razorpay, Cred, Zerodha, PhonePe, Paytm, Slice, Groww. Free, in-depth, no paywall.",
    keywords: [
      "Indian fintech case studies",
      "Razorpay case study",
      "Cred business model",
      "Zerodha bootstrapping",
      "PhonePe UPI",
      "Paytm super app",
      "Slice credit card",
      "Indian fintech 2026",
    ],
    accentColor: "#9B8FFF",
    caseStudyIds: ["cs-51", "cs-52", "cs-53", "cs-55", "cs-57", "cs-61", "cs-62"],
    faqs: [
      {
        question: "What are the most important Indian fintech case studies in 2026?",
        answer: "Cred, Razorpay, Zerodha, PhonePe, Paytm, Slice, and Groww are the seven companies that defined Indian fintech in the 2020s. Cred for design-as-moat, Razorpay for infrastructure, Zerodha for bootstrap profitability, PhonePe for UPI dominance, Paytm for the super-app trap and recovery, Slice for surviving two regulatory shocks, and Groww for serving the underserved.",
      },
      {
        question: "Which Indian fintech is most profitable?",
        answer: "Zerodha is the standout. ₹4,700 crore net profit on ₹8,320 crore revenue in FY24 — a 56% margin, higher than most banks. Achieved without raising a single rupee of VC money. Razorpay is profitable on a smaller margin but with much bigger TPV. Cred is finally monetizing after years of brand-first investment.",
      },
      {
        question: "Why did some Indian fintechs fail while others succeeded?",
        answer: "Three patterns separate winners from losers. Winners (Zerodha, Razorpay, PhonePe) bet on a single core product and went deep. Losers (Paytm's pre-2024 super-app, BYJU'S adjacencies) tried to bundle too many verticals and lost focus. Regulatory readiness also mattered — Slice and Groww survived RBI shocks; others didn't adapt fast enough.",
      },
      {
        question: "What is the future of Indian fintech in 2026?",
        answer: "Three trends defining 2026: reverse-flips back to India for IPO listings (Razorpay, others to follow), UPI-led product expansion across categories beyond payments, and tighter RBI regulation forcing wallet-led companies to evolve into bank-backed infrastructure. The era of US-domiciled Indian fintech IPOs is closing; the Indian capital market era is opening.",
      },
    ],
  },
  {
    slug: "super-app-failures",
    title: "When Super-Apps Break",
    eyebrow: "The bundle-everything thesis, autopsied",
    intro:
      "WeChat made super-apps look easy in China; every other market has discovered they aren't. Indian super-app bets — Paytm, Cult.fit, the broader Tata Neu story — each broke for the same structural reason: adjacent verticals have different unit economics, and bundling them creates more management complexity than customer value. These are the deep dives.",
    metaTitle: "Super-App Failures — Case Studies on the Bundle Trap",
    metaDescription:
      "Why super-apps break outside China: long-form case studies on Paytm, Cult.fit, BYJU'S, and other multi-vertical bets that nearly collapsed.",
    keywords: [
      "super app failures",
      "Paytm super app strategy",
      "Cult.fit wellness app",
      "BYJU'S downfall",
      "super app India",
      "multi-vertical strategy",
    ],
    accentColor: "#FF6B35",
    caseStudyIds: ["cs-55", "cs-59", "cs-54", "cs-39"],
    faqs: [
      {
        question: "Why do super-apps fail outside China?",
        answer: "Three structural reasons. First, adjacent verticals have different unit economics — group fitness margins don't transfer to meal delivery. Second, customer trust doesn't bundle — winning payments doesn't pre-qualify you for lending. Third, management complexity compounds — each vertical needs its own product, marketing, and operations attention, diluting the focus that made any vertical work in the first place.",
      },
      {
        question: "Why did Paytm's super-app strategy fail?",
        answer: "Paytm tried to be India's WeChat — bundling payments, e-commerce (Paytm Mall), gaming, banking, brokerage, insurance, lending. The strategy failed because payments users in India didn't have the social-graph lock-in that made WeChat's bundle work in China. Each vertical had different unit economics; combined, they produced bigger losses, not synergy.",
      },
      {
        question: "Did BYJU'S fail because of acquisitions?",
        answer: "The 12+ acquisitions for $2.5B+ were the symptom, not the cause. The root cause was treating acquisitions as a growth lever instead of building integrated product. None of the acquired companies (WhiteHat Jr, Aakash, Great Learning) integrated into a coherent edtech offering — they remained loosely connected entities with their own unit economics that never compounded.",
      },
      {
        question: "Are super-apps still a viable strategy in India?",
        answer: "Mostly no, with one exception. Pure consumer super-apps (one app for everything) have failed repeatedly in India. The only viable variant is when one vertical produces such high engagement that adjacent verticals get a real distribution edge — like PhonePe layering financial products onto a UPI base. Even then, the core has to be dominant, not just present.",
      },
    ],
  },
  {
    slug: "bootstrapped-companies",
    title: "Bootstrapped to Billion",
    eyebrow: "Companies that refused VC money — and won",
    intro:
      "Most billion-dollar companies are built on hundreds of millions in VC funding. A small set ignored the playbook entirely: Zerodha never took outside capital and made ₹4,700 crore profit in FY24. Atlassian skipped the enterprise sales team and built a $50B+ business on product-led growth. These are the deep dives on the companies that built durable scale without the venture machine.",
    metaTitle: "Bootstrapped Billion-Dollar Companies — Case Studies",
    metaDescription:
      "How Zerodha, Atlassian, and other bootstrapped companies built billion-dollar businesses without raising VC. Long-form case studies, no paywall.",
    keywords: [
      "bootstrapped companies",
      "Zerodha case study",
      "Atlassian no sales team",
      "bootstrapped to billion",
      "no VC funding",
      "product-led growth",
    ],
    accentColor: "#26A69A",
    caseStudyIds: ["cs-53", "cs-50", "cs-49"],
    faqs: [
      {
        question: "Can you really build a billion-dollar company without VC funding?",
        answer: "Yes, but the path is narrower. Zerodha did it in fintech, Atlassian in B2B SaaS, GitHub in developer tools (pre-Microsoft). The pattern: a product so well-fitted to a market that distribution costs are near-zero, plus the discipline to delay every shiny adjacency. The reason it's rare isn't capital — it's the founder personality required to refuse capital when it's offered.",
      },
      {
        question: "Why did Zerodha refuse VC money?",
        answer: "Founders Nithin and Nikhil Kamath believed VC funding would force growth-at-all-costs behavior that erodes customer trust over the long run. Bootstrapping let them prioritize retention over acquisition, refuse to launch products they didn't believe in (no crypto, no IPO push), and keep founder optionality intact. The 2024 SEBI F&O restrictions hit Zerodha less than VC-funded competitors because they had no investor pressure to maintain growth rates.",
      },
      {
        question: "How did Atlassian build a $50B company without sales?",
        answer: "Atlassian replaced outbound sales with product + content + community. Free trials with transparent pricing eliminated evaluation friction. Bottom-up adoption (developers chose Jira/Confluence) bypassed traditional B2B procurement. Eventually they added enterprise sales — but only after the bottom-up motion saturated, which took over a decade. The early bootstrap discipline became the muscle memory that compounded.",
      },
    ],
  },
  {
    slug: "product-design",
    title: "Design as a Moat",
    eyebrow: "When product design is the competitive advantage",
    intro:
      "Most companies treat design as decoration. The companies in this collection treated it as product strategy — building moats that competitors couldn't replicate even with bigger budgets. From Cred's exclusivity-as-design to Figma's browser-first bet, Headspace's approachable meditation interface to Monzo's hot coral card, these are the deep dives where design itself was the wedge.",
    metaTitle: "Product Design Case Studies — When Design Is the Strategy",
    metaDescription:
      "Long-form case studies on companies where design was the competitive moat: Figma, Cred, Headspace, Monzo, Superhuman. Free, in-depth analysis.",
    keywords: [
      "product design case studies",
      "design as moat",
      "Figma case study",
      "Cred design strategy",
      "Headspace design",
      "Monzo branding",
    ],
    accentColor: "#50C878",
    caseStudyIds: ["cs-6", "cs-51", "cs-33", "cs-34", "cs-35", "cs-58"],
    faqs: [
      {
        question: "Can product design be a real competitive moat?",
        answer: "Yes, in two specific ways. First, when design solves a problem the category has accepted as unsolvable — Figma's real-time multiplayer in design tools, Linear's keyboard-driven UI for issue trackers. Second, when design becomes brand asset — Cred's exclusivity-as-design, Monzo's hot coral card. In both cases, design isn't decoration; it's the strategic difference competitors can't replicate without rebuilding from scratch.",
      },
      {
        question: "Why is design Figma's moat against Adobe?",
        answer: "Adobe built XD as a Figma clone with more features. Figma still won because the moat wasn't features — it was the browser-first multiplayer architecture and the ecosystem of plugins + community files. Replacing Figma at a company isn't a tool switch; it's a multi-month migration of files, workflows, and team habits. The moat is switching cost, not feature count.",
      },
      {
        question: "How does Cred use design as a moat in fintech?",
        answer: "Cred treats design as the entire product layer that competitors can't replicate without 5 years of brand investment. Rahul Dravid in traffic ads, ex-Apple designers, motion-first interactions, exclusive premium framing. The 750+ credit score gate and the rejection messages are design choices that became viral marketing. The moat is brand-as-design, not UI-as-design.",
      },
    ],
  },
];

export const getTopicBySlug = (slug: string): Topic | undefined =>
  topics.find((t) => t.slug === slug);
