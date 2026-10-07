# Review Classifier — EmbeddingGemma 2 browser trial

Non-commercial technical demo, independent of Google and reference site 109ichiki.com. No sales, paid API, login, contact collection or backend.

## Routes and operation

- `index.html`: full-bleed dark landing without an outer white frame, one dominant “文章を分類する” link
- `try.html`: separate light trial page; visitor text or UTF-8 CSV, ≤100 reviews; actual local neural embeddings; result list and CSV
- No build step. Serve this folder through HTTPS (or localhost for development). ES-module workers do not run reliably from file://.
- The model is downloaded only after the visitor clicks “この内容を分類する”. Cold load is approximately 234 MB including tokenizer/runtime, disclosed as 220–260 MB. No model assets are committed here.

## Interface naming and cache behavior

The home page fills the viewport edge to edge with no outer white margin/border; its primary action remains singular. The separate light trial workspace is unchanged. The visible application uses generic classification wording. Model/vendor names and model-ID columns are omitted from the ordinary UI and results CSV. Exact provenance remains in this technical README, `model-manifest.json`, notices/licenses and implementation source; the underlying model is unchanged.

The app does not download model assets on the landing page or request persistent-storage permission. Initial classification remains explicit. Transformers.js may reuse assets from browser cache if they were saved and remain present; this is not permanent storage and is not shared across all browsers/devices. The UI only says the engine is ready after actual successful model/prototype initialization in that page. It does not claim a verified cache hit or promise that a future launch never downloads again. No backend, paid service or new authentication was added.

## Exact model and runtime

The requested model is **EmbeddingGemma 2**, released by Google on 2026-10-06. It is not EmbeddingGemma 1 / embeddinggemma-300m.

- Official Google model: https://huggingface.co/google/embeddinggemma-2
- Google launch: https://blog.google/innovation-and-ai/technology/developers-tools/embeddinggemma-2/
- Browser conversion: https://huggingface.co/onnx-community/embeddinggemma-2-ONNX/blob/daa72c51243991dfcaf9f9137d2c573d8f7790c0/README.md
- Runtime support release: https://github.com/huggingface/transformers.js/releases/tag/4.3.1
- Runtime installation docs: https://huggingface.co/docs/transformers.js/installation
- Inference implementation: https://github.com/huggingface/transformers.js/blob/4.3.1/packages/transformers/src/models/embedding_gemma2/modeling_embedding_gemma2.js

`AutoConfig`, with vision/audio configs set to null, preserves external-data-format configuration; `AutoTokenizer` and `AutoModel` load text-only q4. The graph supplies a mean-pooled, normalized 768-dimensional `sentence_embedding`; the app defensively re-normalizes it. The classification prefix is `task: classification | query: ` for both reviews and prototype examples. No custom remote model code is executed.

GPU is chosen only if WebGPU is available. Otherwise WASM/CPU is used. The user can explicitly choose CPU after a GPU error. WASM numThreads=1, compatible with GitHub Pages lacking COOP/COEP. For CPU only, the app selects the exact matched standard ort-wasm-simd-threaded.mjs/.wasm files from the same pinned runtime; the default asyncify reduced-type build failed to register GatherBlockQuantized during browser QA. WebGPU keeps the default asyncify runtime. All work runs in a worker; cancellation terminates it and stops outstanding work, retaining completed rows. No rules-based fallback is substituted if actual inference fails.

## Classification method and limits

Sixteen original synthetic bilingual examples form four class centroids: positive, negative, mixed, and neutral/context-insufficient hold. The model encodes examples at first use and encodes each visitor review. Classification uses maximum cosine similarity to a normalized class centroid. If similarity <0.35 or top-two margin <0.025, the app holds the item. These thresholds are experimental, uncalibrated heuristics, not probabilities or quality claims. No earlier benchmark is applicable to this implementation.

At most 100 rows, 2,000 characters per row, 100,000 characters total, UTF-8 CSV ≤1 MB. CSV can have headers/multiple columns, with explicit text-column selection. Quoted multiline fields are preserved. Reviews above 512 tokens are skipped, never silently truncated. Long rows and over-limit files are rejected before model download.

## Privacy and security

App code never sends input/result content to a network endpoint, analytics, logs or persistent storage. Only static application/runtime/model assets are fetched. Model downloads may disclose normal network metadata such as IP address to GitHub, jsDelivr and Hugging Face. The browser may cache model files, never visitor text through this app. Inputs/results remain in memory and are discarded on closing; browser session restoration is controlled by the browser itself.

A restrictive CSP limits scripts/connect destinations and forbids forms, objects and base overrides. User text and CSV filenames are rendered only with textContent, never HTML. CSV output quotes values and neutralizes formula-like beginnings. External links use noreferrer/noopener. No service worker, tracking, API key, or remote inference fallback.

Provenance and licenses: `model-manifest.json`, `THIRD_PARTY_NOTICES.md`, `licenses/`. Listed hashes are provenance references, not independently enforced client-side integrity validation.

## Verification

Actual browser verification on 2026-10-07 used deployed commit `9016e6cdea7959e7f2440a09ecc0cf38f2b7bc29` at https://kyonhuo.github.io/review-classifier-demo/try.html .

- Desktop landing and separate trial page rendered in the cloud Chrome browser; the single landing CTA navigated correctly
- Two new synthetic Japanese/English reviews were processed by actual EmbeddingGemma 2 on single-threaded standard WASM/CPU in 11 seconds including preparation. Their cosine scores were 0.821490 and 0.796723, with margins 0.010923 and 0.002646; both were held by the unchanged heuristic
- A warm rerun with three additional synthetic positive/negative/mixed reviews finished in 2 seconds and returned three corresponding categories with displayed similarity values 0.930, 0.904 and 0.892
- Real CSV export completed; the 948-byte file was read back and contained both original inputs, computed scores/margins, labels, model ID and pinned revision at that tested commit. The subsequent requested naming-only change removes model ID/revision from ordinary CSV exports and keeps provenance in technical files
- Real cancellation stopped a three-row rerun after one completed result, preserved input and partial results, and restored controls. An already-started restart then completed all three rows in 11 seconds
- 101-row rejection was verified in the browser before inference; 100-row boundaries, quoted/multicolumn CSV, formula neutralization and other limits were checked in local tests
- Final source checks: 31 repository parser/math/export tests, 25 independent parser/mocked-DOM tests, 2 mocked-worker tests, and JavaScript syntax checks passed using Node 24.19.0
- The earlier `c3a73edad9509e286d3aeae263818885f67b8d93` deployment failed under the default asyncify runtime because its reduced-type CPU registry omitted GatherBlockQuantized. The standard-WASM fix resolved that observed error without changing the model, prototypes, thresholds or precision

These are smoke/behavior checks, not an accuracy benchmark. No earlier benchmark or accuracy rate applies. WebGPU inference, mobile rendering/devices, all browsers, cold-download timing and peak memory remain unverified. The browser identified itself as cloud Chrome; an exact browser version was not available through the allowed inspection route. Screenshots were inspected through the browser tool; no screenshot files are claimed in this source package. CSV import was tested through pure parsing/mocked UI, not an actual file chooser in this browser session.

The input-privacy statement is grounded in inspection of the application code: user text is not interpolated into network requests, logs or persistent storage. The smoke test did not perform an exhaustive network-egress audit of the third-party runtime. Only synthetic text was used in QA. Model/runtime provenance is in `model-manifest.json`; expected hashes are documented rather than independently enforced by the browser loader.

Local preview browser execution was restricted, so rendered/runtime verification used the authorized public GitHub Pages deployment. No local-browser restriction was bypassed.

Application files: index.html, try.html, styles.css, app.js, core.js, inference.worker.js, model-config.js, model-manifest.json, assets/, licenses/.
