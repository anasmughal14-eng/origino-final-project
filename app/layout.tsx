import type { Metadata } from "next";
import "./globals.css";
import Navigation from "./components/layout/Navigation";
import Footer from "./components/layout/Footer";
import LanguageProvider from "./components/shared/LanguageProvider";
import ToastProvider from "./components/shared/ToastProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: { default: "ORIGINO - Pakistan's Finest Export Marketplace", template: "%s | ORIGINO" },
  description: "Discover Pakistan's master craftsmen. Curated B2B marketplace connecting global buyers with verified Pakistani manufacturers.",
  keywords: ["Pakistan exports", "B2B marketplace", "Pakistani manufacturers", "Sialkot", "Pakistan textiles"],
  openGraph: { type: "website", siteName: "ORIGINO", title: "ORIGINO - Pakistan's Finest Export Marketplace" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "923001234567";
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="flex min-h-screen flex-col">
        <LanguageProvider>
          <Navigation />
          <main className="flex-1">{children}</main>
          <Footer />
          <ToastProvider />
          <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="whatsapp-float min-h-[44px]" aria-label="Contact on WhatsApp">
            <span>WhatsApp</span>
          </a>
        </LanguageProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
