import Link from "next/link";
import { Cpu, Boxes, Plus, ArrowRight } from "lucide-react";

// Persistent "two halves of one platform" cue shown near the top of both the
// RaaS and SaaS pages. The current side is highlighted; the other side links
// across. This is the Amazon/Google pattern: hardware + cloud, one platform.
export function EcosystemRibbon({ active }: { active: "raas" | "saas" }) {
  const sides = {
    raas: {
      href: "/raas",
      icon: Boxes,
      eyebrow: "Hardware",
      title: "Robotics as a Service",
      blurb: "Professional painting robots, deployed and maintained — no capex.",
    },
    saas: {
      href: "/saas",
      icon: Cpu,
      eyebrow: "Software",
      title: "The Automation Platform",
      blurb: "The intelligent OS that programs, monitors, and optimizes the fleet.",
    },
  };
  const order: ("raas" | "saas")[] = ["raas", "saas"];

  return (
    <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
      <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-lg p-2 grid md:grid-cols-[1fr_auto_1fr] items-stretch gap-2">
        {order.map((k, i) => {
          const s = sides[k];
          const isActive = k === active;
          const Icon = s.icon;
          const inner = (
            <div
              className={`h-full rounded-xl p-5 flex items-start gap-4 transition-colors ${
                isActive
                  ? "bg-[#0A2540] text-white"
                  : "bg-white hover:bg-[#F8FAFC] text-[#0A2540]"
              }`}
            >
              <div
                className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isActive ? "bg-white/10" : "bg-[#0A2540] text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className={`text-[11px] font-mono tracking-[2px] uppercase ${isActive ? "text-[#FF9A6B]" : "text-[#FF6B35]"}`}>
                  {s.eyebrow}
                </div>
                <div className="font-semibold text-lg tracking-tight">{s.title}</div>
                <p className={`text-sm mt-0.5 ${isActive ? "text-white/70" : "text-[#475569]"}`}>
                  {s.blurb}
                </p>
                {!isActive && (
                  <span className="learn-more mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[#FF6B35]">
                    Explore {s.eyebrow.toLowerCase()} <ArrowRight className="w-4 h-4 transition-transform" />
                  </span>
                )}
                {isActive && (
                  <span className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-white/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]" /> You are here
                  </span>
                )}
              </div>
            </div>
          );
          return (
            <div key={k} className="contents">
              {isActive ? inner : <Link href={s.href} className="block h-full">{inner}</Link>}
              {i === 0 && (
                <div className="hidden md:flex items-center justify-center px-1 text-[#94A3B8]">
                  <Plus className="w-5 h-5" />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-center text-sm text-[#64748B] mt-3">
        One platform, two halves — designed to be deployed together.
      </p>
    </section>
  );
}
