import Link from "next/link";
import { Check, Minus, ArrowRight } from "lucide-react";
import { ApplyCTA } from "@/components/ApplyModal";

// Honest "which do you need" comparison: RaaS on its own vs the full RaaS + SaaS
// platform. Features are marked included / planned — no fabricated guarantees.
const ROWS: { label: string; raas: "yes" | "no"; full: "yes" | "planned" }[] = [
  { label: "Painting robot, deployed on site", raas: "yes", full: "yes" },
  { label: "Installation, programming & maintenance", raas: "yes", full: "yes" },
  { label: "Spares & support included", raas: "yes", full: "yes" },
  { label: "Live monitoring & digital twin", raas: "no", full: "planned" },
  { label: "Recipe management & versioning", raas: "no", full: "planned" },
  { label: "Mixed-fleet orchestration", raas: "no", full: "planned" },
  { label: "AI vision inspection & traceability", raas: "no", full: "planned" },
  { label: "Predictive maintenance & analytics", raas: "no", full: "planned" },
];

function Cell({ v }: { v: "yes" | "no" | "planned" }) {
  if (v === "yes") return <Check className="w-4 h-4 text-[#059669]" />;
  if (v === "planned")
    return <span className="text-[10px] font-semibold text-[#D97706] uppercase tracking-wider">Planned</span>;
  return <Minus className="w-4 h-4 text-[#CBD5E1]" />;
}

export function PlatformComparison() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-20">
      <div className="section-header mb-10">
        <div className="kicker mb-3">WHICH DO YOU NEED?</div>
        <h2 className="section-heading">Robots, or the whole system.</h2>
        <p className="mt-4 text-lg text-[#475569] max-w-3xl">
          You can start with robots on a service model. The platform is what turns
          a fleet into an accountable, optimizing system — and it is designed to
          ship with every deployment.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#E2E8F0]">
        <div className="grid grid-cols-[1fr_auto_auto] bg-[#F8FAFC] border-b border-[#E2E8F0] text-sm font-semibold text-[#0A2540]">
          <div className="p-4">Capability</div>
          <div className="p-4 w-28 text-center">RaaS</div>
          <div className="p-4 w-40 text-center bg-[#0A2540] text-white">
            RaaS + SaaS
            <span className="block text-[10px] font-medium text-[#FF9A6B] tracking-wider">RECOMMENDED</span>
          </div>
        </div>
        {ROWS.map((r, i) => (
          <div
            key={i}
            className={`grid grid-cols-[1fr_auto_auto] items-center text-sm ${i % 2 ? "bg-white" : "bg-[#FBFCFE]"}`}
          >
            <div className="p-4 text-[#475569]">{r.label}</div>
            <div className="p-4 w-28 flex justify-center">
              <Cell v={r.raas} />
            </div>
            <div className="p-4 w-40 flex justify-center bg-[#0A2540]/[0.03]">
              <Cell v={r.full} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
        <ApplyCTA label="Apply for the Pilot" className="btn-primary px-8 py-4 inline-flex items-center gap-2 group" />
        <Link href="/pricing" className="btn-secondary px-8 py-4 inline-flex items-center justify-center gap-2 group">
          See planned pricing
          <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition" />
        </Link>
      </div>
      <p className="text-center text-xs text-[#64748B] mt-4">
        &ldquo;Planned&rdquo; items are on the platform roadmap; pilot partners help decide what ships first.
      </p>
    </section>
  );
}
