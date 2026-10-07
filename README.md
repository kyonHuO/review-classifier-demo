# Review Classifier — EmbeddingGemma 2 browser trial

Non-commercial technical demo, independent of Google and reference site 109ichiki.com. No sales, paid API, login, contact collection or backend.

## Routes and operation

- `index.html`: quiet desktop-inspired landing, one dominant “モデルを試す” link
- `try.html`: separate light trial page; visitor text or UTF-8 CSV, ≤100 reviews; actual local neural embeddings; result list and CSV
- No build step. Serve this folder through HTTPS (or localhost for development). ES-module workers do not run reliably from file://.
- The model is downloaded only after the visitor clicks “この内容を分類する”. Cold load is approximately 234 MB including tokenizer/runtime, disclosed as 220–260 MB. No model assets are committed here.

## Exact model and runtime

The requested model is **EmbeddingGemma 2**, released by Google on 2026-10-06. It is not EmbeddingGemma 1 / embeddinggemma-300m.

- Official Google model: https://huggingface.co/google/embeddinggemma-2
- Google launch: https://blog.google/innovation-and-ai/technology/developers-tools/embeddinggemma-2/
- Browser conversion: https://huggingface.co/onnx-community/embeddinggemma-2-ONNX/blob/daa72c51243991dfcaf9f9137d2c573d8f7790c0/README.md
- Runtime support release: https://github.com/huggingface/transformers.js/releases/tag/4.3.1
- Runtime installation docs: https://huggingface.co/docs/transformers.js/installation
- Inference implementation: https://github.com/huggingface/transformers.js/blob/4.3.1/packages/transformers/src/models/embedding_gemma2/modeling_embedding_gemma2.js

`AutoConfig`, with vision/audio configs set to null, preserves external-data-format configuration; `AutoTokenizer` and `AutoModel` load text-only q4. The graph supplies a mean-pooled, normalized 768-dimensional `sentence_embedding`; the app defensively re-normalizes it. The classification prefix is `task: classification | query: ` for both reviews and prototype examples. No custom remote model code is executed.

GPU is chosen only if WebGPU is available. Otherwise WASM/CPU is used. The user can explicitly choose CPU after a GPU error. WASM numThreads=1, compatible with GitHub Pages lacking COOP/COEP. All work runs in a worker; cancellation terminates it and stops outstanding work, retaining completed rows. No rules-based fallback is substituted if actual inference fails.

## Classification method and limits

Sixteen original synthetic bilingual examples form four class centroids: positive, negative, mixed, and neutral/context-insufficient hold. The model encodes examples at first use and encodes each visitor review. Classification uses maximum cosine similarity to a normalized class centroid. If similarity <0.35 or top-two margin <0.025, the app holds the item. These thresholds are experimental, uncalibrated heuristics, not probabilities or quality claims. No earlier benchmark is applicable to this implementation.

At most 100 rows, 2,000 characters per row, 100,000 characters total, UTF-8 CSV ≤1 MB. CSV can have headers/multiple columns, with explicit text-column selection. Quoted multiline fields are preserved. Reviews above 512 tokens are skipped, never silently truncated. Long rows and over-limit files are rejected before model download.

## Privacy and security

App code never sends input/result content to a network endpoint, analytics, logs or persistent storage. Only static application/runtime/model assets are fetched. Model downloads may disclose normal network metadata such as IP address to GitHub, jsDelivr and Hugging Face. The browser may cache model files, never visitor text through this app. Inputs/results remain in memory and are discarded on closing; browser session restoration is controlled by the browser itself.

A restrictive CSP limits scripts/connect destinations and forbids forms, objects and base overrides. User text and CSV filenames are rendered only with textContent, never HTML. CSV output quotes values and neutralizes formula-like beginnings. External links use noreferrer/noopener. No service worker, tracking, API key, or remote inference fallback.

Provenance and licenses: `model-manifest.json`, `THIRD_PARTY_NOTICES.md`, `licenses/`. Listed hashes are provenance references, not independently enforced client-side integrity validation.

## Verification

- JavaScript syntax checked with Node 24
- Pure parser/math/export checks: `node --test tests/core.test.mjs`
- Runtime version/model API verified from pinned upstream sources
- Browser rendering and actual inference: pending public staging QA at this source revision. A passed unit test is not a passed model execution test
- Local browser preview blocked by the execution environment; no attempt to bypass it

Application files: index.html, try.html, styles.css, app.js, core.js, inference.worker.js, model-config.js, model-manifest.json, assets/, licenses/.
