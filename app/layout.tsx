import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Toaster } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Chatbot } from "@/components/Chatbot";

export const metadata: Metadata = {
  metadataBase: new URL("https://paintforge-ai.vercel.app"),
  alternates: { canonical: "/" },
  title: "PaintForge | Robotic Painting for GTA Contractors | 2026 Pilot Program",
  description:
    "PaintForge is building autonomous painting robots for walls and ceilings, targeting 4× crew output with closed-loop mil consistency. Now recruiting GTA design partners for 2026 pilot deployments.",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "PaintForge | Robotic Painting — 2026 GTA Pilot Program",
    description:
      "Autonomous painting robots in development for Ontario contractors. Apply to become a design partner.",
  },
  keywords: [
    "robotic painting",
    "construction automation",
    "GTA contractors",
    "robotic painter Ontario",
    "RaaS painting robot",
    "interior finishing robot",
    "airless spray robot",
    "construction robotics pilot",
  ],
};

export const viewport: Viewport = {
  themeColor: "#0A2540",
  colorScheme: "light",
};

// Honest Organization schema — descriptive facts only, no fabricated ratings,
// review counts, or aggregate metrics. Safe to expand once real data exists.
const orgJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://paintforge-ai.vercel.app/#org",
      name: "PaintForge",
      url: "https://paintforge-ai.vercel.app",
      description:
        "PaintForge is developing autonomous wall-and-ceiling painting robots for construction contractors, delivered as Robot-as-a-Service. Currently recruiting GTA design partners for 2026 pilot deployments.",
      areaServed: {
        "@type": "AdministrativeArea",
        name: "Greater Toronto Area, Ontario, Canada",
      },
      knowsAbout: [
        "robotic painting",
        "construction automation",
        "autonomous airless spraying",
        "Robot-as-a-Service",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://paintforge-ai.vercel.app/#website",
      url: "https://paintforge-ai.vercel.app",
      name: "PaintForge",
      publisher: { "@id": "https://paintforge-ai.vercel.app/#org" },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      id="top"
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Hero images load from Unsplash — open the connection early to
            shave DNS/TLS off the largest-contentful-paint on the homepage. */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className="min-h-full flex flex-col bg-white text-[#0A2540]">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:z-[100] focus:top-3 focus:left-3 focus:rounded-lg focus:bg-[#0A2540] focus:px-4 focus:py-2 focus:text-white focus:shadow-lg"
        >
          Skip to main content
        </a>
        <Navbar />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <Chatbot />
        <Toaster position="top-center" richColors closeButton />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </body>
    </html>
  );
}
