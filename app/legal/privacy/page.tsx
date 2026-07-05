export const metadata = {
  title: "Privacy Policy | PaintForge",
};

const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "vince.ceccarelli@gmail.com";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="section-header mb-10"><h1 className="section-heading mb-2">Privacy Policy</h1>
      <p className="text-sm text-[#64748B]">Last updated: July 2026</p></div>

      <div className="space-y-8 text-[15px] leading-relaxed text-[#475569]">
        <section>
          <h2 className="font-semibold text-xl text-[#0A2540] mb-2">
            What we collect
          </h2>
          <p>
            When you submit the pilot program inquiry form, we collect the
            information you provide: name, work email, phone number (optional),
            company name, and your message. We do not collect anything else
            through forms on this site.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-xl text-[#0A2540] mb-2">
            How we use it
          </h2>
          <p>
            We use your inquiry details solely to respond to you about the
            PaintForge pilot program and related follow-up. We do not sell or
            rent your personal information, and we do not use it for
            third-party advertising.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-xl text-[#0A2540] mb-2">
            Service providers
          </h2>
          <p>
            This site is hosted on Vercel. Form submissions may be processed by
            a form-handling service (Formspree) or delivered to us directly by
            email. These providers process data on our behalf under their own
            privacy terms.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-xl text-[#0A2540] mb-2">
            Your rights
          </h2>
          <p>
            Under Canadian privacy law (PIPEDA), you may request access to, or
            correction or deletion of, personal information you have submitted
            to us. Contact us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#FF6B35]">
              {CONTACT_EMAIL}
            </a>{" "}
            and we will respond promptly.
          </p>
        </section>
      </div>
    </div>
  );
}
