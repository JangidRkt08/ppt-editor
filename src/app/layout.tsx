import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"
  ),
  title: {
    default: "PowerPoint Editor",
    template: "%s | PowerPoint Editor",
  },
  description: "Fabric.js + Next.js presentation editor",
  openGraph: {
    title: "PowerPoint Editor",
    description: "Create, edit, and export slides in the browser",
    url: "/",
    siteName: "PowerPoint Editor",
    images: [
      { url: "/og.svg", width: 1200, height: 630, alt: "PowerPoint Editor" },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PowerPoint Editor",
    description: "Create, edit, and export slides in the browser",
    images: ["/og.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
