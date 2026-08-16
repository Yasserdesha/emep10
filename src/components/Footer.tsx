"use client";

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageContext';

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
              <Image
                src="/logo/logo.png"
                alt="E-MEP Logo"
                width={36}
                height={36}
                className="footer-logo object-contain"
              />
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
            <div className="footer-social-row flex flex-wrap items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => openExternal('https://www.facebook.com/profile.php?id=100087241140432')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs text-white bg-[#1A77F2] hover:bg-[#166fe5] border border-[#005fd8] shadow-sm hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                aria-label="Facebook Page"
              >
                <i className="fa-brands fa-square-facebook text-base flex-shrink-0" aria-hidden="true"></i>
                <span>Facebook</span>
              </button>

              <button
                type="button"
                onClick={() => openExternal('https://www.instagram.com/e__mep/')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] hover:opacity-95 border border-[#DD2A7B]/50 shadow-sm hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                aria-label="Instagram Account"
              >
                <i className="fa-brands fa-instagram text-base flex-shrink-0" aria-hidden="true"></i>
                <span>Instagram</span>
              </button>

              <button
                type="button"
                onClick={() => openExternal('https://www.linkedin.com/in/e-mep-electromechanical-works-3559b2422')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs text-white bg-[#0967C2] hover:bg-[#0855a0] border border-[#0059b3] shadow-sm hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                aria-label="LinkedIn Profile"
              >
                <i className="fa-brands fa-square-linkedin text-base flex-shrink-0" aria-hidden="true"></i>
                <span>LinkedIn</span>
              </button>
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
