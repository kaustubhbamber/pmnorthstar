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

// Block loopback, RFC1918 private ranges, link-local, cloud metadata, and
// the wildcard-DNS services commonly abused to point a public-looking name
// at an internal IP. This is the SSRF guard for a server-side fetcher;
// it's not exhaustive (DNS rebinding still needs a post-resolve check) but
// it closes the obvious holes. IPv6 literals have no "." so they're
// already rejected by the dot rule in normalizeUrl.
function isPrivateHost(host: string): boolean {
  if (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host.endsWith(".internal") ||
    host === "metadata.google.internal" ||
    host === "169.254.169.254"
  ) {
    return true;
  }
  // nip.io / sslip.io resolve arbitrary hostnames to a caller-chosen IP.
  if (/(^|\.)(nip\.io|sslip\.io)$/.test(host)) return true;
  // Dotted-quad IPv4 in loopback / private / link-local ranges.
  const m = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (m) {
    const a = Number(m[1]);
    const b = Number(m[2]);
    if (a === 0 || a === 127 || a === 10) return true;
    if (a === 192 && b === 168) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
  }
  return false;
}

// Accept inputs like "pmnorthstar.in", "https://pmnorthstar.in", "  HTTP://X "
//, return a usable URL or null. Defaults to https.
export function normalizeUrl(raw: string): URL | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const u = new URL(withProto);
    // Only audit real public http(s) web origins.
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    const host = u.hostname.toLowerCase();
    if (!host.includes(".")) return null; // reject "localhost", "foo", etc.
    if (isPrivateHost(host)) return null; // block SSRF to internal targets
    return u;
  } catch {
    return null;
  }
}

// Read a response body but stop after maxBytes. fetchWithTimeout's
// AbortController only bounds time-to-first-byte, not total body size, so
// a malicious or broken origin could otherwise stream gigabytes into the
// serverless function's memory via res.text(). Returns "" when an explicit
// Content-Length already exceeds the cap (caller treats empty body as a
// non-auditable page).
export async function readCapped(
  res: Response,
  maxBytes = 3_000_000,
): Promise<string> {
  const declared = Number(res.headers.get("content-length") ?? "");
  if (Number.isFinite(declared) && declared > maxBytes) {
    try {
      await res.body?.cancel();
    } catch {
      /* noop */
    }
    return "";
  }
  const reader = res.body?.getReader();
  if (!reader) return res.text();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    total += value.byteLength;
    if (total > maxBytes) {
      try {
        await reader.cancel();
      } catch {
        /* noop */
      }
      break;
    }
  }
  const cap = Math.min(total, maxBytes);
  const buf = new Uint8Array(cap);
  let off = 0;
  for (const c of chunks) {
    if (off >= cap) break;
    const slice = c.subarray(0, cap - off);
    buf.set(slice, off);
    off += slice.byteLength;
  }
  return new TextDecoder().decode(buf);
}
