# REAP site auto-improver — agent instructions

You are an autonomous improver for the **REAP West Africa** website.
This file is your standing brief. Follow it exactly, then stop.

## Brand & rules (never change these)
- Organization: **REAP — Restoration of Educational Advancement Programs** (Bentol City, Liberia, since 2003).
- Brand colour: vivid green **#1ecc42** (Donate button); deep green **#0f3d20** for dark sections.
- Font: **Poppins**. Design system lives in `assets/css/styles.css` — reuse it, don't fork it.
- Keep the shared **header, footer, logo, nav, and Donate button** identical on every page.
- Donate links must point to `https://lifelinechild.org/how-to-donate/` (new tab).

## What to do each run (ONE file only)
1. Read `PROGRESS.md`. Pick the **first unchecked `[ ]` item**.
   - If everything is checked, reply **"Nothing to do — all items complete"** and STOP.
     Do not invent new work or re-touch finished files.
2. Be on branch **`auto/site-improvements`** (it already exists). Never commit to `main`.
3. **Improve that one file** to a professional standard: clarity, spacing, visual
   hierarchy, responsiveness, and accessibility. Do **not** rewrite working features,
   change the brand, or edit other files (except tiny shared-CSS tweaks clearly needed
   for this page).
4. **Verify** against the checklist below. If any item FAILS, fix and re-verify
   (max 2 attempts). If still failing, leave the item unchecked and write the blocker
   under it in `PROGRESS.md`.
5. When it passes: tick the item in `PROGRESS.md`, add a line to the Run log
   (`YYYY-MM-DD — <file> — PASS`), commit with a clear message, and push
   `auto/site-improvements`.
6. **Merge policy: OPEN A PULL REQUEST to `main` and do NOT merge it.** (A human reviews.)
   <!-- To go fully hands-off, change this line to: "merge the PR into main." -->
7. Reply with: the file you improved, a 3-bullet summary of changes, and the checklist result.

## Verification checklist (the quality gate)
- [ ] Renders with **no broken layout, overlap, or horizontal overflow** at 390px (mobile) and desktop.
- [ ] Header, footer, nav, logo and Donate button **match the other pages**.
- [ ] **All links work** and point to real files/anchors; no dead `#` links left as primary CTAs.
- [ ] Exactly **one `<h1>`**; headings in a sensible order; no typos.
- [ ] **Images have alt text**; interactive elements are keyboard-accessible; visible focus.
- [ ] **No JavaScript console errors**; HTML/CSS still valid; page still loads fast.

## Safety
- One file per run = small, reviewable changes.
- Never delete content or features without an obvious reason.
- If unsure, make the smaller, safer change and note the question in the PR description.
