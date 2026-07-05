import Link from "next/link";
import { LockKeyhole, ArrowRight, Monitor } from "lucide-react";

export const metadata = {
  title: "Console | PaintForge",
  description:
    "The PaintForge customer console launches with 2026 pilot deployments. Preview the product or apply to the pilot program.",
};

export default function ConsolePage() {
  return (
    <div className="max-w-xl mx-auto px-6 py-24">
      <div className="card p-10 text-center">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-[#0A2540] text-white flex items-center justify-center mb-6">
          <LockKeyhole size={24} />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight mb-3">
          Console sign-in opens with the pilots
        </h1>
        <p className="text-[#475569] leading-relaxed mb-8">
          The InteriorFinish OS customer console — fleet status, job progress,
          spray telemetry, and compliance reports — launches with 2026 pilot
          deployments. Design partners receive their credentials at
          onboarding.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/#talk-to-expert"
            className="btn-primary py-3.5 inline-flex items-center justify-center gap-2"
          >
            Apply for the 2026 Pilot <ArrowRight size={16} />
          </Link>
          <Link
            href="/dashboard"
            className="btn-secondary py-3.5 inline-flex items-center justify-center gap-2"
          >
            <Monitor size={16} /> Explore the console preview
          </Link>
        </div>

        <p className="mt-8 text-xs text-[#94A3B8]">
          No accounts exist yet — this page becomes the real sign-in when the
          first robots ship.
        </p>
      </div>
    </div>
  );
}
