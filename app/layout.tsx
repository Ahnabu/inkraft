import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SyntaxHighlighting } from "@/components/SyntaxHighlighting";

import { Providers } from "@/components/Providers";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://inkraftblog.vercel.app'),
  title: {
    default: "Inkraft | Premium Blog Platform for Tech, AI & Programming",
    template: "%s | Inkraft Blog"
  },
  description: "Inkraft is a premium blogging platform for high-quality tech content. Discover expert articles on AI, Programming, Cybersecurity, Web Development, and more. Join Inkraft - where quality writing meets engaged readers.",
  keywords: [
    "inkraft",
    "inkraft blog",
    "inkraft platform",
    "tech blog platform",
    "programming blog",
    "AI blog",
    "technology articles",
    "web development blog",
    "cybersecurity blog",
    "coding tutorials",
    "software engineering blog",
    "machine learning articles",
    "data science blog",
    "developer community",
    "tech writing platform",
    "quality tech content",
    "editorial platform",
    "long-form technical writing",
    "inkraft articles",
    "inkraft community"
  ],
  authors: [{ name: "Inkraft", url: "https://inkraft.vercel.app" }],
  creator: "Inkraft",
  publisher: "Inkraft",
  applicationName: "Inkraft Blog",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Inkraft | Premium Tech Blog Platform",
    description: "Discover high-quality articles on AI, Programming, Cybersecurity, and Web Development. Inkraft - Premium blogging platform for tech enthusiasts.",
    siteName: "Inkraft",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Inkraft - Premium Tech Blog Platform"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Inkraft | Premium Tech Blog Platform",
    description: "Discover expert content on AI, Programming, and Technology. Join Inkraft's community of quality writers.",
    images: ["/api/og"],
    creator: "@inkraft",
    site: "@inkraft"
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
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
      url: 'https://inkraftblog.vercel.app/icon-512.png',
      width: 512,
      height: 512
    },
    sameAs: [
      'https://twitter.com/inkraft',
      'https://github.com/inkraft'
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="jMiToSCrGKGdzXOOrfgEHRCQTDORKrsaT3xPjHBRHQw" />
        {/* Bing/Edge verification - submit at bing.com/webmasters */}
        <meta name="msvalidate.01" content="" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Favicons for all browsers */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <meta name="theme-color" content="#6366f1" />
        {/* Force browsers to update favicon */}
        <link rel="icon" href="/favicon.ico?v=2" />
      </head>
      <body
        className={`${dmSans.variable} antialiased bg-background text-text font-body min-h-screen flex flex-col overflow-x-hidden`}
      >
        <Providers>
          <SyntaxHighlighting />
          <Toaster position="top-right" richColors />
          <div className="flex-1 flex flex-col relative z-0">
            <Navbar />
            <main className="flex-1 pt-24 pb-12 px-4 container mx-auto relative z-10">
              {children}
            </main>
            <Footer />
          </div>
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
