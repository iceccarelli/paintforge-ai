"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, Mail } from "lucide-react";

const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "vince.ceccarelli@gmail.com";

const HEADER_HEIGHT = 100; // utility bar 36px + primary nav 64px

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  // Smart header: hide on scroll down, reveal on scroll up (AWS/Medium pattern)
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < HEADER_HEIGHT) {
        setHidden(false);
      } else if (y > lastY.current + 6) {
        setHidden(true); // scrolling down
      } else if (y < lastY.current - 6) {
        setHidden(false); // scrolling up
      }
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Overlay menu: lock body scroll while open; close on Escape
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setMobileMenuOpen(false);
      };
      window.addEventListener("keydown", onKey);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", onKey);
      };
    }
    document.body.style.overflow = "";
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: "/#features", label: "Platform" },
    { href: "/technology", label: "Technology" },
    { href: "/solutions", label: "Solutions" },
    { href: "/pricing", label: "Pricing" },
    { href: "/resources", label: "Resources" },
    { href: "/dashboard", label: "Product Preview" },
  ];

  const isHidden = hidden && !mobileMenuOpen;

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-transform duration-300 ease-out will-change-transform ${
          isHidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        {/* Tier 1 — dark utility bar (AWS pattern) */}
        <div className="utility-bar bg-[#0A2540] text-white/85 text-[13px]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-9 flex items-center justify-end gap-4 sm:gap-6">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="hidden sm:flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Mail size={13} /> Contact us
            </a>
            <Link
              href="/dashboard"
              className="hidden sm:inline hover:text-white transition-colors"
            >
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-[#0A2540] flex items-center justify-center transition-transform group-hover:scale-105">
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
                <button className="nav-link flex items-center gap-1 text-[#475569] hover:text-[#0A2540] transition-colors py-2">
                  Discover PaintForge{" "}
                  <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-[#E2E8F0] rounded-xl shadow-xl py-2 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200">
                  <Link
                    href="/#how-it-works"
                    className="menu-item block px-5 py-3 text-sm"
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
                    className="menu-item block px-5 py-3 text-sm border-t"
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
                    className="menu-item block px-5 py-3 text-sm border-t"
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
                  className="nav-link text-[#475569] hover:text-[#0A2540] transition-colors py-2"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side: sign-in + CTA (AWS pattern) */}
            <div className="hidden lg:flex items-center gap-5">
              <Link
                href="/console"
                className="nav-link text-sm font-medium text-[#475569] hover:text-[#0A2540] transition-colors py-2"
              >
                Sign in to console
              </Link>
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
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Spacer: header is fixed, so content starts below it (no layout jump) */}
      <div style={{ height: HEADER_HEIGHT }} aria-hidden="true" />

      {/* Mobile Menu — full overlay; the page beneath never moves */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-white overflow-y-auto overscroll-contain animate-menu-in"
          style={{ top: HEADER_HEIGHT }}
        >
          <div className="px-6 py-8 flex flex-col gap-1 text-base font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="menu-item rounded-xl px-4 py-4 text-[#0A2540]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-6 pt-6 border-t flex flex-col gap-3">
              <Link
                href="/#talk-to-expert"
                className="btn-primary text-center py-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                Apply for the Pilot
              </Link>
              <Link
                href="/console"
                className="btn-secondary text-center py-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign in to console
              </Link>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-center text-sm text-[#64748B] py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact us · {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
