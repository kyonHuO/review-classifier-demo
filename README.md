# Review Classifier — EmbeddingGemma 2 browser trial

Service-preparation information and technical demo, independent of Google and reference site 109ichiki.com. No order acceptance, payment, paid API, login, contact collection or backend. Email links open the visitor's mail app for a pre-service consultation.

## Service preparation candidate (not published)

`estimate.html` adds progressive tax-inclusive pricing, a local CSV count estimator, steps and consultation links. Home and video pages link to it; the dark artwork, videos and use cases remain. `estimate.js` reuses only the existing CSV parser, with no model download or inference. File contents are not sent, stored in browser storage or embedded in consultation emails. Empty body rows are omitted; duplicates are counted individually. The visible preview uses textContent.

Prices: first 1,000 rows at 2 yen, next 9,000 at 1 yen, subsequent rows at 0.5 yen, minimum 500 yen. Fractional 0.5 yen amounts stay unrounded in the reference estimate. Invoice rounding is undecided. The service has no row intake cap. This browser file reader has a disclosed 20 MiB / 100-column technical limit; manual counts remain available for larger files. Browser number safety limits are validation constraints, not intake limits.

No launch discount is advertised. Subscription/non-CSV usage is consultation only. Model integration, payment, production result CSV delivery and commercial data handling terms remain unconnected. Do not launch paid intake on GitHub Pages from this candidate.

## Routes and operation

- `index.html`: restored full-bleed dark wireframe home, matching the pre-video 7ae73a design, with one dominant “デモを見る” link to `demo.html`
- `demo.html`: separate black video screen with the review clip, imagined use cases, a fictional mail-classification clip, native controls and a back-to-home link
- `try.html`: separate light trial page; visitor text or UTF-8 CSV, ≤100 reviews; actual local neural embeddings; result list and CSV
- No build step. Serve this folder through HTTPS (or localhost for development). ES-module workers do not run reliably from file://.
- The model is downloaded only after the visitor clicks “この内容を分類する”. Cold load is approximately 234 MB including tokenizer/runtime, disclosed as 220–260 MB. No model assets are committed here.

## Separate dark video page

`assets/review-classifier-demo.mp4` is the exact approved 12-second silent H.264/yuv420p clip, 1600×900 at 30fps, 604,396 bytes, SHA256 `f1bda946e86f00962d47ad96dd06391696f72e4b638f31899257486cfdf351bb`. It is copied unchanged. The lightweight JPEG poster is extracted from that same clip.

The first four synthetic examples illustrate previously verified results. The subsequent 96-card visual repeats those four examples to suggest volume; it is not a recording of 96 distinct inputs or measured processing speed/accuracy. This is disclosed in the video, in visible adjacent copy and in its text description.

The native video controls support playback/pause/seeking/fullscreen. Playback is muted and inline; the clip contains no audio stream. `preload="metadata"` and a poster provide an initial static view. The small video may start automatically only when on screen and reduced-motion/data-saver preferences do not request otherwise. Explicit pause is respected; leaving the viewport or hiding the tab pauses playback. Model/runtime assets are still never loaded by the home page.

The approved video already passed actual public-browser playback, pause/resume and looping checks on commit 989caf3ea5269a926287757a2951fa0cf717a828. The latest requested navigation revision restores the previous abstract home and moves the same video markup to a separate black `demo.html` page. The home loads neither video nor model/runtime files. Existing `try.html` and classifier/runtime files remain accessible by direct URL and unchanged; they are not the main public CTA. The review video and poster bytes are reused unchanged. The two-page route passed public-browser navigation checks on commit 5f17782419ff2189c6f5689c07e08f9f40b90934. The playback controller is now extended to manage the additional mail video independently; the mail video requires explicit initial play.

## Imagined use cases and mail illustration

Below the existing review video, the page presents two examples under `利用シーン（想定例）`: organizing product/store reviews by sentiment, and organizing incoming messages by purpose. They describe possible workflows, not customer testimonials or deployed customer results.

The mail illustration uses original fictional sentences and four example categories: 問い合わせ, 注文・配送, 請求・支払い, 確認待ち. It is a scripted visual sample, not a model inference recording, accuracy benchmark, or speed measurement. `サンプル演出` remains visible beside and within the clip. No real email data, Gmail access, upload form, contact intake or server inference was added.

The second video uses `preload="none"` and starts only from the visitor's native playback controls. Both videos are muted/inline and pause when outside the viewport or the page is hidden. The first video retains its existing preference-aware automatic behavior; reduced-motion/data-saver preferences prevent initial automatic playback. Manual pause is respected. The source includes focused mocked-DOM playback tests in `tests/video.test.mjs`; public-browser checks are performed after deployment.

## Interface naming and cache behavior

The home page fills the viewport edge to edge with no outer white margin/border; its singular primary action is “デモを見る”. It opens the dedicated dark video page rather than model initialization. The existing separate light trial workspace is preserved but is no longer linked from the main flow. The visible application uses generic classification wording. Model/vendor names and model-ID columns are omitted from the ordinary UI and results CSV. Exact provenance remains in this technical README, `model-manifest.json`, notices/licenses and implementation source; the underlying model is unchanged.

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

Application files: index.html, demo.html, home-video.js, try.html, styles.css, app.js, core.js, inference.worker.js, model-config.js, model-manifest.json, assets/, licenses/.
