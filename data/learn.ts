export type LearnCategory =
  | "Design"
  | "Product Management"
  | "Data Analytics"
  | "Product Analytics"
  | "Marketing"
  | "Branding"
  | "Startup"
  | "Finances";

export type LearnFilter = "All" | LearnCategory;

export interface Playlist {
  id: string;
  title: string;
  channel: string;
  category: LearnCategory;
  description: string;
  url: string;
  thumbnail: string;
  videos?: number;
  level?: "Beginner" | "Intermediate" | "Advanced";
  tags?: string[];
}

export const learnCategories: LearnCategory[] = [
  "Design",
  "Product Management",
  "Data Analytics",
  "Product Analytics",
  "Marketing",
  "Branding",
  "Startup",
  "Finances",
];

export const learnCategoryColors: Record<LearnCategory, string> = {
  Design: "#50C878",
  "Product Management": "#9B8FFF",
  "Data Analytics": "#4FC3F7",
  "Product Analytics": "#FF8A65",
  Marketing: "#F5C842",
  Branding: "#EC407A",
  Startup: "#F3123C",
  Finances: "#26A69A",
};

export const learnCategoryEmojis: Record<LearnCategory, string> = {
  Design: "🎨",
  "Product Management": "📐",
  "Data Analytics": "📊",
  "Product Analytics": "📈",
  Marketing: "📣",
  Branding: "✨",
  Startup: "🚀",
  Finances: "💰",
};

export const playlists: Playlist[] = [
  // ── DESIGN ──────────────────────────────────────────────────────────────
  {
    id: "ln-design-1",
    title: "Design Fundamentals",
    channel: "YouTube",
    category: "Design",
    description: "Curated playlist covering visual design principles, layout, and craft.",
    url: "https://www.youtube.com/playlist?list=PLAwxTw4SYaPlTr1MmjkAZXVv8Su2CfY7D",
    thumbnail: "🎨",
  },
  {
    id: "ln-design-2",
    title: "UX & UI Design Course",
    channel: "YouTube",
    category: "Design",
    description: "Step-by-step lessons on user experience and interface design.",
    url: "https://www.youtube.com/playlist?list=PLlHtucAD9KT19ckHqXpPSStZOyDSq9AW-",
    thumbnail: "🎨",
  },
  {
    id: "ln-design-3",
    title: "Design Talk",
    channel: "YouTube",
    category: "Design",
    description: "A standout talk on design thinking and craft.",
    url: "https://youtu.be/c0zhLzcVJRI",
    thumbnail: "🎨",
  },

  // ── PRODUCT MANAGEMENT ──────────────────────────────────────────────────
  {
    id: "ln-pm-1",
    title: "Product Management Crash Course",
    channel: "YouTube",
    category: "Product Management",
    description: "End-to-end PM curriculum covering discovery, delivery, and growth.",
    url: "https://youtube.com/playlist?list=PLEiEAq2VkUUIE8vrshd0pKiYl7PKpINPe",
    thumbnail: "📐",
  },
  {
    id: "ln-pm-2",
    title: "AI Product Management",
    channel: "YouTube",
    category: "Product Management",
    description: "Building products in the AI era — frameworks, examples, and patterns.",
    url: "https://youtu.be/KjYCEiBTHFo",
    thumbnail: "📐",
  },
  {
    id: "ln-pm-3",
    title: "PM Masterclass",
    channel: "YouTube",
    category: "Product Management",
    description: "A deep masterclass on the craft of product management.",
    url: "https://youtu.be/abA-QZzbon0",
    thumbnail: "📐",
  },

  // ── DATA ANALYTICS ──────────────────────────────────────────────────────
  {
    id: "ln-data-1",
    title: "Data Analytics Course",
    channel: "YouTube",
    category: "Data Analytics",
    description: "From raw data to insights — SQL, dashboards, and storytelling.",
    url: "https://youtube.com/playlist?list=PLjVLYmrlmjGdRs1sGqRrTE-EMraLclJga",
    thumbnail: "📊",
  },
  {
    id: "ln-data-2",
    title: "Data Analysis Bootcamp",
    channel: "YouTube",
    category: "Data Analytics",
    description: "Hands-on playlist for analyst skills, tools, and case studies.",
    url: "https://www.youtube.com/playlist?list=PLUaB-1hjhk8FE_XZ87vPPSfHqb6OcM0cF",
    thumbnail: "📊",
  },

  // ── PRODUCT ANALYTICS ───────────────────────────────────────────────────
  {
    id: "ln-pa-1",
    title: "Product Analytics Course",
    channel: "YouTube",
    category: "Product Analytics",
    description: "Metrics, funnels, retention, and how PMs reason with data.",
    url: "https://youtube.com/playlist?list=PLZubw3yovSsj75rZjNHG0taO43QTppMN8",
    thumbnail: "📈",
  },
  {
    id: "ln-pa-2",
    title: "Product Analytics Talk",
    channel: "YouTube",
    category: "Product Analytics",
    description: "A practical talk on building and using product metrics.",
    url: "https://youtu.be/N-Igkw7__z0",
    thumbnail: "📈",
  },

  // ── MARKETING ───────────────────────────────────────────────────────────
  {
    id: "ln-mkt-1",
    title: "Marketing Fundamentals",
    channel: "YouTube",
    category: "Marketing",
    description: "Positioning, funnels, channels — the modern marketing toolkit.",
    url: "https://youtube.com/playlist?list=PLByMooBE3Mif9_X7UNOX2LAjqTpzc1NbB",
    thumbnail: "📣",
  },
  {
    id: "ln-mkt-2",
    title: "Marketing Crash Course",
    channel: "YouTube",
    category: "Marketing",
    description: "Long-running playlist on marketing strategy and tactics.",
    url: "https://youtube.com/playlist?list=PL14BB28B5FE99A733",
    thumbnail: "📣",
  },

  // ── BRANDING ────────────────────────────────────────────────────────────
  {
    id: "ln-brand-1",
    title: "Branding Course",
    channel: "YouTube",
    category: "Branding",
    description: "Logos, identity systems, and how to build a brand.",
    url: "https://youtube.com/playlist?list=PL-Sv3bpjab1tl3U-kWJZBFmsH7tcnYEYY",
    thumbnail: "✨",
  },
  {
    id: "ln-brand-2",
    title: "Brand Strategy Playlist",
    channel: "YouTube",
    category: "Branding",
    description: "Strategy, naming, voice, and visual identity.",
    url: "https://youtube.com/playlist?list=PLzKJi2GjpkEHa6aTy6PmvbUTKoFUes-DQ",
    thumbnail: "✨",
  },

  // ── STARTUP ─────────────────────────────────────────────────────────────
  {
    id: "ln-startup-1",
    title: "Startup Course",
    channel: "YouTube",
    category: "Startup",
    description: "Founder-grade playlist on building, fundraising, and scaling.",
    url: "https://youtube.com/playlist?list=PL5q_lef6zVkaTY_cT1k7qFNF2TidHCe-1",
    thumbnail: "🚀",
  },
  {
    id: "ln-startup-2",
    title: "Startup Fundamentals",
    channel: "YouTube",
    category: "Startup",
    description: "0 to 1 — picking ideas, talking to users, shipping.",
    url: "https://youtube.com/playlist?list=PLAwxTw4SYaPnxzSuovATBMrNowGaaEBmW",
    thumbnail: "🚀",
  },

  // ── FINANCES ────────────────────────────────────────────────────────────
  {
    id: "ln-fin-1",
    title: "Finance for Founders",
    channel: "YouTube",
    category: "Finances",
    description: "Cap tables, fundraising, runway — finance for product builders.",
    url: "https://youtube.com/playlist?list=PLUkh9m2BorqndWimijiJ-VCAXjJUrzJQU",
    thumbnail: "💰",
  },
  {
    id: "ln-fin-2",
    title: "Foundations of Finance",
    channel: "YouTube",
    category: "Finances",
    description: "Foundational finance concepts every operator should know.",
    url: "https://youtube.com/playlist?list=PLUl4u3cNGP63B2lDhyKOsImI7FjCf6eDW",
    thumbnail: "💰",
  },
];

// Round-robin interleave so the "All" feed rotates through topics
// instead of showing 3 Design then 3 PM then 2 Data, etc.
function interleaveByCategory(items: Playlist[]): Playlist[] {
  const byCategory = new Map<LearnCategory, Playlist[]>();
  for (const item of items) {
    const list = byCategory.get(item.category) ?? [];
    list.push(item);
    byCategory.set(item.category, list);
  }
  const result: Playlist[] = [];
  let i = 0;
  let pushed = true;
  while (pushed) {
    pushed = false;
    for (const cat of learnCategories) {
      const arr = byCategory.get(cat);
      if (arr && arr[i]) {
        result.push(arr[i]);
        pushed = true;
      }
    }
    i++;
  }
  return result;
}

export const interleavedPlaylists: Playlist[] = interleaveByCategory(playlists);

export function getPlaylistsByCategory(filter: LearnFilter): Playlist[] {
  if (filter === "All") return interleavedPlaylists;
  return playlists.filter((p) => p.category === filter);
}
