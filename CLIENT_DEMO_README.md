# Deep Health AI — Client Demo

## Overview and purpose

This is a high-fidelity, mobile-first interactive web prototype built directly from the supplied Google Stitch screens. It is intended for stakeholder demonstrations through one web URL; it is not a production clinical product and does not connect to real health APIs.

The prototype preserves all 26 supplied product screens and their Stitch styling. A lightweight app shell adds URL routing, browser history, transitions, timed scan states, overlays, feedback messages, and PWA installation.

## Run locally

Python 3 and PowerShell are the only local requirements.

```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1
```

Open `http://localhost:4173`.

If Node/npm is installed, the equivalent convenience command is `npm run dev`.

## Production build

```powershell
powershell -ExecutionPolicy Bypass -File .\build.ps1
```

The static deployment bundle is written to `dist/`. Preview it with:

```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1 -Root .\dist
```

## Deployment

Upload the contents of `dist/` to any static host (Netlify, Cloudflare Pages, Firebase Hosting, GitHub Pages, S3/CloudFront, or similar). Keep the included folder structure unchanged. Hash-based routes make direct-link refreshes safe without server rewrite rules. HTTPS is required by browsers for PWA installation and service-worker caching outside localhost.

## Supported browsers

- Android Chrome (current and previous major version)
- iPhone Safari on current iOS releases
- Current Chrome, Safari, Edge, and Firefox desktop browsers

The shell uses `100dvh`, safe-area insets, touch-sized controls, a constrained desktop device presentation, and no horizontal page overflow.

## Phone testing

Android: deploy to an HTTPS URL, open it in Chrome, test the complete journey, then use **Add to Home screen** to verify standalone mode.

iPhone: deploy to an HTTPS URL, open it in Safari, test scrolling and fixed navigation, then use **Share → Add to Home Screen**.

## Prototype data and behavior

All displayed profile, wellness, vitals, scan, rewards, notification, plan, and support information is the realistic demonstration data supplied in the Stitch HTML. No data leaves the browser. Scan/processing stages advance on local timers; authentication, purchase, export, referral, and support actions are simulated locally.

## Limitations and future API integration

- Camera scanning is visually simulated; there is no biometric analysis.
- Login, payments, report export, clipboard, referral sharing, and support submission are demonstration interactions.
- Some source artwork and webfonts referenced by Stitch are hosted by Google and require network access on first load; the service worker caches successfully loaded resources where browser policy permits.
- Replace the routing action handlers in `app.js` with application state/API calls when integrating authentication, payments, biometric services, FHIR export, and customer support.
- This prototype must not be used for diagnosis or medical decision-making.

