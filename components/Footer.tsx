import Link from "next/link";
import {
  Mail,
  ArrowUp,
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

const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "vince.ceccarelli@gmail.com";

// ---------------------------------------------------------------------------
// SOCIAL LINKS — clickable now. Each href points at the platform itself until
// the PaintForge account exists; when it does, replace the href with the
// profile URL (formats in the comments). Nothing else needs to change.
// ---------------------------------------------------------------------------
const socialLinks = [
  { icon: Linkedin, href: "https://www.linkedin.com", label: "LinkedIn" }, // → https://linkedin.com/company/paintforge
  { icon: Twitter, href: "https://x.com", label: "X (Twitter)" }, // → https://x.com/paintforge
  { icon: Youtube, href: "https://www.youtube.com", label: "YouTube" }, // → https://youtube.com/@paintforge
  { icon: Instagram, href: "https://www.instagram.com", label: "Instagram" }, // → https://instagram.com/paintforge
  { icon: Facebook, href: "https://www.facebook.com", label: "Facebook" }, // → https://facebook.com/paintforge
  { icon: Music2, href: "https://www.tiktok.com", label: "TikTok" }, // → https://tiktok.com/@paintforge
  { icon: MessageCircle, href: "https://discord.com", label: "Discord" }, // → https://discord.gg/<invite>
  { icon: Github, href: "https://github.com", label: "GitHub" }, // → https://github.com/paintforge
  { icon: MessageSquare, href: "https://www.reddit.com", label: "Reddit" }, // → https://reddit.com/r/paintforge
];

const columns: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Learn",
    links: [
      { href: "/#features", label: "What Is PaintForge?" },
      { href: "/#how-it-works", label: "How It Works" },
      { href: "/resources#targets", label: "Engineering Targets" },
      { href: "/resources#methodology", label: "ROI Methodology" },
      { href: "/resources#case-studies", label: "Case Studies" },
    ],
  },
  {
    title: "Product",
    links: [
      { href: "/#roi-calculator", label: "ROI Model" },
      { href: "/pricing", label: "Planned RaaS Pricing" },
      { href: "/dashboard", label: "Product Preview" },
      { href: "/#technology", label: "Technology Stack" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { href: "/solutions", label: "General Contractors" },
      { href: "/solutions", label: "Painting Subcontractors" },
      { href: "/solutions", label: "GTA Housing & Condos" },
      { href: "/solutions", label: "Enterprise & Institutional" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/#talk-to-expert", label: "2026 Pilot Program" },
      { href: "/resources", label: "Resources" },
      { href: `mailto:${CONTACT_EMAIL}`, label: "Contact Us" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/legal/privacy", label: "Privacy Policy" },
      { href: "/legal/terms", label: "Terms of Use" },
    ],
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0A2540] text-white/90 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Column grid (AWS pattern) */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-y-10 gap-x-6 pb-10">
          {columns.map((col) => (
            <div key={col.title}>
              <div className="font-semibold text-white mb-4 tracking-tight">
                {col.title}
              </div>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-white/65 hover:text-white transition"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Back to top (AWS pattern) */}
        <div className="border-y border-white/10 py-4 text-center">
          <a
            href="#top"
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition"
          >
            Back to top <ArrowUp size={14} />
          </a>
        </div>

        {/* Bottom bar: statement + socials (AWS pattern) */}
        <div className="pt-8 flex flex-col md:flex-row md:items-start justify-between gap-6 text-sm">
          <div className="text-white/60 max-w-2xl leading-relaxed">
            PaintForge is a pre-launch robotics venture building autonomous
            painting systems for Ontario contractors. All performance figures
            on this site are engineering targets pending validation in 2026
            pilot deployments.
          </div>

          {/* 9 social icons — clickable, platform-level until profiles exist */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
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
              );
            })}
          </div>
        </div>

        {/* Legal line (AWS pattern) */}
        <div className="pt-6 flex flex-col md:flex-row md:items-center gap-x-8 gap-y-2 text-[13px] text-white/50">
          <Link href="/legal/privacy" className="hover:text-white transition">
            Privacy
          </Link>
          <Link href="/legal/terms" className="hover:text-white transition">
            Terms
          </Link>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="hover:text-white transition inline-flex items-center gap-1.5"
          >
            <Mail size={13} /> {CONTACT_EMAIL}
          </a>
          <div className="md:ml-auto">
            © {currentYear} PaintForge. Toronto, Ontario, Canada. All rights
            reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
