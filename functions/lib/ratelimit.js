// Fixed-window rate limiting backed by D1. Used to slow down auth abuse.

export function clientKey(request) {
  // CF-Connecting-IP is set by Cloudflare; local dev may not provide it.
  return request.headers.get("CF-Connecting-IP") || request.headers.get("x-forwarded-for") || "unknown";
}

export async function rateLimit(env, key, limit, windowMs) {
  const now = Date.now();
  const row = await env.DB.prepare(
    "SELECT count, window_start FROM auth_attempts WHERE key = ?",
  )
    .bind(key)
    .first();

  if (!row || now - row.window_start > windowMs) {
    await env.DB.prepare(
      "INSERT INTO auth_attempts (key, count, window_start) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET count = 1, window_start = ?",
    )
      .bind(key, now, now)
      .run();
    return { allowed: true, retryAfterMs: 0 };
  }

  if (row.count >= limit) {
    return { allowed: false, retryAfterMs: row.window_start + windowMs - now };
  }

  await env.DB.prepare("UPDATE auth_attempts SET count = count + 1 WHERE key = ?")
    .bind(key)
    .run();
  return { allowed: true, retryAfterMs: 0 };
}

export function tooMany(retryAfterMs) {
  const seconds = Math.max(1, Math.ceil(retryAfterMs / 1000));
  return new Response(
    JSON.stringify({ error: "試行回数が多すぎます。しばらく待ってから再度お試しください。" }),
    {
      status: 429,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
        "retry-after": String(seconds),
      },
    },
  );
}
