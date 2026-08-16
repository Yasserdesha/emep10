"use client";

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageContext';
import { Button } from '@/components/ui/button';

export default function Footer() {
  const { t, language, isMounted } = useLanguage();
  const router = useRouter();
  const isAr = isMounted && language === 'ar';

  const navigateTo = (path: string) => {
    if (path.startsWith('/#')) {
      const id = path.replace('/#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        window.history.replaceState(null, '', path);
      } else {
        router.push(path);
      }
    } else {
      router.push(path);
    }
  };

  const openExternal = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="footer bg-[#050507] border-t border-white/[0.08] text-white pt-16 pb-12 mt-20 relative overflow-hidden" role="contentinfo">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <div className="footer-top grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="footer-logo-wrap flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl p-1 shadow-[0_0_15px_rgba(255,255,255,0.15)] flex items-center justify-center flex-shrink-0">
                <Image
                  src="/logo/logo.png"
                  alt="E-MEP Logo"
                  width={30}
                  height={30}
                  className="footer-logo object-contain"
                />
              </div>
              <span className="footer-logo-text font-black text-xl tracking-tight text-white">
                E-MEP
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              {t('footer_bio')}
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#FF1E27]">
              {t('footer_col_links')}
            </h4>
            <ul className="space-y-2 text-sm text-[#94A3B8]">
              <li>
                <button type="button" onClick={() => navigateTo('/#about')} className="hover:text-white transition-colors cursor-pointer text-start">
                  {t('nav_about')}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigateTo('/#services')} className="hover:text-white transition-colors cursor-pointer text-start">
                  {t('nav_services')}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigateTo('/#bim')} className="hover:text-white transition-colors cursor-pointer text-start">
                  {t('nav_bim')}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigateTo('/#projects')} className="hover:text-white transition-colors cursor-pointer text-start">
                  {t('nav_projects')}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigateTo('/blog')} className="hover:text-[#FF1E27] font-semibold transition-colors cursor-pointer text-start">
                  {isAr ? 'المقالات الهندسية' : 'Engineering Blog'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Services */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#FF1E27]">
              {t('footer_col_services')}
            </h4>
            <ul className="space-y-2 text-sm text-[#94A3B8]">
              <li>{t('feat_hvac_title')}</li>
              <li>{t('feat_fire_title')}</li>
              <li>{t('feat_plumb_title')}</li>
              <li>{t('feat_elec_title')}</li>
              <li>{t('nav_bim')}</li>
            </ul>
          </div>

          {/* Col 4: Contact & Socials */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#FF1E27]">
              {t('footer_col_contact')}
            </h4>
            
            {/* Email */}
            <button 
              type="button"
              onClick={() => window.location.href = 'mailto:info@emep-eg.com'}
              className="hover:text-[#FF1E27] transition-colors block text-sm text-[#94A3B8] text-start cursor-pointer w-full"
            >
              <p className="flex items-center gap-2">
                <i className="fa-solid fa-envelope red-text text-sm flex-shrink-0" aria-hidden="true"></i>
                <span dir="ltr">info@emep-eg.com</span>
              </p>
            </button>

            {/* WhatsApp Eng. Osama Mohamed */}
            <button
              type="button"
              onClick={() => openExternal('https://wa.me/201018898166?text=Hello%20E-MEP%20Engineering%20Team,%20I%20have%20a%20project%20inquiry.')}
              className="hover:text-[#25D366] transition-colors block text-sm text-[#94A3B8] text-start cursor-pointer w-full"
            >
              <p className="flex items-center gap-2">
                <i className="fa-brands fa-whatsapp text-[#25D366] text-base flex-shrink-0" aria-hidden="true"></i>
                <span>{isAr ? 'مهندس أسامة محمد' : 'Eng. Osama Mohamed'}</span>
              </p>
            </button>

            {/* WhatsApp Eng. Ali Rabie */}
            <button
              type="button"
              onClick={() => openExternal('https://wa.me/201030834372?text=Hello%20E-MEP%20Engineering%20Team,%20I%20have%20a%20project%20inquiry.')}
              className="hover:text-[#25D366] transition-colors block text-sm text-[#94A3B8] text-start cursor-pointer w-full"
            >
              <p className="flex items-center gap-2">
                <i className="fa-brands fa-whatsapp text-[#25D366] text-base flex-shrink-0" aria-hidden="true"></i>
                <span>{isAr ? 'مهندس علي ربيع' : 'Eng. Ali Rabie'}</span>
              </p>
            </button>

            {/* Address */}
            <button 
              type="button"
              onClick={() => openExternal('https://maps.app.goo.gl/3kx4MnDFTmaykXjCA?g_st=ac')}
              className="hover:text-[#FF1E27] transition-colors block text-sm text-[#94A3B8] text-start cursor-pointer w-full"
            >
              <p className="flex items-start gap-2">
                <i className="fa-solid fa-location-dot red-text text-sm flex-shrink-0 mt-1" aria-hidden="true"></i>
                <span>{t('channel_address_val')}</span>
              </p>
            </button>

            {/* Official Social Buttons */}
            <div className="footer-social-row flex flex-wrap items-center gap-2.5 pt-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => openExternal('https://www.facebook.com/profile.php?id=100087241140432')}
                className="!border-[#1877F2]/60 !text-[#1877F2] hover:!border-[#1877F2] hover:bg-[#1877F2]/15 h-8 px-3 text-xs font-semibold cursor-pointer transition-all duration-200 hover:scale-105 rounded-lg inline-flex items-center gap-1.5"
                aria-label="Facebook Page"
              >
                <svg className="size-3.5 fill-[#1877F2] flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-white font-medium">Facebook</span>
              </Button>

              <Button
                variant="outline"
                type="button"
                onClick={() => openExternal('https://www.instagram.com/e__mep/')}
                className="!border-[#E1306C]/60 !text-[#E1306C] hover:!border-[#E1306C] hover:bg-[#E1306C]/15 h-8 px-3 text-xs font-semibold cursor-pointer transition-all duration-200 hover:scale-105 rounded-lg inline-flex items-center gap-1.5"
                aria-label="Instagram Account"
              >
                <svg className="size-3.5 fill-[#E1306C] flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span className="text-white font-medium">Instagram</span>
              </Button>

              <Button
                variant="outline"
                type="button"
                onClick={() => openExternal('https://www.linkedin.com/in/e-mep-electromechanical-works-3559b2422')}
                className="!border-[#0A66C2]/60 !text-[#0A66C2] hover:!border-[#0A66C2] hover:bg-[#0A66C2]/15 h-8 px-3 text-xs font-semibold cursor-pointer transition-all duration-200 hover:scale-105 rounded-lg inline-flex items-center gap-1.5"
                aria-label="LinkedIn Profile"
              >
                <svg className="size-3.5 fill-[#0A66C2] flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <span className="text-white font-medium">LinkedIn</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom text-center pt-8 border-t border-white/[0.08] flex flex-col items-center gap-3">
          <p suppressHydrationWarning className="text-xs text-[#94A3B8]">
            &copy; {new Date().getFullYear()} E-MEP Electromechanical Works. All rights reserved.
          </p>

          {/* Design & Development Copyright Attribution by YASSER MAHMOUD */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md shadow-sm hover:border-[#1877F2]/50 hover:shadow-[0_0_20px_rgba(24,119,242,0.25)] transition-all duration-300">
            <span className="text-xs text-[#94A3B8]">
              {isAr ? 'تصميم وتطوير الموقع:' : 'Designed & Developed by:'}
            </span>
            <button
              type="button"
              onClick={() => openExternal('https://www.facebook.com/1035966674')}
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-white hover:text-[#1877F2] transition-colors cursor-pointer"
              title="Yasser Mahmoud on Facebook"
            >
              <i className="fa-brands fa-facebook text-[#1877F2] text-sm"></i>
              <span className="tracking-wider">YASSER MAHMOUD</span>
              <i className="fa-solid fa-arrow-up-right-from-square text-[10px] opacity-70"></i>
            </button>
          </div>

          <div style={{ marginTop: '0.25rem' }}>
            <button
              type="button"
              onClick={() => router.push('/accessibility')}
              className="footer-nav-item cursor-pointer bg-transparent border-0 text-[#94A3B8] hover:text-white transition-colors"
              style={{ fontSize: '0.8rem', opacity: 0.8 }}
            >
              {isAr ? 'إمكانية الوصول' : 'Accessibility Statement'}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
