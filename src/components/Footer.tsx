"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageContext';

export default function Footer() {
  const { t, language, isMounted } = useLanguage();
  const router = useRouter();
  const isAr = isMounted && language === 'ar';

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
              {t('footer_desc')}
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#FF1E27]">
              {t('footer_quick_links')}
            </h4>
            <ul className="space-y-2 text-sm text-[#94A3B8]">
              <li><Link href="/#about" className="hover:text-white transition-colors">{t('nav_about')}</Link></li>
              <li><Link href="/#services" className="hover:text-white transition-colors">{t('nav_services')}</Link></li>
              <li><Link href="/#bim" className="hover:text-white transition-colors">{t('nav_bim')}</Link></li>
              <li><Link href="/#projects" className="hover:text-white transition-colors">{t('nav_projects')}</Link></li>
              <li><Link href="/blog" className="hover:text-[#FF1E27] font-semibold transition-colors">{isAr ? 'المقالات الهندسية' : 'Engineering Blog'}</Link></li>
            </ul>
          </div>

          {/* Col 3: Services */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#FF1E27]">
              {t('footer_services_title')}
            </h4>
            <ul className="space-y-2 text-sm text-[#94A3B8]">
              <li>{t('hvac_title')}</li>
              <li>{t('fire_title')}</li>
              <li>{t('plumbing_title')}</li>
              <li>{t('electrical_title')}</li>
              <li>{t('bim_title')}</li>
            </ul>
          </div>

          {/* Col 4: Contact & Socials */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#FF1E27]">
              {t('footer_contact_title')}
            </h4>
            
            {/* Email */}
            <a href="mailto:info@emep-eg.com" className="hover:text-[#FF1E27] transition-colors block text-sm text-[#94A3B8]">
              <p className="flex items-center gap-2">
                <i className="fa-solid fa-envelope red-text text-sm flex-shrink-0" aria-hidden="true"></i>
                <span dir="ltr">info@emep-eg.com</span>
              </p>
            </a>

            {/* WhatsApp Eng. Osama Mohamed */}
            <a
              href="https://wa.me/201018898166?text=Hello%20E-MEP%20Engineering%20Team,%20I%20have%20a%20project%20inquiry."
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#25D366] transition-colors block text-sm text-[#94A3B8]"
            >
              <p className="flex items-center gap-2">
                <i className="fa-brands fa-whatsapp text-[#25D366] text-base flex-shrink-0" aria-hidden="true"></i>
                <span>{isAr ? 'مهندس أسامة محمد' : 'Eng. Osama Mohamed'}</span>
              </p>
            </a>

            {/* WhatsApp Eng. Ali Rabie */}
            <a
              href="https://wa.me/201030834372?text=Hello%20E-MEP%20Engineering%20Team,%20I%20have%20a%20project%20inquiry."
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#25D366] transition-colors block text-sm text-[#94A3B8]"
            >
              <p className="flex items-center gap-2">
                <i className="fa-brands fa-whatsapp text-[#25D366] text-base flex-shrink-0" aria-hidden="true"></i>
                <span>{isAr ? 'مهندس علي ربيع' : 'Eng. Ali Rabie'}</span>
              </p>
            </a>

            {/* Address */}
            <a href="https://maps.app.goo.gl/3kx4MnDFTmaykXjCA?g_st=ac" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF1E27] transition-colors block text-sm text-[#94A3B8]">
              <p className="flex items-start gap-2">
                <i className="fa-solid fa-location-dot red-text text-sm flex-shrink-0 mt-1" aria-hidden="true"></i>
                <span>{t('channel_address_val')}</span>
              </p>
            </a>

            {/* Official Social Buttons */}
            <div className="footer-social-row flex flex-wrap items-center gap-2 pt-2">
              <a
                href="https://www.facebook.com/profile.php?id=100087241140432"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs text-white bg-[#1A77F2] hover:bg-[#166fe5] border border-[#005fd8] shadow-sm hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                aria-label="Facebook Page"
              >
                <svg aria-label="Facebook logo" width="14" height="14" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                  <path fill="white" d="M8 12h5V8c0-6 4-7 11-6v5c-4 0-5 0-5 3v2h5l-1 6h-4v12h-6V18H8z" />
                </svg>
                <span>Facebook</span>
              </a>
              <a
                href="https://www.instagram.com/e__mep/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] hover:opacity-95 border border-[#DD2A7B]/50 shadow-sm hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                aria-label="Instagram Account"
              >
                <svg aria-label="Instagram logo" width="14" height="14" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                <span>Instagram</span>
              </a>
              <a
                href="https://www.linkedin.com/in/e-mep-electromechanical-works-3559b2422"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs text-white bg-[#0967C2] hover:bg-[#0855a0] border border-[#0059b3] shadow-sm hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                aria-label="LinkedIn Profile"
              >
                <svg aria-label="LinkedIn logo" width="14" height="14" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                  <path fill="white" d="M26.111,3H5.889c-1.595,0-2.889,1.293-2.889,2.889V26.111c0,1.595,1.293,2.889,2.889,2.889H26.111c1.595,0,2.889-1.293,2.889-2.889V5.889c0-1.595-1.293-2.889-2.889-2.889ZM10.861,25.389h-3.877V12.87h3.877v12.519Zm-1.957-14.158c-1.267,0-2.293-1.034-2.293-2.31s1.026-2.31,2.293-2.31,2.292,1.034,2.292,2.31-1.026,2.31-2.292,2.31Zm16.485,14.158h-3.858v-6.571c0-1.802-.685-2.809-2.111-2.809-1.551,0-2.362,1.048-2.362,2.809v6.571h-3.718V12.87h3.718v1.686s1.118-2.069,3.775-2.069,4.556,1.621,4.556,4.975v7.926Z" fillRule="evenodd" />
                </svg>
                <span>LinkedIn</span>
              </a>
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
            <a
              href="https://www.facebook.com/1035966674"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-white hover:text-[#1877F2] transition-colors"
              title="Yasser Mahmoud on Facebook"
            >
              <i className="fa-brands fa-facebook text-[#1877F2] text-sm"></i>
              <span className="tracking-wider">YASSER MAHMOUD</span>
              <i className="fa-solid fa-arrow-up-right-from-square text-[10px] opacity-70"></i>
            </a>
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
