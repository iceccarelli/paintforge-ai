import type { Metadata } from "next";
import Link from "next/link";
import {
  Boxes, Route, Activity, ScanEye, Gauge, FlaskConical, Plug, Lock,
  ArrowRight, Info, AlertTriangle, Check,
} from "lucide-react";
import { ROBOTS, ROBOTS_DISCLAIMER } from "@/lib/robots";
import { IntegrationDiagram } from "@/components/IntegrationDiagram";
import { RobotCellShowcase } from "@/components/RobotCellShowcase";
import { EcosystemCTA } from "@/components/EcosystemCTA";
import { EcosystemRibbon } from "@/components/EcosystemRibbon";
import { PlatformComparison } from "@/components/PlatformComparison";

export const metadata: Metadata = {
  title: "SaaS — The Paint Automation Platform | PaintForge",
  description:
    "The intelligent operating system for paint robotics: fleet orchestration, offline programming, digital twin, AI vision inspection, predictive maintenance, and MES/ERP integration. Designed to run the RaaS fleet.",
  alternates: { canonical: "/saas" },
  keywords: [
    "Paint Robot SaaS",
    "paint automation software",
    "robotic painting fleet management",
    "digital twin paint shop",
    "industrial painting automation GTA",
  ],
};

const PROBLEMS = [
  { problem: "Robots become islands — each cell programmed on its own pendant, with no shared view.", solution: "One control plane orchestrates a mixed-vendor fleet as a single system." },
  { problem: "Reprogramming for a new part halts production and needs a specialist on the floor.", solution: "Offline, AI-assisted path planning previews coverage before a robot moves." },
  { problem: "Quality is judged by eye; defects surface downstream after cost is sunk.", solution: "AI vision inspection flags runs, sags, and holidays per part, with a pass/fail record." },
  { problem: "Maintenance is reactive; an unplanned stop takes the whole booth down.", solution: "Predictive analytics trend wear and consumption to schedule service before failure." },
];

const FEATURES = [
  { icon: Route, title: "AI-assisted programming", desc: "No-code recipes to expert offline programming, with coverage and overspray prediction before spraying." },
  { icon: Boxes, title: "Mixed-fleet orchestration", desc: "One plane to schedule and monitor robots from different vendors as a single fleet." },
  { icon: Activity, title: "Monitoring & digital twin", desc: "Live pressure, flow, film thickness, temp, humidity — mirrored to a twin for playback and what-if planning." },
  { icon: ScanEye, title: "AI vision inspection", desc: "Camera-based defect detection with a per-part pass/fail record." },
  { icon: Gauge, title: "Predictive maintenance", desc: "Trend wear, pump cycles, and consumption to flag service — plus OEE and traceability." },
  { icon: FlaskConical, title: "Recipe management", desc: "Versioned coating recipes with rollback, reproducible across shifts and sites." },
  { icon: Plug, title: "MES / ERP / SCADA", desc: "Open interfaces — OPC-UA, MQTT, REST, EtherNet/IP, PROFINET — to fit existing plant systems." },
  { icon: Lock, title: "Security, edge + cloud", desc: "Edge buffering keeps a booth running if the link drops; role-based access and audit logging by design." },
];

export default function SaaSPage() {
  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative bg-[#0A2540] text-white py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 text-xs tracking-[2px] font-medium mb-6">
            INTERIORFINISH OS • PLATFORM IN DEVELOPMENT
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.04em] leading-[1.05] mb-6">
            The intelligent operating
            <br />
            system for paint robotics.
          </h1>
          <p className="max-w-3xl text-lg sm:text-xl text-white/75 mb-9">
            Hardware sprays; software decides. PaintForge is building the layer
            that programs, monitors, optimizes, and reports on a painting
            fleet — turning individual robots into one connected, accountable
            system. It is designed to ship with every RaaS deployment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/console" className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-3 group">
              Request console access
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition" />
            </Link>
            <Link href="/raas" className="btn-secondary text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10 inline-flex items-center gap-2 group">
              Deploy it on the RaaS fleet
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition" />
            </Link>
          </div>
          <p className="mt-4 text-xs text-white/50">Capabilities below are the platform roadmap. Pilot partners help decide what ships first.</p>
        </div>
      </section>

      {/* ECOSYSTEM RIBBON */}
      <EcosystemRibbon active="saas" />

      {/* PROBLEM WITH ROBOTS ALONE */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="section-header mb-12">
          <div className="kicker mb-3">WHY ROBOTS ALONE FALL SHORT</div>
          <h2 className="section-heading">A great arm with no brain is just expensive.</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {PROBLEMS.map((p, i) => (
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

      {/* INTERACTIVE CELL */}
      <section className="bg-[#F8FAFC] py-20 border-y">
        <div className="max-w-6xl mx-auto px-6">
          <div className="section-header mb-8">
            <div className="kicker mb-3">SOFTWARE, DRIVING HARDWARE</div>
            <h2 className="section-heading">Watch the platform run a spray path.</h2>
            <p className="mt-3 text-lg text-[#475569] max-w-3xl">
              The software plans the passes, drives the arm, and holds film
              thickness to target while reporting coverage in real time. Drag to
              orbit; replay the coat.
            </p>
          </div>
          <RobotCellShowcase />
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="section-header mb-12">
          <div className="kicker mb-3">PLATFORM CAPABILITIES</div>
          <h2 className="section-heading">Everything a paint fleet needs to run itself — accountably.</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="card p-7 flex flex-col">
              <div className="feature-icon mb-5"><f.icon className="w-6 h-6" /></div>
              <h3 className="font-semibold text-lg tracking-tight mb-2">{f.title}</h3>
              <p className="text-[#475569] text-[15px] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* EXECUTION STACK */}
      <section id="stack" className="bg-[#F8FAFC] py-20 border-y">
        <div className="max-w-5xl mx-auto px-6">
          <div className="section-header mb-10">
            <div className="kicker mb-3">EXECUTION STACK & HARDWARE INTEGRATION</div>
            <h2 className="section-heading">From robot controller to cloud, one accountable path.</h2>
            <p className="mt-4 text-lg text-[#475569] max-w-3xl">
              Serious paint automation lives or dies on integration. This is the
              layered architecture PaintForge is building — a vendor-neutral
              orchestration layer above each robot’s native controller and below
              the analytics operators actually use.
            </p>
          </div>
          <IntegrationDiagram />
        </div>
      </section>

      {/* COMPATIBILITY */}
      <section id="compatibility" className="max-w-6xl mx-auto px-6 py-20">
        <div className="section-header mb-6">
          <div className="kicker mb-3">DESIGNED-FOR COMPATIBILITY</div>
          <h2 className="section-heading">Built to speak every controller’s language.</h2>
          <p className="mt-4 text-lg text-[#475569] max-w-3xl">
            The platform’s job model is vendor-neutral by design. Here is what it
            is intended to add on each professional paint platform in the market.
          </p>
        </div>

        <div className="flex gap-3 items-start bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 mb-8 text-sm text-[#475569]">
          <Info className="w-5 h-5 text-[#FF6B35] flex-shrink-0 mt-0.5" />
          <p>{ROBOTS_DISCLAIMER}</p>
        </div>

        <div className="divide-y divide-[#E2E8F0] border-y border-[#E2E8F0]">
          {ROBOTS.map((r) => (
            <div key={r.id} className="py-5 grid md:grid-cols-[220px_1fr] gap-2 md:gap-8 items-start">
              <div>
                <div className="text-xs font-mono tracking-widest uppercase text-[#FF6B35]">{r.manufacturer}</div>
                <div className="font-semibold text-[#0A2540]">{r.model}</div>
                <Link href={`/raas#${r.id}`} className="learn-more text-xs font-semibold text-[#FF6B35] inline-flex items-center gap-1 mt-1">
                  Problem it solves
                  <ArrowRight className="w-3 h-3 transition-transform" />
                </Link>
              </div>
              <p className="text-[15px] text-[#475569]">{r.softwareAngle}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-[#0A2540] text-white rounded-3xl p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="kicker mb-2">RAAS + SAAS, TOGETHER</div>
            <h3 className="text-2xl font-semibold tracking-tight">The platform is included with every RaaS deployment.</h3>
            <p className="text-white/70 mt-2 max-w-xl">There is a clear upgrade path from RaaS-only to the full hardware-plus-software system. Planned pricing lives on the pricing page.</p>
          </div>
          <Link href="/pricing" className="btn-primary text-lg px-8 py-4 whitespace-nowrap inline-flex items-center gap-2 group">
            See planned pricing
            <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition" />
          </Link>
        </div>
      </section>

      {/* WHICH DO YOU NEED */}
      <PlatformComparison />

      {/* CROSS-LINK */}
      <EcosystemCTA
        kicker="THE OTHER HALF"
        heading="Software needs robots to run on."
        body="This platform is designed to deploy on the PaintForge RaaS fleet — professional painting robotics with no capital expense. The two are built to be bought together."
        crossLink={{ href: "/raas", label: "Explore Robotics as a Service" }}
      />
    </div>
  );
}
