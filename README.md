# PaintForge | paintforge.ai

**The Precision Robotic Painting Platform.**  
Deploy autonomous robots that paint walls and ceilings at 4× human speed with perfect mil consistency. Same mobile base as DryForge. Finish GTA projects weeks earlier.

This is a production-ready, enterprise-grade Next.js 16 SaaS website built to dominate the construction automation space in Ontario and beyond. It matches the tone, visual hierarchy, and credibility of aws.amazon.com while being ruthlessly aggressive in the interior finishing niche.

## Tech Stack (as specified)
- Next.js 16 (App Router) + TypeScript (strict)
- Tailwind CSS 4 + custom premium design system (AWS-inspired)
- shadcn/ui patterns + Radix UI primitives
- Framer Motion for premium animations
- React Hook Form + Zod (forms)
- Clerk for authentication (Google, LinkedIn, Microsoft, email magic links, organizations)
- Supabase (Postgres) client ready + example schema
- Fully optimized for Vercel deployment
- WCAG AA, mobile-first, fast performance

## Project Structure
```
app/
├── dashboard/          # Protected fleet command center (Clerk)
├── pricing/
├── solutions/
├── resources/
├── layout.tsx          # ClerkProvider + Navbar + Footer + Chatbot
├── page.tsx            # Full high-converting homepage
├── globals.css         # Premium enterprise styles
components/
├── Navbar.tsx
├── Footer.tsx          # 9 social icons
├── Chatbot.tsx         # Context-aware floating assistant
├── ROICalculator.tsx   # Fully interactive live calculator
middleware.ts           # Clerk route protection
```

## Local Development Setup

1. **Clone & Install**
   ```bash
   git clone <your-repo>
   cd paintforge
   npm install
   ```

2. **Environment Variables**
   Create `.env.local`:
   ```env
   # Clerk (required for auth + dashboard)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxx
   CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxx

   # Supabase (optional for production data layer)
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

   # Optional: Vercel / Analytics
   ```

3. **Run Dev Server**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000

## Clerk Configuration (Required)
1. Go to [clerk.com](https://clerk.com) → Create application "PaintForge"
2. Enable providers: Google, LinkedIn, Microsoft, Email magic links
3. Enable Organizations (for contractor teams)
4. Copy `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`
5. In Clerk dashboard → Paths → set sign-in/sign-up URLs if needed
6. The `/dashboard` route is protected via `middleware.ts` + `SignedIn` / `auth.protect()`

## Supabase Setup (Optional but Recommended)
1. Create project at supabase.com
2. Run the following SQL in SQL Editor to create core tables:

```sql
-- Core schema for PaintForge (example)
create table robots (
  id uuid primary key default gen_random_uuid(),
  serial_number text unique not null,
  status text check (status in ('idle','painting','maintenance','offline')) default 'idle',
  current_job_id uuid,
  last_seen timestamptz default now(),
  base_id text,                    -- shared with DryForge
  location text
);

create table jobs (
  id uuid primary key default gen_random_uuid(),
  site_name text not null,
  sqft integer,
  coats integer default 3,
  status text default 'scheduled',
  progress integer default 0,
  robot_ids uuid[],
  start_date date,
  target_end_date date,
  created_at timestamptz default now()
);

create table spray_reports (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references jobs(id),
  avg_mil numeric(4,1),
  std_dev numeric(3,2),
  coverage_map_url text,
  photos jsonb,
  environmental_logs jsonb,
  created_at timestamptz default now()
);

create table quotes (
  id uuid primary key default gen_random_uuid(),
  customer_name text,
  sqft integer,
  robots_quoted integer,
  monthly_raas numeric,
  bundling_discount boolean default false,
  created_at timestamptz default now()
);
```

3. Add RLS policies as needed for production.

## Deploy to Vercel (One-Click Ready)
1. Push to GitHub
2. Import project in [vercel.com](https://vercel.com)
3. Add all environment variables from `.env.local`
4. Deploy — automatic production URL at `paintforge.ai` (or your custom domain)

Vercel will automatically handle:
- Edge functions for Clerk middleware
- Image optimization
- Fast global CDN

## GitHub Push Instructions
```bash
git init
git add .
git commit -m "feat: launch PaintForge enterprise SaaS site"
git branch -M main
git remote add origin https://github.com/your-org/paintforge.git
git push -u origin main
```

Then connect the repo to Vercel.

## Key Features Implemented
- **Exact structure** as DryForge spec: sticky header, hero, stats, features, how it works, ROI section + **fully functional interactive calculator**, use cases, technology, pricing with bundling incentives, resources, final CTA, footer with exactly 9 social icons.
- **Floating Chatbot**: Professional, context-aware, 6 quick replies, smart responses, typing indicator, beautiful UX.
- **Interactive ROI Calculator**: Live-updating with realistic Ontario numbers, bundling toggle, payback, monthly savings.
- **Dashboard**: Beautiful mock ops center with fleet status, jobs, bundling metrics. Protected by Clerk.
- **Ruthless positioning**: "4× Human Speed", "Stop fighting painter shortages", strong GTA focus, aggressive bundling promotion.
- **Premium design**: AWS-like whitespace, typography, micro-interactions, orange accent on deep navy, generous cards.
- **SEO + Accessibility**: Proper metadata, structured data ready, WCAG AA, keyboard friendly, fast.

## Production Notes
- Replace placeholder images / OG image in `/public`
- Connect real Supabase in dashboard for live data (easy extension)
- Add real video embed for "Watch Demo" (Vimeo or YouTube)
- The chatbot is mock but feels best-in-class; swap with real LLM if desired
- All forms use proper validation-ready patterns

This site is ready to convert enterprise buyers the moment it launches. Built to feel like a billion-dollar category-defining product from the first second.

**PaintForge — Finish faster. Finish better. Dominate your market.**
