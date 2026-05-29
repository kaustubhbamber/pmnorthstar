---
slug: slack-pivot-from-glitch-2013
caseStudySlug: slack-gaming-pivot
type: historical
category: pivots
publishedAt: "2026-06-08T20:30:00+05:30"
year: 2013
estimatedMinutes: 8
principle: |
  The strongest pivot signal is when your internal tool — built to support
  the product you're failing at — is the thing your team actually loves.
  A team that loves something they built tells you more about
  product-market-fit than any user survey.
intro: |
  You are the CEO of a venture-funded gaming studio. Five years in,
  $17M raised, ~50 employees. Your flagship MMO has been live for
  fourteen months and bookings are still under $1M ARR. Player retention
  is flat. The board is asking pointed questions about runway.

  Internally, your team uses a chat tool you built to replace IRC for
  the studio. It has channels, file sharing, and a search-everything-
  ever feature that nobody else's enterprise chat has. Your team uses
  it 12 hours a day. Two of your engineers refuse to take meetings
  unless they happen in your chat tool. A friend who works at a small
  agency in San Francisco asked if he could try it.

  You have about 9 months of runway and one big decision to make in
  the next month.
nodes:
  start:
    dimension: founder
    prompt: |
      The game isn't working. The chat tool is. What do you do?
    options:
      - text: "Pour another year into the game. The genre takes time to develop. Cut costs to extend runway."
        points: 1
        pattern: sunk-cost-doubling-down
        rationale: |
          The instinct to honor the original mission. You raised $17M
          to build a game; pivoting feels like a betrayal of your
          investors' thesis. The hidden problem: 14 months of flat
          retention is real signal, not noise, and another year of
          grinding burns the option value of the chat tool — which
          your team is telling you, every day, is the thing that
          actually works.
        consequence: |
          The next year is brutal. Player numbers don't move. Runway
          runs out. The chat tool dies on the company's servers.
        leadsTo: end-A
      - text: "Spin the chat tool out as its own product. Pivot the whole company to it. Tell investors."
        points: 5
        pattern: pivot-from-strength
        rationale: |
          The hardest move emotionally, the right move strategically.
          You're abandoning a five-year, $17M bet — but you're doing it
          to chase the only thing your team has built that has real
          internal pull. Risk: investors thought they were funding a
          gaming studio. Payoff: you can charge enterprises for the
          chat tool tomorrow, and the existing team has the muscle
          memory to ship it fast.
        consequence: |
          You tell the team. Half of them are visibly relieved. You
          pivot the company in 8 weeks. Three months later you have
          your first 8 paying enterprise customers.
        leadsTo: B-pivot-followup
      - text: "Open the chat tool as a side product but keep the game alive. Diversify the bet."
        points: 2
        pattern: zombie-portfolio
        rationale: |
          The "keep all options open" trap. You're trying to hedge two
          bets with one team, neither gets full attention, and you
          burn money on both. Multi-product companies at this stage
          almost universally lose to single-product competitors. Worst:
          the team senses you don't believe in either bet enough to
          commit, and your strongest people start looking for jobs.
        consequence: |
          Six months later both products are limping. Two senior
          engineers leave. The chat tool ships to 12 customers but
          stalls because nobody owns it full-time. The game ships
          one more expansion to no fanfare.
        leadsTo: end-C
  B-pivot-followup:
    dimension: product
    prompt: |
      Eight weeks into the pivot. Your first 8 customers love it. You're
      free during private beta — no pricing yet. Three competing
      products exist (one venture-backed, two open-source). You need to
      decide the wedge. Pick the angle for your public launch.
    options:
      - text: "Position as 'email killer for teams' — go after the broad knowledge-worker market"
        points: 3
        pattern: market-too-broad
        rationale: |
          The dream positioning. Massive TAM, big upside if it works.
          The problem: every messaging tool of the last 20 years has
          tried to be the email killer and most have failed. You don't
          have the resources to fight on every front. Without a wedge,
          you'll burn marketing budget chasing everyone and converting
          nobody.
        consequence: |
          The launch lands soft. You get coverage but inbound is thin.
          Sales cycles are 4-6 months because every prospect compares
          you to ten alternatives. You spend Q2 figuring out
          positioning the hard way.
        leadsTo: end-B-soft
      - text: "Position as 'where work happens for software teams' — pick the niche, dominate it first"
        points: 5
        pattern: niche-then-expand
        rationale: |
          The correct call. Software teams are already using your
          private beta, they're loud on Twitter, they switch tools fast,
          and they bring their team chat habits to every company they
          join. Owning that niche gives you both immediate revenue and
          the bridge into other categories — design teams, then sales,
          then everyone.
        consequence: |
          The launch hits Hacker News front page. Inbound floods in.
          By month 6 you have 1,000 paying teams. Sales cycles are 2
          weeks because the niche knows what to do with you.
        leadsTo: end-B-strong
      - text: "Stay closed beta. Wait until you have enterprise-ready security and SSO before any launch."
        points: 2
        pattern: perfection-over-presence
        rationale: |
          The enterprise-readiness trap. You can ship SSO and SOC 2 in
          parallel with the public launch — they don't need to come
          first. Waiting means competitors gather the early adopters
          while you polish, and you lose the most valuable thing in a
          new category: the founder-storyteller advantage.
        consequence: |
          A competitor launches 8 weeks before you. By the time you're
          ready, they're "the team chat tool that everyone uses." You
          ship into a market you used to own.
        leadsTo: end-B-late
  end-A:
    isOutcome: true
    summary: |
      The game never recovered. The chat tool died on the company's
      servers. By the time the layoffs happened, the team chat
      category had been captured by a different company that had read
      the signal you ignored.
  end-B-strong:
    isOutcome: true
    summary: |
      The pivot defined a category. Within 2 years you were the
      fastest-growing enterprise software company in history. The chat
      tool went on to be acquired for $27.7B. The MMO is a footnote.
  end-B-soft:
    isOutcome: true
    summary: |
      The pivot worked but the launch fumbled the positioning. You
      eventually found the niche the hard way and grew, but lost 12-18
      months to competitors who got there first.
  end-B-late:
    isOutcome: true
    summary: |
      The polish came at the wrong price. Enterprise-readiness arrived
      ahead of brand awareness, and by then the category was someone
      else's to own. You built a good product into a market that no
      longer noticed you.
  end-C:
    isOutcome: true
    summary: |
      The hedge failed. Neither product had full team weight behind it,
      neither got the focus that breakthrough products need. The
      strongest engineers left. The company eventually shut both
      products down.
---

## What actually happened

This drill is based on the **Stewart Butterfield / Tiny Speck → Slack
pivot** in 2013. Tiny Speck had spent four years and $17M building
*Glitch*, a browser-based MMO with a devoted but small player base.
The internal team chat tool — used to coordinate game development —
was beloved by the team but invisible to the world.

Butterfield made the call to **shut down Glitch** and pivot the
entire company to the chat tool, naming it **Slack** (Searchable Log
of All Conversation and Knowledge). The pivot took place over roughly
eight weeks in late 2013. Slack launched publicly in February 2014
positioned squarely at **software teams** as the wedge.

Within 24 months Slack was the fastest-growing SaaS company in
history. **Salesforce acquired Slack for $27.7B in 2021**, making the
Glitch → Slack pivot one of the most studied in startup history.

The principle: pivot from strength, not from desperation. The chat
tool worked because Butterfield's team had been using it daily for
years. They knew the product had to exist — they just had to admit
the game didn't.

**Related reading:** [Slack's pivot from gaming](/case-study/slack-gaming-pivot)
