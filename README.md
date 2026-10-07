# Review classification — UI prototype

口コミを見渡すための画面プロトタイプです。商品名は未確定で、「REVIEW CLASSIFIER」は説明用のラベルです。

## Preview

Open `index.html` in a modern browser. This is a static, client-only page with no dependencies, build step, account, API key, analytics, or backend.

For a local HTTP server, run `python3 -m http.server 4173` in this directory, then open `http://localhost:4173`.

## What works

- Eight clearly labeled synthetic Japanese/English review samples
- Fixed illustrative results: positive, negative, mixed, or hold
- Sample-result filters and CSV export
- Local text/one-column UTF-8 CSV counting and preview, limited to the first 100 items
- Category explanations, dark/light themes, responsive menu
- Desktop window movement by dragging or focusing a title bar and pressing arrow keys; Shift+arrows moves farther, Home resets the window
- Reduced-motion support and keyboard navigation

## Product boundary

This is a screen demonstration, not a working AI classification service. Sample labels are predefined, not generated from visitor input. The page has no classifier or API connection, and makes no accuracy claim. User text and CSV files are only processed in the browser; this code does not send or store them. Reloading clears input. Do not enter personal or confidential information.

There is no registration, payment, contact form, email submission, or active trial intake. Pricing and service availability are not set.

## Files

- `index.html`: page structure and Japanese copy
- `styles.css`: original desktop-inspired design and responsive layouts
- `app.js`: fixed samples, CSV handling and UI behavior
- `assets/voice-knot.svg`: original wireframe artwork
- `assets/favicon.svg`: original icon

All artwork and implementation were newly created. No third-party characters, illustrations, production bundles, or downloaded website assets are included.

## Verification status

JavaScript syntax and 15 static/CSV unit checks passed on 2026-10-07. Rendered desktop/mobile and browser interaction checks could not be completed in the build environment because browser execution/preview was restricted. Do not treat this as a visually verified production release.
