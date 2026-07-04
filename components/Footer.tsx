import Link from 'next/link';
import { 
  Linkedin, Twitter, Youtube, Instagram, Facebook, 
  Music2, MessageCircle, Github, MessageSquare 
} from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Linkedin, href: "https://linkedin.com/company/paintforge", label: "LinkedIn" },
    { icon: Twitter, href: "https://x.com/paintforge", label: "X (Twitter)" },
    { icon: Youtube, href: "https://youtube.com/@paintforge", label: "YouTube" },
    { icon: Instagram, href: "https://instagram.com/paintforge", label: "Instagram" },
    { icon: Facebook, href: "https://facebook.com/paintforge", label: "Facebook" },
    { icon: Music2, href: "https://tiktok.com/@paintforge", label: "TikTok" },
    { icon: MessageCircle, href: "https://discord.gg/paintforge", label: "Discord" },
    { icon: Github, href: "https://github.com/paintforge", label: "GitHub" },
    { icon: MessageSquare, href: "https://reddit.com/r/paintforge", label: "Reddit" },
  ];

  return (
    <footer className="bg-[#0A2540] text-white/90 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-y-10 pb-12 border-b border-white/10">
          {/* Product */}
          <div>
            <div className="font-semibold text-white mb-4 tracking-tight">Product</div>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="#features" className="hover:text-white transition">Features</Link></li>
              <li><Link href="#how-it-works" className="hover:text-white transition">How it Works</Link></li>
              <li><Link href="#roi-calculator" className="hover:text-white transition">ROI Calculator</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition">Pricing &amp; RaaS</Link></li>
              <li><Link href="#technology" className="hover:text-white transition">Technology</Link></li>
              <li><a href="#integrations" className="hover:text-white transition">Integrations</a></li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <div className="font-semibold text-white mb-4 tracking-tight">Solutions</div>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/solutions" className="hover:text-white transition">For General Contractors</Link></li>
              <li><Link href="/solutions#subcontractors" className="hover:text-white transition">Painting Subcontractors</Link></li>
              <li><Link href="/solutions#enterprise" className="hover:text-white transition">Enterprise &amp; Large Projects</Link></li>
              <li><Link href="/solutions#gta" className="hover:text-white transition">GTA Housing &amp; Condos</Link></li>
              <li><Link href="/solutions#healthcare" className="hover:text-white transition">Healthcare &amp; Institutional</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <div className="font-semibold text-white mb-4 tracking-tight">Resources</div>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/resources" className="hover:text-white transition">Documentation</Link></li>
              <li><Link href="/resources#case-studies" className="hover:text-white transition">Case Studies</Link></li>
              <li><Link href="/resources#whitepapers" className="hover:text-white transition">Whitepapers &amp; Guides</Link></li>
              <li><a href="#roi-calculator" className="hover:text-white transition">Interactive ROI Tool</a></li>
              <li><Link href="/resources#webinars" className="hover:text-white transition">Webinars &amp; Training</Link></li>
              <li><a href="https://community.paintforge.ai" className="hover:text-white transition">Contractor Community</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <div className="font-semibold text-white mb-4 tracking-tight">Company</div>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#about" className="hover:text-white transition">About PaintForge</a></li>
              <li><a href="#careers" className="hover:text-white transition">Careers (We're Hiring)</a></li>
              <li><a href="#press" className="hover:text-white transition">Press &amp; News</a></li>
              <li><Link href="#talk-to-expert" className="hover:text-white transition">Contact Sales</Link></li>
              <li><a href="https://partners.paintforge.ai" className="hover:text-white transition">Partner Program</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <div className="font-semibold text-white mb-4 tracking-tight">Legal</div>
            <ul className="space-y-2.5 text-sm">
              <li><a href="/legal/privacy" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="/legal/terms" className="hover:text-white transition">Terms of Service</a></li>
              <li><a href="/legal/security" className="hover:text-white transition">Security &amp; Compliance</a></li>
              <li><a href="/legal/accessibility" className="hover:text-white transition">Accessibility (WCAG AA)</a></li>
              <li><a href="/legal/data-processing" className="hover:text-white transition">Data Processing Addendum</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar with socials */}
        <div className="pt-8 flex flex-col md:flex-row md:items-center justify-between gap-6 text-sm">
          <div className="text-white/60">
            © {currentYear} PaintForge Inc. All rights reserved. Toronto, Ontario, Canada. 
            <span className="hidden md:inline"> • Built for the contractors who finish on time.</span>
          </div>

          {/* Exactly 9 social icons */}
          <div className="flex items-center gap-5">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <a 
                  key={index}
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
      </div>
    </footer>
  );
}
