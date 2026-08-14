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

  // All 7 complete sections defined clearly for desktop and mobile
  const navItems = [
    { 
      id: 'hero', 
      i18nKey: 'nav_home',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      id: 'about', 
      i18nKey: 'nav_about',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    { 
      id: 'services', 
      i18nKey: 'nav_services',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    { 
      id: 'bim', 
      i18nKey: 'nav_bim',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
        </svg>
      )
    },
    { 
      id: 'projects', 
      i18nKey: 'nav_projects',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      )
    },
    { 
      id: 'blog', 
      i18nKey: 'nav_blog', 
      href: '/blog',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      )
    },
    { 
      id: 'contact', 
      i18nKey: 'nav_contact',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
  ];

  // Scroll listener for progress bar and scroll-spy
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
      const resetEvent = new CustomEvent('resetHeroCanvas');
      window.dispatchEvent(resetEvent);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const toggleLanguage = () => {
    const nextLang = (isMounted ? language : 'en') === 'en' ? 'ar' : 'en';
    setLanguage(nextLang);
  };

  return (
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Brand Logo & Title */}
        {isHomePage ? (
          <button
            type="button"
            className="flex items-center gap-2.5 sm:gap-3 text-start group cursor-pointer"
            onClick={() => handleScrollTo('hero')}
            aria-label="E-MEP Electromechanical Works Homepage"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-xl p-1 shadow-[0_0_20px_rgba(255,255,255,0.2)] group-hover:scale-105 transition-transform duration-300 flex items-center justify-center flex-shrink-0">
              <Image 
                src="/logo/logo.png" 
                alt="E-MEP Logo" 
                width={30} 
                height={30} 
                style={{ width: '30px', height: '30px', objectFit: 'contain' }} 
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
              <span className="text-[8.5px] sm:text-[9px] font-semibold text-[#94A3B8] tracking-widest uppercase mt-0.5 leading-none">
                Electromechanical
              </span>
            </div>
          </button>
        ) : (
          <Link 
            href="/" 
            className="flex items-center gap-2.5 sm:gap-3 group" 
            aria-label="E-MEP Electromechanical Works Homepage"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-xl p-1 shadow-[0_0_20px_rgba(255,255,255,0.2)] group-hover:scale-105 transition-transform duration-300 flex items-center justify-center flex-shrink-0">
              <Image 
                src="/logo/logo.png" 
                alt="E-MEP Logo" 
                width={30} 
                height={30} 
                style={{ width: '30px', height: '30px', objectFit: 'contain' }} 
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
              <span className="text-[8.5px] sm:text-[9px] font-semibold text-[#94A3B8] tracking-widest uppercase mt-0.5 leading-none">
                Electromechanical
              </span>
            </div>
          </Link>
        )}

        {/* Desktop Navigation Links */}
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
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Language Switcher */}
          <button
            id="langToggleBtn"
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-white/[0.1] bg-white/[0.04] hover:bg-[#FF1E27]/10 hover:border-[#FF1E27]/40 text-white text-xs font-bold transition-all cursor-pointer shadow-sm h-9 sm:h-10"
            onClick={toggleLanguage}
            aria-label={`Switch language to ${isAr ? 'English' : 'العربية'}`}
            type="button"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF1E27]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span id="langText">{isAr ? 'EN' : 'العربية'}</span>
          </button>

          {/* Quick Contact CTA (Desktop) */}
          <button
            type="button"
            onClick={() => handleScrollTo('contact')}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#FF1E27] to-[#D31019] text-white text-xs font-bold shadow-[0_0_20px_rgba(211,16,25,0.35)] hover:shadow-[0_0_25px_rgba(255,30,39,0.5)] hover:-translate-y-0.5 transition-all cursor-pointer h-10"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>{t('nav_contact')}</span>
          </button>

          {/* Mobile Collapsible Menu Toggle Button */}
          <button
            className={`lg:hidden flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-white/[0.12] bg-white/[0.04] text-gray-200 hover:text-white transition-all cursor-pointer ${
              mobileMenuOpen ? 'border-[#FF1E27]/60 bg-[#FF1E27]/20 text-[#FF1E27]' : ''
            }`}
            id="mobileMenuBtn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobileNavDrawer"
            aria-label="Toggle navigation menu"
            type="button"
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5 text-[#FF1E27]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Modern Collapsible Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div 
          id="mobileNavDrawer"
          className="lg:hidden border-t border-white/[0.08] bg-[#0A0A0C]/98 backdrop-blur-3xl shadow-[0_30px_60px_rgba(0,0,0,0.95)] animate-fadeIn"
        >
          <div className="px-4 py-5 space-y-4 max-w-lg mx-auto">
            {/* Nav list of all 7 sections */}
            <ul className="space-y-1.5">
              {navItems.map((item) => {
                const isActive = (isHomePage && activeSection === item.id) || (pathname.startsWith('/blog') && item.id === 'blog');
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-[#FF1E27]/15 border border-[#FF1E27]/30 text-[#FF1E27]' 
                          : 'text-[#CBD5E1] hover:bg-white/[0.05] hover:text-white'
                      }`}
                      onClick={() => handleScrollTo(item.id, item.href)}
                    >
                      <div className="flex items-center gap-3">
                        <span className={isActive ? 'text-[#FF1E27]' : 'text-gray-400'}>{item.icon}</span>
                        <span>{t(item.i18nKey)}</span>
                      </div>
                      <svg className={`w-4 h-4 rtl:rotate-180 transition-transform ${isActive ? 'text-[#FF1E27]' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* In-drawer Quick WhatsApp Cards */}
            <div className="pt-3 border-t border-white/[0.08] space-y-2">
              <a
                href="https://wa.me/201111079467"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] font-bold text-xs flex items-center justify-between hover:bg-[#25D366]/20 transition-all min-h-[44px]"
              >
                <div className="flex items-center gap-2">
                  <i className="fa-brands fa-whatsapp text-base"></i>
                  <span>{isAr ? 'واتساب م. أسامة محمد' : 'WhatsApp Eng. Osama Mohamed'}</span>
                </div>
                <span className="text-[11px] text-[#25D366]/80 font-mono">01111079467</span>
              </a>

              <a
                href="https://wa.me/201030834372"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] font-bold text-xs flex items-center justify-between hover:bg-[#25D366]/20 transition-all min-h-[44px]"
              >
                <div className="flex items-center gap-2">
                  <i className="fa-brands fa-whatsapp text-base"></i>
                  <span>{isAr ? 'واتساب م. علي ربيع' : 'WhatsApp Eng. Ali Rabie'}</span>
                </div>
                <span className="text-[11px] text-[#25D366]/80 font-mono">01030834372</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
