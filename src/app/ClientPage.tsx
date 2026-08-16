"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import Header from '@/components/Header';
import HeroCanvas from '@/components/HeroCanvas';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ScrollRevealText from '@/components/ScrollRevealText';
import FadeImage from '@/components/FadeImage';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const ContactForm = dynamic(() => import('@/components/ContactForm'), {
  loading: () => <div className="h-64 flex items-center justify-center text-[#94A3B8]">Loading contact form...</div>,
  ssr: false,
});

import ExpertiseCard from '@/components/ExpertiseCard';
import ElectricBorder from '@/components/ElectricBorder';
import StarBorder from '@/components/StarBorder';
import SpecularButton from '@/components/SpecularButton';

interface Project {
  id: number;
  image: string;
  titleEn: string;
  titleAr: string;
  category: string;
  catEn: string;
  catAr: string;
  descEn: string;
  descAr: string;
}

interface ClientPageProps {
  initialProjects: Project[];
  brandLogos: string[];
}

export default function ClientPage({ initialProjects, brandLogos }: ClientPageProps) {
  const { t, language, isMounted } = useLanguage();
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Dynamic projects list state initialized with newest projects first
  const [projectsList, setProjectsList] = useState<Project[]>(() => {
    return [...initialProjects].reverse();
  });

  // Handle scroll target upon navigation from other pages or direct hash URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let targetId: string | null = null;
      try {
        targetId = sessionStorage.getItem('emep_scroll_target');
        if (targetId) {
          sessionStorage.removeItem('emep_scroll_target');
        }
      } catch {
        // ignore
      }

      if (!targetId && window.location.hash) {
        targetId = window.location.hash.replace('#', '').trim();
      }

      if (targetId) {
        const scrollToElement = () => {
          const el = document.getElementById(targetId!);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        };
        setTimeout(scrollToElement, 150);
        setTimeout(scrollToElement, 450);
      } else {
        if ('scrollRestoration' in window.history) {
          window.history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);
      }
    }
  }, []);

  // Client-side fetch on mount to get instant live updates from the database API
  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        if (data.projects && Array.isArray(data.projects)) {
          // Sort newest projects first so newly added entries appear at the top
          const sorted = [...data.projects].reverse();
          setProjectsList(sorted);
        }
      })
      .catch(err => console.error('Failed to fetch live projects:', err));
  }, []);

  // Lock/unlock background body scroll when project modal is open/closed
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setSelectedProject(null);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [selectedProject]);

  const isAr = isMounted && language === 'ar';

  // Filter projects based on tab selection
  const filteredProjects = selectedFilter === 'all'
    ? projectsList
    : projectsList.filter(p => p.category === selectedFilter);

  // Show top 3 visible projects unless expanded
  const visibleProjects = isExpanded ? filteredProjects : filteredProjects.slice(0, 3);
  const remainingCount = filteredProjects.length - 3;

  const handleScrollToContact = () => {
    const contactSec = document.getElementById('contact');
    if (contactSec) {
      contactSec.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Expertise Cards definition
  const expertiseCards = [
    {
      id: 1,
      img: "/assets/expertise/fire-alarm.png",
      datSrc: "/assets/expertise/fire-alarm.dat",
      titleKey: "exp_1_title",
      descKey: "exp_1_desc",
    },
    {
      id: 2,
      img: "/assets/expertise/electrical.png",
      datSrc: "/assets/expertise/electrical.dat",
      titleKey: "exp_2_title",
      descKey: "exp_2_desc",
    },
    {
      id: 3,
      img: "/assets/expertise/containments.png",
      datSrc: "/assets/expertise/containments.dat",
      titleKey: "exp_3_title",
      descKey: "exp_3_desc",
    },
    {
      id: 4,
      img: "/assets/expertise/lighting.png",
      datSrc: "/assets/expertise/lighting.dat",
      titleKey: "exp_4_title",
      descKey: "exp_4_desc",
    },
    {
      id: 5,
      img: "/assets/expertise/hvac.png",
      datSrc: "/assets/expertise/hvac.dat",
      titleKey: "exp_5_title",
      descKey: "exp_5_desc",
    },
    {
      id: 6,
      img: "/assets/expertise/plumbing.png",
      datSrc: "/assets/expertise/plumbing.dat",
      titleKey: "exp_6_title",
      descKey: "exp_6_desc",
    },
  ];

  // Safe fallback for brand logos
  const safeBrandLogos = Array.isArray(brandLogos) && brandLogos.length > 0
    ? brandLogos
    : ["/Brand logos/Logo.png", "/Brand logos/08.png.webp"];

  // Quadruplicate brand logos for seamless infinite loop marquee ticker
  const marqueeLogos = [...safeBrandLogos, ...safeBrandLogos, ...safeBrandLogos, ...safeBrandLogos];

  return (
    <>
      <Header />

      {/* Hero Track - Scroll Lock Canvas */}
      <div className="hero-track" id="heroTrack">
        <section className="hero-sticky" id="hero">
          <h1 className="sr-only">
            {isAr ? "E-MEP للأعمال الكهروميكانيكية والهندسة ثلاثية الأبعاد BIM" : "E-MEP Electromechanical Works & BIM 3D Digital Engineering Solutions"}
          </h1>
          <HeroCanvas />
          <div className="hero-centered-logo-overlay">
            <ElectricBorder
              color="#FF1E27"
              speed={1.2}
              chaos={0.14}
              thickness={2.5}
              borderRadius={24}
              className="max-w-fit mx-auto"
            >
              <div className="hero-logo-white-glass">
                <Image
                  src="/logo/logo.png"
                  alt={isAr ? "شعار شركة E-MEP للأنظمة الكهروميكانيكية" : "E-MEP Electromechanical Works Official Brand Logo"}
                  width={150}
                  height={150}
                  className="hero-pure-logo"
                  style={{ width: '150px', height: '150px', aspectRatio: '1/1' }}
                  priority
                />
              </div>
            </ElectricBorder>

            <StarBorder
              as="button"
              color="#FF1E27"
              speed="4s"
              onClick={handleScrollToContact}
              className="cursor-pointer max-w-[90vw]"
            >
              <i className="fa-solid fa-paper-plane" aria-hidden="true"></i>
              <span>{t('hero_btn_contact')}</span>
            </StarBorder>
          </div>
        </section>
      </div>

      {/* Cinematic Kinetic Statement Section (Inspired by Mono Philosophy & Technology Section) */}
      <section className="py-10 sm:py-16 bg-[#050507] border-y border-white/[0.06] relative overflow-hidden flex items-center justify-center">
        <div className="container relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center">
          <ElectricBorder
            color="#FF1E27"
            speed={1.2}
            chaos={0.14}
            thickness={2}
            borderRadius={9999}
            className="max-w-fit mx-auto mb-6 sm:mb-8"
          >
            <div className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#0A0A0C]/90 text-[#FF1E27] text-xs sm:text-sm font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#FF1E27] animate-pulse flex-shrink-0"></span>
              <span className="whitespace-nowrap">{isAr ? 'التميز الهندسي ونمذجة الـ BIM الرقمية' : 'Engineering Excellence & Digital BIM Modeling'}</span>
            </div>
          </ElectricBorder>
          <ScrollRevealText
            text={
              isAr
                ? "مرحباً بكم في E-MEP: نبتكر أعلى معايير الريادة في الهندسة الكهروميكانيكية فائقة الدقة ونمذجة الـ BIM المتقدمة لتحقيق التميز والجودة عبر كبرى المشروعات التطويرية."
                : "Welcome to E-MEP: Pioneering high-precision electromechanical engineering and advanced digital BIM modeling to deliver uncompromising quality across premier development projects."
            }
            className="text-xl sm:text-2xl md:text-3xl lg:text-[2.35rem] font-black max-w-4xl mx-auto leading-relaxed md:leading-snug text-center tracking-tight"
          />
        </div>
      </section>

      {/* About Section (Interactive High-End Engineering Showcase) */}
      <AboutSection />

      {/* Services Section */}
      <section className="services-section section-padding bg-darker" id="services" aria-labelledby="services-title-heading">
        <div className="container">
          <div className="section-header text-center max-w-3xl mx-auto mb-12">
            <div className="section-tag"><span>{t('services_tag')}</span></div>
            <h2 className="section-title text-3xl font-extrabold mt-2 mb-4" id="services-title-heading">
              {t('services_title')}
            </h2>
            <p className="section-subtitle text-[#94A3B8]">
              {t('services_subtitle')}
            </p>
          </div>

          <div className="expertise-grid">
            {expertiseCards.map((card) => (
              <ExpertiseCard
                key={card.id}
                img={card.img}
                datSrc={card.datSrc}
                titleKey={card.titleKey}
                descKey={card.descKey}
              />
            ))}
          </div>
        </div>
      </section>

      {/* BIM Section */}
      <section className="bim-section section-padding" id="bim" aria-labelledby="bim-title-heading">
        <div className="container">
          <div className="glass-panel bim-banner-card">
            <div className="grid grid-2 align-center">

              <div className="bim-content">
                <div className="section-tag"><span>{t('bim_tag')}</span></div>
                <h2 className="section-title" id="bim-title-heading">
                  {t('bim_title')}
                </h2>
                <p className="section-desc">
                  {t('bim_desc')}
                </p>
                <div className="bim-checklist">
                  <div className="check-item">
                    <i className="fa-solid fa-circle-check" aria-hidden="true"></i>
                    <span>{t('bim_c1')}</span>
                  </div>
                  <div className="check-item">
                    <i className="fa-solid fa-circle-check" aria-hidden="true"></i>
                    <span>{t('bim_c2')}</span>
                  </div>
                  <div className="check-item">
                    <i className="fa-solid fa-circle-check" aria-hidden="true"></i>
                    <span>{t('bim_c3')}</span>
                  </div>
                </div>
              </div>

              <div className="bim-visual">
                <div className="bim-frame-preview group">
                  <FadeImage
                    src="/Animated background images/compressed/frame-035.webp"
                    alt={isAr ? "مخطط كهروميكانيكي ثلاثي الأبعاد BIM Revit" : "BIM Revit Electromechanical 3D Engineering Model"}
                    width={600}
                    height={400}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="bim-image group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="bim-badge-overlay">
                    <i className="fa-solid fa-vr-cardboard text-[#FF1E27]" aria-hidden="true"></i>
                    <span>Revit 3D Integrated</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Projects Showcase Section */}
      <section className="projects-section section-padding bg-darker" id="projects" aria-labelledby="projects-title-heading">
        <div className="container">
          <div className="section-header text-center">
            <div className="section-tag"><span>{t('projects_tag')}</span></div>
            <h2 className="section-title" id="projects-title-heading">
              {t('projects_title')}
            </h2>
            <p className="section-subtitle">
              {t('projects_subtitle')}
            </p>
          </div>

          {/* Filter Bar with SpecularButton Architecture */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 mb-10 max-w-4xl mx-auto">
            <SpecularButton
              size="md"
              radius={24}
              lineColor={selectedFilter === 'all' ? '#FF1E27' : '#64748B'}
              baseColor={selectedFilter === 'all' ? '#521014' : '#14141c'}
              intensity={selectedFilter === 'all' ? 1.3 : 0.8}
              shineSize={12}
              shineFade={35}
              thickness={1.5}
              followMouse
              autoAnimate
              className={`px-5 py-2.5 font-bold transition-all duration-300 cursor-pointer ${
                selectedFilter === 'all'
                  ? 'shadow-[0_0_20px_rgba(255,30,39,0.35)] scale-[1.02]'
                  : 'text-[#94A3B8]'
              }`}
              onClick={() => { setSelectedFilter('all'); setIsExpanded(false); }}
              ariaLabel={isAr ? "عرض جميع المشاريع" : "Filter by all projects"}
            >
              <i className="fa-solid fa-border-all" aria-hidden="true"></i>
              <span>{t('filter_all')}</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-bold ${
                selectedFilter === 'all' ? 'bg-white/20 text-white' : 'bg-white/10 text-[#94A3B8]'
              }`}>
                {projectsList.length}
              </span>
            </SpecularButton>

            <SpecularButton
              size="md"
              radius={24}
              lineColor={selectedFilter === 'retail' ? '#FF1E27' : '#64748B'}
              baseColor={selectedFilter === 'retail' ? '#521014' : '#14141c'}
              intensity={selectedFilter === 'retail' ? 1.3 : 0.8}
              shineSize={12}
              shineFade={35}
              thickness={1.5}
              followMouse
              autoAnimate
              className={`px-5 py-2.5 font-bold transition-all duration-300 cursor-pointer ${
                selectedFilter === 'retail'
                  ? 'shadow-[0_0_20px_rgba(255,30,39,0.35)] scale-[1.02]'
                  : 'text-[#94A3B8]'
              }`}
              onClick={() => { setSelectedFilter('retail'); setIsExpanded(false); }}
              ariaLabel={isAr ? "فلترة مشاريع المحلات والبيع بالتجزئة" : "Filter by retail projects"}
            >
              <i className="fa-solid fa-bag-shopping" aria-hidden="true"></i>
              <span>{t('filter_retail')}</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-bold ${
                selectedFilter === 'retail' ? 'bg-white/20 text-white' : 'bg-white/10 text-[#94A3B8]'
              }`}>
                {projectsList.filter(p => p.category === 'retail').length}
              </span>
            </SpecularButton>

            <SpecularButton
              size="md"
              radius={24}
              lineColor={selectedFilter === 'dining' ? '#FF1E27' : '#64748B'}
              baseColor={selectedFilter === 'dining' ? '#521014' : '#14141c'}
              intensity={selectedFilter === 'dining' ? 1.3 : 0.8}
              shineSize={12}
              shineFade={35}
              thickness={1.5}
              followMouse
              autoAnimate
              className={`px-5 py-2.5 font-bold transition-all duration-300 cursor-pointer ${
                selectedFilter === 'dining'
                  ? 'shadow-[0_0_20px_rgba(255,30,39,0.35)] scale-[1.02]'
                  : 'text-[#94A3B8]'
              }`}
              onClick={() => { setSelectedFilter('dining'); setIsExpanded(false); }}
              ariaLabel={isAr ? "فلترة مشاريع المطاعم والكافيهات" : "Filter by dining projects"}
            >
              <i className="fa-solid fa-utensils" aria-hidden="true"></i>
              <span>{t('filter_dining')}</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-bold ${
                selectedFilter === 'dining' ? 'bg-white/20 text-white' : 'bg-white/10 text-[#94A3B8]'
              }`}>
                {projectsList.filter(p => p.category === 'dining').length}
              </span>
            </SpecularButton>

            <SpecularButton
              size="md"
              radius={24}
              lineColor={selectedFilter === 'showrooms' ? '#FF1E27' : '#64748B'}
              baseColor={selectedFilter === 'showrooms' ? '#521014' : '#14141c'}
              intensity={selectedFilter === 'showrooms' ? 1.3 : 0.8}
              shineSize={12}
              shineFade={35}
              thickness={1.5}
              followMouse
              autoAnimate
              className={`px-5 py-2.5 font-bold transition-all duration-300 cursor-pointer ${
                selectedFilter === 'showrooms'
                  ? 'shadow-[0_0_20px_rgba(255,30,39,0.35)] scale-[1.02]'
                  : 'text-[#94A3B8]'
              }`}
              onClick={() => { setSelectedFilter('showrooms'); setIsExpanded(false); }}
              ariaLabel={isAr ? "فلترة مشاريع المعارض والسيارات" : "Filter by showroom projects"}
            >
              <i className="fa-solid fa-car" aria-hidden="true"></i>
              <span>{t('filter_showrooms')}</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-bold ${
                selectedFilter === 'showrooms' ? 'bg-white/20 text-white' : 'bg-white/10 text-[#94A3B8]'
              }`}>
                {projectsList.filter(p => p.category === 'showrooms').length}
              </span>
            </SpecularButton>
          </div>

          {/* Infinite Marquee Ticker */}
          <div className="brand-ticker-wrapper mb-12">
            <div className="brand-ticker-track">
              {marqueeLogos.map((logo, idx) => (
                <div className="brand-ticker-item" key={idx}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo}
                    alt={`Partner Brand Logo ${idx + 1}`}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="projects-grid" id="projectsContainer">
            {visibleProjects.map((p) => (
              <div
                className="project-card glass-panel group bg-[#111116]/85 border border-white/[0.08] hover:border-[#FF1E27]/50 rounded-2xl overflow-hidden hover:shadow-[0_16px_40px_rgba(0,0,0,0.7),0_0_30px_rgba(211,16,25,0.2)] transition-all duration-400 flex flex-col"
                key={p.id}
              >
                <div
                  className="project-img-wrapper relative h-60 overflow-hidden cursor-pointer"
                  onClick={() => setSelectedProject(p)}
                >
                  <FadeImage
                    src={p.image}
                    alt={isAr ? p.titleAr : p.titleEn}
                    fill
                    sizes="(max-width: 480px) 440px, (max-width: 768px) 600px, (max-width: 1200px) 480px, 360px"
                    className="object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
                  />
                  <span className="project-category absolute top-3.5 left-3.5 rtl:left-auto rtl:right-3.5 bg-black/80 backdrop-blur-md border border-[#FF1E27]/40 text-[#FF1E27] text-xs font-bold px-3 py-1 rounded-full z-10">
                    {isAr ? p.catAr : p.catEn}
                  </span>
                  <div className="project-hover-overlay absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      variant="default"
                      size="sm"
                      className="rounded-full shadow-lg shadow-[#FF1E27]/30 pointer-events-none"
                    >
                      <i className="fa-solid fa-up-right-and-down-left-from-center" aria-hidden="true"></i>
                      <span>{isAr ? 'عرض التفاصيل' : 'View High-Res'}</span>
                    </Button>
                  </div>
                </div>

                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="project-title text-lg font-bold text-white group-hover:text-[#FF1E27] transition-colors line-clamp-1 mb-2">
                      {isAr ? p.titleAr : p.titleEn}
                    </h3>
                    <p className="project-desc text-xs sm:text-sm text-[#94A3B8] leading-relaxed line-clamp-2 mb-4">
                      {isAr ? p.descAr : p.descEn}
                    </p>
                  </div>

                  <div className="project-meta pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-[#94A3B8]">
                    <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      {isAr ? 'تم التسليم والتشغيل' : 'Delivered & Operational'}
                    </span>
                    <span className="flex items-center gap-1.5 font-mono text-white/70">
                      <i className="fa-solid fa-bolt text-[#FF1E27]" aria-hidden="true"></i>
                      MEP Scope
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Show More / Show Less Toggle Button with Shadcn styling */}
          {filteredProjects.length > 3 && (
            <div className="flex justify-center mt-12" id="projectsLoadMoreWrap">
              <SpecularButton
                size="lg"
                radius={24}
                lineColor="#FF1E27"
                baseColor="#521014"
                intensity={1.2}
                shineSize={14}
                shineFade={40}
                thickness={1.5}
                speed={0.4}
                followMouse
                autoAnimate
                id="loadMoreProjectsBtn"
                onClick={() => {
                  setIsExpanded(!isExpanded);
                  if (isExpanded) {
                    const sectionEl = document.getElementById('projects');
                    if (sectionEl) {
                      sectionEl.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                }}
                className="px-8 py-5 text-base font-bold shadow-xl shadow-[#FF1E27]/25 cursor-pointer"
              >
                <i className={`fa-solid ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}`} aria-hidden="true"></i>
                <span id="loadMoreBtnText">
                  {isExpanded
                    ? t('btn_show_less')
                    : `${t('btn_show_more')} (+${remainingCount})`}
                </span>
              </SpecularButton>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section section-padding" id="contact" aria-labelledby="contact-title-heading">
        <div className="container">
          <div className="grid grid-2 gap-xl">

            {/* Contact Info Col */}
            <div className="contact-info-col">
              <div className="section-tag"><span>{t('contact_tag')}</span></div>
              <h2 className="section-title" id="contact-title-heading">
                {t('contact_title')}
              </h2>
              <p className="section-desc">
                {t('contact_desc')}
              </p>

              <div className="contact-channels">
                {/* Email */}
                <button 
                  type="button"
                  onClick={() => window.location.href = 'mailto:Info@emep-egy.com'}
                  className="channel-card glass-panel hover:border-[#FF1E27]/50 hover:shadow-[0_0_20px_rgba(211,16,25,0.25)] transition-all duration-300 w-full text-start cursor-pointer"
                >
                  <div className="channel-icon red-glow flex-shrink-0"><i className="fa-solid fa-envelope" aria-hidden="true"></i></div>
                  <div className="channel-text min-w-0">
                    <span className="channel-label">{t('channel_email_label')}</span>
                    <span className="channel-value">Info@emep-egy.com</span>
                  </div>
                </button>

                {/* WhatsApp Line 1 */}
                <button
                  type="button"
                  onClick={() => window.open('https://wa.me/201111079467?text=Hello%20E-MEP%20Engineering%20Team,%20I%20have%20a%20project%20inquiry.', '_blank', 'noopener,noreferrer')}
                  className="channel-card glass-panel hover:border-[#25D366]/50 hover:shadow-[0_0_20px_rgba(37,211,102,0.25)] transition-all duration-300 w-full text-start cursor-pointer"
                >
                  <div className="channel-icon whatsapp-glow flex-shrink-0"><i className="fa-brands fa-whatsapp" aria-hidden="true"></i></div>
                  <div className="channel-text min-w-0">
                    <span className="channel-label">{t('channel_whatsapp_label1')}</span>
                    <span className="channel-value">{t('channel_whatsapp_val1')}</span>
                  </div>
                </button>

                {/* WhatsApp Line 2 */}
                <button
                  type="button"
                  onClick={() => window.open('https://wa.me/201030834372?text=Hello%20E-MEP%20Engineering%20Team,%20I%20have%20a%20project%20inquiry.', '_blank', 'noopener,noreferrer')}
                  id="whatsapp-link"
                  data-testid="whatsapp-link"
                  data-phone="01030834372"
                  className="channel-card glass-panel hover:border-[#25D366]/50 hover:shadow-[0_0_20px_rgba(37,211,102,0.25)] transition-all duration-300 w-full text-start cursor-pointer"
                >
                  <div className="channel-icon whatsapp-glow flex-shrink-0"><i className="fa-brands fa-whatsapp" aria-hidden="true"></i></div>
                  <div className="channel-text min-w-0">
                    <span className="channel-label">{t('channel_whatsapp_label2')}</span>
                    <span className="channel-value">{t('channel_whatsapp_val2')}</span>
                  </div>
                </button>

                {/* Phone Line 1 */}
                <button
                  type="button"
                  onClick={() => window.location.href = 'tel:+201111079467'}
                  className="channel-card glass-panel hover:border-[#FF1E27]/50 hover:shadow-[0_0_20px_rgba(211,16,25,0.25)] transition-all duration-300 w-full text-start cursor-pointer"
                >
                  <div className="channel-icon red-glow flex-shrink-0"><i className="fa-solid fa-phone" aria-hidden="true"></i></div>
                  <div className="channel-text min-w-0">
                    <span className="channel-label">{t('channel_phone_label1')}</span>
                    <span className="channel-value">{t('channel_phone_val1')}</span>
                  </div>
                </button>

                {/* Phone Line 2 */}
                <button
                  type="button"
                  onClick={() => window.location.href = 'tel:+201030834372'}
                  className="channel-card glass-panel hover:border-[#FF1E27]/50 hover:shadow-[0_0_20px_rgba(211,16,25,0.25)] transition-all duration-300 w-full text-start cursor-pointer"
                >
                  <div className="channel-icon red-glow flex-shrink-0"><i className="fa-solid fa-phone" aria-hidden="true"></i></div>
                  <div className="channel-text min-w-0">
                    <span className="channel-label">{t('channel_phone_label2')}</span>
                    <span className="channel-value">{t('channel_phone_val2')}</span>
                  </div>
                </button>

                {/* Headquarters Address */}
                <button
                  type="button"
                  onClick={() => window.open('https://maps.app.goo.gl/3kx4MnDFTmaykXjCA?g_st=ac', '_blank', 'noopener,noreferrer')}
                  className="channel-card glass-panel hover:border-[#FF1E27]/50 hover:shadow-[0_0_20px_rgba(211,16,25,0.25)] transition-all duration-300 w-full text-start cursor-pointer"
                >
                  <div className="channel-icon red-glow flex-shrink-0"><i className="fa-solid fa-location-dot" aria-hidden="true"></i></div>
                  <div className="channel-text min-w-0">
                    <span className="channel-label">{t('channel_address_label')}</span>
                    <span className="channel-value text-xs sm:text-sm font-bold">{t('channel_address_val')}</span>
                  </div>
                </button>
              </div>

              {/* Social Media Channels Grid - Modern Solid Brand Buttons */}
              <div className="mt-8 pt-6 border-t border-white/[0.08]">
                <h3 className="text-xs font-bold text-[#94A3B8] mb-4 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF1E27]"></span>
                  <span>{t('social_heading')}</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Facebook Button */}
                  <button
                    type="button"
                    onClick={() => window.open('https://www.facebook.com/profile.php?id=100087241140432', '_blank', 'noopener,noreferrer')}
                    className="inline-flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl font-bold text-xs text-white bg-[#1A77F2] hover:bg-[#166fe5] border border-[#005fd8] shadow-[0_4px_20px_rgba(26,119,242,0.35)] hover:shadow-[0_6px_25px_rgba(26,119,242,0.55)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
                    aria-label="Facebook Page"
                  >
                    <i className="fa-brands fa-square-facebook text-lg flex-shrink-0" aria-hidden="true"></i>
                    <span>Facebook</span>
                  </button>

                  {/* LinkedIn Button */}
                  <button
                    type="button"
                    onClick={() => window.open('https://www.linkedin.com/in/e-mep-electromechanical-works-3559b2422', '_blank', 'noopener,noreferrer')}
                    className="inline-flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl font-bold text-xs text-white bg-[#0967C2] hover:bg-[#0855a0] border border-[#0059b3] shadow-[0_4px_20px_rgba(9,103,194,0.35)] hover:shadow-[0_6px_25px_rgba(9,103,194,0.55)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
                    aria-label="LinkedIn Profile"
                  >
                    <i className="fa-brands fa-square-linkedin text-lg flex-shrink-0" aria-hidden="true"></i>
                    <span>LinkedIn</span>
                  </button>

                  {/* Instagram Button */}
                  <button
                    type="button"
                    onClick={() => window.open('https://www.instagram.com/e__mep/', '_blank', 'noopener,noreferrer')}
                    className="inline-flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] hover:opacity-95 border border-[#DD2A7B]/50 shadow-[0_4px_20px_rgba(221,42,123,0.35)] hover:shadow-[0_6px_25px_rgba(221,42,123,0.55)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
                    aria-label="Instagram Account"
                  >
                    <i className="fa-brands fa-instagram text-lg flex-shrink-0" aria-hidden="true"></i>
                    <span>Instagram</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Direct Inquiry Form Col */}
            <div className="contact-form-col h-full flex flex-col">
              <ContactForm />
            </div>

          </div>

          {/* Interactive Dark Google Map Section */}
          <div className="mt-12">
            <div className="map-container glass-panel">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2443.7193361439054!2d31.470573661309096!3d29.98112475005925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145823920433d33d%3A0x750a09f1e98e50cf!2z2qTZitmE2KfZhyDZhdit2YXYryDYqNmDINi12KjYp9it!5e0!3m2!1sar!2seg!4v1785697320591!5m2!1sar!2seg"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title={isAr ? "خريطة موقع المقر الرئيسي لشركة E-MEP" : "E-MEP Headquarters Google Map Location"}
              />
              <div className="map-badge-overlay">
                <i className="fa-solid fa-location-dot text-[#FF1E27]" aria-hidden="true"></i>
                <span>{isAr ? 'المقر الرئيسي - التجمع الخامس، القاهرة الجديدة' : 'Headquarters - Fifth Settlement, New Cairo'}</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Shared Unified Footer */}
      <Footer />

      {/* Project details lightbox modal */}
      {selectedProject && (
        <div
          className="project-modal-backdrop active"
          id="projectLightboxModal"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedProject(null);
            }
          }}
        >
          <div className="project-modal-content glass-panel">
            <button
              type="button"
              className="project-modal-close"
              onClick={() => setSelectedProject(null)}
              aria-label={isAr ? "إغلاق النافذة" : "Close modal"}
            >
              &times;
            </button>
            <div className="project-modal-img-wrap">
              <Image
                src={selectedProject.image}
                alt={isAr ? selectedProject.titleAr : selectedProject.titleEn}
                width={800}
                height={550}
                style={{ objectFit: 'contain', width: '100%', height: 'auto' }}
              />
            </div>
            <div className="project-modal-info">
              <span className="project-modal-badge">
                {isAr ? selectedProject.catAr : selectedProject.catEn}
              </span>
              <h3>
                {isAr ? selectedProject.titleAr : selectedProject.titleEn}
              </h3>
              <p>
                {isAr ? selectedProject.descAr : selectedProject.descEn}
              </p>
              <div className="project-modal-actions">
                <StarBorder
                  as="button"
                  color="#FF1E27"
                  speed="4s"
                  onClick={() => {
                    setSelectedProject(null);
                    handleScrollToContact();
                  }}
                  className="px-6 font-bold cursor-pointer"
                >
                  <i className="fa-solid fa-paper-plane" aria-hidden="true"></i>
                  <span>{isAr ? 'اطلب مشروع مشابه' : 'Request Similar Project'}</span>
                </StarBorder>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
