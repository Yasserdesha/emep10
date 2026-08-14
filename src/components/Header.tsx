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
  const [scrolled, setScrolled] = useState(false);

  const isAr = isMounted && language === 'ar';

  // Nav links items definition
  const navItems = [
    { id: 'hero', i18nKey: 'nav_home' },
    { id: 'about', i18nKey: 'nav_about' },
    { id: 'services', i18nKey: 'nav_services' },
    { id: 'bim', i18nKey: 'nav_bim' },
    { id: 'projects', i18nKey: 'nav_projects' },
    { id: 'blog', i18nKey: 'nav_blog', href: '/blog' },
    { id: 'contact', i18nKey: 'nav_contact' },
  ];

  // Scroll listener for header background and scroll-spy
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const scrollPos = window.scrollY + 250;

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
  }, []);

  const handleScrollTo = (id: string, href?: string) => {
    setMobileMenuOpen(false);

    if (href) {
      router.push(href);
      return;
    }

    if (!isHomePage) {
      router.push(id === 'hero' ? '/' : `/#${id}`);
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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header 
      className={`site-header transition-all duration-300 ${scrolled ? 'bg-[#0A0A0C]/95 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl py-2.5' : 'bg-[#0A0A0C]/80 backdrop-blur-md border-b border-white/[0.04] py-3.5'}`} 
      id="navbar" 
      role="banner"
    >
      <div className="header-container max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">

        {/* Brand logo & Text */}
        {isHomePage ? (
          <button
            type="button"
            className="brand-logo-link cursor-pointer flex items-center gap-3 text-start group"
            onClick={() => handleScrollTo('hero')}
            aria-label="E-MEP Electromechanical Works Home"
          >
            <div className="header-logo-badge bg-white p-1.5 rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:scale-105 transition-transform duration-300">
              <Image src="/logo/logo.png" alt="E-MEP Logo" width={36} height={36} className="brand-logo" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
            </div>
            <div className="brand-text flex flex-col">
              <span className="brand-name font-black text-lg tracking-wider text-white group-hover:text-[#FF1E27] transition-colors">E-MEP</span>
              <span className="brand-sub text-[10px] font-semibold text-[#94A3B8] tracking-widest uppercase">Electromechanical</span>
            </div>
          </button>
        ) : (
          <Link href="/" className="brand-logo-link flex items-center gap-3 group" aria-label="E-MEP Electromechanical Works Home">
            <div className="header-logo-badge bg-white p-1.5 rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:scale-105 transition-transform duration-300">
              <Image src="/logo/logo.png" alt="E-MEP Logo" width={36} height={36} className="brand-logo" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
            </div>
            <div className="brand-text flex flex-col">
              <span className="brand-name font-black text-lg tracking-wider text-white group-hover:text-[#FF1E27] transition-colors">E-MEP</span>
              <span className="brand-sub text-[10px] font-semibold text-[#94A3B8] tracking-widest uppercase">Electromechanical</span>
            </div>
          </Link>
        )}

        {/* Main Navigation */}
        <nav
          className={`main-nav ${mobileMenuOpen ? 'open' : ''}`}
          id="mainNav"
          role="navigation"
          aria-label="Main Navigation"
        >
          <ul className="flex items-center gap-1 md:gap-2">
            {navItems.map((item) => {
              const isActive = (isHomePage && activeSection === item.id) || (pathname.startsWith('/blog') && item.id === 'blog');
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`nav-link px-3.5 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                      isActive 
                        ? 'text-white bg-white/[0.08] shadow-sm border border-white/[0.1] text-[#FF1E27]' 
                        : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.04]'
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

        {/* Header Actions */}
        <div className="header-actions flex items-center gap-3">
          {/* Language Switcher */}
          <button
            id="langToggleBtn"
            className="lang-btn inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/[0.12] bg-white/[0.04] hover:bg-[#FF1E27]/10 hover:border-[#FF1E27]/40 text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
            onClick={toggleLanguage}
            aria-label={`Switch to ${isAr ? 'English' : 'العربية'}`}
            type="button"
          >
            <i className="fa-solid fa-globe text-[#FF1E27]" aria-hidden="true"></i>
            <span id="langText">{isAr ? 'English' : 'العربية'}</span>
          </button>

          {/* Contact Quick CTA */}
          <button
            type="button"
            onClick={() => handleScrollTo('contact')}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#FF1E27] to-[#D31019] text-white text-xs font-bold shadow-[0_0_20px_rgba(211,16,25,0.35)] hover:shadow-[0_0_25px_rgba(255,30,39,0.5)] hover:scale-105 transition-all cursor-pointer"
          >
            <span>{t('nav_contact')}</span>
            <i className="fa-solid fa-arrow-right text-[10px] rtl:rotate-180"></i>
          </button>

          {/* Mobile Menu Toggle button */}
          <button
            className={`mobile-menu-toggle md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/[0.05] transition-colors ${mobileMenuOpen ? 'active' : ''}`}
            id="mobileMenuBtn"
            onClick={toggleMobileMenu}
            aria-expanded={mobileMenuOpen}
            aria-controls="mainNav"
            aria-label="Toggle menu"
            type="button"
          >
            <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-lg`}></i>
          </button>
        </div>
      </div>
    </header>
  );
}
