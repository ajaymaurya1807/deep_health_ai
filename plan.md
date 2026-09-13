# Deep Health AI Prototype Implementation

## Screens implemented

All 26 supplied application screens are routed: splash, language, three onboarding screens, sign in, registration, forgot/reset password, OTP, home, face positioning, live scan, processing, scan success, report summary, wellness score telemetry, plans, purchase confirmation, payment success, wallet, refer and earn, profile, notifications, settings/privacy, and help/support.

The supplied standalone logo and avatar artwork are reused as assets rather than treated as routes.

## Navigation flow

- Splash → language → onboarding → sign in/registration → home
- Home → face positioning → live scan → processing → success → report → telemetry
- Home/profile → plans → purchase confirmation → payment success → scan or home
- Profile → reports, wallet, referrals, notifications, settings, and support
- Browser back/forward and in-design back controls preserve navigation history

## Components and interactions

- Responsive mobile app/device shell
- Reusable route/action map
- Stitch-screen host preserving the supplied UI exactly
- Loading state, toast feedback, modal scrim, and reusable bottom sheet
- Timed splash, scan, and processing transitions
- Simulated FHIR export, referral-copy, support-ticket, and logout results
- Desktop presentation frame without changing the mobile layouts

## Mock data

The supplied Stitch screen content is the local demonstration dataset. It covers user profile, biometric metrics, wellness reports, subscriptions, transactions, rewards, alerts, privacy settings, and support. No backend is used.

## Assets used

- Every supplied `code.html` screen is retained as the visual implementation source.
- Every supplied reference screenshot remains available for fidelity comparison.
- The supplied Deep Health AI logo artwork is reused for the app/PWA icon.
- The supplied profile portrait and all existing Stitch-referenced imagery are preserved.

## PWA configuration

Added installable manifest metadata, standalone portrait display, theme/background colors, app icon, Apple mobile metadata, and a cache-first fallback service worker.

## Responsive behavior

- Full-screen phone layout using dynamic viewport units
- 320–414px fluid width support with source-screen scrolling
- iOS safe-area handling for app overlays
- Centered 430px device frame on larger browser widths
- No outer horizontal scrolling

## QA completed

- Production bundle built successfully into `dist/`
- App shell, script, manifest, and a representative routed screen verified with HTTP 200 responses
- All screen entries mapped to supplied directories
- Browser history, timed steps, overlays, and primary flow action mapping reviewed
- Static asset folder copied in full (58 source files)

## Known limitations

- Clinical scanning, authentication, purchasing, export, sharing, and ticket submission are intentionally mocked.
- Stitch source HTML loads Google-hosted fonts and some images; an internet connection is recommended for the first presentation load.
- The prototype is a client demonstration and not a medically validated application.
