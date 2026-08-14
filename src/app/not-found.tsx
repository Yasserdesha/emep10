"use client";

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/components/LanguageContext';
import Link from 'next/link';

export default function NotFound() {
  const { t, language, isMounted } = useLanguage();
  const isAr = isMounted && language === 'ar';

  return (
    <div 
      className="min-h-screen bg-[#0A0A0C] text-[#F8FAFC] flex flex-col justify-center items-center py-16 px-4 text-center relative overflow-hidden selection:bg-[#FF1E27] selection:text-white" 
      dir={isMounted ? (isAr ? 'rtl' : 'ltr') : 'ltr'}
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF1E27]/10 blur-[140px] rounded-full" />
      </div>

      {/* Minimal Header */}
      <header className="absolute top-0 inset-x-0 border-b border-white/[0.06] bg-[#0A0A0C]/90 backdrop-blur-md z-20" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="bg-white p-1 sm:p-1.5 rounded-lg shadow-md group-hover:scale-105 transition-transform flex-shrink-0">
              <Image src="/logo/logo.png" alt="E-MEP Logo" width={32} height={32} style={{ width: '32px', height: '32px', objectFit: 'contain' }} priority />
            </div>
            <div className="flex flex-col text-start">
              <span className="font-black text-white text-base tracking-wider leading-none">E-MEP</span>
              <span className="text-[9px] text-[#64748B] font-semibold uppercase tracking-widest mt-0.5">Electromechanical</span>
            </div>
          </Link>
          
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-white/[0.1] bg-white/[0.04] text-xs font-bold text-[#94A3B8] hover:text-white hover:border-white/20 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>{isAr ? 'الرئيسية' : 'Home'}</span>
          </Link>
        </div>
      </header>

      {/* 404 card */}
      <main className="max-w-[540px] w-full p-6 sm:p-10 rounded-3xl bg-[#111116]/95 border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.85)] relative overflow-hidden z-10 backdrop-blur-xl space-y-6 my-auto">
        {/* Glow Top Line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#D31019] via-[#FF1E27] to-[#FF4040]" />

        {/* Warning Icon */}
        <div className="w-16 h-16 bg-[#FF1E27]/10 border border-[#FF1E27]/30 rounded-2xl flex items-center justify-center mx-auto text-[#FF1E27] shadow-[0_0_35px_rgba(211,16,25,0.35)]">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        {/* 404 Big Number */}
        <div className="text-6xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-[#475569] font-mono leading-none tracking-tighter">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-black text-white">
            {isAr ? 'الصفحة غير موجودة' : 'Page Not Found'}
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed max-w-sm mx-auto">
            {isAr
              ? 'عذراً، الرابط الذي تحاول الوصول إليه غير متاح أو تم نقله.'
              : 'The page or engineering resource you are looking for does not exist or has been moved.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 flex-col sm:flex-row justify-center pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#FF1E27] to-[#D31019] text-white shadow-lg shadow-[#FF1E27]/25 hover:shadow-[#FF1E27]/40 hover:-translate-y-0.5 transition-all min-h-[44px]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>{isAr ? 'العودة للصفحة الرئيسية' : 'Return to Homepage'}</span>
          </Link>

          <Link
            href="/#contact"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.1] text-white hover:-translate-y-0.5 transition-all min-h-[44px]"
          >
            <svg className="w-4 h-4 text-[#FF1E27]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>{isAr ? 'طلب استشارة هندسية' : 'Contact Support'}</span>
          </Link>
        </div>
      </main>

      <footer className="absolute bottom-4 inset-x-0 text-center">
        <p className="text-[11px] text-[#475569]">&copy; E-MEP Electromechanical Works</p>
      </footer>
    </div>
  );
}
