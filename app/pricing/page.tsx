import Link from "next/link";
import { Check } from "lucide-react";

export const metadata = {
  title: "Planned Pricing | PaintForge",
  description:
    "Target Robot-as-a-Service pricing for PaintForge pilot and early production units. Founding design partners lock in preferred rates.",
};

export default function PricingPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="section-header mb-12">
        <div className="kicker mb-3">
          PLANNED ROBOT-AS-A-SERVICE PRICING
        </div>
        <h1 className="section-heading">
          Target pricing for pilot
          <br />
          and early production units.
        </h1>
        <p className="mt-4 text-xl text-[#475569] max-w-2xl">
          These are the price points we are building toward. Nothing is on sale
          yet — founding design partners in the 2026 pilot cohort lock in
          preferred rates before general availability.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {[
          {
            name: "Launch",
            robots: "1 Robot",
            price: "4,900",
            popular: false,
            features: [
              "Robot + airless spray kit + InteriorFinish OS",
              "Standard support (Mon–Fri 8am–6pm ET)",
              "Job reporting & mil thickness logs",
              "Remote onboarding & operator training",
            ],
          },
          {
            name: "Scale",
            robots: "3 Robots",
            price: "13,900",
            popular: true,
            features: [
              "Everything in Launch, scaled to 3 robots",
              "Priority support",
              "Advanced path optimization + analytics",
              "On-site deployment & job start support",
              "Training for up to 8 crew members",
            ],
          },
          {
            name: "Enterprise",
            robots: "Custom Fleet",
            price: "Custom",
            popular: false,
            features: [
              "Volume pricing from 5+ robots",
              "Dedicated success contact",
              "Custom integrations & workflows",
              "Fleet planning support",
            ],
          },
        ].map((plan, idx) => (
          <div
            key={idx}
            className={`card p-8 flex flex-col ${plan.popular ? "border-[#FF6B35] shadow-xl scale-[1.01]" : ""}`}
          >
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-mono text-xs tracking-[2px] text-[#FF6B35]">
                    {plan.name.toUpperCase()}
                  </div>
                  <div className="text-3xl font-semibold tracking-tight mt-1">
                    {plan.robots}
                  </div>
                </div>
                {plan.popular && (
                  <div className="text-xs px-3 py-1 rounded-full bg-[#FF6B35] text-white font-medium">
                    PILOT FOCUS
                  </div>
                )}
              </div>
              <div className="mt-6">
                {plan.price === "Custom" ? (
                  <div className="text-4xl md:text-5xl font-semibold tracking-tighter">
                    Custom
                  </div>
                ) : (
                  <div>
                    <span className="text-4xl md:text-5xl font-semibold tabular-nums tracking-[-2px]">
                      ${plan.price}
                    </span>
                    <span className="text-[#64748B]">/mo target</span>
                  </div>
                )}
              </div>
            </div>

            <ul className="mt-8 space-y-3 text-sm flex-1">
              {plan.features.map((f, fi) => (
                <li key={fi} className="flex gap-3">
                  <Check className="w-4 h-4 text-[#FF6B35] mt-0.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="/#talk-to-expert"
              className={`mt-8 text-center py-3.5 rounded-xl font-semibold ${plan.popular ? "btn-primary" : "btn-secondary"}`}
            >
              Apply for the Pilot
            </Link>
          </div>
        ))}
      </div>

      {/* Bundling roadmap */}
      <div className="bg-[#0A2540] text-white rounded-3xl p-10 md:p-12 mb-16">
        <div className="max-w-3xl">
          <div className="kicker mb-2">
            ROADMAP
          </div>
          <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">
            One base, multiple trades
          </h3>
          <p className="mt-4 text-lg text-white/80">
            The platform is designed for swappable end-effectors, so future
            finishing tools share the same base, operators, and dashboard. Our
            planned bundle pricing targets an{" "}
            <span className="font-bold text-[#FF6B35]">18%</span> discount on
            combined RaaS once multiple end-effectors ship. Roadmap, not a
            current offer.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/#talk-to-expert" className="btn-primary">
              Talk to us about the roadmap
            </Link>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto">
        <h3 className="font-semibold text-2xl mb-6 tracking-tight">
          Frequently Asked Questions
        </h3>
        <div className="space-y-6 text-sm">
          {[
            [
              "Can I buy a robot today?",
              "No. PaintForge is in development. The 2026 pilot program is the first opportunity to run a unit on a real job site, and pilot terms are agreed individually with each design partner.",
            ],
            [
              "What would be included in RaaS?",
              "The planned offer: robot hardware, the airless painting end-effector, access to InteriorFinish OS, software updates, remote support, and initial training. You provide power and site access.",
            ],
            [
              "Are these prices final?",
              "They are targets. Final pricing will be set based on pilot economics. Founding design partners lock in preferred rates regardless of where general-availability pricing lands.",
            ],
            [
              "What does a design partner commit to?",
              "Real job-site access for pilot runs, structured feedback, and a named point of contact. In exchange: first access, preferred pricing, and direct influence on the product.",
            ],
          ].map(([q, a], i) => (
            <div key={i} className="border-l-4 border-[#FF6B35] pl-5">
              <div className="font-semibold">{q}</div>
              <p className="text-[#475569] mt-1">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
