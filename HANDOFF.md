# Nagiport site preparation handoff

Base: GitHub HEAD `fea3a4b9884b0fcf3f0cfc082faee97c0ae78cd3`, freshly cloned 2026-10-08. No push or publication performed.

Final follow-up: user explicitly assigned the remaining CSV operation QA to themselves and authorized skipping it for this publication attempt. It remains unperformed, not passed. Latest remote fetch confirmed origin/main still at the base above (no conflict). Final static review found no prohibited real name, no video/classifier changes and no active payment/delivery claim. Zero reviews now display `対象なし`, with no 500-yen estimate; the minimum applies only from one review. Both 20MB and 100 columns are explicitly described as this screen's technical limits, not service intake limits. Relevant 12 tests passed again.

Publication attempt: local implementation commit `2bd55e0` was ready, but `git push origin main` failed with `remote: Invalid username or token` / `Authentication failed`. No new authentication, token, credential change or alternative publication route was attempted. Public readback cannot confirm these changes because the push failed. Parent must resolve the existing GitHub authentication before a fresh remote-conflict check and authorized push.

Changes: dark pricing / local CSV estimator at estimate.html; home and demo navigation; CSV preparation steps; non-CSV and recurring-use consultation via nagiport.contact@gmail.com; explicit preparation status and fictional mail-demo disclosure. Existing video, posters, artwork, classifier and trial were not modified. No real-name addition.

Reference price examples: 250 = 500 yen, 1,000 = 2,000, 1,001 = 2,001, 10,000 = 11,000, 10,001 = 11,000.5, 20,000 = 16,000. Fractional amounts deliberately remain unrounded; invoice rounding requires a future decision.

## QA evidence and limits

`node --test tests/estimate.test.mjs tests/video.test.mjs`: 12 passed, 0 failed. Covers progressive boundaries/minimum, malformed and unsafe counts, synthetic sample quoting/multiline/empty bodies, malformed CSV, 10,001-row counting, existing video regression. No classification accuracy rerun or model download.

Chrome initially loaded the local page. The later call was reported as user-aborted. The follow-up QA below supersedes the initial incomplete status for the checks it explicitly lists.

### Follow-up actual-browser QA

At restart the local HTTP server was stopped and the old tab debugger was unattached. Restarting the server and creating a new tab in the existing Chrome restored ordinary operations without authentication or permission changes.

- Inputs 1,000 → 2,000 yen; 1,001 → 2,001; 10,000 → 11,000; 10,001 → 11,000.5. Empty, negative, decimal and alphabetic entries show an error and clear the estimate; a valid subsequent entry recovers.
- Home, estimate and demo at 375 / 768 / 1440 CSS pixels: document scroll widths never exceed viewport width. Screenshots show dark layouts and wrapped navigation. At 375 the estimate panels stack vertically.
- Home → pricing and estimate → demo → home links work. Reset without a selected file restores 1,000 / 2,000 yen and disables CSV columns.
- Review video plays with readyState 4; moving to mail pauses review. Mail starts paused, plays through its native control (readyState 4), then pauses through that control. The fictional / unimplemented mail-service disclosure stays visible.

Still blocked: official Chrome file-chooser setFiles returns `To enable file upload ... enable Allow access to file URLs` for the ChatGPT extension. Retried after the user's message that permission was pressed; the same error remained. No extension setting was changed. Actual CSV selection, column/header changes, reselection, malformed-file recovery and race cancellation remain unverified in browser. Pure parser/sample tests passed but do not substitute for these UI checks. No accuracy rerun.

Screenshots: sibling local `../qa-evidence/` directory contains home-375/768/1440.jpg, estimate-375/768/1440.jpg, estimate-boundary-1440.jpg, demo-375/768/1440.jpg and mail-playing-1440.jpg. QA evidence is not added to public assets. Full-page capture timed out; viewport captures succeeded. Viewport override was reset afterward.

Public URL fetch via web tool failed as inaccessible; repository HEAD is verified but current deployed-page equality is not verified.

## Prototype retrieval blocker

Library known-reference prepare_materialize returned version 0 and initially a signed transfer, then returned workspace_path `/workspace/scratch/c12a521516ab/nagiport-csv-preparation-2026-10-08.zip` with no download URL. That path does not exist on this Windows host. The current official materialization helper failed with `transfer.download_url must be a non-empty string`. No raw URL download or cloud-path assumption was used. Prototype bytes were not read or integrated; independent implementation uses GitHub CSV parser.

## Before launch

Parent performs final review and publication. Complete blocked CSV file-selection UI QA, deployed-page verification and prototype comparison when materialization is available. Confirm a suitable commercial intake host and its current terms before paid transactions, plus formal service/data handling terms, delivery workflow and invoice rounding. Model, payment and production result CSV connection are not implemented. No storage-period or deletion guarantee is promised. No new account, billing agreement, OAuth, key, permissions or customer-data transfer was initiated.
