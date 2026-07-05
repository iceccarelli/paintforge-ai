"use client";

import React, { useState } from "react";
import { toast } from "sonner";

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;
const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "vince.ceccarelli@gmail.com";

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // [integration] api-first submit
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

    if (!FORMSPREE_ID) {
      // No form backend configured yet — fall back to a pre-filled email.
      const subject = encodeURIComponent(
        `PaintForge pilot inquiry — ${data.get("company") || ""}`
      );
      const body = encodeURIComponent(
        `Name: ${data.get("name")}\nEmail: ${data.get("email")}\nPhone: ${
          data.get("phone") || "-"
        }\nCompany: ${data.get("company")}\n\n${data.get("message")}`
      );
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (!res.ok) throw new Error(`Formspree responded ${res.status}`);
      setSent(true);
      form.reset();
      toast.success("Thanks — we received your inquiry and will reply by email.");
    } catch {
      toast.error(
        `Something went wrong sending the form. You can reach us directly at ${CONTACT_EMAIL}.`
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="p-8 text-center">
        <div className="text-2xl font-semibold tracking-tight mb-2">
          Inquiry received
        </div>
        <p className="text-[#475569]">
          We review every pilot application personally and will reply by email.
        </p>
      </div>
    );
  }

  return (
    <form className="p-6 space-y-5" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="cf-name" className="form-label">
            Full name
          </label>
          <input
            id="cf-name"
            type="text"
            name="name"
            placeholder="Jane Doe"
            className="form-input"
            required
          />
        </div>
        <div>
          <label htmlFor="cf-email" className="form-label">
            Work email
          </label>
          <input
            id="cf-email"
            type="email"
            name="email"
            placeholder="jane@yourcompany.ca"
            className="form-input"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="cf-phone" className="form-label">
            Phone <span className="text-[#94A3B8] font-normal">— optional</span>
          </label>
          <input
            id="cf-phone"
            type="tel"
            name="phone"
            placeholder="(416) 555-0100"
            className="form-input"
          />
        </div>
        <div>
          <label htmlFor="cf-company" className="form-label">
            Company / GC name
          </label>
          <input
            id="cf-company"
            type="text"
            name="company"
            placeholder="Your company"
            className="form-input"
            required
          />
        </div>
      </div>
      <div>
        <label htmlFor="cf-message" className="form-label">
          Your upcoming projects
        </label>
        <textarea
          id="cf-message"
          name="message"
          placeholder="Sqft, timelines, current painting challenges..."
          className="form-input min-h-[110px] resize-y"
          required
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full py-4 text-base disabled:opacity-60"
      >
        {submitting ? "Sending..." : "Apply for the 2026 Pilot Program"}
      </button>
      <p className="text-center text-xs text-[#64748B]">
        We reply to every serious inquiry by email, typically within 1–2
        business days.
      </p>
    </form>
  );
}
