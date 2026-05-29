---
slug: razorpay-api-pivot-2014
caseStudySlug: razorpay-pivot-fintech
type: historical
category: pivots
publishedAt: "2026-07-06T20:30:00+05:30"
year: 2014
estimatedMinutes: 7
principle: |
  In regulated markets, the pivot signal isn't always weak metrics —
  sometimes it's that you discover the real product after talking to
  the people you thought were your competitors. Listen carefully when
  someone says "the real problem is one level deeper than what you're
  solving."
intro: |
  You are one of two co-founders of a fintech startup in India. You
  spent the first 18 months building a peer-to-peer payments app —
  imagine Venmo for India, before UPI existed. Adoption is real but
  slow; growth is constrained by the friction of bank-to-bank
  transfers (which take 2-3 days to settle in 2014).

  In Y Combinator interviews and during early investor calls, every
  smart person you talk to asks the same thing: "Why are you building
  a consumer product when the payments infrastructure underneath is
  broken? Most businesses in India can't accept online payments
  reliably. Why aren't you solving that?"

  Your bank account: ₹40 lakh ($60K) of personal savings. Your team:
  two engineers and the two of you. The bank-API integrations you've
  built for the consumer product could, in theory, be packaged as
  payment APIs for businesses.
nodes:
  start:
    dimension: founder
    prompt: |
      The consumer app has 2K users and is growing slowly. Every
      investor is asking why you're not building B2B payments
      infrastructure. Your runway is six months. Pick.
    options:
      - text: "Stay the course on the consumer app. UPI is rumored to be coming and will fix the bank-transfer problem."
        points: 1
        pattern: wait-for-the-platform
        rationale: |
          Betting on government infrastructure to fix your product —
          dangerous because the timing is unknowable. UPI did
          eventually arrive (April 2016) but until then, every
          consumer payments app was bottlenecked by the same
          settlement friction. Waiting for the platform means
          burning runway on a product the platform will commoditize.
        consequence: |
          Six months pass. UPI hasn't shipped. Runway hits zero.
          The consumer app shuts down. When UPI eventually launches,
          PhonePe and Google Pay absorb the consumer category.
        leadsTo: end-A
      - text: "Pivot to B2B payment APIs. Build for the businesses that can't accept online payments. Tell investors and team."
        points: 5
        pattern: pivot-to-the-real-problem
        rationale: |
          The right call. The signal is unambiguous: every
          experienced person is pointing at the same gap. The
          consumer app was a hypothesis; the B2B opportunity is
          a validated demand (every Indian business owner asks
          their bank for online payments and gets a 3-page form).
          Pivoting now uses the technical work you've done as
          a foundation, not as wasted effort.
        consequence: |
          You spend three months building the API and the merchant
          onboarding flow. First 10 businesses sign up in week
          one of beta. The infrastructure pain is so acute that
          they tolerate the rough v1.
        leadsTo: B-api-followup
      - text: "Hybrid: keep the consumer app, ship the B2B API as a side product."
        points: 2
        pattern: half-pivot
        rationale: |
          Trying to honor sunk cost while chasing the new
          opportunity. Two products, one tiny team, neither gets
          full focus. Both will move slower than a competitor who
          commits.
        consequence: |
          The B2B side gets traction but the team is split.
          Engineering moves slowly on both fronts. A focused
          competitor catches up within 12 months.
        leadsTo: end-C
      - text: "Sell what you have to a fintech in the consumer-payments space. Use the proceeds to fund a new company."
        points: 2
        pattern: graceful-exit-then-restart
        rationale: |
          Defensible but premature. You haven't tested the B2B
          hypothesis yet; selling now means assuming the consumer
          play is the ceiling of your value. Acqui-hire valuations
          at this stage are low and the new company means starting
          from zero — without the technical foundation you've built.
        consequence: |
          Acqui-hire closes at ₹2 crore (~$300K). You take six
          months off. The B2B payments market in India explodes
          over the next 24 months without you in it.
        leadsTo: end-D
  B-api-followup:
    dimension: business
    prompt: |
      Six months into the pivot. ~50 merchants live. Take rate is
      2.5% (fixed). Bigger merchants (₹50L+ monthly volume) are
      asking for custom rates. Smaller merchants are asking for a
      "no-code" version they can embed without engineering. Pick.
    options:
      - text: "Build the no-code version. Long tail of small merchants is the bigger market and aligns with the self-serve motion."
        points: 5
        pattern: small-merchants-as-distribution
        rationale: |
          Right call for early-stage. Small merchants compound
          fastest (referral loops, low CAC, fast onboarding), and
          a no-code embed becomes the wedge that drives word-of-
          mouth. Custom rates for big merchants are a Q2 question;
          today's question is "how do we get to 5,000 merchants?"
        consequence: |
          No-code embed ships in 8 weeks. Onboarding flow drops
          from days to minutes. Merchant count crosses 1,000 in
          90 days. Word of mouth in the small-business community
          becomes the dominant acquisition channel.
        leadsTo: end-B-great
      - text: "Custom rates for big merchants first. Larger contracts, more revenue per merchant."
        points: 3
        pattern: enterprise-first-too-soon
        rationale: |
          Bigger deals but slower compounding. Enterprise sales
          cycles in Indian fintech are 4-9 months. You'd be
          shifting the team from a self-serve motion to an
          enterprise motion before the self-serve motion has
          fully validated.
        consequence: |
          Two big merchants sign at 1.8% take rate. ARR jumps but
          the long-tail growth slows because engineering is busy
          with custom integrations.
        leadsTo: end-B-mixed
      - text: "Stay focused on the current 50 merchants. Stabilize the product before adding either segment."
        points: 2
        pattern: stabilize-when-momentum-matters
        rationale: |
          Defensive when the moment calls for offense. At 50
          merchants with strong product-market signal, the
          constraint is acquisition velocity, not product polish.
          Slowing down now means letting competitors catch the
          merchants who would have been yours.
        consequence: |
          Stable product, stable growth at 30 merchants/month.
          A competitor ships a no-code version and captures the
          long-tail market you would have owned.
        leadsTo: end-B-mediocre
  end-A:
    isOutcome: true
    summary: |
      You waited for the platform and ran out of money. UPI shipped
      18 months after you closed. The consumer category was taken
      by PhonePe and Google Pay; the B2B category was taken by a
      pivoted competitor who didn't wait.
  end-B-great:
    isOutcome: true
    summary: |
      The no-code embed compounded. Merchant count crossed 100K
      within 18 months. The company became the default payments
      infrastructure for Indian businesses. By 2022, valuation
      ~$7.5B and a category-defining brand.
  end-B-mixed:
    isOutcome: true
    summary: |
      The enterprise-first call delivered short-term revenue but
      slowed the long-tail compounding. You eventually shipped
      the no-code version 12 months later and recovered, but
      gave up a year of market velocity.
  end-B-mediocre:
    isOutcome: true
    summary: |
      The stabilization slowed growth and a competitor took the
      market. You eventually shipped the no-code version 18
      months later, but the category was someone else's by then.
  end-C:
    isOutcome: true
    summary: |
      The half-pivot worked partially. The B2B side grew but
      slower than a focused competitor's, who eventually took the
      category leadership position.
  end-D:
    isOutcome: true
    summary: |
      The early exit closed at the wrong valuation. The market
      exploded without you. You restarted but lost two years and
      the technical foundation that would have made the new
      company faster.
---

## What actually happened

This drill is based on the **Razorpay pivot in 2014**. Harshil Mathur
and Shashank Kumar started Razorpay as a peer-to-peer consumer
payments app. During their YC interview, Paul Graham specifically
pointed out that the real opportunity was in fixing payments
infrastructure for Indian businesses — every YC mentor they spoke
to said the same thing.

They pivoted in 2014 to B2B payment APIs. The first version of the
product was painful to onboard (3-day verification, paperwork,
manual integration) but the demand was so acute that businesses
tolerated it. The team then built a no-code embed that brought
onboarding from days to minutes — that became the unlock.

By 2018 Razorpay had crossed ₹10,000 crore in annual transaction
volume. By 2022 the company was valued at **$7.5B** and was the
default payments provider for digital-first Indian businesses.

The pattern: in regulated markets, the best signal of where to
build is what your investors and mentors *keep* pointing at, even
when you've committed to a different idea.

**Related reading:** [Razorpay's brand polish at fintech scale](/case-study/razorpay-pivot-fintech)
