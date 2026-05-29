---
slug: notion-pivot-2015
caseStudySlug: notion-all-in-one-workspace
type: historical
category: crisis
publishedAt: "2026-06-22T20:30:00+05:30"
year: 2015
estimatedMinutes: 7
principle: |
  When you're 18 months in with no PMF and the product feels wrong,
  the courageous move is to nuke what you have and rebuild on first
  principles — but only if you can name what was wrong in one
  sentence. Pivots that can't be articulated are just thrash.
intro: |
  You are the co-founder of an early-stage productivity startup, two
  years post-founding, $2M raised, four engineers including the two
  co-founders. You've shipped a v1 product — a tool that lets users
  combine notes, tasks, and databases on a single canvas. It has a
  few hundred power users who love it, but daily-active users are
  flat and signups have been steady at ~30/day for nine months.

  Your fundraise runway is six months. The product has 47 features.
  Half of them are used by under 5% of users. The codebase is a
  React-on-a-custom-renderer experiment that nobody else on the
  team fully understands except your CTO. Two power users keep
  emailing about a specific bug; you can't fix it without rewriting
  the renderer.

  Your CTO walks into your one-on-one and says: "I think we should
  throw it all away and rebuild from scratch."
nodes:
  start:
    dimension: founder
    prompt: |
      The CTO wants to rebuild. The product works for a few hundred
      users. Six months of runway. Pick.
    options:
      - text: "Rebuild from scratch. Communicate to the team and to investors. Buy 4 more months runway by cutting headcount."
        points: 5
        pattern: nuke-and-rebuild
        rationale: |
          The courageous move when the diagnosis is correct. You're
          saying: the architecture is the constraint, the feature
          bloat is the symptom, and another year of patching gets
          you another year of flat numbers. Rebuilding lets you
          collapse the 47 features into the core 5 that the power
          users actually love, on a renderer that the team can ship
          fast on. The risk: you might rebuild the wrong thing.
          Mitigation: do it from first principles, not from the
          current product's feature list.
        consequence: |
          You communicate the pivot to the team and investors. You
          let two engineers go. You spend 4 months in stealth
          rebuilding around the "blocks" primitive. The new product
          ships and converts the existing power users in 48 hours.
        leadsTo: B-rebuild-followup
      - text: "Refactor incrementally. Keep shipping features. Don't break the existing users."
        points: 2
        pattern: incremental-when-radical-needed
        rationale: |
          The defensible-looking instinct. Problem: you're acknowledging
          the architecture is wrong but committing to fix it
          piecewise. Each incremental refactor takes longer than
          planned, breaks something else, and never compounds. You
          spend the next year half-rebuilding and half-shipping new
          features, and end up with both a worse product and a
          worse architecture.
        consequence: |
          12 months later you've half-rebuilt the renderer and
          shipped 8 new features. DAU is still flat. Runway runs
          out.
        leadsTo: end-A
      - text: "Cut features aggressively. Don't rebuild. Just remove everything below 10% usage."
        points: 3
        pattern: prune-without-rebuild
        rationale: |
          Right instinct on bloat, wrong call on architecture. Cutting
          to the core 5 features is the right exercise — but it
          doesn't fix the rendering bug that's blocking the power
          users you have. You'd be shipping a cleaner-but-still-
          broken product, which doesn't move the DAU number.
        consequence: |
          Feature count drops to 12. Existing users don't notice
          either way. The architecture problem remains. DAU still
          flat at month 6.
        leadsTo: end-C
      - text: "Sell the company. You have a working product and 200 paying users — find a strategic buyer."
        points: 1
        pattern: surrender-prematurely
        rationale: |
          Premature capitulation. You haven't earned the right to
          sell yet — your numbers aren't strong enough to command a
          good price, but they're strong enough to justify a real
          pivot. Selling at this stage means selling at desperation
          valuation. The real question is: do you believe the
          original thesis? If yes, keep going; if no, return the
          money and don't take the acqui-hire.
        consequence: |
          The acqui-hire offer arrives at $4M. Investors take it.
          Your team is folded into a larger company. The blocks-
          based workspace category gets defined by someone else 18
          months later.
        leadsTo: end-D
  B-rebuild-followup:
    dimension: product
    prompt: |
      Three months into the rebuild. The team has shipped a working
      "blocks" prototype — every UI element (text, image, list,
      table, database) is the same primitive that can nest into
      anything. The early demos are getting strong reactions from
      friends in the dev community. The CTO wants to ship in
      stealth to a tight invite list before the public launch.
      Pick the launch strategy.
    options:
      - text: "Invite-only beta. Personal outreach to 100 power users from the old product. Iterate quickly."
        points: 5
        pattern: deliberate-base-rebuild
        rationale: |
          The right call for a rebuilt product. Your old power users
          are the highest-signal audience — they'll tell you what
          translated and what didn't. Invite-only also lets you
          tighten the loop on bug reports without overloading
          support. The public launch can come once the early
          feedback loop confirms the blocks primitive works at
          scale.
        consequence: |
          Of the 100 invited, 87 sign up. Daily active users
          surpass the old product's peak within 6 weeks. You ship
          public launch with a built-in evangelist base.
        leadsTo: end-B-great
      - text: "Public launch on Product Hunt. Maximum surface area, fast feedback."
        points: 3
        pattern: launch-before-loop
        rationale: |
          Faster, riskier. Product Hunt traffic is broad and noisy —
          you'll get sign-ups but also bug reports from users who
          aren't your ICP. The feedback loop is messier and the
          team gets pulled into edge cases rather than the core
          product loop. Works if your product is bug-free; risky
          when you've just rebuilt the renderer.
        consequence: |
          Launch lands on PH top 10. 2,000 signups in week one. 40%
          churn at day-7 because the product is still buggy and
          your support team can't keep up.
        leadsTo: end-B-mixed
      - text: "Skip the launch. Quietly migrate the old users. Don't talk about the rebuild until v2."
        points: 2
        pattern: hide-the-bet
        rationale: |
          Conservative to a fault. The rebuild IS the story; not
          telling it forfeits the narrative moment. A rebuilt
          product can use the rebuild itself as marketing
          ("we threw it all away and started over"); shipping
          it quietly leaves that asset on the table.
        consequence: |
          The migration works but nobody outside the user base
          notices. By the time v2 comes, the moment has passed.
        leadsTo: end-B-quiet
  end-A:
    isOutcome: true
    summary: |
      The incremental refactor never compounded. Twelve months later
      you'd shipped neither a meaningfully new product nor a
      cleaner codebase. The team ran out of runway and the company
      shut down quietly.
  end-B-great:
    isOutcome: true
    summary: |
      The deliberate base-rebuild compounded perfectly. Within 18
      months you were the fastest-growing productivity tool in
      history. By 5 years out, $30B+ valuation and a tool every
      knowledge worker had heard of. The rebuild story became the
      most-told founder narrative of the decade.
  end-B-mixed:
    isOutcome: true
    summary: |
      The public launch came too fast. The new product was right
      but the support pipeline wasn't ready. The growth recovered
      eventually but the first 90 days were chaos.
  end-B-quiet:
    isOutcome: true
    summary: |
      The migration worked technically. Brand-wise, you missed the
      moment. The product grew on word-of-mouth alone for the next
      two years until a competitor copied the blocks primitive and
      launched it louder.
  end-C:
    isOutcome: true
    summary: |
      You cleaned up the features but didn't fix the architecture.
      Six months later the DAU graph was identical. The runway ran
      out and the team scattered.
  end-D:
    isOutcome: true
    summary: |
      The acqui-hire was the worst-timed exit possible. You returned
      the cap-table at par; your team got jobs at the acquirer; the
      blocks-based workspace got defined by a different startup 18
      months later, valued in the tens of billions. You watched it
      happen on Twitter.
---

## What actually happened

This drill is based on the **Notion 2015 rebuild**. Notion shipped
its first product in 2014 to lukewarm reception — a few hundred
power users, a complex codebase, a CTO (Simon Last) who believed
the rendering architecture was the constraint.

Ivan Zhao and Simon Last made the call to **throw the entire product
away and rebuild from scratch on a new "blocks" primitive** — the
idea that every UI element (text, image, table, database row) is
the same primitive that can nest infinitely into other blocks.

The rebuild took about 18 months. They cut the team to four people,
moved to a cheaper Bay Area apartment, and shipped quietly to a
small invite list before the public launch in 2018. Within 24
months of relaunch, Notion was the fastest-growing productivity
tool of its category.

The current Notion valuation is **$10B+** with tens of millions of
users, and the "blocks" primitive defined an entire category of
productivity tools that followed (Coda, Craft, Tana, etc.).

The lesson: when the architecture is wrong, the only honest move is
to rebuild. But only if you can name what was wrong in one
sentence first.

**Related reading:** [Notion: identity through every surface](/case-study/notion-all-in-one-workspace)
