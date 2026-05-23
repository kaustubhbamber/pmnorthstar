// Shared helpers for the CheckIt audit engine.

export async function fetchWithTimeout(
  url: string,
  init: RequestInit = {},
  timeoutMs: number,
): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...init,
      signal: ctrl.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "CheckItBot/1.0 (+https://pmnorthstar.in/checkit)",
        ...(init.headers ?? {}),
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

export function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, "");
}

export function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

// Accept inputs like "pmnorthstar.in", "https://pmnorthstar.in", "  HTTP://X "
//, return a usable URL or null. Defaults to https.
export function normalizeUrl(raw: string): URL | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const u = new URL(withProto);
    if (!u.hostname.includes(".")) return null; // reject "localhost", "foo", etc.
    return u;
  } catch {
    return null;
  }
}
