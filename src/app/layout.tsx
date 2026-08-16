import type { Metadata } from "next";
import { LanguageProvider } from "@/components/LanguageContext";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import "./globals.css";

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
