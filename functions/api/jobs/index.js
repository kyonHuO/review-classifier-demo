import { json, fail, sameOrigin, ensureDb, currentUser } from "../../lib/auth.js";
import { normalizeResults, buildCounts, newJobId, newResultId } from "../../lib/jobs.js";

function serialize(job) {
  let counts = {};
  try {
    counts = JSON.parse(job.counts_json || "{}");
  } catch {}
  return {
    id: job.id,
    title: job.title || null,
    total: job.total,
    counts,
    created_at: job.created_at,
  };
}

export async function onRequestGet({ request, env }) {
  const dbError = ensureDb(env);
  if (dbError) return dbError;
  const user = await currentUser(request, env);
  if (!user) return fail(401, "ログインしていません。");

  const { results } = await env.DB.prepare(
    "SELECT id, title, total, counts_json, created_at FROM jobs WHERE user_id = ? ORDER BY created_at DESC LIMIT 100",
  )
    .bind(user.id)
    .all();
  return json({ jobs: (results || []).map(serialize) });
}

export async function onRequestPost({ request, env }) {
  if (!sameOrigin(request)) return fail(403, "不正なリクエストです。");
  const dbError = ensureDb(env);
  if (dbError) return dbError;
  const user = await currentUser(request, env);
  if (!user) return fail(401, "ログインしていません。");

  let body = {};
  try {
    body = await request.json();
  } catch {
    return fail(400, "入力内容を確認してください。");
  }

  const results = normalizeResults(body.results);
  if (!results) return fail(400, "保存できるのは1〜100件の分類結果です。");

  const title = String(body.title || "").trim().slice(0, 120) || null;
  const clientToken =
    typeof body.client_token === "string" && body.client_token
      ? body.client_token.slice(0, 64)
      : null;

  // Idempotency: the same client token returns the already-saved job.
  if (clientToken) {
    const existing = await env.DB.prepare(
      "SELECT id, title, total, counts_json, created_at FROM jobs WHERE user_id = ? AND client_token = ?",
    )
      .bind(user.id, clientToken)
      .first();
    if (existing) return json({ job: serialize(existing), duplicate: true });
  }

  const now = Date.now();
  const jobId = newJobId();
  const counts = buildCounts(results);

  const statements = [
    env.DB.prepare(
      "INSERT INTO jobs (id, user_id, title, total, counts_json, created_at, client_token) VALUES (?, ?, ?, ?, ?, ?, ?)",
    ).bind(jobId, user.id, title, results.length, JSON.stringify(counts), now, clientToken),
  ];
  for (const r of results) {
    statements.push(
      env.DB.prepare(
        "INSERT INTO job_results (id, job_id, row_index, source_id, text, category, candidate, score, margin, reason, nearest, method) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      ).bind(
        newResultId(),
        jobId,
        r.row_index,
        r.source_id,
        r.text,
        r.category,
        r.candidate,
        r.score,
        r.margin,
        r.reason,
        r.nearest,
        r.method,
      ),
    );
  }

  try {
    await env.DB.batch(statements);
  } catch (error) {
    // Race on the same token: return the winning job instead of a 500.
    if (clientToken) {
      const existing = await env.DB.prepare(
        "SELECT id, title, total, counts_json, created_at FROM jobs WHERE user_id = ? AND client_token = ?",
      )
        .bind(user.id, clientToken)
        .first();
      if (existing) return json({ job: serialize(existing), duplicate: true });
    }
    throw error;
  }

  return json({ job: { id: jobId, title, total: results.length, counts, created_at: now } }, 201);
}
