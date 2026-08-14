"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from './LanguageContext';

export default function Header() {
  const { language, setLanguage, t, isMounted } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === '/';

  const [activeSection, setActiveSection] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);

  const isAr = isMounted && language === 'ar';

  // Core navigation sections for Desktop Header
  const desktopNavItems = [
    { id: 'hero', i18nKey: 'nav_home' },
    { id: 'about', i18nKey: 'nav_about' },
    { id: 'services', i18nKey: 'nav_services' },
    { id: 'bim', i18nKey: 'nav_bim' },
    { id: 'projects', i18nKey: 'nav_projects' },
    { id: 'contact', i18nKey: 'nav_contact' },
  ];

  // Mobile Bottom Dock Quick Items (5 Essential Destinations: Home, About Us, Services, BIM, Projects)
  const mobileBottomItems = [
    { id: 'hero', i18nKey: 'nav_home', icon: 'fa-solid fa-house' },
    { id: 'about', i18nKey: 'nav_about', icon: 'fa-solid fa-building' },
    { id: 'services', i18nKey: 'nav_services', icon: 'fa-solid fa-gears' },
    { id: 'bim', i18nKey: 'nav_bim', icon: 'fa-solid fa-cube' },
    { id: 'projects', i18nKey: 'nav_projects', icon: 'fa-solid fa-layer-group' },
  ];

  // ScrollSpy & Progress Tracker
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const totalDocHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalDocHeight > 0) {
        const progress = Math.min(100, Math.max(0, (currentScrollY / totalDocHeight) * 100));
        setScrollProgress(progress);
      }

      if (!isHomePage) return;

      const scrollPos = currentScrollY + 250;
      const sections = [
        { id: 'hero', el: document.getElementById('heroTrack') },
        { id: 'about', el: document.getElementById('about') },
        { id: 'services', el: document.getElementById('services') },
        { id: 'bim', el: document.getElementById('bim') },
        { id: 'projects', el: document.getElementById('projects') },
        { id: 'contact', el: document.getElementById('contact') },
      ];

      for (let i = sections.length - 1; i >= 0; i--) {
        const { id, el } = sections[i];
        if (el && scrollPos >= el.offsetTop) {
          setActiveSection(id);
          if (typeof window !== 'undefined') {
            const targetHash = id === 'hero' ? '' : `#${id}`;
            if (window.location.hash !== targetHash && !(id === 'hero' && !window.location.hash)) {
              window.history.replaceState(null, '', id === 'hero' ? window.location.pathname : `#${id}`);
            }
          }
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const handleNavigate = (id: string, href?: string) => {
    if (href) {
      router.push(href);
      return;
    }

    if (!isHomePage) {
      if (id === 'hero') {
        router.push('/');
      } else {
        try {
          sessionStorage.setItem('emep_scroll_target', id);
        } catch {
          // ignore
        }
        router.push(`/#${id}`);
      }
      return;
    }

    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.replaceState(null, '', window.location.pathname);
      const resetEvent = new CustomEvent('resetHeroCanvas');
      window.dispatchEvent(resetEvent);
    } else {
      const targetElement = document.getElementById(id);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
        window.history.replaceState(null, '', `#${id}`);
      }
    }
  };

  const toggleLanguage = () => {
    const nextLang = (isMounted ? language : 'en') === 'en' ? 'ar' : 'en';
    setLanguage(nextLang);
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. TOP HEADER (الموقع بالكامل) */}
      {/* ========================================================================= */}
      <header 
        className="fixed top-0 inset-x-0 z-50 bg-[#0A0A0C]/90 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_4px_25px_rgba(0,0,0,0.7)]"
        id="navbar"
        role="banner"
      >
        {/* Red Reading Progress Bar */}
        <div 
          className="absolute top-0 left-0 h-[2.5px] bg-gradient-to-r from-[#D31019] via-[#FF1E27] to-[#FF4040] z-50 transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress}%` }}
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Brand Logo & Name */}
          <button
            type="button"
            onClick={() => handleNavigate('hero')}
            className="flex items-center gap-3 text-start group cursor-pointer focus:outline-none flex-shrink-0 touch-manipulation"
            aria-label="E-MEP Homepage"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-xl p-1 shadow-[0_0_15px_rgba(255,255,255,0.15)] group-hover:scale-105 transition-transform duration-300 flex items-center justify-center flex-shrink-0">
              <Image 
                src="/logo/logo.png" 
                alt="E-MEP Logo" 
                width={28} 
                height={28} 
                style={{ width: '28px', height: '28px', objectFit: 'contain' }} 
                priority 
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base sm:text-lg tracking-wider text-white group-hover:text-[#FF1E27] transition-colors leading-none">
                  E-MEP
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF1E27] shadow-[0_0_8px_#FF1E27]"></span>
              </div>
              <span className="text-[8px] sm:text-[9px] font-semibold text-[#94A3B8] tracking-widest uppercase mt-0.5 leading-none">
                Electromechanical
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links (>= 1024px) */}
          <nav className="hidden lg:flex items-center" aria-label="Desktop Navigation">
            <ul className="flex items-center gap-1 p-1 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              {desktopNavItems.map((item) => {
                const isActive = isHomePage && activeSection === item.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleNavigate(item.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap touch-manipulation ${
                        isActive 
                          ? 'text-white bg-[#FF1E27] shadow-[0_0_15px_rgba(255,30,39,0.4)]' 
                          : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.06]'
                      }`}
                    >
                      {t(item.i18nKey)}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right Action Controls: Blog Button + Language Switcher */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            
            {/* Direct Blog Access Button */}
            <Link
              href="/blog"
              className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer h-9 shadow-sm whitespace-nowrap touch-manipulation ${
                pathname.startsWith('/blog')
                  ? 'bg-[#FF1E27] text-white shadow-[0_0_15px_rgba(255,30,39,0.4)]'
                  : 'bg-white/[0.06] hover:bg-[#FF1E27]/15 text-white hover:text-[#FF1E27] border border-white/[0.12] hover:border-[#FF1E27]/40'
              }`}
              aria-label={isAr ? 'الانتقال إلى المدونة والمقالات' : 'Go to Blog Articles'}
            >
              <i className="fa-solid fa-newspaper text-xs text-[#FF1E27]"></i>
              <span>{isAr ? 'المقالات' : 'Blog'}</span>
            </Link>

            {/* Language Switcher */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] hover:border-[#FF1E27]/40 text-white text-xs font-bold transition-all cursor-pointer shadow-sm h-9 whitespace-nowrap touch-manipulation"
              aria-label={`Switch language to ${isAr ? 'English' : 'العربية'}`}
            >
              <i className="fa-solid fa-globe text-[#FF1E27] text-xs"></i>
              <span>{isAr ? 'EN' : 'العربية'}</span>
            </button>
          </div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MOBILE BOTTOM NAVIGATION DOCK (Home, About Us, Services, BIM, Projects) */}
      {/* ========================================================================= */}
      <nav 
        className="lg:hidden fixed inset-x-3 sm:inset-x-6 z-40 bg-[#0D0D12]/95 backdrop-blur-2xl border border-white/[0.12] rounded-2xl py-2 px-2 shadow-[0_12px_40px_rgba(0,0,0,0.9)] select-none"
        style={{
          bottom: 'max(0.75rem, env(safe-area-inset-bottom, 0.75rem))'
        }}
        aria-label="Mobile Navigation Dock"
      >
        <div className="grid grid-cols-5 w-full items-center justify-items-center">
          {mobileBottomItems.map((item) => {
            const isActive = isHomePage && activeSection === item.id;
              
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item.id)}
                aria-label={t(item.i18nKey)}
                title={t(item.i18nKey)}
                className={`flex flex-col items-center justify-center w-12 h-11 rounded-xl transition-all cursor-pointer touch-manipulation ${
                  isActive 
                    ? 'text-[#FF1E27] bg-[#FF1E27]/15 shadow-[0_0_12px_rgba(255,30,39,0.35)] scale-105' 
                    : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <i className={`${item.icon} text-lg mb-0.5 ${isActive ? 'text-[#FF1E27]' : ''}`} aria-hidden="true"></i>
                <span className="text-[9px] font-bold leading-none tracking-tight whitespace-nowrap">
                  {t(item.i18nKey)}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
