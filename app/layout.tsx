import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Toaster } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Chatbot } from "@/components/Chatbot";

export const metadata: Metadata = {
  metadataBase: new URL("https://paintforge-app.vercel.app"),
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-[#0A2540]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Chatbot />
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
