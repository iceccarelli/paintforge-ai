"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, Mail } from "lucide-react";

const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "vince.ceccarelli@gmail.com";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/#features", label: "Platform" },
    { href: "/solutions", label: "Solutions" },
    { href: "/pricing", label: "Pricing" },
    { href: "/resources", label: "Resources" },
    { href: "/dashboard", label: "Product Preview" },
  ];

  return (
    <header className="sticky top-0 z-50">
      {/* Tier 1 — dark utility bar (AWS pattern) */}
      <div className="utility-bar bg-[#0A2540] text-white/85 text-[13px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-9 flex items-center justify-end gap-4 sm:gap-6">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="hidden sm:flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Mail size={13} /> Contact us
          </a>
          <Link href="/dashboard" className="hidden sm:inline hover:text-white transition-colors">
            Product Preview
          </Link>
          <Link
            href="/#talk-to-expert"
            className="font-medium text-[#FF9A6B] hover:text-white transition-colors"
          >
            2026 Pilot Program
          </Link>
        </div>
      </div>

      {/* Tier 2 — white primary nav (AWS pattern) */}
      <nav className="bg-white/95 backdrop-blur-lg border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-[#0A2540] flex items-center justify-center">
              <span className="text-white font-bold text-2xl tracking-tighter">
                PF
              </span>
            </div>
            <div>
              <div className="font-semibold text-xl tracking-[-0.04em] text-[#0A2540] group-hover:text-[#FF6B35] transition-colors">
                PaintForge
              </div>
              <div className="text-[9px] text-[#64748B] -mt-1 font-mono tracking-[2px]">
                ROBOTICS · IN DEVELOPMENT
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
            {/* Platform Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-[#475569] hover:text-[#0A2540] transition-colors">
                Discover PaintForge <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-[#E2E8F0] rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <Link
                  href="/#how-it-works"
                  className="block px-5 py-3 hover:bg-[#F8FAFC] text-sm"
                >
                  <div className="font-semibold text-[#0A2540]">
                    How it Works
                  </div>
                  <div className="text-xs text-[#64748B]">
                    Scan → plan → autonomous execution
                  </div>
                </Link>
                <Link
                  href="/resources#targets"
                  className="block px-5 py-3 hover:bg-[#F8FAFC] text-sm border-t"
                >
                  <div className="font-semibold text-[#0A2540]">
                    Engineering Targets
                  </div>
                  <div className="text-xs text-[#64748B]">
                    The numbers we are building toward
                  </div>
                </Link>
                <Link
                  href="/resources#methodology"
                  className="block px-5 py-3 hover:bg-[#F8FAFC] text-sm border-t"
                >
                  <div className="font-semibold text-[#0A2540]">
                    ROI Methodology
                  </div>
                  <div className="text-xs text-[#64748B]">
                    Every assumption, published
                  </div>
                </Link>
              </div>
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[#475569] hover:text-[#0A2540] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/#talk-to-expert"
              className="btn-primary text-sm px-6 py-2.5 shadow-sm"
            >
              Apply for the Pilot
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#475569]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t bg-white px-6 py-6 flex flex-col gap-4 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-1.5 text-[#475569]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t flex flex-col gap-3">
              <Link
                href="/#talk-to-expert"
                className="btn-primary text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Apply for the Pilot
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
