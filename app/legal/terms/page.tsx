export const metadata = {
  title: "Terms of Use | PaintForge",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="section-header mb-10"><h1 className="section-heading mb-2">Terms of Use</h1>
      <p className="text-sm text-[#64748B]">Last updated: July 2026</p></div>

      <div className="space-y-8 text-[15px] leading-relaxed text-[#475569]">
        <section>
          <h2 className="font-semibold text-xl text-[#0A2540] mb-2">
            About this site
          </h2>
          <p>
            PaintForge is a pre-launch robotics venture. This website describes
            a product in development, including engineering targets and planned
            pricing. Nothing on this site constitutes an offer for sale, a
            performance guarantee, or measured field results unless explicitly
            labeled as such.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-xl text-[#0A2540] mb-2">
            ROI model
          </h2>
          <p>
            The interactive ROI calculator produces modeled estimates based on
            stated assumptions and published labor rate ranges. Actual results
            will vary by project and have not yet been validated in the field.
            Do not rely on model outputs for bidding or financial decisions.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-xl text-[#0A2540] mb-2">
            Intellectual property
          </h2>
          <p>
            The content, design, and branding of this site belong to
            PaintForge. You may not reproduce them for commercial purposes
            without permission.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-xl text-[#0A2540] mb-2">
            Limitation of liability
          </h2>
          <p>
            This site is provided &quot;as is&quot; without warranties of any
            kind. To the maximum extent permitted by law, PaintForge is not
            liable for decisions made in reliance on the information presented
            here.
          </p>
        </section>
      </div>
    </div>
  );
}
