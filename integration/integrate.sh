#!/usr/bin/env bash
# PaintForge integration — run from the repo root after unzipping there.
set -euo pipefail

echo "==> 1/5 Wiring contact form to /api/apply (idempotent)"
node integration/wire-contact-form.mjs

echo "==> 2/5 Installing new dependencies (zod, resend)"
npm install zod resend --save

echo "==> 3/5 Building website"
npm run build

echo "==> 4/5 Testing Python package"
cd packages/paintforge-sim
python -m pip install -e ".[dev]" --quiet \
  || python -m pip install -e ".[dev]" --quiet --break-system-packages
python -m pytest -q
cd ../..

echo "==> 5/5 Committing"
git add -A
git -c user.name="${GIT_AUTHOR_NAME:-Vincenzo Grimaldi}" -c user.email="${GIT_AUTHOR_EMAIL:-vince.ceccarelli@gmail.com}" commit -m "feat(platform): software+hardware integration — paintforge-ai Python package, /api/apply backend, CI pipeline

- packages/paintforge-sim: pydantic-based simulation, ROI, and coverage
  path-planning package (4 tests green, wheel builds, CLI works).
  Audited and repaired from generated scaffold: fixed illegal extras
  marker, invalid PyPI classifier, missing README/LICENSE, phantom
  calculate_payback export, deprecated utcnow, and a fleet-sizing bug
  that made robots slower than large manual crews
- app/api/apply: zod-validated Resend-backed pilot inquiry endpoint;
  returns 503 when unconfigured so the form falls back to
  Formspree/mailto — never fakes a send
- ContactForm: tries /api/apply first, existing fallback intact
- .github/workflows/ci.yml: eslint + next build; pytest + wheel build
  + twine check; PyPI publish on GitHub release (PYPI_API_TOKEN secret)
- vercel.json: security headers (nosniff, frame-deny, referrer,
  permissions policy)"

echo ""
echo "DONE. Review with 'git show --stat', then: git push"
echo "Optional Vercel env vars: RESEND_API_KEY, CONTACT_EMAIL"
