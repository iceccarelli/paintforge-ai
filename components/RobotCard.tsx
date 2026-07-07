import Link from "next/link";
import { ArrowRight, AlertTriangle, Check } from "lucide-react";
import type { Robot } from "@/lib/robots";

// Shared across /raas and /saas so a robot's specs and problem/solution
// framing can never diverge between pages — both render from lib/robots.ts.
export function RobotCard({
  robot,
  crossLinkHref = "/saas#compatibility",
  crossLinkLabel = "How the platform is designed to orchestrate this robot",
}: {
  robot: Robot;
  crossLinkHref?: string;
  crossLinkLabel?: string;
}) {
  return (
    <div id={robot.id} className="card p-7 flex flex-col scroll-mt-32">
      <div className="flex items-start justify-between gap-4 mb-1">
        <div>
          <div className="text-xs font-mono tracking-[2px] uppercase text-[#FF6B35]">
            {robot.manufacturer}
          </div>
          <h3 className="font-semibold text-xl tracking-tight text-[#0A2540]">
            {robot.model}
          </h3>
        </div>
        <span className="text-[11px] font-medium text-[#475569] bg-[#F1F5F9] border border-[#E2E8F0] rounded-full px-3 py-1 text-right">
          {robot.category}
        </span>
      </div>

      <p className="text-[#475569] text-[15px] leading-relaxed mt-2">
        {robot.tagline}
      </p>

      {/* Problem → solution */}
      <div className="mt-5 space-y-3">
        <div className="flex gap-2.5">
          <AlertTriangle className="w-4 h-4 text-[#D97706] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-[#475569]">
            <span className="font-semibold text-[#0A2540]">Problem. </span>
            {robot.problem}
          </p>
        </div>
        <div className="flex gap-2.5">
          <Check className="w-4 h-4 text-[#059669] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-[#475569]">
            <span className="font-semibold text-[#0A2540]">Solution. </span>
            {robot.solution}
          </p>
        </div>
      </div>

      {/* Spec table */}
      <dl className="mt-5 pt-5 border-t border-[#E2E8F0] grid grid-cols-2 gap-x-5 gap-y-2.5 text-sm">
        {robot.specs.map((s) => (
          <div key={s.label} className="flex flex-col">
            <dt className="text-[11px] uppercase tracking-wider text-[#64748B]">
              {s.label}
            </dt>
            <dd className="font-medium text-[#0A2540] tabular-nums">{s.value}</dd>
          </div>
        ))}
      </dl>

      <Link
        href={crossLinkHref}
        className="learn-more mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#FF6B35]"
      >
        {crossLinkLabel}
        <ArrowRight className="w-4 h-4 transition-transform" />
      </Link>
    </div>
  );
}
