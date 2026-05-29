---
slug: linear-pricing-2019
caseStudySlug: linear-brand-from-day-one
type: historical
category: pricing
publishedAt: "2026-06-29T20:30:00+05:30"
year: 2019
estimatedMinutes: 6
principle: |
  In categories where the dominant competitor is enterprise-priced
  and slow, free-forever for individuals is a market-entry weapon.
  But free-forever only works if you can defend the unit economics
  at scale — which means it has to be tightly bounded so power users
  graduate to paid before they cost too much.
intro: |
  You are the CEO of a new project-management tool for software
  teams. You've spent eight months building a faster, more opinionated
  alternative to the dominant incumbent (which charges $7-15/user/
  month, has a notoriously slow UI, and locks features behind enterprise
  tiers). Your product is meaningfully better — faster, keyboard-
  shortcut-driven, designed for engineers.

  Launch is in four weeks. You've assembled a beta of ~200 software
  teams; they love the product. Pricing is the last big decision.
  Your team has three internal proposals on the whiteboard.
nodes:
  start:
    dimension: business
    prompt: |
      Pick the pricing model for public launch.
    options:
      - text: "Match the incumbent: $8/user/month, with enterprise tier at $14. Compete on product quality."
        points: 2
        pattern: incumbent-match
        rationale: |
          The defensible approach. Same pricing as competitors lets
          you compete on product, not price. Problem: you're a new
          entrant trying to displace a giant. "Same price, better
          product" requires every prospect to actively switch — a
          motion that takes 6-9 months in enterprise sales cycles.
          You burn the velocity advantage of being new.
        consequence: |
          Initial signups are slow. Each deal requires a switch
          conversation. By month 12 you have 200 paying teams; the
          incumbent has 100,000. The product is better but the
          motion is too slow to compound.
        leadsTo: end-A
      - text: "Free for small teams (under 10 users). $8/user/month for larger teams."
        points: 5
        pattern: free-for-the-trojan-horse
        rationale: |
          The right wedge. Small teams (under 10 users) self-serve
          and bring you with them when they grow or move companies.
          You give up direct revenue on the bottom of the funnel
          but compound on viral distribution. The 10-user threshold
          is the right gate — it's where the product economics
          start to require a real account.
        consequence: |
          Signups hit 5,000 teams in the first 90 days. ~12% of
          them cross the 10-user threshold organically within a
          year. ARR compounds at 2x the rate of the incumbent-
          match scenario.
        leadsTo: B-free-followup
      - text: "Free forever, no limits. Monetize later via enterprise features (SSO, audit log, custom SLAs)."
        points: 3
        pattern: monetize-much-later
        rationale: |
          The growth-first bet. Audacious — works for some
          categories — but the runway implications are real. Free
          forever means no revenue for 12-18 months while you wait
          for enterprise demand to materialize. If the next
          fundraise sours in that window, you're in trouble.
        consequence: |
          Adoption hits 20,000 teams in 6 months. Revenue stays
          at zero. The Series B closes but at a lower valuation
          than a revenue-bearing version of the same product would
          have commanded.
        leadsTo: end-C
      - text: "Aggressive undercut: $4/user/month flat. Half the incumbent's price."
        points: 1
        pattern: undercut-with-no-moat
        rationale: |
          Doomed at scale. The incumbent has 100x your capital and
          can match any price you set; competing on price means
          competing on capital, which you lose. Worse, you're
          training the market to expect $4/user pricing in a
          category where the unit economics need at least $8 to
          fund product investment.
        consequence: |
          Volume comes in but margins are thin. The incumbent
          matches your price for new customers. You can't fund
          enterprise features at $4/user. By Q3 you're raising
          prices to $8 and breaking trust with early customers.
        leadsTo: end-D
  B-free-followup:
    dimension: product
    prompt: |
      Twelve months post-launch. Free tier has 30K teams. Paid tier
      has 600 teams. A common complaint: free teams hit the 10-user
      limit and instead of upgrading, they create multiple
      workspaces ("Team A," "Team A overflow") to stay free. You
      need to decide what to do about it.
    options:
      - text: "Enforce a strict 'one workspace per organization' rule. Block obvious multi-workspace abuse."
        points: 2
        pattern: enforce-the-gate-hard
        rationale: |
          Direct but adversarial. Users who were happily using your
          product now feel like they're being policed. Some will
          upgrade; many will resent the move and switch. Especially
          dangerous because the product hasn't yet earned the
          "we're indispensable" trust that lets you tighten gates.
        consequence: |
          ~20% of the bypassing teams upgrade. ~30% switch to a
          competitor that's more permissive. Brand trust takes
          a hit on Twitter.
        leadsTo: end-B-bad
      - text: "Make the upgrade feel like an upgrade — add valuable team features (cross-workspace search, admin tooling) only available paid."
        points: 5
        pattern: positive-upgrade-pull
        rationale: |
          Pull, not push. You're not blocking the workaround;
          you're making the upgrade path more attractive than the
          workaround. Cross-workspace search, central admin,
          analytics — features that the workaround can't replicate.
          Users upgrade because they want to, not because they
          have to.
        consequence: |
          Upgrade rate among multi-workspace teams jumps from 5%
          to 28%. Brand stays clean. Conversion engine compounds.
        leadsTo: end-B-great
      - text: "Tighten free tier limits — drop from 10 users to 5. Force the upgrade sooner."
        points: 1
        pattern: shrink-the-free-tier
        rationale: |
          The retroactive-narrowing trap. You're changing the deal
          your free users signed up under, which is exactly how
          you destroy the free-tier trust that fuels your
          distribution. Even users who would've upgraded eventually
          will switch out of principle.
        consequence: |
          Backlash on social media. Multiple competitors pick up
          your churned users with "we don't bait-and-switch"
          positioning. Net loss across the funnel.
        leadsTo: end-B-terrible
  end-A:
    isOutcome: true
    summary: |
      Matching the incumbent's price made the product invisible.
      You eventually flipped to a free-tier model in year 2, but
      the launch momentum had passed.
  end-B-great:
    isOutcome: true
    summary: |
      The positive-upgrade-pull model worked. Paid conversion
      compounded year-over-year, and the brand stayed clean. By
      year 5 you were the default project-management tool for
      software teams and a multi-hundred-million ARR business.
  end-B-bad:
    isOutcome: true
    summary: |
      The enforcement worked technically but cost brand trust.
      Growth slowed. The product still works but the love is
      gone.
  end-B-terrible:
    isOutcome: true
    summary: |
      The retroactive limit change made you the case study other
      founders quote when explaining "how to destroy your community."
      Recovery took 18 months and a public apology.
  end-C:
    isOutcome: true
    summary: |
      Free-forever drove huge adoption but no revenue. The
      enterprise tier eventually monetized a slice, but the
      fundraise dynamics meant earlier dilution and a less
      favorable cap table.
  end-D:
    isOutcome: true
    summary: |
      The undercut became a race to the bottom you couldn't win.
      The incumbent matched and outlasted you. You raised prices
      back to $8/user, broke trust, and ended up with a worse
      brand than the match scenario.
---

## What actually happened

This drill is loosely based on **Linear's pricing model from 2019
onward**. Linear shipped with **free for teams under 10 users,
$8/user/month above** — and made the paid tier compelling not by
restricting the free tier over time but by adding genuinely
valuable team features (advanced search, integrations, admin
controls).

The free tier became Linear's primary distribution channel:
engineers used Linear at small startups, took it with them when
they moved to bigger companies, and brought their teams in. By
2024 Linear was the dominant project-management tool for
high-growth software companies and a category-defining brand.

The principle that compounded: a free tier is a marketing channel
disguised as a product feature. Treat it accordingly.

**Related reading:** [Linear's brand from day one](/case-study/linear-brand-from-day-one)
