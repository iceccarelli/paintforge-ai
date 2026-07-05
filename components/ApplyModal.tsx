"use client";

import React, { useEffect, useState } from "react";
import { X, ArrowRight } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";

export function ApplyCTA({
  label = "Apply for the 2026 Pilot Program",
  className = "btn-primary text-lg px-10 py-4 inline-flex items-center gap-3 group",
}: {
  label?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  // Scroll lock + Escape while the modal is open
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {label}
        <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Apply as a Design Partner"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#0A2540]/70 backdrop-blur-sm animate-backdrop-in"
            onClick={() => setOpen(false)}
          />

          {/* Dialog */}
          <div className="relative w-full max-w-xl max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-3xl bg-white shadow-2xl animate-dialog-in">
            <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-[#E2E8F0] px-6 sm:px-8 py-5 flex items-start justify-between gap-4 rounded-t-3xl">
              <div>
                <div className="kicker mb-1">2026 PILOT PROGRAM</div>
                <h2 className="text-2xl font-semibold tracking-tight text-[#0A2540]">
                  Apply as a Design Partner
                </h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 -m-2 text-[#64748B] hover:text-[#0A2540] transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="px-2 sm:px-4 py-4">
              <ContactForm />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
