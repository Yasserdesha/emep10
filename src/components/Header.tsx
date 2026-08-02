"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLanguage } from './LanguageContext';

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Nav links items definition
  const navItems = [
    { id: 'hero', i18nKey: 'nav_home' },
    { id: 'about', i18nKey: 'nav_about' },
    { id: 'services', i18nKey: 'nav_services' },
    { id: 'bim', i18nKey: 'nav_bim' },
    { id: 'projects', i18nKey: 'nav_projects' },
    { id: 'contact', i18nKey: 'nav_contact' },
  ];

  // Scroll spy effect to highlight active section in header
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 250;

      // Check hero track or other sections
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
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTo = (id: string) => {
    setMobileMenuOpen(false);

    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Reset hero canvas if it is on page
      const resetEvent = new CustomEvent('resetHeroCanvas');
      window.dispatchEvent(resetEvent);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleScrollTo(id);
    }
  };

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'ar' : 'en';
    setLanguage(nextLang);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="site-header" id="navbar" role="banner">
      <div className="header-container">

        {/* Brand logo & Text */}
        <button
          type="button"
          className="brand-logo-link cursor-pointer"
          onClick={() => handleScrollTo('hero')}
          aria-label="E-MEP Electromechanical Works Home"
        >
          <div className="header-logo-badge">
            <Image src="/logo/logo.png" alt="E-MEP Electromechanical Works Logo" width={38} height={38} className="brand-logo" priority style={{ width: '38px', height: '38px', objectFit: 'contain' }} />
          </div>
          <div className="brand-text">
            <span className="brand-name">E-MEP</span>
            <span className="brand-sub">Electromechanical Works</span>
          </div>
        </button>

        {/* Main Navigation */}
        <nav
          className={`main-nav ${mobileMenuOpen ? 'open' : ''}`}
          id="mainNav"
          role="navigation"
          aria-label="Main Navigation"
        >
          <ul>
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={`nav-link w-full text-start md:w-auto ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => handleScrollTo(item.id)}
                  aria-current={activeSection === item.id ? 'page' : undefined}
                >
                  {t(item.i18nKey)}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Header Actions */}
        <div className="header-actions">
          {/* Language Switcher */}
          <button
            id="langToggleBtn"
            className="lang-btn"
            onClick={toggleLanguage}
            aria-label={`Switch to ${language === 'en' ? 'العربية' : 'English'}`}
            type="button"
          >
            <i className="fa-solid fa-globe" aria-hidden="true"></i>
            <span id="langText">{language === 'en' ? 'العربية' : 'English'}</span>
          </button>

          {/* Mobile Menu Toggle button */}
          <button
            className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
            id="mobileMenuBtn"
            onClick={toggleMobileMenu}
            aria-expanded={mobileMenuOpen}
            aria-controls="mainNav"
            aria-label="Toggle menu"
            type="button"
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
