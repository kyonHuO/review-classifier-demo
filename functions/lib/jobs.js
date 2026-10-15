// Helpers for the per-customer job (classification result) API.

export const MAX_ROWS = 100;
export const CATEGORIES = ["positive", "negative", "mixed", "hold", "skipped"];

export function normalizeResults(raw) {
  if (!Array.isArray(raw)) return null;
  if (raw.length === 0 || raw.length > MAX_ROWS) return null;
  const out = [];
  for (let i = 0; i < raw.length; i++) {
    const r = raw[i] || {};
    const text = typeof r.text === "string" ? r.text : "";
    if (!text) return null;
    const category = CATEGORIES.includes(r.category) ? r.category : "hold";
    out.push({
      row_index: i,
      source_id: r.id === undefined || r.id === null ? null : String(r.id),
      text,
      category,
      candidate: CATEGORIES.includes(r.candidate) ? r.candidate : null,
      score: Number.isFinite(r.score) ? r.score : null,
      margin: Number.isFinite(r.margin) ? r.margin : null,
      reason: typeof r.reason === "string" ? r.reason : null,
      nearest: typeof r.nearest === "string" ? r.nearest : null,
      method:
        typeof r.method === "string"
          ? r.method
          : "Bilingual prototype centroids; uncalibrated similarity, not probability",
    });
  }
  return out;
}

export function buildCounts(results) {
  const counts = {};
  for (const key of CATEGORIES) counts[key] = 0;
  for (const r of results) if (counts[r.category] !== undefined) counts[r.category]++;
  return counts;
}

export function newJobId() {
  return crypto.randomUUID();
}

export function newResultId() {
  return crypto.randomUUID();
}
