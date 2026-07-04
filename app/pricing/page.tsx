import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <div className="text-[#FF6B35] text-sm font-semibold tracking-[2px] mb-3">ROBOT AS A SERVICE</div>
        <h1 className="section-heading">Simple, transparent pricing.<br />Built for contractors who scale.</h1>
        <p className="mt-4 text-xl text-[#475569]">No hidden fees. No capex. Cancel anytime with 30 days notice.</p>
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
              "Full robot + Graco airless kit + InteriorFinish OS",
              "Standard support (Mon–Fri 8am–6pm ET)",
              "Basic job reporting & mil thickness logs",
              "Remote onboarding & 3 operator training sessions",
              "14-day paid pilot available",
            ],
          },
          {
            name: "Scale",
            robots: "3 Robots",
            price: "13,900",
            popular: true,
            features: [
              "Everything in Launch, scaled to 3 robots",
              "Priority 24/7 phone & on-site support",
              "Advanced AI path optimization + analytics",
              "On-site deployment & job start support",
              "Training for up to 8 crew members",
              "Quarterly optimization reviews",
            ],
          },
          {
            name: "Enterprise",
            robots: "Custom Fleet",
            price: "Custom",
            popular: false,
            features: [
              "Volume pricing from 5+ robots",
              "Dedicated Customer Success Manager",
              "99.9% uptime SLA with on-site spare robots",
              "Custom integrations (Procore, SAP, etc.)",
              "Bespoke end-effectors & workflow development",
              "Annual business review & fleet planning",
            ],
          },
        ].map((plan, idx) => (
          <div key={idx} className={`card p-8 flex flex-col ${plan.popular ? 'border-[#FF6B35] shadow-xl scale-[1.01]' : ''}`}>
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-mono text-xs tracking-[2px] text-[#FF6B35]">{plan.name.toUpperCase()}</div>
                  <div className="text-3xl font-semibold tracking-tight mt-1">{plan.robots}</div>
                </div>
                {plan.popular && <div className="text-xs px-3 py-1 rounded-full bg-[#FF6B35] text-white font-medium">MOST POPULAR</div>}
              </div>
              <div className="mt-6">
                {plan.price === "Custom" ? (
                  <div className="text-5xl font-semibold tracking-tighter">Custom</div>
                ) : (
                  <div>
                    <span className="text-5xl font-semibold tabular-nums tracking-[-2px]">${plan.price}</span>
                    <span className="text-[#64748B]">/mo</span>
                  </div>
                )}
              </div>
            </div>

            <ul className="mt-8 space-y-3 text-sm flex-1">
              {plan.features.map((f, fi) => (
                <li key={fi} className="flex gap-3"><Check className="w-4 h-4 text-[#FF6B35] mt-0.5 flex-shrink-0" />{f}</li>
              ))}
            </ul>

            <Link 
              href={plan.name === "Enterprise" ? "/contact" : "#"} 
              className={`mt-8 text-center py-3.5 rounded-xl font-semibold ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}
            >
              {plan.name === "Enterprise" ? "Contact Sales" : "Start 14-Day Pilot"}
            </Link>
          </div>
        ))}
      </div>

      {/* Bundling Banner */}
      <div className="bg-[#0A2540] text-white rounded-3xl p-10 md:p-12 mb-16">
        <div className="max-w-3xl">
          <div className="uppercase tracking-[2px] text-xs text-[#FF6B35] mb-2">THE FULL INTERIOR FINISHING SUITE</div>
          <h3 className="text-4xl font-semibold tracking-tight">DryForge + PaintForge Bundle</h3>
          <p className="mt-4 text-lg text-white/80">Save <span className="font-bold text-[#FF6B35]">18%</span> on combined monthly RaaS. One shared platform. One team. One dashboard. Finish full interiors 5 weeks faster on average.</p>
          
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="#bundle-details" className="btn-primary">See Bundle Savings</Link>
            <Link href="#talk-to-expert" className="btn-secondary border-white/30 text-white">Speak with our Ontario team</Link>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto">
        <h3 className="font-semibold text-2xl mb-6 tracking-tight">Frequently Asked Questions</h3>
        <div className="space-y-6 text-sm">
          {[
            ["What is included in RaaS?", "Robot hardware, painting end-effector (Graco airless + servo gun), full access to InteriorFinish OS, all software updates, remote support, and initial training. You provide power, compressed air (if needed), and site access."],
            ["How fast can I get a robot on site?", "Typical deployment in the GTA is 7–14 days from signed agreement. We handle delivery, setup, and first-job training."],
            ["What if the robot breaks down?", "Scale and Enterprise plans include rapid replacement. We maintain a fleet of spares in the GTA. Most issues are resolved remotely within 2 hours."],
            ["Can I use the same operators as DryForge?", "Yes. That's the entire point of the shared platform. One 2-day cross-training course and your team can run both painting and drywall robots."],
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
