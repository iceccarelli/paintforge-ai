import Link from 'next/link';

export default function ResourcesPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-12">
        <div className="text-[#FF6B35] text-sm font-semibold tracking-[2px]">RESOURCES</div>
        <h1 className="section-heading">Documentation, case studies,<br />and tools to deploy faster.</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {[
          { cat: "Getting Started", items: ["Quick Start Guide (PDF)", "First Job Checklist", "Safety & Site Requirements", "Operator Training Videos"] },
          { cat: "Technical", items: ["Spray Path Optimization Whitepaper", "Mil Thickness Best Practices", "InteriorFinish OS API Docs", "Integration Guides (Procore, BIM 360)"] },
          { cat: "Business", items: ["ROI & Payback Calculator Methodology", "DryForge + PaintForge Bundle Guide", "Case Studies (GTA Projects)", "Contractor Community Forum"] },
        ].map((section, i) => (
          <div key={i} className="card p-8">
            <div className="font-semibold tracking-tight mb-4 text-lg">{section.cat}</div>
            <ul className="space-y-2.5 text-sm text-[#475569]">
              {section.items.map((item, ii) => (
                <li key={ii}><a href="#" className="hover:text-[#FF6B35] transition">{item} →</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div id="case-studies" className="mb-8">
        <h2 className="font-semibold text-2xl tracking-tight mb-6">Featured Case Studies</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {["The Well Tower – Tridel", "Sunnybrook Phase 3 – EllisDon", "Retail Rollout 2025 – National Chain", "Oakville Estate Collection"].map((title, i) => (
            <div key={i} className="card p-7">
              <div className="text-sm text-[#FF6B35] font-medium">GTA • 2025</div>
              <div className="font-semibold text-xl mt-1 mb-3">{title}</div>
              <p className="text-sm text-[#475569]">Detailed metrics, photos, and contractor quotes available in the full PDF.</p>
              <a href="#" className="text-sm text-[#FF6B35] mt-4 inline-block">Download PDF →</a>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center text-sm text-[#64748B] mt-12">
        Can't find what you need? <Link href="#talk-to-expert" className="text-[#FF6B35] font-medium">Contact our team</Link> — we respond fast.
      </div>
    </div>
  );
}
