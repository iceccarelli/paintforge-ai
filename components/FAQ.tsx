import { Plus } from "lucide-react";

// Single source of truth: renders both the visible accordion and the
// FAQPage structured data, so they can never drift out of sync.
// Every answer is honest to a pre-launch company — no claimed field results.
const FAQS: { q: string; a: string }[] = [
  {
    q: "Does PaintForge have robots painting job sites today?",
    a: "No. PaintForge is in active development. We are recruiting a small group of GTA contractors as design partners for 2026 pilot deployments — the pilots are how the system earns its field results.",
  },
  {
    q: "Where do the performance numbers come from?",
    a: "They are engineering targets, not measured field results: roughly 4× manual crew output, ±2 mil thickness tolerance via closed-loop control, and 1,000+ sqft per coat per day per robot. The ROI calculator combines these targets with published 2025–2026 Ontario labor rates. Pilots exist to validate every one of them.",
  },
  {
    q: "How does Robot-as-a-Service pricing work?",
    a: "RaaS means no capital expense — you pay a monthly rate per robot instead of buying hardware. The published figures are target prices for pilot and early-production units. Founding design partners lock in preferred rates. Full detail is on the Pricing page.",
  },
  {
    q: "What does a design partner actually commit to?",
    a: "Giving structured feedback during pilot deployments on your real interior packages. In return you get first access to pilot units, preferred RaaS pricing locked in, direct input into the end-effector and reporting design, and named case-study rights once results are real and measured.",
  },
  {
    q: "What surfaces and coats can it handle?",
    a: "The platform targets walls and ceilings with industrial airless spraying across primer, base, and finish coats. A roller attachment for back-rolling, texture matching, and edge detailing is on the roadmap for the shared mobile base.",
  },
  {
    q: "How is coating quality verified?",
    a: "The quality thesis is closed-loop mil-thickness sensing with real-time flow control, producing a sensor-verified thickness record for every square foot. That inspector-ready evidence trail is the wedge — the deliverable includes proof, not just paint.",
  },
  {
    q: "What is the service area for the 2026 pilot?",
    a: "The Greater Toronto Area, Ontario. Early cohorts are intentionally small so each partner gets real engineering attention.",
  },
];

export function FAQ() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section id="faq" className="max-w-4xl mx-auto px-6 py-20">
      <div className="section-header mb-10">
        <div className="kicker mb-3">STRAIGHT ANSWERS</div>
        <h2 className="section-heading">
          What contractors ask us first.
        </h2>
      </div>

      <div className="divide-y divide-[#E2E8F0] border-y border-[#E2E8F0]">
        {FAQS.map((f, i) => (
          <details key={i} className="group py-2">
            <summary className="flex items-center justify-between gap-4 cursor-pointer list-none py-5 text-lg font-semibold text-[#0A2540] marker:hidden">
              <span>{f.q}</span>
              <Plus
                className="w-5 h-5 flex-shrink-0 text-[#FF6B35] transition-transform duration-200 group-open:rotate-45"
                aria-hidden="true"
              />
            </summary>
            <p className="text-[#475569] leading-relaxed pb-6 pr-9 max-w-3xl">
              {f.a}
            </p>
          </details>
        ))}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </section>
  );
}
