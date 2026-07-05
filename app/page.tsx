import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  Check,
  Zap,
  Target,
  Shield,
  Clock,
  Users,
  Award,
} from "lucide-react";
import { ROICalculator } from "@/components/ROICalculator";
import { HeroReel } from "@/components/HeroReel";
import { ApplyCTA } from "@/components/ApplyModal";

export default function PaintForgeHomepage() {
  return (
    <div className="overflow-hidden">
      {/* HERO — Ken Burns image reel behind, randomized per visit */}
      <section id="top" className="relative min-h-[88vh] flex items-center py-20 bg-[#0A2540] text-white">
        <HeroReel />
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 text-xs tracking-[2px] font-medium mb-6">
            IN DEVELOPMENT • GTA PILOT PROGRAM • 2026
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-[-0.05em] leading-[1.05] mb-6">
            Robotic Painting,
            <br />
            Built for Contractors
            <br />
            Who Finish First.
          </h1>

          <p className="max-w-3xl mx-auto text-lg sm:text-xl md:text-2xl text-white/80 tracking-tight mb-10">
            PaintForge is an autonomous wall-and-ceiling painting platform in
            development, engineered to multiply crew output with closed-loop
            coating consistency. We are recruiting a small group of GTA design
            partners for 2026 pilot deployments.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <ApplyCTA
              label="Apply as a Design Partner"
              className="btn-primary text-lg px-10 py-4 flex items-center gap-3 group"
            />
            <a
              href="#roi-calculator"
              className="btn-secondary text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10 flex items-center gap-2"
            >
              Model Your ROI
            </a>
          </div>
          <p className="mt-4 text-xs text-white/50">
            Limited pilot cohort • Preferred pricing for founding partners
          </p>
        </div>

        <a
          href="#features"
          aria-label="Scroll to features"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-colors animate-scroll-cue"
        >
          <ChevronDown size={28} />
        </a>
      </section>

      {/* ENGINEERING TARGETS BAR */}
      <div className="stats-bar py-5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 text-sm">
            <div className="flex items-center gap-8 text-white/80">
              <div>Engineering targets for pilot units</div>
              <div className="hidden md:block h-3 w-px bg-white/30" />
            </div>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-white text-sm font-medium">
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg">4×</span> target crew
                output
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg">±2 mil</span> target
                thickness tolerance
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg">1,000+</span> sqft/coat/day
                per robot (design spec)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <section id="features" className="max-w-7xl mx-auto px-6 pt-20 pb-16">
        <div className="section-header mb-12">
          <div className="kicker mb-3">
            WHAT WE ARE BUILDING
          </div>
          <h2 className="section-heading">
            Precision Robotic Painting.
            <br />
            Designed Around Real Job Sites.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Zap,
              title: "Large-Field Airless Spraying",
              href: "/#how-it-works",
              desc: "Industrial airless spray systems designed for 1,000+ sqft per coat per day, with consistent pressure control on primer, base, and finish coats.",
            },
            {
              icon: Target,
              title: "Dynamic Spray Path Optimization",
              href: "/resources#targets",
              desc: "Vision-guided path planning designed to minimize overspray, eliminate holidays, and hold a ±2 mil thickness target across walls, ceilings, and complex geometry.",
            },
            {
              icon: Shield,
              title: "Closed-Loop Mil Thickness",
              href: "/resources#targets",
              desc: "Real-time thickness sensing with closed-loop flow control, so every square foot is applied to spec instead of eyeballed — the core of our quality thesis.",
            },
            {
              icon: Users,
              title: "Back-Rolling & Edge Detailing",
              href: "/#technology",
              desc: "A planned secondary roller attachment for texture matching, with servo-gun control for reveals, corners, and architectural details.",
            },
            {
              icon: Clock,
              title: "Multi-Coat Scheduling",
              href: "/dashboard",
              desc: "Designed to sequence primer → base → topcoat with dry times driven by measured humidity and temperature, not guesswork.",
            },
            {
              icon: Award,
              title: "One Shared Platform",
              href: "/#technology",
              desc: "PaintForge is designed as the first end-effector on a shared mobile-base platform, so future finishing tools run on the same base, OS, and operator training.",
            },
          ].map((feature, index) => (
            <div key={index} className="card p-8 group flex flex-col">
              <div className="feature-icon mb-6 group-hover:scale-105 transition-transform">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-xl tracking-tight mb-3">
                {feature.title}
              </h3>
              <p className="text-[#475569] leading-relaxed flex-1">
                {feature.desc}
              </p>
              <Link
                href={feature.href}
                className="learn-more mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#FF6B35]"
              >
                Learn more{" "}
                <ArrowRight className="w-4 h-4 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-[#F8FAFC] py-16 border-y">
        <div className="max-w-6xl mx-auto px-6">
          <div className="section-header mb-12">
            <div className="kicker mb-3">
              THE PLANNED WORKFLOW
            </div>
            <h2 className="section-heading">
              From Scan to Handover,
              <br />
              in Five Steps.
            </h2>
          </div>

          <div className="space-y-8">
            {[
              {
                num: "01",
                title: "Site Scan & Digital Twin",
                desc: "The robot maps walls, ceilings, columns, and openings with depth vision, building a 3D model and identifying masking zones.",
              },
              {
                num: "02",
                title: "Spray Path Planning",
                desc: "The planner generates coverage paths. You review coverage heatmaps and back-roll zones in the app, then approve or adjust.",
              },
              {
                num: "03",
                title: "Kit Mount & Deploy",
                desc: "The airless spray kit mounts to the mobile base. One operator supervises setup and safety zones.",
              },
              {
                num: "04",
                title: "Autonomous Execution",
                desc: "The robot sprays with real-time thickness monitoring and a live feed. Your crew focuses on prep, masking, and QA.",
              },
              {
                num: "05",
                title: "Quality Report & Handover",
                desc: "An auto-generated spray report with thickness maps, coverage photos, and environmental logs, ready for inspector sign-off.",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row gap-6 md:gap-8 items-start bg-white p-8 rounded-2xl border border-[#E2E8F0]"
              >
                <div className="step-number">{step.num}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-2xl tracking-tight mb-1">
                    {step.title}
                  </h3>
                  <p className="text-[#475569] text-[15px] leading-relaxed max-w-3xl">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI MODEL */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="section-header mb-10">
          <div className="kicker mb-3">
            MODEL THE ECONOMICS
          </div>
          <h2 className="section-heading">
            What Robotic Painting Could Mean
            <br />
            for Your Next Project.
          </h2>
        </div>

        <ROICalculator />

        <p className="text-xs text-[#64748B] mt-4">
          Modeled estimates only. Assumptions use published 2025–2026 Ontario
          labor rates and PaintForge engineering targets — not measured field
          results. Pilot deployments will validate these numbers.
        </p>
      </section>

      {/* DESIGN PARTNER PROGRAM */}
      <section className="bg-[#0A2540] py-16 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-10">
            <div className="kicker mb-3">
              2026 PILOT PROGRAM
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              We are looking for a handful of
              <br />
              GTA contractors to build this with.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Who it's for",
                points: [
                  "GCs and painting subs running 40k+ sqft interior packages in the GTA",
                  "Teams losing bids or margin to painter shortages",
                  "Operators willing to give structured feedback during pilots",
                ],
              },
              {
                title: "What design partners get",
                points: [
                  "First access to pilot units and preferred RaaS pricing locked in",
                  "Direct input into end-effector, reporting, and workflow design",
                  "Named case-study rights once results are real and measured",
                ],
              },
            ].map((block, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-2xl p-8"
              >
                <h3 className="font-semibold text-2xl tracking-tight mb-5">
                  {block.title}
                </h3>
                <ul className="space-y-3">
                  {block.points.map((p, i) => (
                    <li key={i} className="flex gap-3 text-white/80">
                      <Check className="w-5 h-5 text-[#FF6B35] flex-shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TECHNOLOGY */}
      <section id="technology" className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-x-16 gap-y-12 items-center">
          <div>
            <div className="section-header mb-8">
              <div className="kicker mb-3">
                ONE PLATFORM. EVERY TRADE.
              </div>
              <h2 className="section-heading">
                The Shared Interior Finishing Stack
              </h2>
            </div>
            <p className="text-xl text-[#475569]">
              PaintForge is the first product on a shared mobile-base platform.
              The long-term thesis: one base, one operator training program, one
              dashboard — with swappable end-effectors for painting and, later,
              other finishing trades.
            </p>

            <div className="mt-8 space-y-5">
              {[
                "Self-leveling mobile base designed for real job-site conditions",
                "Industrial collaborative arm with the reach and payload for wall and ceiling work",
                "Quick-swap painting kit: airless pump + servo spray gun + planned roller attachment",
                "Depth-vision system for surface mapping and obstacle avoidance",
                "InteriorFinish OS — one command center designed for a multi-trade fleet",
              ].map((item, i) => (
                <div key={i} className="flex gap-3 text-[15px]">
                  <Check className="w-5 h-5 text-[#FF6B35] flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#F8FAFC] rounded-3xl p-9 border border-[#E2E8F0]">
            <div className="kicker mb-4">
              INTERIORFINISH OS — PLANNED CAPABILITIES
            </div>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <span className="font-mono text-[#FF6B35] w-5">→</span> Unified
                fleet dashboard for every robot on a job
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-[#FF6B35] w-5">→</span> Spray
                path optimizer with coverage and overspray prediction
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-[#FF6B35] w-5">→</span> Live
                telemetry: pressure, flow rate, mil thickness, temp, humidity
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-[#FF6B35] w-5">→</span>{" "}
                Compliance-ready job logging for inspectors
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-[#FF6B35] w-5">→</span>{" "}
                Integrations with construction management tools on the roadmap
              </li>
            </ul>
            <div className="mt-8 pt-6 border-t text-xs text-[#64748B]">
              Roadmap items, not shipped features. Pilot partners help decide
              what gets built first.
            </div>
          </div>
        </div>
      </section>

      {/* PRICING TEASER */}
      <section className="bg-[#F8FAFC] py-16 border-y">
        <div className="max-w-6xl mx-auto px-6 section-header">
          <div className="kicker mb-3">
            PLANNED RAAS PRICING
          </div>
          <h2 className="section-heading mb-4">
            Robot as a Service. No capex.
          </h2>
          <p className="text-xl text-[#475569] max-w-xl">
            Target pricing for pilot and early production units. Founding
            design partners lock in preferred rates.
          </p>
          <div className="mt-8">
            <Link href="/pricing" className="btn-primary px-10 py-4 text-lg">
              See Planned Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA + PILOT APPLICATION (popup form) */}
      <section id="talk-to-expert" className="bg-[#0A2540] py-20 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="section-header section-header--dark">
            <div className="kicker mb-3">JOIN THE 2026 COHORT</div>
            <h2 className="section-heading text-white mb-4">
              Help define how
              <br />
              interiors get painted.
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-white/70 max-w-2xl mb-9">
              The 2026 pilot cohort is small by design. If painter shortages
              are costing you schedule or margin, apply and we will build a
              custom ROI model for your pipeline together.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <ApplyCTA />
              <Link
                href="/pricing"
                className="btn-secondary text-lg px-8 py-4 border-white/40 text-white hover:bg-white/10 inline-flex items-center justify-center"
              >
                See Planned Pricing
              </Link>
            </div>
            <p className="mt-5 text-sm text-white/50">
              We reply to every serious inquiry by email, typically within 1–2
              business days.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
