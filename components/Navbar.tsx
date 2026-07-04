"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/nextjs';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How it Works' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/solutions', label: 'Solutions' },
    { href: '/resources', label: 'Resources' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-[#0A2540] flex items-center justify-center">
            <span className="text-white font-bold text-2xl tracking-tighter">PF</span>
          </div>
          <div>
            <div className="font-semibold text-2xl tracking-[-0.04em] text-[#0A2540] group-hover:text-[#FF6B35] transition-colors">PaintForge</div>
            <div className="text-[10px] text-[#64748B] -mt-1.5 font-mono tracking-[2px]">PRECISION ROBOTICS</div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-9 text-sm font-medium">
          {/* Products Dropdown */}
          <div className="relative group">
            <button 
              onClick={() => setProductsOpen(!productsOpen)}
              className="flex items-center gap-1 text-[#475569] hover:text-[#0A2540] transition-colors"
            >
              Products <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-[#E2E8F0] rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <Link href="/" className="block px-5 py-3 hover:bg-[#F8FAFC] text-sm">
                <div className="font-semibold text-[#0A2540]">PaintForge</div>
                <div className="text-xs text-[#64748B]">Precision Robotic Painting • 4× speed</div>
              </Link>
              <a href="https://dryforge.ai" target="_blank" className="block px-5 py-3 hover:bg-[#F8FAFC] text-sm border-t">
                <div className="font-semibold text-[#0A2540]">DryForge</div>
                <div className="text-xs text-[#64748B]">Autonomous Drywall Finishing • Shared base</div>
              </a>
              <a href="https://floorforge.ai" target="_blank" className="block px-5 py-3 hover:bg-[#F8FAFC] text-sm border-t">
                <div className="font-semibold text-[#0A2540]">FloorForge</div>
                <div className="text-xs text-[#64748B]">Precision Flooring &amp; Leveling Robots</div>
              </a>
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

          <Link href="/solutions#enterprise" className="text-[#475569] hover:text-[#0A2540] transition-colors">
            Enterprise
          </Link>
        </div>

        {/* Right side CTAs */}
        <div className="hidden lg:flex items-center gap-3">
          <Link 
            href="#talk-to-expert" 
            className="btn-ghost text-sm px-5 py-2.5"
          >
            Talk to an Expert
          </Link>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="btn-ghost text-sm px-5 py-2.5 font-medium">
                Log in
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 rounded-full ring-2 ring-[#E2E8F0]"
                }
              }}
            />
          </SignedIn>

          <Link 
            href="/pricing" 
            className="btn-primary text-sm px-6 py-2.5 shadow-sm"
          >
            Get Started
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
          <Link href="#features" className="py-1.5 text-[#475569]">Features</Link>
          <Link href="#how-it-works" className="py-1.5 text-[#475569]">How it Works</Link>
          <Link href="/pricing" className="py-1.5 text-[#475569]">Pricing</Link>
          <Link href="/solutions" className="py-1.5 text-[#475569]">Solutions</Link>
          <Link href="/resources" className="py-1.5 text-[#475569]">Resources</Link>
          
          <div className="pt-4 border-t flex flex-col gap-3">
            <Link href="#talk-to-expert" className="btn-secondary text-center">Talk to an Expert</Link>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="btn-secondary text-center w-full">Log in</button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className="flex justify-center"><UserButton /></div>
            </SignedIn>
            <Link href="/pricing" className="btn-primary text-center">Get Started — Deploy Fleet</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
