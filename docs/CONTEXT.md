# northstar — context document

Last updated: 2026-05-04 (Substack integration shipped, 8 India case studies live)

A living context doc so any future session (Claude or otherwise) can pick up cold. Update it whenever decisions or strategy shift.

---

## What this is

**northstar** is a free, curated library for product managers, founders, and operators. Long-form case studies on the companies that built modern product, plus hand-picked books and YouTube playlists.

- Domain: **pmnorthstar.in** (Hostinger DNS → Vercel)
- Brand wordmark: lowercase `north` + `star` (red), indie-tech aesthetic
- Built solo, indie project, free to use, no paywall

## Who owns what

All accounts on personal email (migrated from company email earlier in May 2026):

| Service | Account | Plan |
|---|---|---|
| GitHub | `kaustubhbrao-apps/pmnorthstar` | personal, free |
| Vercel | personal | Hobby (free) |
| Supabase | "kaustubhbrao-apps's Org" | free |
| Hostinger | personal email | domain hosting only |
| Substack | `pmnorthstar.substack.com` (account: pmnorthstarindia@gmail.com) | free |
| Google Search Console | personal email | verified |

## Tech stack

- **Framework**: Next.js 14.2 (App Router)
- **Hosting**: Vercel
- **Database**: Supabase Postgres
- **ORM**: Prisma
- **Auth**: Custom JWT in cookies (Supabase as DB only, not Supabase Auth)
- **Email** (installed, not actively used): Resend
- **Styling**: Tailwind + CSS variables
- **Fonts**: Space Grotesk (display), JetBrains Mono (code/eyebrows)
- **Brand colors**:
  - Primary red: `#F3123C` (dark mode), `#D4102F` (light mode)
  - Text high-contrast in both modes (see app/globals.css)
- **Local dev bypass**: when `NODE_ENV === "development"`, auth is mocked so dev works even when Supabase is paused

## Repo structure

```
app/
  page.tsx                    # main home, all tabs (home/library/casestudies/learn/saved/favourites)
  layout.tsx                  # root metadata, JSON-LD WebSite + SearchAction
  india/
    page.tsx                  # /india landing — India PM positioning
    layout.tsx                # India-specific metadata + CollectionPage schema
  case-study/[id]/
    page.tsx                  # individual case study (client)
    layout.tsx                # per-case-study metadata + Article + BreadcrumbList JSON-LD, generateStaticParams for all 55
  api/
    auth/                     # login, signup, logout, me, forgot-password
    saved/                    # POST/DELETE for save state
    liked/                    # POST/DELETE for like state
  reset-password/
  sitemap.ts                  # auto-generates 57 URLs
  robots.ts
components/
  Sidebar.tsx                 # desktop nav, includes /india link
  MobileNav.tsx               # mobile chip strip
  TopNav.tsx                  # search + filters + theme toggle
  HeroBanner.tsx              # home hero
  ResourceCard.tsx            # book cards (with Wikipedia author photo fallback)
  CaseStudyCard.tsx           # case study cards (with Google Favicon logo)
  PlaylistCard.tsx            # learn playlist cards (YouTube thumbnails)
  SaveButton.tsx              # save/like, syncs across duplicate cards
  AuthModal.tsx               # login/signup/forgot-password
  ThemeToggle.tsx             # Sun/Moon icon toggle
  SectionRow.tsx              # horizontal scrolling row
data/
  books.ts                    # 30 books (titles, authors, ISBNs/thumbnailURLs, links)
  caseStudies.ts              # 55 case studies, 5 tagged region: "India"
  learn.ts                    # 19 YouTube playlists across 8 categories
  companyDomains.ts           # company → domain map for favicon API
public/
  llms.txt                    # AI search index file
  logo-icon.svg               # square brand icon (red rounded sq + white star)
  logo-cover.svg              # 1500x500 cover with wordmark
prisma/
  schema.prisma               # User, SavedItem, LikedItem
docs/
  CONTEXT.md                  # this file
```

## Content inventory

### Books (30, in `data/books.ts`)
Across PM, Startups, Management. Each has `thumbnailURL` (OpenLibrary by ISBN), external link (Drive or partner), description, rating, year, tags. **Note**: OpenLibrary cover fetches currently fail because they redirect to archive.org which has been down. Cards now use Wikipedia author photos via REST API as primary, with brand-red gradient + initials as final fallback.

### Case studies (55, in `data/caseStudies.ts`)

50 original global cases (cs-1 through cs-50): Apple, Slack, Airbnb, Netflix, Spotify, Figma, Notion, Zoom, Duolingo, Instagram, Dropbox, Hotmail, Twitter, LinkedIn, Pinterest, Uber, TikTok, HubSpot, Clubhouse, PayPal, Amazon, Microsoft, Tesla, Nintendo, Shopify, Google, Stripe, Lego, OpenAI, Canva, Apple (App Store), Google (search), Headspace, Monzo, Superhuman, Kodak, Blackberry, Google (Maps), WeWork, Quibi, Microsoft (Surface), Facebook, Theranos, Myspace, Yahoo, Intercom, Snapchat, Robinhood, WhatsApp, Atlassian.

5 India cases added 2026-05-03 (cs-51 through cs-55):
- cs-51: **Cred** (Design) — exclusivity/design-led fintech
- cs-52: **Razorpay** (Strategy) — gateway → neo-banking platform pivot, $150B+ TPV, 2025 reverse-flip for IPO
- cs-53: **Zerodha** (Strategy) — bootstrapped to ₹4,700cr profit FY24, no VC
- cs-54: **Byju's** (Failure) — $20B collapse, NCLT proceedings 2025
- cs-55: **Paytm** (Strategy) — super-app → collapse → 2025-26 comeback

Each case study: 7 paragraphs, ~3000-4000 words, structured as: context → problem → key decision → execution → results → ripple effects → PM lessons.

**20 more India case studies planned** (in `app/india/page.tsx` upcoming list):
Swiggy, PhonePe, Cult.fit, Nykaa, Meesho, Slice, Groww vs Zerodha — and more to be picked.

**Publishing cadence: 5 every 3 days, total 25 India case studies in 2 weeks.**

### YouTube playlists (19, in `data/learn.ts`)
8 categories: Design, Product Management, Data Analytics, Product Analytics, Marketing, Branding, Startup, Finances. Single-video URLs get YouTube thumbnails; playlist URLs get gradient + emoji.

## Routes

| URL | Purpose |
|---|---|
| `/` | Home — books + case studies + learn previews, has tab nav (home/library/casestudies/learn/saved/favourites) |
| `/india` | India landing page (additive, doesn't replace home) |
| `/case-study/cs-1` through `/case-study/cs-55` | 55 prerendered case study detail pages |
| `/reset-password` | Password reset (auth flow) |
| `/sitemap.xml`, `/robots.txt`, `/llms.txt` | SEO/AI surface |

## Strategic plan

### North star
**Become the go-to PM resource for India first, then expand to global builder platform.** Different positioning by surface:
- Site (`pmnorthstar.in`): global PM library
- `/india`: dedicated India sub-landing, captures India-specific search intent
- Substack newsletter: global voice (not India-led, broader appeal)

### Phased expansion (post-month-12 milestones permitting)

| Phase | Months | Focus | Conditional triggers |
|---|---|---|---|
| 1. Nail PM | Now → May 2027 | 100+ case studies, 10k+ subs, 50k+ MAU | — |
| 2. Layer monetization | May-Aug 2027 | Premium newsletter or course or jobs board | Phase 1 milestones hit |
| 3. NorthStar Startups | Aug-Nov 2027 | Add `/startups`, similar publishing rhythm | $5-15k MRR live |
| 4. NorthStar Marketing | Nov 2027-Feb 2028 | Add `/marketing` | Audience trusts cross-vertical content |
| 5. Design + Branding | Feb-Aug 2028 | Bundle |
| 6. Finance | 2028+ | Last (hardest, biggest competition) |

**All sub-verticals on same domain via `/startups`, `/design` etc** (Option A architecture, not subdomains, not separate domains). Single SEO authority, easy cross-promo, single newsletter.

### Realistic value projection (probability-weighted)

| Outcome | Probability if executing | Site worth at month 24 |
|---|---|---|
| Quit before month 12 | 60% | $2-10k |
| PM-only sustained | 18% | $30-150k |
| Multi-vertical lifestyle business | 12% | $200-700k |
| **High-net multi-vertical** | **7%** | **$1-3M** |
| Outlier breakout | 3% | $5M+ |

**Combined ~22% probability of high-net asset at 24 months.** The variable is execution discipline over 6-12 months when growth feels slow.

## Distribution playbook

### Daily LinkedIn (~2k baseline impressions per post)
- 1 post/day, varied format (case study deep dive, single insight, question, carousel, behind-the-scenes)
- Pattern: hook in body, link in **first comment** (LinkedIn deprioritizes external links in body)
- Always link to **pmnorthstar.in/case-study/cs-X**, not Substack
- DM 5-8 PM friends 30 min before posting, ask for first-hour engagement
- Posting time: 9-10 AM IST Tue/Wed
- Hashtags: 3-5 max, end of post body

### Substack (newsletter)
- 1 article/week on Tuesday morning IST
- 2-3 humor Notes/week (50 drafted, see chat history)
- Notes get more reach at low subscriber count; articles compound at scale
- Custom URL: `pmnorthstar.substack.com` (not yet created)
- Brand voice: lowercase `northstar`, global tone (NOT India-led — Substack should feel international)

### Reddit (careful)
- 9-1 rule: 90% genuine engagement, 10% your content
- 5-10 quality comments/day across PM subs (r/ProductManagement, r/IndianStartups, r/SaaS, etc.)
- 1-2 contextual link mentions per week, never cold-drop
- "Push it somewhere somehow daily" = ban risk; avoid

### Email/newsletter setup status
- ✅ **Substack live** at `pmnorthstar.substack.com`
- ✅ **Custom signup form** (`components/SubscribeForm.tsx`) embedded on:
  - Bottom of every case study page
  - Home page footer (after Learn preview)
  - Bottom of `/india` page (before final CTA)
- Form POSTs directly to Substack's `/api/v1/free` endpoint with `mode: no-cors`
- On success: shows confirmation message ("Check your inbox to confirm")
- Substack handles email confirmation flow + welcome email
- Beehiiv considered but Substack chosen for network effects

## SEO status

### Done
- ✅ Custom domain (`pmnorthstar.in`) on Hostinger DNS
- ✅ All 55 case study URLs prerendered as static HTML
- ✅ Sitemap at `/sitemap.xml` (57 URLs: home + /india + 55 case studies)
- ✅ robots.txt with sitemap reference, disallow /api and /reset-password
- ✅ llms.txt for AI search engines
- ✅ Per-case-study OG metadata (title, description, article OG tags, Twitter card)
- ✅ JSON-LD: WebSite + SearchAction on home, Article + BreadcrumbList on case studies (3-item BreadcrumbList: home → case studies → title), CollectionPage on /india
- ✅ /india metadata with India-specific keywords
- ✅ Google Search Console verified (DNS TXT record at Hostinger)
- ✅ Sitemap submitted to GSC
- ✅ 5 new India URLs requested for indexing manually
- ✅ Internal linking: "Related case studies" section on each detail page
- ✅ AI bot allowlist (GPTBot, ClaudeBot, PerplexityBot, etc.) — implicit via Allow: /

### Outstanding
- Track Search Console Coverage report weekly
- Get backlinks from Indian publications (Inc42, YourStory, MTP, IPMA, etc.)
- Re-validate BreadcrumbList in Search Console after the 2026-05-04 fix lands

### Recent SEO fix (2026-05-04)
Fixed BreadcrumbList "Missing field 'item'" error. Removed the category breadcrumb (no URL pattern existed). Now: `northstar → Case Studies → {title}` (3 valid items).

## Brand decisions

| Decision | Status |
|---|---|
| Wordmark casing | lowercase `northstar` (changed 2026-05-04) |
| Style direction | indie-tech (notion/figma/linear), NOT AI-template feel |
| Avoid | `// slash labels`, `[NN]` brackets, mono everywhere, dual L/D theme buttons, gradient logos |
| Use | proper Title Case section headers, real images (book covers / company logos / playlist thumbs), color identity per category |
| Logo | red rounded square + white star (icon), `north` + `star` two-tone wordmark |
| Theme toggle | single Sun/Moon icon, not two-button |

### Visual design system
- Eyebrow text: `.eyebrow` class — small caps, sans-serif weight 500, letter-spacing 0.14em
- Cards: `.surface` (var(--card-bg) + var(--card-border) hairline), `.playlist-card` (with hover lift + accent border on hover)
- Buttons: `.btn-primary` (filled), `.btn-ghost` (hairline outline), `.btn-accent` (brand red)
- Chips: `.chip` (filter pills, used in TopNav, MobileNav)
- Dotted grid backdrops: `.dot-grid`
- Gradient text: `.gradient-text` (animated 5-color), `.gradient-warm` (orange/yellow), `.gradient-cool` (blue/purple)

## Known issues

- **OpenLibrary book covers**: redirect to archive.org which has been broken since the 2024 cyberattack. Hangs for 30-75s. Workaround: use Wikipedia author photos via REST API (`useAuthorPhoto` hook in ResourceCard, localStorage cached). Final fallback: gradient avatar with author initials.
- **Wikipedia API misses**: not all authors have Wikipedia pages (Marty Cagan, etc.). Falls through to initials avatar.
- **Google Books API**: shared free tier quota always exhausted by other users. Skipped for now. Possible future: get a free GCP API key for one-time cover URL fetch.
- **Clearbit Logo API**: shut down by HubSpot mid-2025. Replaced with Google Favicon API.
- **Substack signup**: form not yet embedded; need user to share Substack URL first.

## Recent meaningful commits

| Commit | What |
|---|---|
| `c55936e` | Rebrand: NorthStar → northstar lowercase |
| `6e7942f` | Fix BreadcrumbList schema (3 items, valid) |
| `1a9ea7d` | Add logo SVG assets (icon + cover) |
| `cb7e78f` | Refresh 4 case studies to 2025-26 data; fix /india sidebar; link /india from main |
| `ff4813b` | Update Paytm case study for 2025-26 comeback |
| `517d0bd` | Add 5 India case studies |
| `eb1457a` | Auto-syndicate India cases to /india |
| `b905196` | Add /india landing page |
| `2416b95` | SEO: sitemap, robots, OG, JSON-LD, per-case metadata |
| `5315737` | Add llms.txt for AI search |

## Pending / next moves

1. ✅ Substack live at `pmnorthstar.substack.com` (done 2026-05-04)
2. ✅ Custom signup form embedded on case studies + home + /india (done 2026-05-04)
3. ✅ Added 3 more India case studies: Swiggy (cs-56), PhonePe (cs-57), Nykaa (cs-58) — total 8 India cases live
4. **Write next India case studies** at the 3-day mark: Cult.fit, Meesho, Slice, Groww vs Zerodha — 4 remain in queue, then expand the queue further
5. **First Substack post**: write the welcome / intro post (~150 words) introducing the publication

## v3 backlog (post-month-12, after PM is nailed)

- **CMS for case studies** — currently all case study content is in `data/caseStudies.ts` and requires a code push to update. v3 should add a lightweight admin interface (e.g., admin route gated by user role, Markdown editor, content lives in DB or in MDX files). Goal: user can publish a new case study without touching code. Keep this scoped — not a full Notion-like system, just a Markdown-in-Markdown-out editor with preview. Likely Supabase-backed table with role-based auth.
- Author photo manual override field (for cases where Wikipedia API misses)
- Newsletter "subscribers" dashboard (read-only mirror of Substack stats)
- Per-vertical sub-section structure (`/startups`, `/marketing`, etc) — see Phased expansion above
- B2B layer (sell case studies as a curriculum to companies)
4. **Continue weekly publishing** after the 25-case batch
5. **Audit at month 6**: if not at 25-60k MAU + 1.5k+ subs, plan needs adjustment
6. **Monetization layer at month 12-15** if PM milestones met

## Conventions / preferences (from chat history)

- User prefers honest, direct feedback (not sycophantic agreement)
- Wants tactical specificity over abstract advice
- Values quality over volume (rejected "publish 25 in one day" plan)
- Wants both LinkedIn distribution AND SEO compounding (not either/or)
- Reddit cadence: careful, not spam-prone
- LinkedIn cadence: daily, varied formats
- Brand: lowercase, indie-tech, no AI-template tells
- Substack tone: global (not India-only)
- /india page tone: India-specific, manifesto-style
- Time horizon: 24 months for serious value
- Multi-vertical expansion: yes, but only after month 12+ PM milestones met

## How to use this doc

If you (or a future Claude session) are picking up cold:

1. Skim "What this is", "Tech stack", "Routes" — gives you the shape
2. Read "Strategic plan" — explains the direction
3. Read "Distribution playbook" + "Pending / next moves" — tells you what's actively in motion
4. Check "Known issues" before debugging — saves you re-discovering the same problems
5. Use "Recent meaningful commits" as a rough timeline of what's been changed

To update: edit this file when major decisions, milestones, or strategic shifts happen. Commit alongside the change. Date the "Last updated" line at the top.
