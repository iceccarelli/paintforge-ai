import Link from 'next/link';
import { Check } from 'lucide-react';

export default function SolutionsPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-14">
        <div className="text-[#FF6B35] text-sm font-semibold tracking-[2px]">SOLUTIONS BY SEGMENT</div>
        <h1 className="section-heading mt-3">Built for the contractors<br />who win work by finishing first.</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {[
          {
            title: "General Contractors &amp; Production Builders",
            desc: "Win more bids with aggressive timelines. Deploy PaintForge across multiple concurrent sites with unified scheduling and reporting.",
            points: ["Reduce painting duration by 60-75%", "Predictable costs with RaaS", "One dashboard for all trades via InteriorFinish OS", "Differentiate your bid with robotic precision"],
          },
          {
            title: "Painting Subcontractors",
            desc: "Scale your crew without hiring. Take on larger projects with the same headcount and deliver higher margins.",
            points: ["4× output per operator", "Win work you previously had to turn down", "Reduce rework to near zero", "Attract and retain better talent (less physical work)"],
          },
          {
            title: "Enterprise &amp; Large Institutional",
            desc: "Healthcare, education, airports, and government projects that demand documentation, consistency, and minimal disruption.",
            points: ["Full compliance logging &amp; audit trails", "99.9% first-pass acceptance rate", "Minimal VOC &amp; dust in occupied spaces", "Dedicated success manager + SLA"],
          },
          {
            title: "GTA Housing &amp; Mid-Rise Condos",
            desc: "The housing boom needs speed. Finish towers and townhome blocks weeks earlier with consistent quality buyers notice.",
            points: ["Perfect for repetitive floor plates", "Back-roll texture that matches hand work", "Fast turnover between units", "Strong ROI on 40k–120k sqft projects"],
          },
        ].map((sol, i) => (
          <div key={i} className="card p-9">
            <h3 className="text-2xl font-semibold tracking-tight mb-3">{sol.title}</h3>
            <p className="text-[#475569] mb-6">{sol.desc}</p>
            <ul className="space-y-2 text-sm">
              {sol.points.map((p, pi) => (
                <li key={pi} className="flex gap-2.5"><Check className="w-4 h-4 text-[#FF6B35] mt-0.5" />{p}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-14 text-center">
        <Link href="#talk-to-expert" className="btn-primary px-10 py-4">Talk to our Ontario team about your next project</Link>
      </div>
    </div>
  );
}
