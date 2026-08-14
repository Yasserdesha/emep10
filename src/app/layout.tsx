import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" className={`${inter.variable} ${cairo.variable} dark`}>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
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
