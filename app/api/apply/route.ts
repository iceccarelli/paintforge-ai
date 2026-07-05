import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { pilotInquirySchema } from "@/lib/schemas";

export const runtime = "nodejs";

// Best-effort per-instance rate limit. Serverless instances don't share
// memory, so this is a speed bump, not a guarantee — swap for Upstash
// Redis when submission volume justifies it (same pattern as other
// Grimaldi Engineering deployments).
const hits = new Map<string, { count: number; reset: number }>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = hits.get(ip) ?? { count: 0, reset: now + 3_600_000 };
  if (now > rec.reset) {
    rec.count = 0;
    rec.reset = now + 3_600_000;
  }
  rec.count += 1;
  hits.set(ip, rec);
  return rec.count > 5;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL || "vince.ceccarelli@gmail.com";

  // Not configured: tell the client honestly so it can use its fallback
  // (Formspree or mailto). Never fake a successful send.
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, configured: false, message: "Email backend not configured" },
      { status: 503 }
    );
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, message: "Too many submissions — please try again later or email us directly." },
      { status: 429 }
    );
  }

  let parsed;
  try {
    const form = await req.formData();
    parsed = pilotInquirySchema.parse({
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone") ?? "",
      company: form.get("company"),
      message: form.get("message"),
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Please check the form fields and try again." },
      { status: 400 }
    );
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      // Works out of the box; switch to a verified domain sender later.
      from: "PaintForge Pilot <onboarding@resend.dev>",
      to: [to],
      replyTo: parsed.email,
      subject: `Pilot inquiry — ${parsed.company}`,
      text: [
        `Name: ${parsed.name}`,
        `Email: ${parsed.email}`,
        `Phone: ${parsed.phone || "-"}`,
        `Company: ${parsed.company}`,
        "",
        parsed.message,
        "",
        `— submitted via /api/apply, IP ${ip}, ${new Date().toISOString()}`,
      ].join("\n"),
    });
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true, configured: true });
  } catch {
    return NextResponse.json(
      { ok: false, configured: true, message: "Send failed — please email us directly." },
      { status: 502 }
    );
  }
}
