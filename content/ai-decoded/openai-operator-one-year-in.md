---
slug: openai-operator-one-year-in
title: "OpenAI Operator, One Year In: What Worked, What Didn't, What Should Ship Next"
metaTitle: "OpenAI Operator Review: 18 Months of Real-World Use"
excerpt: "Operator launched in early 2025 to mixed reviews. 18 months later, it's the most-used agentic browser by 4x. Here's what's actually working, what's still broken, and what OpenAI should ship next to keep the lead."
primaryKeyword: "openai operator review"
longTailKeywords:
  - "openai operator one year"
  - "is operator worth it"
  - "operator agentic browser"
  - "openai operator vs comet"
  - "best openai operator use cases"
  - "operator limitations"
  - "what operator can do"
  - "openai operator review 2026"
category: "Agents"
audience: ["PM", "Founder", "Operator"]
publishedAt: "2026-06-03"
updatedAt: "2026-06-03"
heroImage:
  src: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1600&q=80&auto=format&fit=crop"
  alt: "Computer screen with browser interface and code"
  credit: "Photo: Steve Johnson / Unsplash"
tags: ["openai", "operator", "agentic browser", "ai agents"]
readTime: 7
faqs:
  - question: "What is OpenAI Operator?"
    answer: "Operator is OpenAI's browser-based agent that completes multi-step web tasks on behalf of users. Launched in early 2025, it became OpenAI's primary agentic surface by 2026. Operator uses vision-grounded reasoning — taking screenshots and reasoning about what's on screen — rather than DOM-scraping, which makes it more robust across sites but slower per step than purely text-based agents."
  - question: "What is Operator best at?"
    answer: "Operator's strongest use cases in 2026: restaurant booking, food ordering, calendar coordination, comparison shopping, simple form filling. On these task types, completion rates are 60-70%. Operator also has unexpected strength in B2B research workflows: sales teams use it to gather competitor intel, procurement teams use it to fill RFPs."
  - question: "What is Operator bad at?"
    answer: "Operator struggles with: complex decision-making (anything requiring trade-off analysis), sites with aggressive anti-bot protection, multi-step payment flows requiring 3D Secure or OTP verification, sites with non-standard UIs or heavy dark patterns. The structural limitation: vision-grounded reasoning is slower than humans for tasks that require many quick decisions."
  - question: "How much does Operator cost?"
    answer: "Operator is included in ChatGPT Plus ($20/month) with a usage quota. ChatGPT Pro ($200/month) includes higher quota and faster execution. Enterprise customers access Operator through OpenAI's enterprise plans with custom pricing. The cost-per-task is reasonable for the use cases where it works; the main cost is the time tax of human supervision when tasks fail or need correction."
  - question: "Should I use Operator for my workflow?"
    answer: "Try it if your task involves multi-step web navigation that you do repeatedly — booking, ordering, research, form filling. The 30-minute test: pick a task you do weekly, attempt it through Operator, see if it completes acceptably. If yes, the time savings compound. If no, the task is probably outside Operator's current capability envelope and you're better off doing it manually for now."
---

Operator launched in early 2025 to mixed reviews. The early demos were impressive but the production experience was rough — slow, failure-prone, requiring human supervision for almost every task. The narrative for the first six months was "interesting but not ready." Eighteen months later, that narrative has reversed. Operator is the most-used agentic browser by a 4x margin and has become OpenAI's primary agentic surface for consumer-facing use cases.

The transition from "demo" to "default" happened gradually through a series of model updates, infrastructure improvements, and product polish that didn't make headlines individually but compounded into a meaningfully different product. For PMs, founders, and operators thinking about agentic workflows in their own products, Operator's one-year arc is instructive. It shows what an agentic product looks like when it crosses the threshold from interesting to actually useful, and where the structural limits still sit.

## What's working

Three categories of use cases where Operator now works well enough to actually save time.

**Restaurant and travel booking.** Operator can navigate OpenTable, Resy, hotel booking sites, and airline sites with 60-70% completion rates. The remaining 30-40% failures are usually around payment flows or specific availability constraints. For users who book frequently (sales people on travel, anyone organizing dinners), the time savings are real. The pattern that works: describe the constraint clearly ("Italian restaurant for 4 on Friday at 7pm within 2 miles of zip code 94110"), let Operator do the navigation, intervene only at the payment step.

**Comparison shopping.** Operator excels at "find me X with constraints" tasks. Comparing prices across e-commerce sites, evaluating laptop specs across brands, finding the best deal on a flight route. The task is well-suited to Operator's strengths: clear constraint definition, multi-site navigation, structured output (here are 5 options that match). Conversion to actual purchase often happens manually after Operator surfaces the options, but the research time savings are significant.

**B2B research and prospecting.** This was an unexpected hit. Sales teams use Operator to gather competitive intel — find the competitor's pricing page, find their integration list, find their customer logos. Procurement teams use Operator to fill RFP responses — go to vendor sites, gather product details, format them into the RFP template. The use case is less glamorous than consumer transactions but the productivity gains are bigger because the manual version is so painful.

**Calendar and scheduling coordination.** Setting up calls across multiple time zones, scheduling against multiple calendars, sending meeting invites with the right context. Operator handles this category reasonably well by treating calendar interfaces as just another web surface to navigate. Productivity gain is moderate but the friction reduction is meaningful — most users dislike the manual scheduling work enough that even a 50% time saving feels valuable.

## What's still broken

Three categories where Operator regularly fails.

**Sites with aggressive anti-bot protection.** Cloudflare's bot management, Akamai's bot detection, sophisticated captcha implementations — these block Operator regularly. The user often has to step in to solve the captcha manually before Operator can continue. For sites that block bots aggressively, Operator's value drops to near zero.

**Multi-step payment flows.** 3D Secure verification, OTP-based confirmations, bank-specific payment friction — these are deal-breakers for Operator. Indian payment flows in particular are difficult because UPI verification, OTPs, and 3D Secure are common across most merchant sites. Operator can navigate to the payment page but typically can't complete the actual payment, which limits its value for transactional use cases in markets with friction-heavy payment infrastructure.

**Complex decision-making.** Operator is reasonably good at following clear instructions. It's bad at making judgment calls. "Find me the best restaurant" requires Operator to define "best" without specific criteria, which it does poorly. The fix is to define the criteria yourself: "Find me an Italian restaurant within 2 miles, with 4+ stars, and reservations available Friday at 7pm." When you provide the judgment, Operator does the navigation well. When you ask Operator to provide the judgment, results vary.

## The structural limits

Three deeper constraints that haven't been solved and probably won't be in the next 12 months.

**Speed.** Vision-grounded reasoning is structurally slower than humans on tasks involving many quick interactions. A human can navigate a site in seconds; Operator typically takes 30-60 seconds for the same task. For asynchronous tasks (Operator runs in the background, you check the result later), this doesn't matter. For synchronous tasks (you're waiting for Operator to complete something while you watch), the speed gap is irritating.

**Trust at the authentication boundary.** Operator can navigate to a login page but rarely logs in successfully — and users are uncomfortable letting it. The trust problem is real on both sides: Operator's security model isn't designed for it to hold credentials, and users aren't comfortable handing those credentials over even if it were. The fix requires identity standards (passkeys, agent-specific OAuth) that are emerging but not yet widely deployed.

**Site-specific brittleness.** Operator works well on common sites that have been included in training. It works poorly on niche sites that haven't. The long tail of "sites Operator hasn't seen" is large, and the failure mode is unpredictable — Operator will sometimes get partway through a task and then get confused by an unfamiliar UI element. The mitigation is human-in-the-loop checkpoints, which limits the autonomy of the agent.

## What OpenAI should ship next

If I were prioritizing the Operator roadmap, three things would top the list.

**Better authentication integration.** Partner with identity providers (Auth0, Okta, password managers) to enable secure credential handoff. Implement an agent-specific OAuth scope model that lets users grant Operator access to specific accounts with specific permissions, time-bounded, easily revocable. This single change would unlock a substantially larger set of use cases.

**Memory across sessions.** Operator currently treats each task as independent. If I book restaurants weekly, Operator should learn my preferences, my usual party size, my dietary constraints. The current pattern requires re-specifying everything each time. Persistent memory would compound the time savings as users build a relationship with the agent.

**Better failure recovery.** When Operator hits an unexpected state, the current behavior is usually to ask the user what to do. A better pattern would be to try multiple recovery strategies before escalating — back up a page, refresh, try an alternative path. Most human users routinely do this kind of recovery; Operator should too.

## What this means for builders

Three takeaways.

**Agent-driven traffic is real and measurable.** Sites in categories Operator does well (restaurants, travel, e-commerce comparison) are starting to see meaningful agent-driven traffic. Most analytics tools now flag traffic from known agent user-agents. Pulling that data is the first step in deciding whether your product needs agent-friendly redesign.

**The Operator playbook is repeatable.** Other agentic browsers (Comet, Dia, future agents from Apple or Google) will follow similar patterns. Build your product to be agent-friendly once and you're prepared for the whole category, not just OpenAI's specific implementation. The audit criteria — clean DOM, semantic markup, no dark patterns, API parity for UI actions — are the same regardless of which agent is browsing.

**Trust and payment friction are where competitive advantage will land.** The merchants and sites that solve the authentication and payment friction for agentic visitors will capture the agent-driven transaction share. The merchants that don't will lose that share to competitors who do. This is the next 18-24 months of competitive dynamics in conversion-heavy categories.

Operator at 18 months is a genuine product, not a demo. It's not magic, it's not always reliable, and it doesn't replace human attention for any task that matters. But for the use cases it handles well, it's a measurable productivity gain. The trajectory from launch to now is the most useful evidence we have for what agentic products look like as they mature: a slow grind of model improvements, infrastructure work, and product polish that compounds into something useful, even when no single update is impressive on its own.
