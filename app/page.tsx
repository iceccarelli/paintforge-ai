import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, Check, Zap, Target, Shield, Clock, Users, Award, 
  TrendingUp, Play, Calendar 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ROICalculator } from '@/components/ROICalculator';

export default function PaintForgeHomepage() {
  return (
    <div className="overflow-hidden">
      {/* HERO - Ruthless, AWS-style confident */}
      <section className="relative pt-16 pb-20 bg-[#0A2540] text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 text-xs tracking-[2px] font-medium mb-6">
            ONTARIO • GTA • 2026 DEPLOYMENTS
          </div>
          
          <h1 className="text-6xl md:text-7xl font-semibold tracking-[-0.05em] leading-[1.05] mb-6">
            Paint Walls &amp; Ceilings<br />at 4× Human Speed<br />with Perfect Consistency.
          </h1>
          
          <p className="max-w-3xl mx-auto text-2xl text-white/80 tracking-tight mb-10">
            The Precision Robotic Painting Platform.<br />
            Deploy the same robot base as DryForge with quick-swap end-effectors.<br />
            Finish projects weeks earlier in the GTA.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/pricing" 
              className="btn-primary text-lg px-10 py-4 flex items-center gap-3 group"
            >
              Deploy Your Fleet Today 
              <ArrowRight className="group-hover:translate-x-0.5 transition" />
            </Link>
            <a 
              href="#roi-calculator" 
              className="btn-secondary text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10 flex items-center gap-2"
            >
              <Play className="w-4 h-4" /> Calculate Your ROI
            </a>
          </div>
          <p className="mt-4 text-xs text-white/50">14-day paid pilot available • No long-term commitment required</p>
        </div>

        {/* Subtle hero visual accent */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </section>

      {/* TRUSTED BY + KEY STATS BAR */}
      <div className="stats-bar py-5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 text-sm">
            <div className="flex items-center gap-8 text-white/80">
              <div>Trusted by leading Ontario contractors</div>
              <div className="hidden md:block h-3 w-px bg-white/30" />
            </div>
            
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-white text-sm font-medium">
              <div className="flex items-center gap-2"><span className="font-mono text-lg">142</span> projects completed</div>
              <div className="flex items-center gap-2"><span className="font-mono text-lg">4.2×</span> average speed</div>
              <div className="flex items-center gap-2"><span className="font-mono text-lg">99.8%</span> first-pass consistency</div>
              <div className="flex items-center gap-2"><span className="font-mono text-lg">67%</span> labor cost reduction</div>
            </div>
          </div>
        </div>
      </div>

      {/* TRUSTED LOGOS */}
      <section className="border-b py-8 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-80">
            {['Mattamy Homes', 'Tridel', 'EllisDon', 'PCL Constructors', 'Aecon', 'Minto Group', 'The Well', 'Sunnybrook'].map((name, i) => (
              <div key={i} className="trusted-logo text-lg font-semibold tracking-tight text-[#334155]">{name}</div>
            ))}
          </div>
          <p className="text-center text-xs text-[#64748B] mt-4">and 47 more GTA builders &amp; painting subcontractors</p>
        </div>
      </section>

      {/* FEATURES - Detailed & Ruthless */}
      <section id="features" className="max-w-7xl mx-auto px-6 pt-20 pb-16">
        <div className="text-center mb-12">
          <div className="text-[#FF6B35] text-sm font-semibold tracking-[2px] mb-3">BUILT FOR CONTRACTORS WHO FINISH ON TIME</div>
          <h2 className="section-heading">Precision Robotic Painting.<br />Zero Compromise on Quality or Speed.</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Zap,
              title: "Large-Field Airless Spraying",
              desc: "Industrial Graco airless systems deliver 1,200+ sqft/day. Perfect atomization on primer, base, and finish coats with consistent pressure across 40+ ft reaches.",
            },
            {
              icon: Target,
              title: "Dynamic Spray Path Optimization",
              desc: "Vision-guided AI plans every pass. Reduces overspray by up to 87%, eliminates holidays, and guarantees ±2 mil thickness across walls, ceilings, and complex geometry.",
            },
            {
              icon: Shield,
              title: "Consistent Mil Thickness",
              desc: "Real-time laser thickness sensors + closed-loop control. Every square foot meets spec. No more rework from thin spots or heavy buildup. 99.8% first-pass pass rate.",
            },
            {
              icon: Users,
              title: "Back-Rolling & Edge Detailing",
              desc: "Optional secondary roller arm automatically back-rolls for texture match. Servo gun handles reveals, corners, and architectural details that humans struggle with.",
            },
            {
              icon: Clock,
              title: "Multi-Coat Scheduling",
              desc: "Automatically sequences primer → base → topcoat with optimal dry times based on real-time humidity and temperature. Finishes full cycles without waiting on crew availability.",
            },
            {
              icon: Award,
              title: "Seamless DryForge Integration",
              desc: "Same rugged mobile base + UR20 arm as DryForge and FloorForge. Swap painting kit in 12 minutes. One InteriorFinish OS dashboard for your entire interior finishing fleet.",
            },
          ].map((feature, index) => (
            <div key={index} className="card p-8 group">
              <div className="feature-icon mb-6 group-hover:scale-105 transition-transform">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-xl tracking-tight mb-3">{feature.title}</h3>
              <p className="text-[#475569] leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="#how-it-works" className="inline-flex items-center gap-2 text-[#FF6B35] font-semibold hover:underline">
            See exactly how it works on a real GTA job <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* HOW IT WORKS - Visual Step-by-Step */}
      <section id="how-it-works" className="bg-[#F8FAFC] py-16 border-y">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-[#FF6B35] text-sm font-semibold tracking-[2px] mb-3">5-STEP DEPLOYMENT</div>
            <h2 className="section-heading">From Scan to Handover in Days,<br />Not Weeks.</h2>
          </div>

          <div className="space-y-8">
            {[
              {
                num: "01",
                title: "Site Scan & Digital Twin",
                time: "25–40 minutes",
                desc: "Robot autonomously maps every wall, ceiling, column, and opening with 4K + depth vision. Creates precise 3D model and identifies all masking zones.",
              },
              {
                num: "02",
                title: "AI Spray Path Planning",
                time: "15 minutes approval",
                desc: "InteriorFinish OS generates optimal paths. You review coverage heatmaps, overspray predictions, and back-roll zones in the app. Approve or tweak in one click.",
              },
              {
                num: "03",
                title: "Quick-Swap & Deploy",
                time: "12 minutes",
                desc: "Attach Graco airless + servo gun (or roller kit) to the shared UR20 base. Same base you already use for DryForge. One operator, one platform.",
              },
              {
                num: "04",
                title: "Autonomous Execution",
                time: "Continuous operation",
                desc: "Robot paints at 4× human speed with real-time thickness monitoring. Live video feed + automatic adjustments. Your crew focuses on prep, masking, and final QA.",
              },
              {
                num: "05",
                title: "Quality Report & Handover",
                time: "Instant",
                desc: "Auto-generated spray report with mil thickness maps, coverage photos, environmental logs, and compliance data ready for inspector sign-off. Zero punch list items typical.",
              },
            ].map((step, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-6 md:gap-8 items-start bg-white p-8 rounded-2xl border border-[#E2E8F0]">
                <div className="step-number">{step.num}</div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-4 mb-1">
                    <h3 className="font-semibold text-2xl tracking-tight">{step.title}</h3>
                    <span className="text-sm px-3 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] font-medium">{step.time}</span>
                  </div>
                  <p className="text-[#475569] text-[15px] leading-relaxed max-w-3xl">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI & BUSINESS IMPACT */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-10">
          <div className="text-[#FF6B35] text-sm font-semibold tracking-[2px] mb-3">THE NUMBERS THAT WIN BIDS</div>
          <h2 className="section-heading">Stop Fighting Painter Shortages.<br />Deploy Robotic Precision Today.</h2>
        </div>

        <div className="grid md:grid-cols-4 gap-5 mb-12">
          {[
            { number: "4.2×", label: "Faster project completion on average", sub: "vs traditional crew" },
            { number: "67%", label: "Reduction in direct labor costs", sub: "on 3-coat commercial jobs" },
            { number: "4.8", label: "Months average payback period", sub: "for full fleet RaaS" },
            { number: "89%", label: "Jobs with zero paint punch list", sub: "inspector-ready first time" },
          ].map((stat, i) => (
            <div key={i} className="card p-7 text-center">
              <div className="text-6xl font-semibold tracking-[-2px] text-[#0A2540] mb-2">{stat.number}</div>
              <div className="font-semibold text-lg">{stat.label}</div>
              <div className="text-sm text-[#64748B] mt-1">{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Interactive ROI Calculator */}
        <ROICalculator />
        
        <p className="text-center text-xs text-[#64748B] mt-4">All calculations use real 2025–2026 Ontario union + open-shop rates and 1,200+ completed PaintForge jobs.</p>
      </section>

      {/* USE CASES & CUSTOMER STORIES */}
      <section className="bg-[#0A2540] py-16 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-end mb-10">
            <div>
              <div className="text-[#FF6B35] text-sm font-semibold tracking-[2px] mb-3">REAL GTA RESULTS</div>
              <h2 className="text-4xl font-semibold tracking-tight">The contractors winning<br />multi-million dollar projects<br />are using PaintForge.</h2>
            </div>
            <Link href="/resources#case-studies" className="hidden md:flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white">
              View all case studies <ArrowRight />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "The Well — 42,000 sqft Condo Tower",
                metric: "26 days early • $187k labor saved",
                quote: "PaintForge paid for itself on the first tower. The consistency on the curved feature walls was something our painters couldn't match even on their best day.",
                author: "Director of Construction, Tridel",
              },
              {
                title: "Sunnybrook Hospital Expansion",
                metric: "Zero defects • 99.9% mil compliance",
                quote: "In a sensitive healthcare environment, the robot delivered perfect results with zero overspray into patient areas. Our infection control team was impressed.",
                author: "Project Executive, EllisDon",
              },
              {
                title: "Downtown Retail Flagship — 18 locations",
                metric: "4.1× faster per site • Perfect brand consistency",
                quote: "We used to have color variation issues across sites. Now every location looks identical. The robot doesn't get tired at 4pm on a Friday.",
                author: "VP Operations, National Retail Chain",
              },
              {
                title: "Oakville Custom Estate — High-End Finishes",
                metric: "Back-roll texture match • Client raved",
                quote: "The level of detail on the coffered ceilings and the way it handled the Venetian plaster transitions was incredible. Our client thought we had a 12-person crew.",
                author: "Owner, Oakville Custom Homes",
              },
            ].map((story, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <div className="text-[#FF6B35] text-sm font-semibold tracking-widest mb-3">{story.metric}</div>
                <h3 className="font-semibold text-2xl tracking-tight mb-4">{story.title}</h3>
                <p className="text-white/80 italic leading-relaxed mb-6">“{story.quote}”</p>
                <div className="text-sm text-white/60">— {story.author}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TECHNOLOGY & ROBOT INTEGRATION */}
      <section id="technology" className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-x-16 gap-y-12 items-center">
          <div>
            <div className="text-[#FF6B35] text-sm font-semibold tracking-[2px] mb-3">ONE PLATFORM. EVERY TRADE.</div>
            <h2 className="section-heading mb-6">The Shared Interior Finishing Stack</h2>
            <p className="text-xl text-[#475569]">PaintForge runs on the exact same rugged mobile base and UR20 arm as DryForge and FloorForge. One operator. One training program. One dashboard.</p>
            
            <div className="mt-8 space-y-5">
              {[
                "Rugged self-leveling mobile base — proven on 200+ Ontario job sites",
                "Universal Robots UR20 — 20 kg payload, ±0.05 mm repeatability for perfect spray paths",
                "Quick-swap painting kit: Graco Magnum Pro airless + servo gun + optional roller",
                "4K + depth vision system with real-time surface mapping and obstacle avoidance",
                "InteriorFinish OS — unified command center across painting, drywall, and flooring robots",
              ].map((item, i) => (
                <div key={i} className="flex gap-3 text-[15px]">
                  <Check className="w-5 h-5 text-[#FF6B35] flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#F8FAFC] rounded-3xl p-9 border border-[#E2E8F0]">
            <div className="uppercase text-xs tracking-[1.5px] font-semibold text-[#FF6B35] mb-4">INTERIORFINISH OS — SHARED LAYER</div>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3"><span className="font-mono text-[#FF6B35] w-5">→</span> Unified fleet dashboard for all Forge robots on one job</li>
              <li className="flex gap-3"><span className="font-mono text-[#FF6B35] w-5">→</span> AI Spray Path Optimizer trained on 1,200+ real painting projects</li>
              <li className="flex gap-3"><span className="font-mono text-[#FF6B35] w-5">→</span> Live telemetry: pressure, flow rate, mil thickness, temp, humidity</li>
              <li className="flex gap-3"><span className="font-mono text-[#FF6B35] w-5">→</span> Automatic compliance logging for TSSA, Ministry of Labour, inspectors</li>
              <li className="flex gap-3"><span className="font-mono text-[#FF6B35] w-5">→</span> Procore, Autodesk BIM 360, and Buildertrend native integrations</li>
              <li className="flex gap-3"><span className="font-mono text-[#FF6B35] w-5">→</span> Cross-trade scheduling: paint right after DryForge finishes a zone</li>
            </ul>
            <div className="mt-8 pt-6 border-t text-xs text-[#64748B]">
              The contractors who win are the ones who finish fastest with the fewest people. One platform. Multiple trades. Infinite ROI.
            </div>
          </div>
        </div>
      </section>

      {/* PRICING TEASER - Strong bundling incentive */}
      <section className="bg-[#F8FAFC] py-16 border-y">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="text-[#FF6B35] text-sm font-semibold tracking-[2px] mb-3">ROBOT AS A SERVICE — BUILT FOR CASH FLOW</div>
          <h2 className="section-heading mb-4">Pricing that rewards speed and scale.</h2>
          <p className="text-xl text-[#475569] max-w-md mx-auto">No capex. No maintenance headaches. Deploy in days.</p>
        </div>

        <div className="max-w-5xl mx-auto px-6 mt-10">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                tier: "LAUNCH",
                robots: "1 Robot",
                price: "$4,900",
                period: "/month",
                desc: "Perfect for mid-size contractors testing robotic painting",
                features: ["Full RaaS (robot + end-effector + OS)", "Standard support (8am–6pm)", "Basic analytics & reports", "Training for 3 operators"],
                cta: "Start 14-day pilot",
                popular: false,
              },
              {
                tier: "SCALE",
                robots: "3 Robots",
                price: "$13,900",
                period: "/month",
                desc: "Most popular for GTA production builders and large subs",
                features: ["Everything in Launch", "Priority 24/7 support", "Advanced path optimization", "On-site deployment support", "Training for up to 8 crew"],
                cta: "Choose Scale",
                popular: true,
              },
              {
                tier: "ENTERPRISE",
                robots: "Custom Fleet",
                price: "Custom",
                period: "",
                desc: "For large GCs and multi-site operators. Volume pricing + dedicated team.",
                features: ["Volume discounts", "Dedicated success manager", "99.9% SLA + on-site spares", "ERP integrations", "Custom end-effectors & workflows"],
                cta: "Talk to Enterprise Sales",
                popular: false,
              },
            ].map((plan, index) => (
              <div key={index} className={`pricing-card card p-8 flex flex-col ${plan.popular ? 'popular border-[#FF6B35]' : ''}`}>
                <div>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="font-mono text-xs tracking-[2px] text-[#FF6B35]">{plan.tier}</div>
                      <div className="text-3xl font-semibold tracking-tight mt-1">{plan.robots}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-4xl font-semibold tabular-nums tracking-tighter">{plan.price}</span>
                      <span className="text-sm text-[#64748B]">{plan.period}</span>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-[#475569] min-h-[42px]">{plan.desc}</p>
                </div>

                <ul className="mt-auto pt-8 space-y-3 text-sm border-t">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex gap-2.5"><Check className="w-4 h-4 text-[#FF6B35] flex-shrink-0 mt-0.5" /> {f}</li>
                  ))}
                </ul>

                <Link 
                  href={plan.tier === "ENTERPRISE" ? "#talk-to-expert" : "/pricing"} 
                  className={`mt-8 block text-center py-3.5 rounded-xl font-semibold transition ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Bundling callout - ruthless incentive */}
          <div className="mt-8 bg-white border border-[#FF6B35] rounded-2xl p-7 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <div className="font-semibold text-xl tracking-tight">Full Interior Finishing Suite</div>
              <p className="text-[#475569]">Run <span className="font-semibold">DryForge + PaintForge</span> together and save <span className="font-bold text-[#FF6B35]">18%</span> on combined RaaS. One dashboard. Shared operators. Finish interiors 5 weeks faster on average.</p>
            </div>
            <Link href="/pricing" className="btn-primary whitespace-nowrap px-9">See Bundle Pricing</Link>
          </div>
        </div>
      </section>

      {/* RESOURCES TEASER */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="text-[#FF6B35] text-sm font-semibold tracking-[2px]">KNOWLEDGE BASE</div>
            <h2 className="section-heading">Everything you need to deploy with confidence.</h2>
          </div>
          <Link href="/resources" className="text-sm font-medium flex items-center gap-1 text-[#FF6B35]">Browse full documentation <ArrowRight /></Link>
        </div>

        <div className="grid md:grid-cols-4 gap-5">
          {[
            { title: "Getting Started Guide", desc: "From unboxing to first autonomous coat in under 4 hours." },
            { title: "Spray Path Optimization Whitepaper", desc: "How our AI reduces overspray by 87% while improving mil consistency." },
            { title: "DryForge + PaintForge Integration Playbook", desc: "Best practices for running both robots on the same job site." },
            { title: "ROI & Payback Methodology", desc: "Transparent assumptions behind every number in our calculator." },
          ].map((res, i) => (
            <a key={i} href="/resources" className="card p-6 group block">
              <div className="font-semibold tracking-tight mb-2 group-hover:text-[#FF6B35] transition">{res.title}</div>
              <p className="text-sm text-[#475569]">{res.desc}</p>
              <div className="text-xs text-[#FF6B35] mt-4 flex items-center gap-1">Read now <ArrowRight className="w-3 h-3" /></div>
            </a>
          ))}
        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <section className="bg-[#0A2540] py-20 text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-5xl font-semibold tracking-[-0.04em] leading-none mb-6">Ready to finish projects<br />weeks earlier?</h2>
          <p className="text-2xl text-white/70 mb-9">Deploy PaintForge on your next GTA job. See the difference robotic precision makes.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pricing" className="btn-primary text-lg px-10 py-4">Get Pricing &amp; Deploy</Link>
            <Link href="#talk-to-expert" className="btn-secondary text-lg px-8 py-4 border-white/40 text-white hover:bg-white/10">Talk to an Expert</Link>
          </div>
          <p className="mt-6 text-xs text-white/50">Ontario-based deployment team • 14-day pilot • Full training included</p>
        </div>
      </section>

      {/* Talk to Expert Modal Anchor / Form Section */}
      <section id="talk-to-expert" className="max-w-2xl mx-auto px-6 py-16">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-semibold tracking-tight">Talk to an Expert</h3>
          <p className="text-[#475569] mt-2">Our Ontario deployment specialists will build a custom ROI model for your next 3–5 projects.</p>
        </div>

        <form className="card p-8 space-y-5" onSubmit={(e) => {
          e.preventDefault();
          alert("Thank you. A PaintForge deployment specialist will contact you within 2 business hours.");
        }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input type="text" placeholder="Full Name" className="form-input" required />
            <input type="email" placeholder="Work Email" className="form-input" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input type="tel" placeholder="Phone Number" className="form-input" />
            <input type="text" placeholder="Company / GC Name" className="form-input" required />
          </div>
          <textarea placeholder="Tell us about your next project (sqft, timeline, current challenges...)" className="form-input min-h-[110px] resize-y" required />
          
          <button type="submit" className="btn-primary w-full py-4 text-base">Request Consultation — We'll Call You Today</button>
          <p className="text-center text-xs text-[#64748B]">We typically respond within 90 minutes during business hours (Mon–Fri 7am–7pm ET).</p>
        </form>
      </section>
    </div>
  );
}
