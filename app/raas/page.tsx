import type { Metadata } from "next";
import Link from "next/link";
import { Wallet, Wrench, ShieldCheck, Check, ArrowRight, Info, AlertTriangle } from "lucide-react";
import { ROBOTS, ROBOTS_DISCLAIMER, NICHE_PROBLEMS } from "@/lib/robots";
import { RobotCard } from "@/components/RobotCard";
import { RobotCellShowcase } from "@/components/RobotCellShowcase";
import RobotShowcaseMount from "@/components/RobotShowcaseMount";
import { ProSimulatorLauncher } from "@/components/ProSimulatorLauncher";
import { EcosystemCTA } from "@/components/EcosystemCTA";
import { EcosystemRibbon } from "@/components/EcosystemRibbon";
import { PlatformComparison } from "@/components/PlatformComparison";
import { ApplyCTA } from "@/components/ApplyModal";

export const metadata: Metadata = {
  title: "RaaS — Robotics as a Service for Paint Automation | PaintForge",
  description:
    "Professional robotic painting delivered as a service — no capital expense. The painter shortage, film-build consistency, overspray, and capex risk, solved by the RaaS model. GTA-focused, 2026 pilot.",
  alternates: { canonical: "/raas" },
  keywords: [
    "Robotics as a Service Toronto",
    "Robotic Paint Line RaaS",
    "industrial painting automation GTA",
    "paint robot subscription",
    "RaaS painting robot Ontario",
  ],
};

export default function RaaSPage() {
  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative bg-[#0A2540] text-white py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 text-xs tracking-[2px] font-medium mb-6">
            ROBOTICS AS A SERVICE • 2026 GTA PILOT
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.04em] leading-[1.05] mb-6">
            Professional robotic painting,
            <br />
            delivered as a service.
          </h1>
          <p className="max-w-3xl text-lg sm:text-xl text-white/75 mb-9">
            The precision of industrial paint robotics without the capital
            expense of owning, programming, and maintaining a cell. PaintForge
            is building its own painting platform on this model — and designing
            the software to orchestrate the professional paint robots
            manufacturers already trust.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <ApplyCTA label="Apply for the Pilot" className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-3 group" />
            <Link href="/saas" className="btn-secondary text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10 inline-flex items-center gap-2 group">
              See the software that runs it
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition" />
            </Link>
          </div>
          <p className="mt-4 text-xs text-white/50">
            PaintForge is pre-launch. RaaS terms below describe the model we are building toward with pilot partners.
          </p>
        </div>
      </section>

      {/* ECOSYSTEM RIBBON */}
      <EcosystemRibbon active="raas" />

      {/* PROBLEM → SOLUTION */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="section-header mb-12">
          <div className="kicker mb-3">THE PROBLEM WE ARE BUILT AROUND</div>
          <h2 className="section-heading">
            Paint is where quality, cost,
            <br />
            and labor collide.
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {NICHE_PROBLEMS.map((p, i) => (
            <div key={i} className="card p-7">
              <div className="flex gap-3 mb-3">
                <AlertTriangle className="w-5 h-5 text-[#D97706] flex-shrink-0 mt-0.5" />
                <p className="font-semibold text-[#0A2540]">{p.problem}</p>
              </div>
              <div className="flex gap-3 pl-8">
                <Check className="w-5 h-5 text-[#059669] flex-shrink-0 mt-0.5 -ml-8" />
                <p className="text-[#475569] text-[15px]">{p.solution}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* THE MODEL */}
      <section className="bg-[#F8FAFC] py-20 border-y">
        <div className="max-w-7xl mx-auto px-6">
          <div className="section-header mb-12">
            <div className="kicker mb-3">THE RAAS ANSWER</div>
            <h2 className="section-heading">One subscription. The whole cell — not just the arm.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Wallet, title: "Zero capex", desc: "A predictable monthly rate instead of a six-figure purchase, integration project, and depreciation schedule." },
              { icon: Wrench, title: "Deployment & support", desc: "Installation, programming, maintenance, and spares are the service — not a headcount you carry." },
              { icon: ShieldCheck, title: "Software included", desc: "Every deployment is designed to ship with the PaintForge platform for monitoring, recipes, and reporting." },
              { icon: Check, title: "Scale with the pipeline", desc: "Add robots for a big program, release them when it ships. Capacity that follows demand." },
            ].map((f, i) => (
              <div key={i} className="card p-7 flex flex-col">
                <div className="feature-icon mb-5"><f.icon className="w-6 h-6" /></div>
                <h3 className="font-semibold text-lg tracking-tight mb-2">{f.title}</h3>
                <p className="text-[#475569] text-[15px] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTERACTIVE CELL */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="section-header mb-8">
          <div className="kicker mb-3">SEE IT RUN</div>
          <h2 className="section-heading">A machine you can see through.</h2>
          <p className="mt-3 text-[#475569] max-w-2xl">
            Slice it open, explode it, watch the internals move. This is the PaintForge
            concept unit as an inspectable digital twin — every part is a design target.
          </p>
        </div>

        <RobotShowcaseMount />

        <div className="mt-8 rounded-2xl border border-[#E2E8F0] bg-gradient-to-br from-[#0A2540] to-[#0D2B4A] p-8 flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <div className="text-[11px] font-mono tracking-widest uppercase text-[#FF9A6B] mb-2">PRO SIMULATOR</div>
            <h3 className="text-white font-semibold text-2xl tracking-tight mb-1">Inspect it at full mechanical fidelity.</h3>
            <p className="text-white/70 text-[15px] max-w-xl">
              The browser twin above is the preview. The Godot-powered Pro Simulator adds
              cross-section teardown, exploded assemblies, slow-motion internals, and a
              realistic coverage run you can drive.
            </p>
          </div>
          <ProSimulatorLauncher job={{ source: "raas", surface: "both", coats: 3 }} />
        </div>

      </section>

      {/* PICK A ROBOT — interactive reference machines */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="section-header mb-8">
          <div className="kicker mb-3">PICK A ROBOT · WATCH IT RUN</div>
          <h2 className="section-heading">Five reference machines, live.</h2>
          <p className="mt-3 text-[#475569] max-w-2xl">
            Select any robot to load its class-accurate build and watch it run a coat —
            distinct base, wrist, and applicator per machine. Launch any one into the
            full-fidelity Pro Simulator.
          </p>
        </div>
        <RobotCellShowcase />
      </section>

      {/* ROBOT LANDSCAPE — problem/solution */}
      <section id="robots" className="bg-[#F8FAFC] py-20 border-y">
        <div className="max-w-7xl mx-auto px-6">
          <div className="section-header mb-6">
            <div className="kicker mb-3">THE PROFESSIONAL LANDSCAPE</div>
            <h2 className="section-heading">
              Five robots. Five problems
              <br />
              they were built to solve.
            </h2>
            <p className="mt-4 text-lg text-[#475569] max-w-3xl">
              Robotic painting is a proven category. These platforms set the bar
              for repeatability, explosion safety, and finish quality across the
              automotive, aerospace, heavy-equipment, and metal-fabrication
              plants of the Toronto GTA and Southern Ontario. PaintForge is
              building its orchestration software to speak their languages.
            </p>
          </div>

          <div className="flex gap-3 items-start bg-white border border-[#E2E8F0] rounded-xl p-4 mb-10 text-sm text-[#475569]">
            <Info className="w-5 h-5 text-[#FF6B35] flex-shrink-0 mt-0.5" />
            <p>{ROBOTS_DISCLAIMER}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ROBOTS.map((robot) => (
              <RobotCard key={robot.id} robot={robot} />
            ))}
          </div>
        </div>
      </section>

      {/* WHICH DO YOU NEED */}
      <PlatformComparison />

      {/* CROSS-LINK */}
      <EcosystemCTA
        kicker="HARDWARE IS HALF THE STORY"
        heading="Robots are only as good as what directs them."
        body="Every RaaS deployment is designed to run on the PaintForge software platform — the layer that programs, monitors, and reports on the fleet. Renting robots without it leaves most of the value on the table."
        crossLink={{ href: "/saas", label: "Explore the software platform" }}
      />
    </div>
  );
}
