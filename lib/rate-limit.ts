// In-memory sliding-window rate limiter. Good enough for a single Next.js server
// instance; swap for Upstash Redis (@upstash/ratelimit) once deployed across
// multiple serverless regions where in-memory state isn't shared.
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 20;

const hits = new Map<string, number[]>();

export function checkRateLimit(key: string): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  const existing = (hits.get(key) ?? []).filter((t) => t > windowStart);

  if (existing.length >= MAX_REQUESTS) {
    const retryAfterSeconds = Math.ceil((existing[0] + WINDOW_MS - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  existing.push(now);
  hits.set(key, existing);
  return { allowed: true, retryAfterSeconds: 0 };
}
