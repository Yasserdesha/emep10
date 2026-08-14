"use client";

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/components/LanguageContext';
import Link from 'next/link';

export default function NotFound() {
  const { t, language, isMounted } = useLanguage();
  const isAr = isMounted && language === 'ar';

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#F8FAFC] flex flex-col justify-center items-center py-20 px-4 text-center relative overflow-hidden selection:bg-[#FF1E27] selection:text-white" dir={isMounted ? (isAr ? 'rtl' : 'ltr') : 'ltr'}>

      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF1E27]/10 blur-[140px] rounded-full" />
      </div>

      {/* Minimal Header */}
      <header className="absolute top-0 inset-x-0 border-b border-white/[0.04] bg-[#0A0A0C]/80 backdrop-blur-md" role="banner">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-white p-1.5 rounded-lg shadow-md group-hover:scale-105 transition-transform">
              <Image src="/logo/logo.png" alt="E-MEP Logo" width={34} height={34} style={{ width: '34px', height: '34px', objectFit: 'contain' }} />
            </div>
            <div className="flex flex-col text-start">
              <span className="font-black text-white text-base tracking-wider leading-none">E-MEP</span>
              <span className="text-[10px] text-[#64748B] font-semibold uppercase tracking-widest mt-0.5">Electromechanical</span>
            </div>
          </Link>
          
          <Link 
            href="/"
            className="text-xs font-bold text-[#94A3B8] hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <i className="fa-solid fa-house text-xs"></i>
            <span>{isAr ? 'الرئيسية' : 'Home'}</span>
          </Link>
        </div>
      </header>

      {/* 404 card */}
      <main className="max-w-[560px] w-full p-8 sm:p-12 rounded-3xl bg-[#111116]/90 border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden z-10 backdrop-blur-xl space-y-6">
        {/* Glow Top Line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#D31019] via-[#FF1E27] to-[#FF4040]" />

        {/* Warning Icon with Pulse Glow */}
        <div className="w-16 h-16 bg-[#FF1E27]/10 border border-[#FF1E27]/30 rounded-2xl flex items-center justify-center mx-auto text-2xl text-[#FF1E27] shadow-[0_0_35px_rgba(211,16,25,0.35)] animate-pulse">
          <i className="fa-solid fa-triangle-exclamation"></i>
        </div>

        {/* 404 Number */}
        <div className="text-7xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-[#475569] font-mono leading-none tracking-tighter drop-shadow-sm">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-black text-white">
            {t('err_title')}
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed max-w-md mx-auto">
            {t('err_desc')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 flex-col sm:flex-row justify-center pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#FF1E27] to-[#D31019] text-white shadow-lg shadow-[#FF1E27]/25 hover:shadow-[#FF1E27]/40 hover:-translate-y-0.5 transition-all"
          >
            <i className="fa-solid fa-house text-xs"></i>
            <span>{t('err_btn_home')}</span>
          </Link>

          <Link
            href="/#contact"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.1] text-white hover:-translate-y-0.5 transition-all"
          >
            <i className="fa-solid fa-headset text-xs text-[#FF1E27]"></i>
            <span>{t('err_btn_support')}</span>
          </Link>
        </div>
      </main>

    </div>
  );
}
