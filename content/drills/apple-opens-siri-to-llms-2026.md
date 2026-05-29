---
slug: apple-opens-siri-to-llms-2026
type: current
category: strategic
publishedAt: "2026-06-11T20:30:00+05:30"
estimatedMinutes: 7
principle: |
  Platform moves by hyperscalers don't kill verticals — they reshape
  what the vertical has to be. When Apple opens Siri, the question
  isn't "do we compete with Siri" but "what do we own that becoming
  a Siri-plugin doesn't erase?"
intro: |
  You are the CEO of a voice-AI startup. ~$2M ARR. Your moat was
  "voice + AI in one product" — your assistant runs on iOS and Android,
  uses your own NLU pipeline plus an LLM backend, and your enterprise
  customers (call centers, legal intake, healthcare scheduling) pay
  $50-200/seat/month for it.

  This morning at WWDC, Apple announced that iOS 20 will let any
  third-party developer plug their own LLM into Siri for specific
  query categories. Users can pick their default LLM the same way
  they pick their default browser. The integration is deep: app
  context, on-device privacy guarantees, system-level voice access.

  Your phone is ringing. Your enterprise customers want to know what
  this means. Your board wants to know what you're doing. Your
  engineering team is split.
nodes:
  start:
    dimension: founder
    prompt: |
      The market has just changed shape. Pick the move.
    options:
      - text: "Build a Siri plugin. Position as 'the best LLM for voice on iOS.'"
        points: 3
        pattern: ride-the-platform
        rationale: |
          The defensive-but-fast move. Plug into Apple's distribution,
          let them handle the hardest part (system-level voice access),
          and become the LLM users pick. Risk: you're now Apple's
          tenant. They control the discovery surface, the privacy
          rules, and the cut. Reward: you reach 100x more users than
          your standalone app ever could.
        consequence: |
          Plugin ships in 6 weeks. Downloads spike. Apple changes the
          plugin guidelines in Q3 in a way that hurts your specific
          flow. You spend Q4 redesigning around their rules.
        leadsTo: A-plugin-followup
      - text: "Pivot to a vertical — pick legal voice, medical voice, or call-center voice and own it."
        points: 5
        pattern: own-a-vertical
        rationale: |
          The right strategic move. Horizontal voice-AI for consumers
          just got commoditized by Apple. Vertical voice-AI for
          enterprises did not — your compliance posture, domain
          fine-tuning, and integration depth are things Apple won't
          ever ship. By picking one vertical and going deep, you turn
          a soon-commodity layer into a fundable enterprise business.
        consequence: |
          You spend 4 weeks picking the vertical, then commit. Two of
          your enterprise customers become design partners for the
          new positioning. Twelve months later you're the dominant
          name in that vertical.
        leadsTo: B-vertical-followup
      - text: "Sell the company now while you can. Apple just commoditized your category."
        points: 2
        pattern: capitulate-too-early
        rationale: |
          Defensible logic, premature timing. The platform announcement
          doesn't kill verticals — it kills the consumer wedge. You
          still have a real enterprise business with paying customers
          and domain depth. Selling at the bottom of the news cycle
          means selling at the worst possible valuation.
        consequence: |
          Acquisition talks begin. Best offer is 1x ARR — half what
          you were worth six months ago. You take it. Eighteen months
          later, the team that bought you spins your tech into the
          legal-vertical play you could have run yourself.
        leadsTo: end-C
      - text: "Stay horizontal. Double down on Android + web where Apple's move doesn't reach."
        points: 2
        pattern: avoid-the-fight
        rationale: |
          The "go where they aren't" instinct. Android voice is
          fragmented and Google's Assistant has been weak. The problem:
          Google will follow Apple's move within 12 months — they
          always do — and your enterprise customers don't care about
          Android-only. You're buying ~12 months of margin at the
          cost of giving up the iOS market entirely.
        consequence: |
          You ship Android features through Q3. Google announces a
          similar plugin model at I/O in May. You're now exiled from
          both major platforms with a thinner product.
        leadsTo: end-D
  A-plugin-followup:
    dimension: product
    prompt: |
      The plugin is live. Downloads are strong but ARPU collapsed — you
      can't charge consumers $5/month when Siri is the default
      surface. Enterprise customers are asking why your consumer
      product is now free while their seats still cost $200. What now?
    options:
      - text: "Make the consumer plugin free forever. Use it as a top-of-funnel for enterprise."
        points: 4
        pattern: free-tier-as-funnel
        rationale: |
          Smart funnel math. Consumer plugin becomes the awareness
          driver, enterprise stays the revenue engine. The thing to
          watch: the funnel only works if there's a clear product
          differentiation between the free Siri plugin and the
          enterprise product. Otherwise enterprise asks why they're
          paying for what their employees use for free.
        consequence: |
          Free plugin drives 200K downloads in 90 days. ~3% of users
          discover the enterprise version through your team. Sales
          cycles shorten by 30%.
        leadsTo: end-A-good
      - text: "Try to monetize the consumer plugin via premium features. Charge $5/month."
        points: 1
        pattern: monetize-where-platform-owns
        rationale: |
          Doomed. The user already pays Apple for iCloud, and Apple's
          plugin guidelines specifically discourage app-level payments
          for system-level features. You're charging $5 for a thing
          users perceive as part of iOS.
        consequence: |
          Premium conversion is <0.4%. Reviews call you "another
          subscription tax." You quietly remove the paywall in Q4.
        leadsTo: end-A-bad
  B-vertical-followup:
    dimension: business
    prompt: |
      You picked Legal Voice (intake, deposition assistance, citation
      lookup). Three enterprise design partners signed. Pricing
      decision: per-seat or per-firm?
    options:
      - text: "Per-firm flat fee. $50K/year for unlimited seats."
        points: 4
        pattern: simple-pricing-for-trust
        rationale: |
          Clean, defensible, easy for legal procurement to approve.
          You leave money on the table at large firms but you close
          deals faster and get reference customers. At early stage,
          velocity beats per-unit margin.
        consequence: |
          You sign 12 firms in 6 months. ARR jumps to $5M. Some big
          firms quietly absorb hundreds of seats — you'll fix the
          pricing in v2.
        leadsTo: end-B-good
      - text: "Per-seat: $200/month. Tiered by usage."
        points: 3
        pattern: granular-pricing
        rationale: |
          More accurate to value, but creates friction in legal
          procurement (every seat needs ROI justification). You
          maximize per-unit revenue but slow the sales motion at the
          stage where you most need pace.
        consequence: |
          Sales cycles stretch to 5-6 months. You sign 4 firms but
          deals are larger. Mixed outcome on net revenue.
        leadsTo: end-B-mixed
      - text: "Free for solo lawyers. Pay only for firms over 10 attorneys."
        points: 5
        pattern: bottom-up-then-top-down
        rationale: |
          The PLG-into-enterprise move. Solos try you free, fall in
          love, get hired at firms, bring you with them. The firms
          pay because their lawyers already use you. This is the
          Notion / Figma playbook applied to legal voice.
        consequence: |
          Solo signups hit 8K in 6 months. 47 of them join larger
          firms in that period and bring you in the door. ARR hits
          $7M with low CAC.
        leadsTo: end-B-great
  end-A-good:
    isOutcome: true
    summary: |
      The plugin became a credible top-of-funnel for the enterprise
      product. You stayed in the platform game but didn't bet the
      company on it.
  end-A-bad:
    isOutcome: true
    summary: |
      The consumer monetization failed and the brand took a small hit
      with the subscription-tax reviews. The enterprise business is
      intact but you wasted 6 months trying to charge for something
      the platform gave away.
  end-B-good:
    isOutcome: true
    summary: |
      Legal voice became your category. ARR grew from $2M to $5M in
      six months. The Apple platform shift, in retrospect, was the
      moment that forced you to find your real business.
  end-B-mixed:
    isOutcome: true
    summary: |
      The vertical bet worked but the pricing model slowed you down.
      You'll fix it in v2; in the meantime you're growing slower than
      a cleaner pricing model would have allowed.
  end-B-great:
    isOutcome: true
    summary: |
      The bottom-up motion compounded. By Q4 you were the default
      voice tool in legal, with 8K solo lawyers and 60+ firms paying.
      The platform shift turned out to be the best thing that ever
      happened to your company.
  end-C:
    isOutcome: true
    summary: |
      You sold at the worst possible moment. The vertical you could
      have owned became someone else's $100M ARR business 24 months
      later. You're consulting now and won't talk about it.
  end-D:
    isOutcome: true
    summary: |
      The Android bet bought you ~12 months. Google's I/O announcement
      ended it. You're now sub-scale on both platforms with no
      enterprise wedge. The next fundraise gets ugly.
---

## What's at stake here

The pattern: when a platform owner (Apple, Google, Microsoft, Meta)
absorbs a horizontal capability into their OS, the founders who
**panic and pivot to compete with the platform** lose. The founders
who **panic and pivot to a vertical the platform won't ever serve
deeply** consistently win.

Examples from history: Mailchimp survived Google ads moving in by
going deep on small-business automation. Zapier survived Microsoft
Power Automate by owning the long-tail of integrations. Calendly
survived Google/Microsoft calendar features by owning the cross-
company scheduling use case.

The platform threat is a clarifying force, not an ending one.

**Related reading:** [Apple Intelligence Failed in 2026](/ai-decoded/apple-intelligence-flop-2026)
