import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

import { Providers } from "@/components/Providers";
import { Toaster } from "sonner";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://inkraft.com'),
  title: {
    default: "Inkraft - Premium Editorial Platform for Quality Writing",
    template: "%s | Inkraft"
  },
  description: "Inkraft is a premium blogging platform for long-form, high-quality writing. Discover expert content on Technology, AI, Programming, Cybersecurity, and more. Join our community of thoughtful writers and engaged readers.",
  keywords: [
    "blogging platform",
    "editorial platform",
    "long-form writing",
    "quality content",
    "tech blog",
    "programming blog",
    "AI articles",
    "cybersecurity",
    "writing community",
    "SEO optimized blog"
  ],
  authors: [{ name: "Inkraft" }],
  creator: "Inkraft",
  publisher: "Inkraft",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://inkraft.com",
    title: "Inkraft - Premium Editorial Platform for Quality Writing",
    description: "A premium platform for thoughtful writers and engaged readers. Discover high-quality content on Technology, AI, Programming, and more.",
    siteName: "Inkraft",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Inkraft - Premium Editorial Platform"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Inkraft - Premium Editorial Platform",
    description: "Premium blogging platform for long-form, quality writing. Join our community of expert authors.",
    images: ["/og-image.png"],
    creator: "@inkraft"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  verification: {
    google: "your-google-verification-code",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} antialiased bg-background text-text font-body min-h-screen flex flex-col`}
      >
        <Providers>
          <Toaster position="top-right" richColors />
          <div className="flex-1 flex flex-col relative z-0">
            <Navbar />
            <main className="flex-1 pt-24 pb-12 px-4 container mx-auto relative z-10">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
