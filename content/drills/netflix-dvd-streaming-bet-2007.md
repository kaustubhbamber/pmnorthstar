---
slug: netflix-dvd-streaming-bet-2007
caseStudySlug: netflix-dvd-to-streaming
type: historical
category: strategic
publishedAt: "2026-08-17T20:30:00+05:30"
year: 2007
estimatedMinutes: 7
principle: |
  The hardest strategic move is cannibalizing your most profitable
  business before someone else does. Companies that protect the profit
  pool always lose to companies that race themselves into the next one.
  The Innovator's Dilemma isn't a theory — it's a calendar problem.
intro: |
  You are the CEO of a publicly-traded mail-order DVD rental company.
  ~$1B in annual revenue, profitable, market leader. Your business
  is at peak: 7M subscribers, ~95% gross margin on each DVD rented
  through the postal system. Wall Street loves you.

  Two facts on your desk this quarter:
  1. Broadband adoption just crossed a threshold — ~50% of US homes
  have connections fast enough to stream low-quality video on demand.
  2. Internal R&D has built a working streaming prototype. It works
  technically but the catalog is tiny (~1,000 titles vs. your 100K+
  DVD catalog) and the content licensing terms for streaming are
  brutal — studios will charge 3-5x more per stream than per DVD
  rental.

  Your CFO presents three scenarios for the next board meeting.
nodes:
  start:
    dimension: founder
    prompt: |
      The DVD business is at peak profitability. Streaming is coming
      but the unit economics are terrible today. Pick.
    options:
      - text: "Stay focused on DVDs. Streaming will get viable in 3-4 years. Maximize the profit window."
        points: 1
        pattern: defend-the-profit-pool
        rationale: |
          The instinct that kills incumbents. You'd be choosing to
          maximize quarterly earnings while a structural shift moves
          under you. The hidden math: by the time streaming economics
          improve, multiple new entrants will have captured streaming
          subscribers. You'd be defending a shrinking market with no
          presence in the growing one. Wall Street rewards this
          quarterly; history punishes it permanently.
        consequence: |
          The next 3 years of DVD profits are excellent. By year 4, a
          venture-backed streaming-native competitor has 20M subscribers
          and is signing exclusive content deals. Your DVD business
          starts to shrink. By year 7, you're acquired at a fraction of
          peak valuation.
        leadsTo: end-A
      - text: "Launch streaming as a free add-on to the DVD subscription. Same price, both included."
        points: 5
        pattern: cannibalize-yourself-first
        rationale: |
          The contrarian move. You're effectively saying: "the DVD
          business will be cannibalized — better that we do it on our
          own terms than someone else's." Bundling streaming free
          eliminates customer-decision friction (no upsell question),
          gives you instant streaming subscribers from your existing
          base, and starts the data-flywheel (watch behavior, catalog
          preferences) you'll need to compete with future streaming-
          natives. Risks: short-term margin pressure, Wall Street
          confusion. Payoff: you own both businesses while they
          coexist, with proprietary intelligence about the transition.
        consequence: |
          You announce the free streaming add-on. DVD subs barely
          notice; ~30% try streaming in the first month. Wall Street
          drops the stock 15% on margin concerns. Six months later the
          stock recovers as streaming engagement metrics dominate
          earnings calls.
        leadsTo: B-bundle-followup
      - text: "Split the company. Two CEOs, two brands, two stock tickers. Let each compete on its own terms."
        points: 2
        pattern: spin-off-too-early
        rationale: |
          Theoretically clean — eliminates internal conflict between the
          two business models. Practically expensive and premature.
          You'd be incurring spinoff costs (separate ops, separate
          marketing, separate finance) at exactly the moment when the
          two businesses still benefit from being a single brand. The
          time for the split is when streaming is fully scaled, not
          when it's a sub-1% revenue line.
        consequence: |
          The split happens. Customers are confused about which brand
          is which. The streaming entity raises capital separately but
          at lower terms because it's smaller. Eight years later you
          re-merge after a costly detour.
        leadsTo: end-C
      - text: "Charge separately for streaming. New tier, $2/month add-on."
        points: 2
        pattern: monetize-the-transition
        rationale: |
          The "extract revenue from both" instinct. Wall Street loves
          this because it shows growing ARPU. The problem: you create
          customer-decision friction at the moment when you most need
          streaming adoption velocity. Customers who don't opt in
          remain DVD-only and miss the streaming habit that would
          have kept them sticky.
        consequence: |
          Streaming attach rate hits ~12% in year one. Stock looks fine
          quarterly. By year 3, streaming-native competitors have free-
          tier offerings that destroy your $2 add-on. You eventually
          bundle it free in year 4, two years late.
        leadsTo: end-D
  B-bundle-followup:
    dimension: business
    prompt: |
      Three years into the streaming bundle. ~40M total subscribers,
      ~70% now stream regularly. The DVD business is shrinking but
      still profitable. Content costs are exploding — studios are
      charging $100M+ per major series for streaming rights. You need
      to decide content strategy.
    options:
      - text: "Pour profits into original content. Become a studio. Reduce dependence on licensed content."
        points: 5
        pattern: vertical-integration-as-survival
        rationale: |
          The bet that defines the next decade. Licensed content is a
          rising cost with no end; original content amortizes across
          your entire subscriber base and creates a moat licensed
          content never can. The first big original series will likely
          flop. The third one might define your brand. The investment
          is multi-year and existential.
        consequence: |
          Year 1 of originals: ~$2B spent, mixed results. Year 3:
          a flagship series defines the category and quadruples
          subscriber growth. Year 5: you're spending $15B/year on
          original content and have 200M+ subscribers. The DVD
          business is wound down without anyone caring.
        leadsTo: end-B-great
      - text: "Stay licensing-only. Keep capital efficient. Compete on user experience and recommendations."
        points: 2
        pattern: feature-not-content
        rationale: |
          Capital-efficient but doomed. Licensed content costs will
          keep rising, and the studios you license from will eventually
          become competitors (Disney+, HBO Max, Paramount). Without
          original content, you're a UX layer over a commodity catalog,
          and the catalog can be ripped away.
        consequence: |
          By year 5, three major studios have launched competing
          streamers and pulled their catalogs. Your subscriber growth
          flattens. The stock multiple compresses.
        leadsTo: end-B-mediocre
  end-A:
    isOutcome: true
    summary: |
      Protecting the DVD profit pool was the textbook Innovator's
      Dilemma failure. The streaming-native competitor captured the
      category. The DVD business shrank to irrelevance by the early
      2010s. You were eventually acquired at a fraction of peak.
  end-B-great:
    isOutcome: true
    summary: |
      The free-bundle plus original-content strategy made you the
      defining company of the streaming era. ~250M subscribers
      globally within a decade. Market cap crossed $250B at peak. The
      DVD business was a footnote by year 10.
  end-B-mediocre:
    isOutcome: true
    summary: |
      The bundle saved the company short-term but the licensing-only
      strategy capped your ceiling. Competitors with original content
      compounded faster. You stayed a major player but not the
      defining one.
  end-C:
    isOutcome: true
    summary: |
      The premature spinoff was operationally costly. Both entities
      underperformed against integrated competitors. Eight years
      later, you re-merged, but the moment was past.
  end-D:
    isOutcome: true
    summary: |
      The $2 streaming add-on captured some subscribers but created
      enough friction that streaming-native free-trial competitors
      captured the bigger growth wave. You eventually bundled
      streaming free but too late to lead the category.
---

## What actually happened

This drill is based on **Netflix's 2007-2010 streaming pivot**. Reed
Hastings and the Netflix leadership made the call in 2007 to bundle
streaming free with the DVD subscription — a deliberately cannibalizing
move when DVDs were ~95% gross margin and streaming was barely viable
unit-economically.

Wall Street initially punished the stock; the Netflix board reportedly
debated the move for months. The 2011 spinoff attempt (creating Qwikster
for DVDs) is generally considered the worst version of the strategy —
which Hastings later publicly apologized for and reversed within
weeks. The free-bundle strategy plus the **shift to original content
starting in 2013 with House of Cards** defined the modern streaming
industry.

Netflix grew from ~7M subscribers in 2007 to **280M+ in 2024**, with
a peak market cap above **$300B**. The DVD-by-mail business was
formally shut down in **September 2023**, with Hastings closing the
operation himself.

The principle Reed Hastings articulated: *"We had to disrupt our own
DVD-by-mail business before someone else did. That was the entire
strategic insight."*

**Related reading:** [Netflix's DVD-to-streaming pivot](/case-study/netflix-dvd-to-streaming)
