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

  // All 7 complete sections with standard classic web icons (FontAwesome)
  const navItems = [
    { 
      id: 'hero', 
      i18nKey: 'nav_home',
      iconClass: 'fa-solid fa-house'
    },
    { 
      id: 'about', 
      i18nKey: 'nav_about',
      iconClass: 'fa-solid fa-building'
    },
    { 
      id: 'services', 
      i18nKey: 'nav_services',
      iconClass: 'fa-solid fa-gears'
    },
    { 
      id: 'bim', 
      i18nKey: 'nav_bim',
      iconClass: 'fa-solid fa-cube'
    },
    { 
      id: 'projects', 
      i18nKey: 'nav_projects',
      iconClass: 'fa-solid fa-layer-group'
    },
    { 
      id: 'blog', 
      i18nKey: 'nav_blog', 
      href: '/blog',
      iconClass: 'fa-solid fa-newspaper'
    },
    { 
      id: 'contact', 
      i18nKey: 'nav_contact',
      iconClass: 'fa-solid fa-envelope'
    },
  ];

  // All 7 sections for the Icon-Only mobile bottom bar
  const allBottomNavItems = [
    { id: 'hero', i18nKey: 'nav_home', iconClass: 'fa-solid fa-house' },
    { id: 'about', i18nKey: 'nav_about', iconClass: 'fa-solid fa-building' },
    { id: 'services', i18nKey: 'nav_services', iconClass: 'fa-solid fa-gears' },
    { id: 'bim', i18nKey: 'nav_bim', iconClass: 'fa-solid fa-cube' },
    { id: 'projects', i18nKey: 'nav_projects', iconClass: 'fa-solid fa-layer-group' },
    { id: 'blog', i18nKey: 'nav_blog', iconClass: 'fa-solid fa-newspaper', href: '/blog' },
    { id: 'contact', i18nKey: 'nav_contact', iconClass: 'fa-solid fa-envelope' },
  ];

  // Scroll listener for progress bar, active section, and live URL hash update
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const totalDocHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalDocHeight > 0) {
        const progress = Math.min(100, Math.max(0, (currentScrollY / totalDocHeight) * 100));
        setScrollProgress(progress);
      }

      if (!isHomePage) return;

      const scrollPos = currentScrollY + 200;
      const heroTrack = document.getElementById('heroTrack');
      const aboutSec = document.getElementById('about');
      const servicesSec = document.getElementById('services');
      const bimSec = document.getElementById('bim');
      const projectsSec = document.getElementById('projects');
      const contactSec = document.getElementById('contact');

      const sections = [
        { id: 'hero', element: heroTrack },
        { id: 'about', element: aboutSec },
        { id: 'services', element: servicesSec },
        { id: 'bim', element: bimSec },
        { id: 'projects', element: projectsSec },
        { id: 'contact', element: contactSec },
      ];

      for (let i = sections.length - 1; i >= 0; i--) {
        const { id, element } = sections[i];
        if (element) {
          const top = element.offsetTop;
          if (scrollPos >= top) {
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
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const handleScrollTo = (id: string, href?: string) => {
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
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
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
      <header 
        className="fixed top-0 inset-x-0 z-50 bg-[#0A0A0C]/95 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.8)]" 
        id="navbar" 
        role="banner"
      >
        {/* Scroll Reading Progress Bar */}
        <div 
          className="absolute top-0 left-0 h-[2.5px] bg-gradient-to-r from-[#D31019] via-[#FF1E27] to-[#FF4040] shadow-[0_0_10px_#FF1E27] z-50 transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress}%` }}
          aria-hidden="true"
        />

        {/* Clean Proportionate Header Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">

          {/* Brand Logo & Title */}
          {isHomePage ? (
            <button
              type="button"
              className="flex items-center gap-2.5 text-start group cursor-pointer flex-shrink-0"
              onClick={() => handleScrollTo('hero')}
              aria-label="E-MEP Electromechanical Works Homepage"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-xl p-1 shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:scale-105 transition-transform duration-300 flex items-center justify-center flex-shrink-0">
                <Image 
                  src="/logo/logo.png" 
                  alt="E-MEP Logo" 
                  width={26} 
                  height={26} 
                  style={{ width: '26px', height: '26px', objectFit: 'contain' }} 
                  priority 
                />
              </div>
              <div className="flex flex-col flex-shrink-0">
                <div className="flex items-center gap-1">
                  <span className="font-black text-sm sm:text-base tracking-wider text-white group-hover:text-[#FF1E27] transition-colors leading-none whitespace-nowrap">
                    E-MEP
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF1E27] shadow-[0_0_8px_#FF1E27] flex-shrink-0"></span>
                </div>
                <span className="text-[7.5px] sm:text-[8.5px] font-semibold text-[#94A3B8] tracking-widest uppercase mt-0.5 leading-none whitespace-nowrap">
                  Electromechanical
                </span>
              </div>
            </button>
          ) : (
            <Link 
              href="/" 
              className="flex items-center gap-2.5 group flex-shrink-0" 
              aria-label="E-MEP Electromechanical Works Homepage"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-xl p-1 shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:scale-105 transition-transform duration-300 flex items-center justify-center flex-shrink-0">
                <Image 
                  src="/logo/logo.png" 
                  alt="E-MEP Logo" 
                  width={26} 
                  height={26} 
                  style={{ width: '26px', height: '26px', objectFit: 'contain' }} 
                  priority 
                />
              </div>
              <div className="flex flex-col flex-shrink-0">
                <div className="flex items-center gap-1">
                  <span className="font-black text-sm sm:text-base tracking-wider text-white group-hover:text-[#FF1E27] transition-colors leading-none whitespace-nowrap">
                    E-MEP
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF1E27] shadow-[0_0_8px_#FF1E27] flex-shrink-0"></span>
                </div>
                <span className="text-[7.5px] sm:text-[8.5px] font-semibold text-[#94A3B8] tracking-widest uppercase mt-0.5 leading-none whitespace-nowrap">
                  Electromechanical
                </span>
              </div>
            </Link>
          )}

          {/* Desktop Navigation Links (Visible on >= 1024px) */}
          <nav
            className="hidden lg:flex items-center flex-shrink-0"
            role="navigation"
            aria-label="Main Navigation"
          >
            <ul className="flex items-center gap-1 p-1 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              {navItems.map((item) => {
                const isActive = (isHomePage && activeSection === item.id) || (pathname.startsWith('/blog') && item.id === 'blog');
                return (
                  <li key={item.id} className="flex-shrink-0">
                    <button
                      type="button"
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap flex-shrink-0 ${
                        isActive 
                          ? 'text-white bg-[#FF1E27] shadow-[0_0_15px_rgba(255,30,39,0.4)]' 
                          : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.06]'
                      }`}
                      onClick={() => handleScrollTo(item.id, item.href)}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {t(item.i18nKey)}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Header Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            
            {/* Language Switcher */}
            <button
              id="langToggleBtn"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/[0.12] bg-white/[0.04] hover:bg-[#FF1E27]/10 hover:border-[#FF1E27]/40 text-white text-xs font-bold transition-all cursor-pointer shadow-sm h-8 sm:h-9 whitespace-nowrap flex-shrink-0"
              onClick={toggleLanguage}
              aria-label={`Switch language to ${isAr ? 'English' : 'العربية'}`}
              type="button"
            >
              <i className="fa-solid fa-globe text-[#FF1E27] text-xs"></i>
              <span id="langText" className="whitespace-nowrap">{isAr ? 'EN' : 'العربية'}</span>
            </button>

            {/* Quick Contact CTA (Desktop >= 1024px) */}
            <button
              type="button"
              onClick={() => handleScrollTo('contact')}
              className="hidden lg:inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#FF1E27] to-[#D31019] text-white text-xs font-bold shadow-[0_0_20px_rgba(211,16,25,0.35)] hover:shadow-[0_0_25px_rgba(255,30,39,0.5)] hover:-translate-y-0.5 transition-all cursor-pointer h-9 sm:h-10 whitespace-nowrap flex-shrink-0"
            >
              <i className="fa-solid fa-paper-plane text-xs"></i>
              <span className="whitespace-nowrap">{t('nav_contact')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Floating Bottom Quick-Action Dock: ICON-ONLY, ALL 7 SECTIONS in ONE STATIC BAR */}
      <nav 
        className="lg:hidden fixed bottom-3 inset-x-3 sm:inset-x-6 z-40 bg-[#0D0D12]/95 backdrop-blur-2xl border border-white/[0.12] rounded-2xl py-2 px-1 shadow-[0_12px_40px_rgba(0,0,0,0.9)]"
        aria-label="Mobile Quick Bottom Navigation"
      >
        <div className="grid grid-cols-7 w-full items-center justify-items-center">
          {allBottomNavItems.map((item) => {
            const isActive = item.href 
              ? pathname.startsWith('/blog') 
              : (isHomePage && activeSection === item.id);
              
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleScrollTo(item.id, item.href)}
                aria-label={t(item.i18nKey)}
                title={t(item.i18nKey)}
                className={`flex flex-col items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl transition-all cursor-pointer ${
                  isActive 
                    ? 'text-[#FF1E27] bg-[#FF1E27]/20 shadow-[0_0_12px_rgba(255,30,39,0.4)] scale-105' 
                    : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <i className={`${item.iconClass} text-base sm:text-lg`} aria-hidden="true"></i>
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-[#FF1E27] mt-0.5 shadow-[0_0_6px_#FF1E27]"></span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
