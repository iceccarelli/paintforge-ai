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
      <div className="card p-8 text-center">
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
    <form className="card p-8 space-y-5" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="form-input"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Work Email"
          className="form-input"
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number (optional)"
          className="form-input"
        />
        <input
          type="text"
          name="company"
          placeholder="Company / GC Name"
          className="form-input"
          required
        />
      </div>
      <textarea
        name="message"
        placeholder="Tell us about your upcoming projects (sqft, timelines, current painting challenges...)"
        className="form-input min-h-[110px] resize-y"
        required
      />

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
