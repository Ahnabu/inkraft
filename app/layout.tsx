import type { Metadata } from "next";
import { DM_Sans, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SyntaxHighlighting } from "@/components/SyntaxHighlighting";

import { Providers } from "@/components/Providers";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { KeyboardShortcutsModal } from "@/components/ui/KeyboardShortcutsModal";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const notoSansBengali = Noto_Sans_Bengali({
  variable: "--font-bangla",
  subsets: ["bengali"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://inkraftblog.vercel.app'),
  title: {
    default: "Inkraft | Modern Editorial Blogging Platform for Writers",
    template: "%s | Inkraft Blog"
  },
  description: "Inkraft is a modern editorial blogging platform for high-quality content. A SEO-optimized platform for writers, developers, and startups to publish expert articles.",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/favicon.ico',
    },
  },
  keywords: [
    // Primary Brand
    "Inkraft blog",
    "Inkraft blogging platform",
    "Inkraft editorial platform",
    // Core Platform
    "editorial blogging platform",
    "modern blogging platform",
    "seo optimized blogging platform",
    "multi author blogging platform",
    // Audience
    "developer blogging platform",
    "writing platform for creators",
    "startup blog platform",
    // Tech Specs
    "nextjs blog",
    "react blog platform",
    "markdown blog editor"
  ],
  authors: [{ name: "Inkraft", url: "https://inkraftblog.vercel.app" }],
  creator: "Inkraft",
  publisher: "Inkraft",
  applicationName: "Inkraft Blog",
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Inkraft | Modern Editorial Blogging Platform",
    description: "The SEO-optimized blogging platform for professional writers and tech teams. Publish high-quality articles with our rich text editor and built-in analytics.",
    siteName: "Inkraft",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Inkraft - Modern Blogging Platform"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Inkraft | Modern Editorial Blogging Platform",
    description: "Join Inkraft, the modern blogging platform for developers and writers. Share expert content on a SEO-optimized platform.",
    images: ["/api/og"],
    creator: "@inkraft",
    site: "@inkraft"
  },

  category: 'technology',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Inkraft',
  alternateName: ['Inkraft Blog', 'Inkraft Platform'],
  url: 'https://inkraftblog.vercel.app',
  description: 'Premium blogging platform for high-quality tech content. Discover expert articles on AI, Programming, Cybersecurity, Web Development, and more.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://inkraftblog.vercel.app/explore?search={search_term_string}'
    },
    'query-input': 'required name=search_term_string'
  },
  publisher: {
    '@type': 'Organization',
    name: 'Inkraft',
    url: 'https://inkraftblog.vercel.app',
    logo: {
      '@type': 'ImageObject',
      url: 'https://inkraftblog.vercel.app/favicon.ico',
      width: 192,
      height: 192
    },
    sameAs: [
      'https://twitter.com/inkraft',
      'https://github.com/inkraft'
    ]
  }
};

import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

import { OnboardingModal } from "@/components/onboarding/OnboardingModal";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <meta name="google-site-verification" content="jMiToSCrGKGdzXOOrfgEHRCQTDORKrsaT3xPjHBRHQw" />
        {/* Bing/Edge verification - submit at bing.com/webmasters */}
        <meta name="msvalidate.01" content="" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${dmSans.variable} ${notoSansBengali.variable} antialiased bg-background text-text font-body min-h-screen flex flex-col overflow-x-hidden`}
      >
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <SyntaxHighlighting />
            <Toaster position="top-right" richColors />
            <KeyboardShortcutsModal />
            <OnboardingModal />
            <div className="flex-1 flex flex-col relative z-0">
              <Navbar />
              <main className="flex-1 pt-24 pb-12 px-4 container mx-auto relative z-10">
                {children}
              </main>
              <Footer />
            </div>
            <Analytics mode="production" debug={false} />
            <SpeedInsights />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
