import Link from "next/link";
import {
  Gauge,
  ScanLine,
  Database,
  Users,
  FlaskConical,
  ArrowRight,
  Check,
} from "lucide-react";

export const metadata = {
  title: "Technology & Research | PaintForge",
  description:
    "The engineering thesis behind PaintForge: closed-loop coating verification, scan-plan-verify autonomy, a coating performance data layer, and our active research agenda.",
};

export default function TechnologyPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="section-header mb-14">
        <div className="kicker">TECHNOLOGY &amp; RESEARCH</div>
        <h1 className="section-heading mt-3">
          Painting, converted from an
          <br />
          inspected trade to a verified process.
        </h1>
        <p className="mt-4 text-lg text-[#475569] max-w-3xl">
          Robotic painting is a validated category: ventures in the US and
          Europe have raised institutional funding, painted millions of square
          feet, and proven that service and rental models work on real job
          sites. Our wedge is different — we are engineering the first
          platform where <strong>coating quality is measured while it is
          applied</strong>, not eyeballed after. This page lays out the
          thesis, what is built versus targeted, and the research agenda
          behind it.
        </p>
      </div>

      <div className="space-y-8">
        {/* 1. Closed-loop verification */}
        <div className="card p-9" id="closed-loop">
          <div className="flex items-center gap-3 mb-4">
            <div className="feature-icon">
              <Gauge className="w-6 h-6" />
            </div>
            <h2 className="font-semibold text-2xl tracking-tight">
              Closed-Loop Coating Verification
            </h2>
          </div>
          <div className="text-[#475569] space-y-4 text-[15px] leading-relaxed">
            <p>
              Every coating manufacturer publishes a specified film thickness;
              applying under it voids warranties and causes premature failure,
              applying over it wastes material and causes sagging and
              cracking. Today this is verified by spot-checking after the
              fact — if at all.
            </p>
            <p>
              PaintForge is engineered around in-process film thickness
              sensing feeding a control loop that modulates pump flow and arm
              velocity in real time, targeting a{" "}
              <strong>±2 mil tolerance across every pass</strong>. The output
              is not just a painted wall — it is a thickness map of the
              entire surface, attached to the job record.
            </p>
            <p className="text-sm text-[#64748B]">
              Status: core engineering target for 2026 pilot units. Tolerance
              figures are design targets pending field validation.
            </p>
          </div>
        </div>

        {/* 2. Scan - Plan - Verify */}
        <div className="card p-9" id="autonomy">
          <div className="flex items-center gap-3 mb-4">
            <div className="feature-icon">
              <ScanLine className="w-6 h-6" />
            </div>
            <h2 className="font-semibold text-2xl tracking-tight">
              Scan → Plan → Verify Autonomy
            </h2>
          </div>
          <div className="text-[#475569] space-y-4 text-[15px] leading-relaxed">
            <p>
              The robot builds a depth-vision digital twin of the space —
              walls, ceilings, openings, obstacles — before a drop of paint
              moves. Coverage is then solved as a path-optimization problem:
              minimize overspray and travel time subject to overlap,
              standoff-distance, and thickness constraints. The operator
              reviews the plan as a coverage heatmap and approves it in the
              app.
            </p>
            <p>
              After execution, the same twin holds the as-applied record:
              thickness per zone, environmental conditions per coat, photos
              per wall. Plan and result live in one model.
            </p>
          </div>
        </div>

        {/* 3. Data layer */}
        <div className="card p-9" id="data">
          <div className="flex items-center gap-3 mb-4">
            <div className="feature-icon">
              <Database className="w-6 h-6" />
            </div>
            <h2 className="font-semibold text-2xl tracking-tight">
              The Coating Performance Data Layer
            </h2>
          </div>
          <div className="text-[#475569] space-y-4 text-[15px] leading-relaxed">
            <p>
              Every verified square foot compounds. Over time, the platform
              accumulates a dataset no manual crew can produce: measured
              thickness, substrate, product, temperature, humidity, and cure
              conditions — per zone, per job. That dataset is the foundation
              for asset-lifecycle services: predicting recoat windows,
              flagging failure risk, and giving building owners a maintenance
              record instead of a paint invoice.
            </p>
            <p>
              Design principle: <strong>customers own their job data.</strong>{" "}
              Aggregate learning improves the platform; individual records
              belong to the contractor and their client.
            </p>
          </div>
        </div>

        {/* 4. Hybrid crew */}
        <div className="card p-9" id="hybrid-crew">
          <div className="flex items-center gap-3 mb-4">
            <div className="feature-icon">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="font-semibold text-2xl tracking-tight">
              Hybrid Crew, Not Replacement
            </h2>
          </div>
          <div className="text-[#475569] space-y-4 text-[15px] leading-relaxed">
            <p>
              The economics that work on real sites — proven by every serious
              player in this category — are hybrid: the robot handles the
              high-volume, repetitive, physically punishing spraying; skilled
              painters own prep, masking, edges, detail work, and final QA.
              One operator supervises the robot while the rest of the crew
              does the work that actually requires human judgment.
            </p>
            <p>
              The trade gets more attractive, not smaller: less time on
              ladders breathing overspray, more finished square feet per
              crew, and a new operator skill that commands a premium.
            </p>
          </div>
        </div>

        {/* 5. Research agenda */}
        <div className="card p-9" id="research">
          <div className="flex items-center gap-3 mb-4">
            <div className="feature-icon">
              <FlaskConical className="w-6 h-6" />
            </div>
            <h2 className="font-semibold text-2xl tracking-tight">
              Active Research Agenda
            </h2>
          </div>
          <div className="text-[#475569] space-y-4 text-[15px] leading-relaxed">
            <p>
              These are open problems we are actively working on — labeled as
              research, not shipped features:
            </p>
            <ul className="space-y-3">
              {[
                "Learning-based spray-path optimization under airflow disturbance: adapting pass spacing and gun velocity when HVAC, drafts, or open facades disturb the spray fan.",
                "Semantic job-site mapping: classifying surfaces (drywall vs. concrete vs. glazing vs. fixtures) from depth + RGB so masking zones are proposed automatically instead of drawn manually.",
                "Thickness estimation fusion: combining wet-film sensing with flow-rate integration and post-cure spot verification to certify dry-film thickness without full manual gauging.",
                "Multi-robot job scheduling: sequencing several robots and coats across floors against dry-time constraints, treated as a constrained scheduling problem.",
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <Check className="w-5 h-5 text-[#FF6B35] flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p>
              The founding team brings a graduate research background in
              industrial automation and machine learning (M.Sc., RWTH Aachen
              University) — the methods above are extensions of published
              approaches in robotics and control, applied to a trade that has
              never had them.
            </p>
          </div>
        </div>

        {/* Market context */}
        <div className="bg-[#0A2540] text-white rounded-3xl p-9">
          <div className="section-header section-header--dark mb-6">
            <div className="kicker mb-2">WHERE WE SIT IN THE MARKET</div>
            <h2 className="section-heading text-white text-3xl">
              A validated category. A different wedge.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5 text-sm">
            {[
              {
                title: "Service model",
                desc: "Company crews paint for you with their robots. Lowest adoption barrier; the contractor outsources the work. Proven at scale on large exterior and industrial surfaces.",
              },
              {
                title: "Rental model",
                desc: "Contractors rent robots for their own crews, keeping the work in-house. Proven on repetitive interior volumes in the European market.",
              },
              {
                title: "PaintForge: verified RaaS",
                desc: "Robot-as-a-Service where the deliverable includes the proof: a sensor-verified thickness record per job. Your crew, your client relationship, our robot and its evidence.",
              },
            ].map((m, i) => (
              <div
                key={i}
                className={`rounded-2xl p-6 border ${
                  i === 2
                    ? "border-[#FF6B35] bg-white/5"
                    : "border-white/10 bg-white/5"
                }`}
              >
                <div
                  className={`font-semibold mb-2 ${i === 2 ? "text-[#FF6B35]" : "text-white"}`}
                >
                  {m.title}
                </div>
                <p className="text-white/70 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-white/40">
            Model descriptions reflect publicly reported approaches in the
            robotic painting category; they describe business models, not
            specific companies&apos; current offerings.
          </p>
        </div>

        {/* CTA */}
        <div className="card p-9 flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <h3 className="font-semibold text-2xl tracking-tight mb-2">
              Want to pressure-test this thesis on your job site?
            </h3>
            <p className="text-[#475569]">
              The 2026 pilot cohort exists to turn these targets into measured
              results — with design partners named on the data.
            </p>
          </div>
          <Link
            href="/#talk-to-expert"
            className="btn-primary px-8 py-4 inline-flex items-center gap-2 flex-shrink-0"
          >
            Apply for the Pilot <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
