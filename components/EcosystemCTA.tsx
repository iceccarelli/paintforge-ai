import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ApplyCTA } from "@/components/ApplyModal";

// Reusable conversion band. Used at the foot of both /raas and /saas to keep
// the hardware ↔ software story (and the funnel) consistent across pages.
export function EcosystemCTA({
  kicker,
  heading,
  body,
  crossLink,
}: {
  kicker: string;
  heading: string;
  body: string;
  crossLink: { href: string; label: string };
}) {
  return (
    <section className="bg-[#0A2540] py-16 text-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="section-header section-header--dark">
          <div className="kicker mb-3">{kicker}</div>
          <h2 className="section-heading text-white mb-4">{heading}</h2>
          <p className="text-lg text-white/70 max-w-2xl mb-8">{body}</p>

          <div className="flex flex-col sm:flex-row gap-4">
            <ApplyCTA label="Apply for the 2026 Pilot" />
            <Link
              href={crossLink.href}
              className="btn-secondary text-lg px-8 py-4 border-white/40 text-white hover:bg-white/10 inline-flex items-center justify-center gap-2 group"
            >
              {crossLink.label}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
