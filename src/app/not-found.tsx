"use client";

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/components/LanguageContext';
import Link from 'next/link';

export default function NotFound() {
  const { t, language } = useLanguage();
  const isAr = language === 'ar';

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#F8FAFC] flex flex-col justify-center items-center py-24 px-6 text-center relative overflow-hidden">

      {/* Background glow overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(211, 16, 25, 0.12) 0%, rgba(10, 10, 12, 0.95) 70%, #0A0A0C 100%)'
        }}
      ></div>

      {/* Header simulation matching official design */}
      <header className="site-header absolute top-0 inset-x-0" role="banner">
        <div className="header-container flex justify-between items-center max-w-7xl mx-auto px-6 py-4">
          <Link href="/" className="brand-logo-link flex items-center gap-3">
            <div className="header-logo-badge">
              <Image src="/logo/logo.png" alt="E-MEP Electromechanical Works Logo" width={38} height={38} className="brand-logo" priority style={{ width: '38px', height: '38px', objectFit: 'contain' }} />
            </div>
            <div className="brand-text">
              <span className="brand-name">E-MEP</span>
              <span className="brand-sub">Electromechanical Works</span>
            </div>
          </Link>
          <div className="header-actions">
            {/* Lang switcher on 404 */}
            <button
              type="button"
              className="lang-btn"
              onClick={() => {
                const newLang = language === 'en' ? 'ar' : 'en';
                localStorage.setItem('emep_lang', newLang);
                window.location.reload();
              }}
              aria-label="Toggle language"
            >
              <i className="fa-solid fa-globe"></i>
              <span>{isAr ? 'English' : 'العربية'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 404 card container */}
      <main className="max-w-[620px] w-full glass-panel p-8 md:p-12 border border-white/10 shadow-2xl relative overflow-hidden z-10">
        {/* Glow bar */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#D31019] to-[#FF1E27]"></div>

        <div className="w-20 h-20 bg-[#FF1E27]/10 border border-[#FF1E27]/30 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl text-[#FF1E27] shadow-[0_0_30px_rgba(211,16,25,0.3)]">
          <i className="fa-solid fa-triangle-exclamation"></i>
        </div>

        <div className="text-7xl md:text-8xl font-black text-[#FF1E27] font-mono leading-none mb-4 tracking-tighter drop-shadow-[0_0_35px_rgba(211,16,25,0.55)]">
          404
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
          {t('err_title')}
        </h1>

        <p className="text-sm text-[#94A3B8] mb-8 leading-relaxed">
          {t('err_desc')}
        </p>

        <div className="flex gap-4 flex-col sm:flex-row justify-center">
          <Link
            href="/"
            className="btn btn-primary px-6 py-3 rounded-md font-bold text-sm tracking-wide inline-flex items-center justify-center gap-2 focus:ring-2 focus:ring-[#FF1E27]"
          >
            <i className="fa-solid fa-house"></i>
            <span>{t('err_btn_home')}</span>
          </Link>

          <Link
            href="/#contact"
            className="btn btn-outline px-6 py-3 rounded-md font-bold text-sm tracking-wide inline-flex items-center justify-center gap-2 focus:ring-2 focus:ring-white/20"
          >
            <i className="fa-solid fa-headset"></i>
            <span>{t('err_btn_support')}</span>
          </Link>
        </div>
      </main>

    </div>
  );
}
