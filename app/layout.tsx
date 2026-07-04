import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Chatbot } from "@/components/Chatbot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "PaintForge | Precision Robotic Painting Platform | 4× Faster Wall & Ceiling Painting",
  description: "Deploy autonomous robots that paint walls and ceilings at 4× human speed with perfect mil consistency. Same mobile base as DryForge. Finish GTA projects weeks earlier. RaaS pricing from $4,900/mo.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "PaintForge | The Precision Robotic Painting Platform",
    description: "Stop fighting painter shortages. Deploy robotic precision today. Shared platform with DryForge for full interior finishing.",
    images: [{ url: "/og-image.png" }],
  },
  keywords: [
    "robotic painting",
    "construction automation",
    "GTA contractors",
    "robotic painter Ontario",
    "DryForge integration",
    "RaaS painting robot",
    "interior finishing robot",
    "airless spray robot",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_placeholder"}
    >
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col bg-white text-[#0A2540]">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Chatbot />
          <Toaster position="top-center" richColors closeButton />
        </body>
      </html>
    </ClerkProvider>
  );
}
