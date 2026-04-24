import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Providers from "@/components/Providers";
import ConditionalNavigation from "@/components/ConditionalNavigation";
import ScrollToTop from "@/components/ui/scroll-to-top";

export const metadata: Metadata = {
  title: "Triovate Labs",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Toaster />
          <Sonner />
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100001] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-gold focus:text-[#0A1628] focus:font-semibold focus:shadow-lg"
          >
            Skip to main content
          </a>
          <div className="fixed inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-quantum" />
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "radial-gradient(#ffffff12 1px, transparent 1.5px)",
                backgroundSize: "22px 22px",
              }}
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{ boxShadow: "inset 0 0 200px rgba(0,0,0,.12), inset 0 0 400px rgba(0,0,0,.06)" }}
            />
          </div>
          <div id="floating-ui-root" />
          <ConditionalNavigation />
          <main id="main-content" className="relative min-h-screen overflow-x-hidden text-tl-ink">
            <Suspense
              fallback={
                <div className="flex min-h-screen items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
                </div>
              }
            >
              {children}
            </Suspense>
          </main>
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}
