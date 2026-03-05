# ⭐ NorthStar — PM Resource Hub

A modern, dark-themed resource hub for Product Managers, Founders, and Leaders. Built with Next.js 14 (App Router) and Tailwind CSS, inspired by the YouTube Music aesthetic.

## ✨ Features

- **30 Curated Books** — 10 each on Product Management, Startups, and Management (Marketing/Finance)
- **YouTube Music-style UI** — Dark sidebar, top navigation, horizontal scrolling carousels
- **Category Filters** — Interactive filter chips to narrow by category
- **Search** — Real-time search across titles, authors, tags, and descriptions
- **Hero Banner** — Featured book spotlight with book cover art
- **Trending Section** — Highlighted hot picks with a gold "HOT" badge
- **Case Studies Grid** — Alternate card layout for deep-dive picks
- **Click → YouTube** — Every card opens the associated YouTube/external link in a new tab
- **Stats Strip** — Quick overview (total books, trending count, categories)

## 🗂️ Project Structure

```
northstar/
├── app/
│   ├── globals.css          # Global styles, CSS variables, animations
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Main home page (all logic here)
├── components/
│   ├── HeroBanner.tsx       # Featured book hero section
│   ├── ResourceCard.tsx     # Book card (4 variants: default, featured, list, case-study)
│   ├── SectionRow.tsx       # Horizontal scrolling carousel row
│   ├── Sidebar.tsx          # Left sidebar navigation
│   └── TopNav.tsx           # Top navigation bar with search & filters
├── data/
│   └── books.ts             # 30 books dataset + helper functions
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm / yarn / pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/northstar.git
cd northstar

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build for Production

```bash
npm run build
npm start
```

## 📚 Books Dataset

### Product Management (10 books)
| # | Title | Author |
|---|-------|--------|
| 1 | Inspired | Marty Cagan |
| 2 | Continuous Discovery Habits | Teresa Torres |
| 3 | The Lean Product Playbook | Dan Olsen |
| 4 | Empowered | Marty Cagan |
| 5 | Shape Up | Ryan Singer |
| 6 | Product-Led Growth | Wes Bush |
| 7 | Obviously Awesome | April Dunford |
| 8 | The Mom Test | Rob Fitzpatrick |
| 9 | Hooked | Nir Eyal |
| 10 | Escaping the Build Trap | Melissa Perri |

### Startups (10 books)
| # | Title | Author |
|---|-------|--------|
| 1 | Zero to One | Peter Thiel |
| 2 | The Lean Startup | Eric Ries |
| 3 | The Hard Thing About Hard Things | Ben Horowitz |
| 4 | Blitzscaling | Reid Hoffman |
| 5 | Traction | Gabriel Weinberg |
| 6 | The Startup Owner's Manual | Steve Blank |
| 7 | Venture Deals | Brad Feld |
| 8 | Hacking Growth | Sean Ellis |
| 9 | Lost and Founder | Rand Fishkin |
| 10 | The $100 Startup | Chris Guillebeau |

### Management — Marketing & Finance (10 books)
| # | Title | Author |
|---|-------|--------|
| 1 | High Output Management | Andrew Grove |
| 2 | Measure What Matters | John Doerr |
| 3 | Good to Great | Jim Collins |
| 4 | Principles | Ray Dalio |
| 5 | The Innovator's Dilemma | Clayton Christensen |
| 6 | Thinking, Fast and Slow | Daniel Kahneman |
| 7 | The Psychology of Money | Morgan Housel |
| 8 | This Is Marketing | Seth Godin |
| 9 | No Rules Rules | Reed Hastings |
| 10 | The E-Myth Revisited | Michael E. Gerber |

## 🔌 Backend Integration

The frontend is designed to be backend-agnostic. To connect your API:

1. **Replace static data** — Swap `data/books.ts` with API calls to your backend
2. **Add auth** — Wrap the layout with your auth provider
3. **Add env vars** — Create `.env.local` with `NEXT_PUBLIC_API_URL=...`

Example API integration in `app/page.tsx`:
```ts
// Replace static import
const books = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/books`).then(r => r.json());
```

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--north-bg` | `#0A0A0F` | Page background |
| `--north-surface` | `#111118` | Sidebar, header |
| `--north-card` | `#16161F` | Cards |
| `--north-accent` | `#6C63FF` | Primary CTA, active state |
| `--north-gold` | `#F5C842` | Trending badges |
| `--north-text` | `#E8E8F0` | Primary text |
| `--north-muted` | `#7A7A9A` | Secondary text |

**Fonts:** Playfair Display (display) + DM Sans (body) + DM Mono (mono)

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: lucide-react
- **Language**: TypeScript
- **Images**: next/image with remote patterns

## 📄 License

MIT
