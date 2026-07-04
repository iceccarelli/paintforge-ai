# PaintForge — paintforge-ai

Marketing and pilot-recruitment site for **PaintForge**, an autonomous
wall-and-ceiling painting platform in development. The site's job is one
thing: recruit GTA design partners for 2026 pilot deployments.

**Status: pre-launch.** No robots are deployed, no customers exist yet, and
the site says so. All performance numbers are labeled as engineering targets;
all pricing is labeled as target pricing; the dashboard is a clearly-badged
simulated product preview. Case studies stay empty until there is real,
measured field data.

## Tech Stack

- Next.js 16 (App Router) + TypeScript (strict)
- Tailwind CSS 4
- Geist fonts via the bundled `geist` package (no build-time font fetch)
- Framer Motion (ROI calculator + chatbot animations)
- sonner (toasts), lucide-react (icons)
- Deployed on Vercel — builds green with **zero** environment variables

## Structure

```
app/
├── page.tsx              # Homepage: hero, targets, features, ROI model, pilot program, contact
├── pricing/              # Target RaaS pricing + FAQ
├── solutions/            # Segment positioning
├── resources/            # ROI methodology, engineering targets, (empty) case studies
├── dashboard/            # Simulated InteriorFinish OS preview (clearly labeled)
├── legal/privacy/        # PIPEDA-oriented privacy policy
├── legal/terms/          # Terms incl. pre-launch + ROI-model disclaimers
components/
├── Navbar.tsx  Footer.tsx  Chatbot.tsx  ROICalculator.tsx  ContactForm.tsx
```

## Environment Variables (all optional)

| Variable | Purpose | Behaviour if unset |
| --- | --- | --- |
| `NEXT_PUBLIC_FORMSPREE_ID` | Formspree form ID for the pilot inquiry form | Form falls back to a pre-filled `mailto:` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Contact email shown in footer/legal/mailto | Defaults to the founder's email |

There is no auth, no database, and no server-side secret on this site by
design. Add those only when there is a real product behind them.

## Local Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # must pass before pushing
```

## Deploy to Vercel

1. Push to GitHub, import the repo in Vercel (framework auto-detected).
2. Optionally set the two `NEXT_PUBLIC_*` variables above.
3. Deploy. No other configuration required.

## Content Policy for This Repo

Non-negotiable, enforced in review:

- No fabricated customers, logos, testimonials, or case studies.
- No invented metrics ("X projects completed", "trusted by...").
- Performance numbers must be labeled as **engineering targets** until
  validated by measured pilot data.
- Pricing must be labeled as **target/planned** until units are on sale.
