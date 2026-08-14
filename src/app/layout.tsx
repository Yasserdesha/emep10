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
  formatDetection: {
    telephone: false,
    date: false,
    email: false,
    address: false,
  },
  other: {
    'preconnect': 'https://dpptnkehkzolqrifbagx.supabase.co',
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
      <body suppressHydrationWarning className="theme-dark bg-[#0A0A0C] text-[#F8FAFC]">
        <LanguageProvider>
          <ServiceWorkerRegister />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
