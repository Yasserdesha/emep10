import type { Metadata } from "next";
import { Inter, Cairo, Outfit } from "next/font/google";
import { LanguageProvider } from "@/components/LanguageContext";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "E-MEP Electromechanical Works | Electromechanical Contracting & BIM",
  description: "E-MEP Electromechanical Works specializes in top-tier Mechanical, Electrical, Plumbing, and Firefighting engineering solutions, BIM design, and electromechanical contracting.",
  icons: {
    icon: [
      { url: '/logo/logo.png', type: 'image/png', sizes: '32x32' },
      { url: '/logo/logo.png', type: 'image/png', sizes: '192x192' },
    ],
    shortcut: '/logo/logo.png',
    apple: '/logo/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`${inter.variable} ${cairo.variable} ${outfit.variable}`}
    >
      <head>
        {/* Preconnect & DNS-prefetch for Supabase Storage CDN */}
        <link rel="preconnect" href="https://dpptnkehkzolqrifbagx.supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://dpptnkehkzolqrifbagx.supabase.co" />

        {/* iOS & Safari format detection meta tag to prevent hydration mismatches */}
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />

        {/* Favicon & Logo for browser tab header */}
        <link rel="icon" href="/logo/logo.png" type="image/png" sizes="any" />
        <link rel="shortcut icon" href="/logo/logo.png" />
        <link rel="apple-touch-icon" href="/logo/logo.png" />

        {/* FontAwesome icons stylesheet */}
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/fontawesome/all.min.css" />
      </head>
      <body suppressHydrationWarning className="theme-dark bg-[#0A0A0C] text-[#F8FAFC]">
        <LanguageProvider>
          <ServiceWorkerRegister />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
