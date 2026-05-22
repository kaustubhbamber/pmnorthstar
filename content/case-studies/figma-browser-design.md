---
id: "cs-6"
slug: "figma-browser-design"
company: "Figma"
title: "Figma's Browser-First Design Revolution"
category: "Product"
description: "Figma bet on the browser when every design tool was desktop-only. Real-time multiplayer collaboration — like Google Docs for design — created a new category."
outcome: "Adobe acquisition attempt at $20B blocked by regulators. 4M+ users."
year: 2016
tags:
  - "collaboration"
  - "SaaS"
  - "design tools"
logo: "🎨"
faqs:
  - question: "How did Figma beat Sketch?"
    answer: "Figma won by building real-time multiplayer collaboration as the default — not a feature. Sketch was native desktop with no easy way to retrofit collaboration; Figma was browser-first and built for it. Once teams adopted Figma, switching back required losing the collaboration layer entirely."
  - question: "Why was the Figma-Adobe deal blocked?"
    answer: "Adobe announced a $20B acquisition of Figma in 2022. UK and EU regulators raised antitrust concerns about Adobe absorbing its main competitor in design tools. Adobe and Figma terminated the deal in December 2023 — Adobe paid Figma a $1B breakup fee. Figma stayed independent and is now worth more."
  - question: "Is Figma free?"
    answer: "Figma has a generous free tier — unlimited personal files, up to 3 collaborative team files, browser access. Paid tiers (Professional, Organization, Enterprise) add unlimited team files, advanced permissions, design systems support, and SSO. The free tier was the wedge that beat Sketch's paid-only model."
---

When Dylan Field dropped out of Brown University in 2012 to start Figma, the design tool market was dominated by Sketch on Mac and Adobe's Creative Suite on both Mac and Windows. Both were desktop applications, both saved files locally, and both required designers to export screenshots or PDFs when they wanted feedback from non-designers. The design process was littered with friction: version conflicts when two designers edited the same file, email chains full of annotated screenshots, and developers who could never find the latest mockup. Field's thesis was that design was fundamentally a collaborative activity trapped in single-player tools, and that the browser, not the desktop, was the right platform to fix this.

The problem was not just inconvenient workflows but a structural disconnect between designers and the rest of their teams. Product managers, engineers, marketers, and executives all had opinions about design, but the tools excluded them from the process. A PM who wanted to leave feedback on a button's placement had to schedule a meeting, share a screen, and point with their cursor while the designer tried to interpret the feedback. A developer who needed a spacing value had to message the designer and wait for a response. Design tools had become bottlenecks in the product development process, slowing down teams that needed to move fast. Figma saw that making design accessible to everyone on the team was not just a feature but a fundamental rethinking of how design work gets done.

The key decision was to build entirely in the browser, using WebGL for rendering, at a time when the conventional wisdom held that professional creative tools could only deliver acceptable performance as native desktop applications. This was not a casual bet; it required building a custom rendering engine from scratch because the browser's built-in Canvas and DOM APIs were far too slow for complex design work. Field and his co-founder Evan Wallace spent over three years on this engineering foundation before launching publicly in 2016. The investment was a gamble that browser technology would continue improving and that the collaboration benefits would outweigh any performance trade-offs.

The execution was technically extraordinary. Figma's WebGL renderer could handle designs with thousands of layers at 60 frames per second in a browser tab, matching or exceeding the performance of native desktop applications. The multiplayer collaboration feature, seeing other people's cursors moving in real time as they edited the same file, was built on operational transformation algorithms similar to those powering Google Docs. The team also built a component system, auto-layout capabilities, and a developer handoff mode that let engineers inspect designs and copy CSS values without any export step. Every feature was designed to collapse the distance between designing and shipping.

Figma's growth was viral by design. Every time a designer sent a Figma URL to a PM or engineer for feedback, they were introducing a new user to the platform. No download was required, no account was necessary to view a file, and commenting was instant. This meant Figma spread within organizations through shared links, following the same bottom-up adoption pattern that had powered Slack and Dropbox. Within four years, Figma had captured significant market share from Sketch and had become the default design tool at many of the world's largest technology companies. Adobe attempted to acquire Figma for $20 billion in 2022, but EU regulators blocked the deal on competition grounds.

The ripple effects of Figma's success reshaped the design tools industry and the broader product development workflow. Sketch pivoted to add collaboration features but struggled to match Figma's browser-native experience. Adobe accelerated development of its own collaborative tools. More importantly, Figma changed the role of design in product organizations: when anyone can open a design file and leave feedback, design becomes a team sport rather than a siloed discipline. This cultural shift, enabled by the tool, was arguably more significant than any technical feature.

For product managers, Figma demonstrates two powerful lessons. First, the most durable competitive moat is not technology but workflow integration. When your product becomes the medium through which work happens, switching costs become nearly infinite because the cost of migration includes not just data but habits, processes, and organizational knowledge. Second, the best way to grow a B2B product is to make it useful to people who are not your primary user. By making design accessible to PMs, engineers, and stakeholders, Figma created advocates across entire organizations, not just within design teams.
