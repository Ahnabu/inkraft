import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Inkraft - Premium Editorial Platform",
  description: "A content-first editorial platform for deep thinking, long-form reading, and serious writing. Discover stories from expert authors on Technology, AI, Programming, and more.",
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
        <div className="flex-1 flex flex-col relative z-0">
          <Navbar />
          <main className="flex-1 pt-24 pb-12 px-4 container mx-auto relative z-10">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
