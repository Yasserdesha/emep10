import type { Metadata } from "next";
import { LanguageProvider } from "@/components/LanguageContext";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://emep.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "E-MEP Electromechanical Works | Electromechanical Contracting & BIM",
    template: "%s | E-MEP Electromechanical Works",
  },
  description: "E-MEP Electromechanical Works specializes in top-tier Mechanical, Electrical, Plumbing, and Firefighting engineering solutions, BIM design, and electromechanical contracting.",
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'ar_EG',
    url: '/',
    siteName: 'E-MEP Electromechanical Works',
    title: 'E-MEP Electromechanical Works | Engineering Excellence & Digital BIM Modeling',
    description: 'Specialists in Mechanical, Electrical, Plumbing, and Firefighting (MEP) contracting solutions, BIM coordination, and digital twin engineering.',
    images: [
      {
        url: '/logo/logo.png',
        width: 800,
        height: 800,
        alt: 'E-MEP Electromechanical Works Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'E-MEP Electromechanical Works',
    description: 'Premier MEP Contracting & Advanced Digital BIM Modeling Solutions.',
    images: ['/logo/logo.png'],
  },
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
  },
};

export const viewport = {
  themeColor: '#0A0A0C',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover' as const,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/fontawesome/all.min.css" />
      </head>
      <body className="antialiased bg-[#0A0A0C] text-white selection:bg-[#FF1E27] selection:text-white font-sans overflow-x-hidden min-h-screen">
        <LanguageProvider>
          {children}
          <ServiceWorkerRegister />
        </LanguageProvider>
      </body>
    </html>
  );
}
