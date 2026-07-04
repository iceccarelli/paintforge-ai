import Link from "next/link";
import {
  Mail,
  Linkedin,
  Twitter,
  Youtube,
  Instagram,
  Facebook,
  Music2,
  MessageCircle,
  Github,
  MessageSquare,
} from "lucide-react";

// ---------------------------------------------------------------------------
// SOCIAL LINKS — fill in each `href` when the account exists.
// Leave `href: ""` until then: the icon renders as a muted placeholder
// (not a clickable dead link). The moment you paste a URL it goes live.
// ---------------------------------------------------------------------------
const socialLinks = [
  { icon: Linkedin, href: "", label: "LinkedIn" }, // TODO: https://linkedin.com/company/...
  { icon: Twitter, href: "", label: "X (Twitter)" }, // TODO: https://x.com/...
  { icon: Youtube, href: "", label: "YouTube" }, // TODO: https://youtube.com/@...
  { icon: Instagram, href: "", label: "Instagram" }, // TODO: https://instagram.com/...
  { icon: Facebook, href: "", label: "Facebook" }, // TODO: https://facebook.com/...
  { icon: Music2, href: "", label: "TikTok" }, // TODO: https://tiktok.com/@...
  { icon: MessageCircle, href: "", label: "Discord" }, // TODO: https://discord.gg/...
  { icon: Github, href: "", label: "GitHub" }, // TODO: https://github.com/...
  { icon: MessageSquare, href: "", label: "Reddit" }, // TODO: https://reddit.com/r/...
];

const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "vince.ceccarelli@gmail.com";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0A2540] text-white/90 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 pb-12 border-b border-white/10">
          {/* Product */}
          <div>
            <div className="font-semibold text-white mb-4 tracking-tight">
              Product
            </div>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/#features" className="hover:text-white transition">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-white transition">
                  How it Works
                </Link>
              </li>
              <li>
                <Link href="/#roi-calculator" className="hover:text-white transition">
                  ROI Model
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition">
                  Planned Pricing
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition">
                  Product Preview
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <div className="font-semibold text-white mb-4 tracking-tight">
              Solutions
            </div>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/solutions" className="hover:text-white transition">
                  For General Contractors
                </Link>
              </li>
              <li>
                <Link href="/solutions" className="hover:text-white transition">
                  Painting Subcontractors
                </Link>
              </li>
              <li>
                <Link href="/solutions" className="hover:text-white transition">
                  GTA Housing &amp; Condos
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <div className="font-semibold text-white mb-4 tracking-tight">
              Company
            </div>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/resources" className="hover:text-white transition">
                  Resources &amp; Methodology
                </Link>
              </li>
              <li>
                <Link href="/#talk-to-expert" className="hover:text-white transition">
                  Pilot Program
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="hover:text-white transition"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <div className="font-semibold text-white mb-4 tracking-tight">
              Legal
            </div>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/legal/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="hover:text-white transition">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row md:items-center justify-between gap-6 text-sm">
          <div className="text-white/60">
            © {currentYear} PaintForge. Toronto, Ontario, Canada.
            <span className="hidden md:inline">
              {" "}
              · A pre-launch robotics venture — pilot deployments planned for
              2026.
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {/* 9 social icons — live links once hrefs are filled in above */}
            <div className="flex items-center gap-5">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return social.href ? (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-white transition-colors hover:scale-110"
                    aria-label={social.label}
                  >
                    <Icon size={18} />
                  </a>
                ) : (
                  <span
                    key={social.label}
                    className="text-white/25 cursor-default"
                    aria-label={`${social.label} (coming soon)`}
                    title={`${social.label} — coming soon`}
                  >
                    <Icon size={18} />
                  </span>
                );
              })}
            </div>

            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <Mail size={16} /> {CONTACT_EMAIL}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
