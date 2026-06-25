# REAP West Africa — Website

A clean, professional, fully responsive static website for **REAP West Africa**, a
non-governmental, non-profit organization in Bentol City, Montserrado County, Liberia,
serving children, orphans and young adults affected by Liberia's civil wars since 2003.

## Why this was rebuilt

The previous `index.html` was a ~1 MB machine-generated **Wix** runtime bundle. It could
not be meaningfully edited or improved by hand, and its assets depended on Wix servers.
This version replaces it with a hand-built, dependency-free site that is fast,
accessible, easy to edit, and deployable anywhere (GitHub Pages, Netlify, Vercel, any
static host). The original export is preserved in [`legacy/`](legacy/) for reference.

## Structure

```
index.html          Home
about.html          Who We Are — mission, vision, founder & history, values, leadership
programs.html       Programs — VTC Institute, ECDC, PLI Seminars, Sustainability
impact.html         Our Impact — outcomes, stories, where we work
news.html           News & newsletters
get-involved.html   Donate, volunteer, partner
contact.html        Contact form & details
assets/css/styles.css   Design system (tokens, components, responsive)
assets/js/main.js       Interactions (nav, scroll reveal, stat counters, forms)
legacy/             Original Wix export (archived)
```

## Design

- **Type:** Fraunces (display) + Plus Jakarta Sans (body), via Google Fonts.
- **Palette:** growth green, hope gold and trustworthy slate — fitting for a Liberian
  non-profit (the gold echoes the Liberian flag).
- **No build step, no frameworks, no external image dependencies** — illustrations are
  inline SVG, so the site always renders.
- Responsive, keyboard-accessible, and respects `prefers-reduced-motion`.

## Editing content

All copy lives directly in the HTML files. Faithful, real facts (founded 2003; 18
full-time / 14 part-time staff; Bentol City location; program and newsletter names) come
from the organization's existing site. A few items are **clearly-marked placeholders**
ready for the team to supply:

- **Contact details** — phone number and exact email (`info@reapwestafrica.org` is a
  sensible default; update in the footer/contact page).
- **Leadership** — real names, photos and bios (currently placeholder roles).
- **Donation processor** — the donate flow is wired for an amount selector; connect a
  provider (e.g. Stripe, PayPal, Donorbox) to enable live giving.
- **Forms** — contact/newsletter forms are front-end only; connect to a form service
  (Formspree, Netlify Forms, etc.) on deploy.

## Running locally

It's plain static HTML — open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```
