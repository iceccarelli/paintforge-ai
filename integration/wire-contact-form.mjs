// Idempotently wires ContactForm to try /api/apply first, falling back to
// the existing Formspree/mailto flow if the API reports "not configured".
import { readFileSync, writeFileSync } from "node:fs";

const PATH = "components/ContactForm.tsx";
const MARKER = "// [integration] api-first submit";
let src = readFileSync(PATH, "utf8");

if (src.includes(MARKER)) {
  console.log("✓ ContactForm already wired — nothing to do");
  process.exit(0);
}

const anchor = "    const data = new FormData(form);\n";
if (!src.includes(anchor)) {
  console.error("✗ Anchor not found in ContactForm.tsx — wire manually (see INTEGRATION.md)");
  process.exit(1);
}

const inject = `    const data = new FormData(form);

    ${MARKER}
    // Try our own backend first (Resend via /api/apply). If it isn't
    // configured (503) or errors, fall through to Formspree/mailto below.
    try {
      setSubmitting(true);
      const apiRes = await fetch("/api/apply", { method: "POST", body: data });
      if (apiRes.ok) {
        setSent(true);
        form.reset();
        toast.success("Thanks — we received your inquiry and will reply by email.");
        setSubmitting(false);
        return;
      }
      if (apiRes.status === 429) {
        toast.error("Too many submissions — please try again later.");
        setSubmitting(false);
        return;
      }
    } catch {
      // network error: fall through to the fallback path
    } finally {
      setSubmitting(false);
    }
`;
src = src.replace(anchor, inject);
writeFileSync(PATH, src);
console.log("✓ ContactForm wired: /api/apply first, Formspree/mailto fallback intact");
