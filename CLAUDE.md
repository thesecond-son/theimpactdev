# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Static marketing site for ImpactDev Digital Solutions, hosted on Vercel (`https://theimpactdev.vercel.app`). There is no build step, package manager, linter, or test suite: every page is a self-contained `.html` file with its own inline `<style>` and `<script>` (only Google Fonts and Bootstrap Icons come from CDNs). Pushing to `main` deploys.

`vercel.json` enables `cleanUrls`, so pages are served without `.html` (e.g. `/storefrontpro`). Canonical/`og:url` tags should use the clean form.

## Pages

- `index.html`, `about.html`, `projects.html`, `cybersecurity-awareness.html`: main site, linked to each other via `*.html` hrefs. Changes to shared parts (nav, footer) must be repeated in each file.
- `storefrontpro.html`: the live StoreFront Pro landing page used for paid ads (the largest and most frequently edited page).
- `storefront-pro-thank-you.html`: post-form confirmation page where conversions fire.
- `storefrontpro-old.html`, `storefrontpro-previous.html`, `storefrontpro-story.html`: archived/alternate versions of the landing page. Don't edit or read them unless asked; `storefrontpro-v2/` is empty.

## StoreFront Pro lead flow (spans multiple files)

1. The form in `storefrontpro.html` POSTs to Formspree (`FORM_ENDPOINT`), saves the submitted details to `sessionStorage` key `sfpLead`, then redirects to `THANK_YOU_PAGE`.
2. `storefront-pro-thank-you.html` reads `sfpLead` to personalise the page and fires the conversion events: GA4 `generate_lead` and Meta `Lead`.
3. The Meta `Lead` is sent twice with the same `event_id` for deduplication: browser-side via `fbq` and server-side via `POST /api/meta-event`. A `sfpMetaLeadSent` sessionStorage flag prevents duplicates on refresh.
4. `api/meta-event.js` is a Vercel serverless function forwarding events to the Meta Conversions API. It needs the Vercel env vars `META_PIXEL_ID` and `META_ACCESS_TOKEN`.

## Tracking IDs

- GA4: `G-817KQV5XYZ` (index, cybersecurity-awareness, storefrontpro, thank-you).
- Meta Pixel: `2013017630104228` (storefrontpro and thank-you pages only), placed in `<head>` right after the Google tag.
