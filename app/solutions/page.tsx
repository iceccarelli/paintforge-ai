import Link from "next/link";
import { Check } from "lucide-react";

export const metadata = {
  title: "Solutions | PaintForge",
  description:
    "How robotic painting is designed to help GTA general contractors, painting subcontractors, and production builders.",
};

export default function SolutionsPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-14">
        <div className="text-[#FF6B35] text-sm font-semibold tracking-[2px]">
          SOLUTIONS BY SEGMENT
        </div>
        <h1 className="section-heading mt-3">
          Built for the contractors
          <br />
          who win work by finishing first.
        </h1>
        <p className="mt-4 text-lg text-[#475569] max-w-2xl mx-auto">
          PaintForge is in development. Here is who we are designing it for,
          and the outcomes the platform is engineered to deliver.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {[
          {
            title: "General Contractors & Production Builders",
            desc: "Win more bids with aggressive timelines. Deploy robotic painting across concurrent sites with unified scheduling and reporting.",
            points: [
              "Designed to compress painting durations significantly",
              "Predictable costs with RaaS instead of capex",
              "One dashboard for the fleet via InteriorFinish OS",
              "Differentiate your bid with documented, sensor-verified quality",
            ],
          },
          {
            title: "Painting Subcontractors",
            desc: "Scale output without scaling headcount. Take on larger projects with the same crew and protect your margins.",
            points: [
              "Target of 4× output per operator",
              "Bid work you previously had to turn down",
              "Closed-loop thickness control designed to minimize rework",
              "Less physical strain for your best people",
            ],
          },
          {
            title: "Enterprise & Large Institutional",
            desc: "Healthcare, education, and government projects demand documentation, consistency, and minimal disruption.",
            points: [
              "Compliance logging & audit trails built into the OS",
              "Sensor-verified coating thickness on every pass",
              "Designed for low-overspray operation in sensitive spaces",
            ],
          },
          {
            title: "GTA Housing & Mid-Rise Condos",
            desc: "The housing pipeline needs speed. Repetitive floor plates are exactly where robotic painting is designed to shine.",
            points: [
              "Ideal for repetitive floor plates and unit turns",
              "Planned back-roll attachment for texture matching",
              "Strongest modeled ROI on 40k–120k sqft projects",
            ],
          },
        ].map((sol, i) => (
          <div key={i} className="card p-9">
            <h3 className="text-2xl font-semibold tracking-tight mb-3">
              {sol.title}
            </h3>
            <p className="text-[#475569] mb-6">{sol.desc}</p>
            <ul className="space-y-2 text-sm">
              {sol.points.map((p, pi) => (
                <li key={pi} className="flex gap-2.5">
                  <Check className="w-4 h-4 text-[#FF6B35] mt-0.5 flex-shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-14 text-center">
        <Link href="/#talk-to-expert" className="btn-primary px-10 py-4">
          Apply for the 2026 GTA pilot program
        </Link>
      </div>
    </div>
  );
}
