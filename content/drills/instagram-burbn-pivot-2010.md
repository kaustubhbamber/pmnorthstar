---
slug: instagram-burbn-pivot-2010
caseStudySlug: instagram-burbn-pivot
type: historical
category: pivots
publishedAt: "2026-07-13T20:30:00+05:30"
year: 2010
estimatedMinutes: 6
principle: |
  The best feature in a struggling product is usually the only one
  your users actually use. The fastest pivot is to delete everything
  else and rebuild around the one thing that worked.
intro: |
  You are the co-founder of a location-based social app. Eight months
  in, $500K raised, two engineers including yourself. The product is
  a Foursquare-like check-in app with extras: gamified badges, a
  feed of friends' check-ins, photo posting at check-in spots.

  Foursquare just raised $20M. They have the lead in your category
  by a country mile. Your DAU is flat at ~1,500. The only metric
  going up is the number of photos users post when they check in —
  some users skip the check-in entirely and just post photos with
  filters. Your photo-posting flow is genuinely better than every
  alternative (Hipstamatic, Path, the camera roll).

  You have ~3 months of runway.
nodes:
  start:
    dimension: founder
    prompt: |
      Competing with Foursquare isn't working. Photos are the only
      thing growing. Pick.
    options:
      - text: "Strip out everything except photo posting + filters + sharing. Rebuild as a photo-only social app."
        points: 5
        pattern: delete-to-the-loved-feature
        rationale: |
          The fastest possible pivot. You're not building a new
          product; you're isolating the one feature users
          already love. Two weeks of removal work plus filter
          polish, and you ship as a pure photo app. The TAM is
          larger (everyone with a camera phone), the category
          is open (no clear leader yet), and your existing
          users will follow because you're giving them the part
          they actually wanted.
        consequence: |
          You ship the photo-only version in 8 weeks. Initial
          users include some friends in tech. A photo of one
          founder's dog gets shared widely. Daily active users
          double in week one of public launch.
        leadsTo: B-photo-followup
      - text: "Stay the course. Polish the check-in product. Differentiate from Foursquare on the gamification angle."
        points: 1
        pattern: feature-war-with-leader
        rationale: |
          Doomed math. You'd be fighting Foursquare's $20M war chest
          with $500K. Even with a better gamification system, the
          category leader has 50x your distribution. The photo
          signal is louder than any rationalization for staying
          in the check-in market.
        consequence: |
          Three months later, Foursquare has 5M users; you have
          2,000. Your runway runs out. The team shuts down.
        leadsTo: end-A
      - text: "Sell the company to Foursquare. Acqui-hire."
        points: 2
        pattern: surrender-without-trying-pivot
        rationale: |
          Premature. You have a clear pivot path with strong signal
          (the photo feature). Selling now means selling at
          check-in-app prices when a 6-week pivot could turn the
          company into something fundamentally more valuable.
        consequence: |
          Foursquare acqui-hires for $1.5M. Eighteen months later
          they shut down the team and you watch a photo-app
          category get built by someone else for $1B.
        leadsTo: end-C
      - text: "Add more features. Try photos as one of three big bets — check-ins, photos, and group plans."
        points: 1
        pattern: hedge-when-pivot-is-clear
        rationale: |
          Hedging when the signal is clear is the same as ignoring
          the signal. Three half-built features mean nothing
          compounds — engineering capacity gets sliced too thin
          to make any one of them great.
        consequence: |
          The product becomes a feature-jumbled three-headed
          hydra. Users are confused. Daily actives slip below
          1,000. Runway runs out.
        leadsTo: end-D
  B-photo-followup:
    dimension: product
    prompt: |
      Six weeks post-launch. ~250K users. Twitter and Reddit are
      noticing. A key feature decision: should the product be
      photo-only (no captions, no comments, no DMs) or social-
      enabled (likes, comments, follows)?
    options:
      - text: "Photo-only. No comments, no captions. Just a stream of friends' photos."
        points: 2
        pattern: under-build-social
        rationale: |
          Defensible minimalism but probably wrong. Without
          comments/likes, photos die in the feed and there's no
          re-engagement signal. Users post once and stop. The
          social loop is what makes photo apps habit-forming;
          stripping it eliminates the compounding behavior.
        consequence: |
          Posting frequency drops after week 2. Users move to
          competing apps that have comments. Growth plateaus
          at ~400K.
        leadsTo: end-B-bad
      - text: "Full social: likes, comments, follows, DMs. Build it now while attention is high."
        points: 5
        pattern: social-loop-now
        rationale: |
          Right call. Photo + social is the loop that compounds —
          posts get likes, likes attract follows, follows attract
          posts. Building it now while the early-adopter
          attention is hot means the loop kicks in immediately.
          Skipping or delaying means users churn before they
          experience the social layer.
        consequence: |
          The social features ship in 4 weeks. Likes and comments
          compound posting frequency 3x. Growth becomes
          exponential. By month 6 you're at 5M users.
        leadsTo: end-B-great
      - text: "Partial social: likes only, no comments. Less moderation burden."
        points: 3
        pattern: half-loop
        rationale: |
          Underpowered. Likes alone don't create conversation,
          and conversation is where the daily-return habit
          builds. You'd be optimizing for moderation cost at
          the expense of the loop that makes the product
          sticky.
        consequence: |
          Growth is decent but slower than full-social would
          produce. The product retains ~60% of users at day-30
          vs. ~75% for full-social comps.
        leadsTo: end-B-mixed
  end-A:
    isOutcome: true
    summary: |
      Staying in the check-in war was unwinnable. Foursquare took
      the category. Your runway expired. Two years later, the
      photo-only social category became a $1B+ company built by
      someone who saw the same signal you ignored.
  end-B-great:
    isOutcome: true
    summary: |
      The photo + social loop compounded into one of the fastest-
      growing products in history. Twelve months post-launch, the
      company was acquired for $1 billion. The pivot from check-
      in app to photo app became the textbook fast-pivot case
      study.
  end-B-bad:
    isOutcome: true
    summary: |
      The photo-only product stalled without the social loop. You
      added comments 6 months later but a competitor with full
      social features had already taken the category.
  end-B-mixed:
    isOutcome: true
    summary: |
      The like-only loop worked partially. Growth was decent but
      a competitor with full social compounded faster and took
      the category 18 months later.
  end-C:
    isOutcome: true
    summary: |
      The acqui-hire closed cleanly. Foursquare shut down the team
      18 months later. You watched the photo-app category get
      defined by someone else with a $1B exit.
  end-D:
    isOutcome: true
    summary: |
      The hedge failed. Three half-built features confused users
      and engineering. The product never compounded. Runway
      ran out.
---

## What actually happened

This drill is based on **Burbn's pivot to Instagram in 2010**. Kevin
Systrom and Mike Krieger had built Burbn, a check-in app with photo
features. Foursquare was the dominant competitor. Burbn was
struggling — flat DAU, no clear differentiation — but users were
disproportionately engaged with the photo posting.

Systrom and Krieger made the call to **strip everything except photos
and filters**, rebuilt the product in 8 weeks, and shipped Instagram
in October 2010. The first photo posted on the new app was of a
stray dog at a taco stand in Mexico.

Within 24 months, Instagram had 30 million users and was acquired by
Facebook for **$1 billion** in April 2012 — the largest acquisition
of a venture-funded mobile-first company at that time.

The principle: when a feature is the only thing your users actually
love, delete everything else and rebuild around it.

**Related reading:** [Instagram from Burbn pivot](/case-study/instagram-burbn-pivot)
