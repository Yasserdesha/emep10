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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleScrollTo = (id: string, href?: string) => {
    setMobileMenuOpen(false);

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">

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
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-black text-sm sm:text-base tracking-wider text-white group-hover:text-[#FF1E27] transition-colors leading-none">
                    E-MEP
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF1E27] shadow-[0_0_8px_#FF1E27]"></span>
                </div>
                <span className="text-[7.5px] sm:text-[8.5px] font-semibold text-[#94A3B8] tracking-widest uppercase mt-0.5 leading-none">
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
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-black text-sm sm:text-base tracking-wider text-white group-hover:text-[#FF1E27] transition-colors leading-none">
                    E-MEP
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF1E27] shadow-[0_0_8px_#FF1E27]"></span>
                </div>
                <span className="text-[7.5px] sm:text-[8.5px] font-semibold text-[#94A3B8] tracking-widest uppercase mt-0.5 leading-none">
                  Electromechanical
                </span>
              </div>
            </Link>
          )}

          {/* Desktop Navigation Links (Visible on >= 1024px) */}
          <nav
            className="hidden lg:flex items-center"
            role="navigation"
            aria-label="Main Navigation"
          >
            <ul className="flex items-center gap-1 p-1 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              {navItems.map((item) => {
                const isActive = (isHomePage && activeSection === item.id) || (pathname.startsWith('/blog') && item.id === 'blog');
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
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
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-white/[0.12] bg-white/[0.04] hover:bg-[#FF1E27]/10 hover:border-[#FF1E27]/40 text-white text-xs font-bold transition-all cursor-pointer shadow-sm h-8 sm:h-9"
              onClick={toggleLanguage}
              aria-label={`Switch language to ${isAr ? 'English' : 'العربية'}`}
              type="button"
            >
              <i className="fa-solid fa-globe text-[#FF1E27] text-xs"></i>
              <span id="langText">{isAr ? 'EN' : 'العربية'}</span>
            </button>

            {/* Quick Contact CTA (Desktop >= 1024px) */}
            <button
              type="button"
              onClick={() => handleScrollTo('contact')}
              className="hidden lg:inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#FF1E27] to-[#D31019] text-white text-xs font-bold shadow-[0_0_20px_rgba(211,16,25,0.35)] hover:shadow-[0_0_25px_rgba(255,30,39,0.5)] hover:-translate-y-0.5 transition-all cursor-pointer h-9 sm:h-10"
            >
              <i className="fa-solid fa-paper-plane text-xs"></i>
              <span>{t('nav_contact')}</span>
            </button>

            {/* Mobile Icon-Only Hamburger Menu Button */}
            <button
              className={`lg:hidden flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-white/[0.12] bg-white/[0.04] text-white hover:border-[#FF1E27]/50 transition-all cursor-pointer flex-shrink-0 ${
                mobileMenuOpen ? 'border-[#FF1E27] bg-[#FF1E27]/20 text-[#FF1E27]' : ''
              }`}
              id="mobileMenuBtn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobileNavDrawer"
              aria-label={isAr ? "فتح قائمة الأقسام" : "Open sections menu"}
              type="button"
            >
              <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark text-[#FF1E27]' : 'fa-bars text-white'} text-sm`}></i>
            </button>
          </div>
        </div>

        {/* Modern Collapsible Mobile Menu Drawer (Attached Directly Below Header on Mobile/Tablet < 1024px) */}
        {mobileMenuOpen && (
          <div 
            id="mobileNavDrawer"
            className="lg:hidden fixed top-14 inset-x-0 bottom-0 bg-[#0A0A0C]/98 backdrop-blur-3xl z-[100] overflow-y-auto border-t border-white/[0.08] shadow-[0_30px_60px_rgba(0,0,0,0.95)] animate-fadeIn"
          >
            <div className="px-4 py-6 space-y-4 max-w-lg mx-auto pb-28">
              {/* Header Drawer Info */}
              <div className="flex items-center justify-between px-2 pb-2 border-b border-white/[0.06]">
                <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
                  {isAr ? 'أقسام الموقع الرئيسية' : 'Website Sections'}
                </span>
                <button 
                  type="button" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs text-[#FF1E27] font-bold p-1 hover:underline cursor-pointer"
                >
                  {isAr ? 'إغلاق ✕' : 'Close ✕'}
                </button>
              </div>

              {/* Nav list of all 7 sections */}
              <ul className="space-y-2">
                {navItems.map((item) => {
                  const isActive = (isHomePage && activeSection === item.id) || (pathname.startsWith('/blog') && item.id === 'blog');
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                          isActive 
                            ? 'bg-[#FF1E27] text-white shadow-[0_0_20px_rgba(255,30,39,0.4)]' 
                            : 'bg-white/[0.03] border border-white/[0.06] text-[#CBD5E1] hover:bg-white/[0.08] hover:text-white'
                        }`}
                        onClick={() => handleScrollTo(item.id, item.href)}
                      >
                        <div className="flex items-center gap-3">
                          <i className={`${item.iconClass} ${isActive ? 'text-white' : 'text-[#FF1E27]'} text-base`}></i>
                          <span>{t(item.i18nKey)}</span>
                        </div>
                        <i className={`fa-solid fa-chevron-right rtl:rotate-180 text-xs ${isActive ? 'text-white' : 'text-gray-500'}`}></i>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* In-drawer Quick WhatsApp Cards */}
              <div className="pt-4 border-t border-white/[0.08] space-y-2">
                <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider block px-2">
                  {isAr ? 'تواصل مباشر مع مهندسي التنفيذ' : 'Direct Engineering Support'}
                </span>

                <a
                  href="https://wa.me/201111079467"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] font-bold text-xs flex items-center justify-between hover:bg-[#25D366]/25 transition-all min-h-[46px]"
                >
                  <div className="flex items-center gap-2.5">
                    <i className="fa-brands fa-whatsapp text-lg"></i>
                    <span>{isAr ? 'م. أسامة محمد (واتساب)' : 'Eng. Osama Mohamed (WhatsApp)'}</span>
                  </div>
                  <span className="text-[11px] text-[#25D366]/80 font-mono">01111079467</span>
                </a>

                <a
                  href="https://wa.me/201030834372"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] font-bold text-xs flex items-center justify-between hover:bg-[#25D366]/25 transition-all min-h-[46px]"
                >
                  <div className="flex items-center gap-2.5">
                    <i className="fa-brands fa-whatsapp text-lg"></i>
                    <span>{isAr ? 'م. علي ربيع (واتساب)' : 'Eng. Ali Rabie (WhatsApp)'}</span>
                  </div>
                  <span className="text-[11px] text-[#25D366]/80 font-mono">01030834372</span>
                </a>
              </div>
            </div>
          </div>
        )}
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
