# Review classification — non-commercial UI study

デザイン・操作確認用の非商用プロトタイプです。参考サイト109ichiki.comとは関係ありません。実際のサービス提供・申込み受付は行っていません。

“REVIEW CLASSIFIER” is a descriptive prototype label, not a finalized product name. This page is a technical experiment in desktop-inspired UI, sample presentation, and responsive controls. All artwork and code were newly created; no third-party characters, illustrations, logos, production bundles, or downloaded website assets are included.

## Preview

Open `index.html` in a modern browser. This static, client-only page has no dependencies, build step, account, API key, analytics, or backend.

For a local HTTP server, run `python3 -m http.server 4173` in this directory, then open `http://localhost:4173`.

## Demonstrated interface

- Eight clearly labeled synthetic Japanese/English review samples
- Fixed illustrative labels: positive, negative, mixed, or hold
- Sample-result filters and CSV export
- Local text/one-column UTF-8 CSV counting and preview, limited to the first 100 items
- Category explanations, dark/light themes, responsive menu
- Desktop window movement by dragging or focusing a title bar and pressing arrow keys; Shift+arrows moves farther, Home resets the window
- Reduced-motion support and keyboard navigation

## Scope and privacy

This is a screen demonstration, not a working AI classification service. Sample labels are predefined, not generated from visitor input. There is no classifier or API connection and no accuracy claim.

User text and CSV files are only processed in the browser for a local preview. This code does not collect, transmit, or store their contents. Reloading clears input. Do not enter personal or confidential information.

There is no sales offer, registration, payment, contact form, email submission, active trial intake, or collection of contact details.

## Files

- `index.html`: page structure and Japanese copy
- `styles.css`: original desktop-inspired design and responsive layouts
- `app.js`: fixed samples, CSV handling and UI behavior
- `assets/voice-knot.svg`: original wireframe artwork
- `assets/favicon.svg`: original icon

## Verification status

JavaScript syntax and 15 static/CSV unit checks passed on 2026-10-07. Rendered desktop/mobile and browser interaction checks could not be completed in the build environment because browser execution/preview was restricted. Do not treat this as a visually verified production release.
