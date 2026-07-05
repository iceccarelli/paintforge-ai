# Integration bundle — what this adds (and what it deliberately does not touch)

## Adds (new files only — zero overwrites of existing site code)
- `packages/paintforge-sim/` — the `paintforge-ai` Python package: simulation,
  ROI model, coverage path planning, CLI. Tested, wheel-buildable,
  PyPI-publishable via CI on GitHub release.
- `app/api/apply/route.ts` — Resend-backed pilot inquiry endpoint with
  zod validation and best-effort rate limiting. Honest 503 when
  RESEND_API_KEY is unset (form falls back to Formspree/mailto).
- `lib/schemas.ts` — shared zod schema for the form + API.
- `.github/workflows/ci.yml` — web lint+build, Python test+build, PyPI
  publish on release.
- `vercel.json` — security headers.

## Touches (one file, via idempotent script)
- `components/ContactForm.tsx` — submit handler tries `/api/apply` first.

## Rejected from the generated zip (would have broken or clobbered the repo)
- Wholesale replacements of page.tsx, layout.tsx, Navbar, Footer, Chatbot,
  ROICalculator, globals.css, package.json, tsconfig, next.config, README
- drizzle config referencing a schema file that was never generated
- Server action importing @upstash/ratelimit absent from its own deps
- 20+ unused dependencies (@vercel/kv/blob/postgres, ai-sdk/openai,
  playwright, husky, vitest, react-pdf, jspdf, radix suite, drizzle)
- Broken eslint --ext script (removed in ESLint 9)
- Nonexistent PyPI classifier, BSL license claim without a LICENSE file,
  fake engineering@paintforge.ai contact, "used by contractors" claim

## Env vars (all optional)
- `RESEND_API_KEY` — enables direct email delivery from /api/apply
- `CONTACT_EMAIL` — destination inbox (defaults to founder email)
