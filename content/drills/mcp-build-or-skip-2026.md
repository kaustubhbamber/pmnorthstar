---
slug: mcp-build-or-skip-2026
type: current
category: strategic
publishedAt: "2026-07-16T20:30:00+05:30"
estimatedMinutes: 6
principle: |
  Standards become moats only when they're inevitable. Investing in
  an emerging standard early is a bet on its trajectory, not on its
  current adoption. The right question isn't "is the standard
  popular today?" but "does its momentum show it will be a default
  in 18 months?"
intro: |
  You are the CTO of a Series-B SaaS company (~$15M ARR, 80
  customers). Your product is a CRM for sales teams with deep
  integrations into email, calendar, and call-recording tools.

  Anthropic's MCP (Model Context Protocol) is gaining traction —
  major foundation-model providers and AI agent frameworks are
  adopting it as the way agents discover and call into third-party
  tools. Building an MCP server for your product would let any AI
  agent (Claude, OpenAI's, Cursor, Linear's agents) query and
  modify CRM data through a standard interface.

  Your engineering team has 6 people. The MCP server is roughly
  3-4 weeks of work for a senior engineer. Your Q3 roadmap is
  already committed to enterprise security features (SSO, audit
  log) that two paying customers asked for. You can't do both.
nodes:
  start:
    dimension: product
    prompt: |
      Ship MCP server in Q3 or do the security features. Pick.
    options:
      - text: "Ship MCP. Skip or defer the SSO/audit features. Bet on the standard."
        points: 4
        pattern: standard-bet-over-customer-ask
        rationale: |
          Bold but defensible. MCP momentum is real — adoption is
          compounding monthly, foundation model providers are
          standardizing on it, and the AI-agent distribution
          channel will be 10x larger in 12 months. Shipping early
          puts you in the discoverability layer that every agent
          will query. The cost: two paying customers feel
          deprioritized, and security features tend to be table
          stakes for enterprise.
        consequence: |
          MCP ships in 4 weeks. Within a month, ~12% of new
          inbound mentions "we want a CRM that works with our AI
          agent." One of the SSO-asking customers churns; the
          other waits. Net new ARR up 30% by quarter end.
        leadsTo: A-mcp-followup
      - text: "Ship security features. MCP can wait until the standard is more proven."
        points: 3
        pattern: customer-ask-over-standard
        rationale: |
          The defensible "ship what they're asking for" call.
          Security features close known deals; MCP closes
          hypothetical deals. The problem: by the time the
          standard is unambiguously dominant, you'll be 6-9
          months behind competitors who shipped early and
          captured the agent-traffic layer.
        consequence: |
          Security features ship. Both customers stay and one
          expands. AI-agent inbound goes to your competitor.
          Mixed outcome — short-term wins, long-term cost.
        leadsTo: end-B
      - text: "Hire a contractor to ship MCP in parallel. Keep the security roadmap intact."
        points: 5
        pattern: contractor-for-the-bet
        rationale: |
          The right answer. MCP is a defined surface that a
          competent contractor can ship in 3-4 weeks; security
          features are intertwined with your codebase and need
          full-time eng. Splitting the work across employment
          types lets you capture both the standard-adoption
          window and the customer-ask. Cost: ~$25K for the
          contractor. Worth it.
        consequence: |
          Both features ship in Q3. MCP integration in week 4,
          SSO/audit in week 10. Inbound agent-traffic compounds
          while existing customers stay happy. Net new ARR up
          45% by quarter end.
        leadsTo: C-both-followup
      - text: "Wait for Q4. Defer both. Q3 is for selling the existing pipeline."
        points: 1
        pattern: defer-both
        rationale: |
          The "let's plan more" instinct. Both bets are real and
          deferring isn't free — competitors ship MCP in Q3,
          enterprise customers churn over missing SSO. The
          right move is to make a call now, not to push the
          decision into the next quarter.
        consequence: |
          One enterprise customer churns. A competitor ships MCP.
          You enter Q4 behind on both axes.
        leadsTo: end-D
  A-mcp-followup:
    dimension: business
    prompt: |
      The MCP server is live. ~12% of new inbound mentions AI agent
      compatibility. The remaining SSO-asking customer is at
      renewal. They want SSO + audit log; you don't have it.
      What do you do?
    options:
      - text: "Offer them a credit and a Q4 ETA on SSO. Stretch the relationship."
        points: 4
        pattern: relationship-bridge
        rationale: |
          Right balance. You're not promising what you can't
          deliver; you're acknowledging the gap and giving the
          customer a clear timeline + financial gesture.
          Enterprise customers respect honesty about roadmap.
        consequence: |
          They renew on a 6-month term instead of 12, with the
          option to extend when SSO ships. You ship SSO in Q4.
          They sign the extension.
        leadsTo: end-A-good
      - text: "Let them churn cleanly. Refer them to a competitor with SSO."
        points: 2
        pattern: prioritize-strategy-over-customer
        rationale: |
          Discipline taken too far. Losing a paying enterprise
          customer to a competitor — and personally helping —
          signals to other customers that you don't fight for
          renewals. The MCP bet doesn't require you to actively
          churn the customers who built the company.
        consequence: |
          The customer churns. Two other enterprise prospects
          hear about it and pause their pipelines.
        leadsTo: end-A-bad
  C-both-followup:
    dimension: product
    prompt: |
      Both features shipped. AI-agent inbound is now 18% of new
      pipeline. You're getting questions about deeper MCP
      integrations — write actions, multi-step workflows,
      structured callbacks. Your competitor is reading the same
      pattern. Pick.
    options:
      - text: "Ship the deepest MCP integration in the category. Become the reference CRM for AI agents."
        points: 5
        pattern: depth-over-breadth
        rationale: |
          The right move. The AI-agent integration depth is
          actually defensible — write actions, multi-step
          workflows, callback hooks require domain understanding
          of CRM data models. Generic CRMs won't match it. By
          going deep, you become "the CRM for AI-first sales
          teams" rather than just "a CRM that works with AI."
        consequence: |
          Deep integration ships over Q4. You become the
          reference customer for Anthropic's MCP documentation,
          which drives compounding inbound for 18 months.
        leadsTo: end-C-great
      - text: "Stay at MCP parity. Don't over-invest in a category that's still uncertain."
        points: 3
        pattern: parity-not-depth
        rationale: |
          Defensible hedge. Parity protects against a standard
          shift, but it also forfeits the differentiation moment.
          If MCP becomes dominant, you'll be one of many; if it
          doesn't, you'll still have a working integration.
        consequence: |
          You stay current with the standard but don't lead it.
          AI-agent inbound plateaus at ~18% of pipeline.
        leadsTo: end-C-stable
  end-A-good:
    isOutcome: true
    summary: |
      The MCP bet plus the customer-bridge worked. Renewals stayed
      strong, AI-agent inbound grew, and Q3 closed 30% above
      target. The bet on the standard compounded.
  end-A-bad:
    isOutcome: true
    summary: |
      The customer churn signaled bad faith to the broader
      pipeline. AI-agent inbound was real but the brand took a
      hit. Net neutral quarter.
  end-B:
    isOutcome: true
    summary: |
      Security features kept existing customers happy but you
      missed the standard-adoption window. A competitor took
      the AI-agent traffic layer. You shipped MCP in Q4 but as
      a follower, not a leader.
  end-C-great:
    isOutcome: true
    summary: |
      The deep MCP integration positioned you as the AI-first
      CRM. Inbound compounded for 18 months. Series C closed at
      4x the Series B valuation on the "agent-distribution layer"
      story.
  end-C-stable:
    isOutcome: true
    summary: |
      Parity worked but didn't compound. You retained the AI-
      agent traffic you had but didn't grow it. Net stable
      quarter, stable narrative.
  end-D:
    isOutcome: true
    summary: |
      Deferring both bets cost you on both axes. Q4 became a
      catch-up quarter, and the agent-traffic layer was someone
      else's by then.
---

## What's at stake here

The MCP decision is a live case for every developer-tool and SaaS
company in 2026. The companies treating MCP as a Q4-or-later
roadmap item are losing the agent-distribution channel to faster
movers. The companies investing aggressively in MCP integration
depth are capturing inbound from every AI agent that queries their
category.

The pattern: emerging standards reward early movers
asymmetrically because the discoverability surface (model
registries, MCP marketplaces, agent search) sorts integrations by
quality and recency. Late-arrivers fight for visibility against
the established defaults.

**Related reading:** [MCP becoming the standard](/ai-decoded/mcp-becoming-standard-2026)
