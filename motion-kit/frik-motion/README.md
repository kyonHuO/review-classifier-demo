# Nagiport Motion Atlas

An independent Japanese design exploration for Nagiport Motion Kit. This static page is not an official template, certification, or partnership of the Digital Agency, Apple, Google, or Figma.

## Open

Serve the repository's `docs` directory with any static HTTP server, then open `/frik-motion/`. There is no build step, package installation, account, or backend requirement. The parent navigation points to `../`.

## What is interactive

- A manually started 12-second reel with play/pause, replay, a keyboard-accessible scrubber, and three scene buttons. Playback stops after one pass and pauses when the reel leaves the viewport or the document is hidden. It does not automatically resume.
- Clear, Calm, and Expressive modes change the component demo's color, corner geometry, shadows, and interaction motion. Arrow keys, Home, and End switch the mode tabs.
- Three fictional ideas can be expanded, marked as checked, filtered, undone, and reset. There is no actual submission, purchase, account action, or remote persistence.
- The operating system's reduced-motion preference is respected initially and follows system changes until the visitor explicitly changes the on-page setting. The toggle affects the current page only. Reduced motion removes animated transitions and uses static reel scenes without hiding content.

## Actual Figma motion source

Design file: https://www.figma.com/design/g6JaCl0Nv8uFRnYzJEa5rI?node-id=3-2

The hero's three cards contain the actual source shapes and motion tracks. The surrounding editorial page, reel arrangement, scene framing, controls, and interactive workspace are an original web adaptation.

| Source node | Hero element | Source geometry | Exported tracks |
| --- | --- | --- | --- |
| `3:10` | `[data-node-id="3:10"]` | Blue 112 × 112 rounded rectangle, radius 10 | Opacity and Y translation |
| `3:15` | `[data-node-id="3:15"]` | `calm.svg`, 112 × 112 circle | Opacity and scale |
| `3:20` | `[data-node-id="3:20"]` | `expressive.svg`, 101 × 101 rounded star within the 112 × 112 source wrapper | Opacity, rotation, and scale |

`figma-motion-source.json` preserves the motion export and shared cohort metadata from Figma. `figma-motion.css` uses its CSS animation declarations and keyframe values verbatim, including the sampled spring easings. The three source nodes share the same 12,000 ms timeline. `atlas.js` pauses these CSS animations and drives their `currentTime` together to provide playback controls. Layout and rotation of the surrounding cards are on separate wrappers and do not overwrite source transforms.

The source cohort is looping; the web player deliberately stops after one pass so that playback stays under visitor control. The initial poster samples the source at 1.2 seconds; the first Play starts from zero. Scene boundaries are at 0, 4, and 8 seconds, with the original animation onsets preserved at 0.4, 4.4, and 8.4 seconds. Under reduced motion all three shapes show their final, static geometry.

The exported SVGs are original design assets from this Figma file. No official reference-site logos, typefaces, or brand assets are used. This page does not depend on a Figma embed or video download.

The workspace's compact CSS and Web Animations transitions are separate Nagiport interpretations, not exports of the hero tracks, implementations of the references' full design systems, or a physical spring solver. They are intentionally described separately.

## References and interpretation

- Digital Agency: https://www.digital.go.jp/policies/servicedesign/designsystem and https://design.digital.go.jp/dads/
  - Clear information hierarchy, legible contrast, visible focus, and keyboard access inform the baseline design.
- Apple Human Interface Guidelines: https://developer.apple.com/design/human-interface-guidelines/motion
  - Purposeful motion, continuity, control, and a reduced-motion alternative inform the Calm study.
- Material Design 3: https://m3.material.io/styles/motion
  - Responsive expression and the current spring-based motion approach inform the Expressive study. The local demo's easing is not claimed to be Google's official motion engine or token implementation.

All three modes keep the same content, functionality, and accessible controls. The labels are this project's names, not an official taxonomy of the referenced systems. The mode comparison does not rank the systems or imply that accessibility belongs to only one of them.

## Privacy and assets

There are no application network calls, analytics, form submissions, cookies, local-storage writes, external fonts, or CDN scripts. All interface state stays in memory and resets on reload. Loading the page and its assets involves ordinary requests to the static host. Opening a reference link visits that external site in a new tab. The Content Security Policy disallows connection and form endpoints.

Files: `index.html`, `atlas.css`, `atlas.js`, `figma-motion.css`, `figma-motion-source.json`, `calm.svg`, `expressive.svg`, `mark.svg`, and this note.

## Browser support and testing scope

The source spring curves use CSS `linear()` easing and individual `translate` / `scale` properties. The rotation uses a registered CSS custom property. Current browsers with those features are the target; older browsers may simplify the source motion. Reduced-motion static shapes remain available without those features.

The source animations are authored for modern browser rendering. Actual browsers and devices should be checked before treating this exploration as a production accessibility or browser-compatibility certification. No such certification is claimed.
