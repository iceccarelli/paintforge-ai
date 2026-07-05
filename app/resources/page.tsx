import Link from "next/link";

export const metadata = {
  title: "Resources | PaintForge",
  description:
    "The ROI model methodology, engineering targets, and pilot program details behind PaintForge.",
};

export default function ResourcesPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="section-header mb-12">
        <div className="kicker">
          RESOURCES
        </div>
        <h1 className="section-heading">
          How our numbers work,
          <br />
          and where the product stands.
        </h1>
        <p className="mt-4 text-lg text-[#475569]">
          We publish our assumptions instead of inventing results. Case studies
          will appear here once pilot deployments produce real, measured data.
        </p>
      </div>

      <div className="space-y-8">
        <div className="card p-8" id="methodology">
          <h2 className="font-semibold text-2xl tracking-tight mb-4">
            ROI Model Methodology
          </h2>
          <div className="text-[#475569] space-y-4 text-[15px] leading-relaxed">
            <p>
              The interactive calculator on the homepage estimates project
              impact from five inputs: total wall and ceiling area, current
              crew size, daily cost per painter, number of coats, and your
              target timeline.
            </p>
            <p>Key assumptions, stated plainly:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Manual productivity is modeled at roughly 245 sqft per painter
                per day per coat, including masking and edge work — consistent
                with published commercial painting production rates.
              </li>
              <li>
                Robot productivity uses our engineering target of roughly
                1,000 sqft per coat per day per robot, with a 15% buffer for
                maintenance and setup. This is a design target, not a measured
                field result.
              </li>
              <li>
                Labor costs use published 2025–2026 Ontario union and
                open-shop rate ranges; you can override the daily cost input
                with your own numbers.
              </li>
              <li>
                A reduced supervisory crew (roughly one third of the original)
                is assumed to remain for prep, masking, touch-up, and QA.
              </li>
            </ul>
            <p>
              Every output is a modeled estimate. The purpose of the 2026 pilot
              program is to replace these assumptions with measured data.
            </p>
          </div>
        </div>

        <div className="card p-8" id="targets">
          <h2 className="font-semibold text-2xl tracking-tight mb-4">
            Engineering Targets
          </h2>
          <ul className="text-[#475569] space-y-3 text-[15px]">
            <li>
              <span className="font-semibold text-[#0A2540]">Throughput:</span>{" "}
              ~4× the effective output of a manual crew per operator.
            </li>
            <li>
              <span className="font-semibold text-[#0A2540]">Quality:</span>{" "}
              ±2 mil coating thickness tolerance via closed-loop sensing and
              flow control.
            </li>
            <li>
              <span className="font-semibold text-[#0A2540]">Coverage:</span>{" "}
              1,000+ sqft per coat per day per robot on open wall and ceiling
              fields.
            </li>
          </ul>
        </div>

        <div className="card p-8" id="case-studies">
          <h2 className="font-semibold text-2xl tracking-tight mb-4">
            Case Studies
          </h2>
          <p className="text-[#475569] text-[15px] leading-relaxed">
            None yet — and we won&apos;t publish any until they are real.
            Design partners in the 2026 pilot cohort get named case-study
            rights once results are measured on their sites. If you want to be
            the first name on this page,{" "}
            <Link
              href="/#talk-to-expert"
              className="text-[#FF6B35] font-medium"
            >
              apply for the pilot program
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
