// In-memory cache for audit results. Keyed by normalized URL.
//
// V1 scope: process-local Map with a 24h TTL. On Vercel this means each
// serverless instance has its own cache, so a popular site might still
// run 2-3 audits per day across instances, that's fine. When we
// outgrow this, move to KV or Redis.

import type { AuditResult } from "./types";

interface CacheEntry {
  result: AuditResult;
  expiresAt: number;
}

const TTL_MS = 24 * 60 * 60 * 1000;
const MAX_ENTRIES = 500; // hard cap so we don't leak memory

const store = new Map<string, CacheEntry>();

export function cacheKey(url: URL): string {
  // Normalize: lowercase host, drop trailing slash on root, drop fragment.
  const host = url.hostname.toLowerCase();
  const path = url.pathname === "/" ? "" : url.pathname.replace(/\/$/, "");
  return `${url.protocol}//${host}${path}${url.search}`;
}

export function getCached(key: string): AuditResult | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (entry.expiresAt < Date.now()) {
    store.delete(key);
    return null;
  }
  return entry.result;
}

export function setCached(key: string, result: AuditResult): void {
  // Evict oldest if we're at the cap.
  if (store.size >= MAX_ENTRIES) {
    const oldestKey = store.keys().next().value;
    if (oldestKey) store.delete(oldestKey);
  }
  store.set(key, { result, expiresAt: Date.now() + TTL_MS });
}
