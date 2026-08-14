"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import Header from '@/components/Header';
import HeroCanvas from '@/components/HeroCanvas';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const ContactForm = dynamic(() => import('@/components/ContactForm'), {
  loading: () => <div className="h-64 flex items-center justify-center text-[#94A3B8]">Loading contact form...</div>,
  ssr: false,
});

import ExpertiseCard from '@/components/ExpertiseCard';

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

  // Force page to scroll to top (0,0) on every initial load or F5 refresh
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      window.scrollTo(0, 0);
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
            <div className="hero-logo-white-glass">
              <Image 
                src="/logo/logo.png" 
                alt={isAr ? "شعار شركة E-MEP للأنظمة الكهروميكانيكية" : "E-MEP Electromechanical Works Official Brand Logo"} 
                width={150}
                height={150}
                className="hero-pure-logo" 
                style={{ width: '150px', height: '150px', aspectRatio: '1/1' }}
              />
            </div>
            
            <button 
              type="button" 
              className="hero-cta-btn btn btn-primary focus:ring-2 focus:ring-[#FF1E27] outline-none" 
              onClick={handleScrollToContact}
            >
              <i className="fa-solid fa-paper-plane" aria-hidden="true"></i>
              <span>{t('hero_btn_contact')}</span>
            </button>
          </div>
        </section>
      </div>

      {/* About Section */}
      <section className="about-section section-padding relative overflow-hidden" id="about" aria-labelledby="about-title-heading">
        <div className="container relative z-10">
          <div className="grid grid-2 align-center">
            
            <div className="about-image-column">
              <div className="brand-showcase-box glass-panel white-logo-bg shadow-2xl rounded-3xl p-8 md:p-12">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/logo/logo.png" 
                  alt={isAr ? "علامة الجودة الكهروميكانيكية E-MEP" : "E-MEP High Quality Standard MEP"} 
                  className="about-logo-hero" 
                />
                <div className="badge-tag" role="status">
                  <i className="fa-solid fa-shield-halved text-[#FF1E27]" aria-hidden="true"></i>
                  <span>{t('about_tag')}</span>
                </div>
              </div>
            </div>

            <div className="about-text-column">
              <div className="section-tag">
                <span>{t('about_section_tag')}</span>
              </div>
              <h2 className="section-title text-3xl md:text-4xl font-extrabold mb-4 text-white leading-tight" id="about-title-heading">
                {t('about_title')}
              </h2>
              <p 
                className="section-desc mb-4 text-[#94A3B8] leading-relaxed text-sm md:text-base"
                dangerouslySetInnerHTML={{ __html: t('about_desc1') }}
              />
              <p 
                className="section-desc mb-6 text-[#94A3B8] leading-relaxed text-sm md:text-base"
                dangerouslySetInnerHTML={{ __html: t('about_desc2') }}
              />

              <div className="about-features-list grid grid-cols-2 gap-4 mt-6">
                <div className="feature-card bg-white/[0.02] border border-white/[0.06] p-4 rounded-xl">
                  <div className="feature-icon"><i className="fa-solid fa-fan" aria-hidden="true"></i></div>
                  <div className="feature-info">
                    <h3 className="font-bold text-sm text-white">{t('feat_hvac_title')}</h3>
                    <p className="text-xs text-[#94A3B8] mt-1">{t('feat_hvac_desc')}</p>
                  </div>
                </div>

                <div className="feature-card bg-white/[0.02] border border-white/[0.06] p-4 rounded-xl">
                  <div className="feature-icon"><i className="fa-solid fa-bolt" aria-hidden="true"></i></div>
                  <div className="feature-info">
                    <h3 className="font-bold text-sm text-white">{t('feat_elec_title')}</h3>
                    <p className="text-xs text-[#94A3B8] mt-1">{t('feat_elec_desc')}</p>
                  </div>
                </div>

                <div className="feature-card bg-white/[0.02] border border-white/[0.06] p-4 rounded-xl">
                  <div className="feature-icon"><i className="fa-solid fa-faucet-drip" aria-hidden="true"></i></div>
                  <div className="feature-info">
                    <h3 className="font-bold text-sm text-white">{t('feat_plumb_title')}</h3>
                    <p className="text-xs text-[#94A3B8] mt-1">{t('feat_plumb_desc')}</p>
                  </div>
                </div>

                <div className="feature-card bg-white/[0.02] border border-white/[0.06] p-4 rounded-xl">
                  <div className="feature-icon"><i className="fa-solid fa-fire-extinguisher" aria-hidden="true"></i></div>
                  <div className="feature-info">
                    <h3 className="font-bold text-sm text-white">{t('feat_fire_title')}</h3>
                    <p className="text-xs text-[#94A3B8] mt-1">{t('feat_fire_desc')}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Pillars Grid */}
          <div className="pillars-grid grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="pillar-card glass-panel bg-[#111116] border border-white/[0.08] hover:border-[#FF1E27]/40 p-8 rounded-2xl transition-all">
              <div className="pillar-icon red-glow text-[#FF1E27] mb-4 text-2xl"><i className="fa-solid fa-bullseye" aria-hidden="true"></i></div>
              <h3 className="font-bold text-lg text-white mb-2">{t('mission_title')}</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">{t('mission_desc')}</p>
            </div>

            <div className="pillar-card glass-panel bg-[#111116] border border-white/[0.08] hover:border-[#FF1E27]/40 p-8 rounded-2xl transition-all">
              <div className="pillar-icon red-glow text-[#FF1E27] mb-4 text-2xl"><i className="fa-solid fa-eye" aria-hidden="true"></i></div>
              <h3 className="font-bold text-lg text-white mb-2">{t('vision_title')}</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">{t('vision_desc')}</p>
            </div>

            <div className="pillar-card glass-panel bg-[#111116] border border-white/[0.08] hover:border-[#FF1E27]/40 p-8 rounded-2xl transition-all">
              <div className="pillar-icon red-glow text-[#FF1E27] mb-4 text-2xl"><i className="fa-solid fa-gem" aria-hidden="true"></i></div>
              <h3 className="font-bold text-lg text-white mb-2">{t('values_title')}</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">{t('values_desc')}</p>
            </div>
          </div>
        </div>
      </section>

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
                <div className="bim-frame-preview">
                  <Image 
                    src="/Animated background images/compressed/frame-035.webp" 
                    alt={isAr ? "مخطط كهروميكانيكي ثلاثي الأبعاد BIM Revit" : "BIM Revit Electromechanical 3D Engineering Model"} 
                    width={600}
                    height={400}
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="bim-image" 
                  />
                  <div className="bim-badge-overlay">
                    <i className="fa-solid fa-vr-cardboard" aria-hidden="true"></i>
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

          {/* Filter Bar */}
          <div className="projects-filter-bar">
            <button
              type="button"
              className={`project-filter-btn ${selectedFilter === 'all' ? 'active' : ''}`}
              onClick={() => { setSelectedFilter('all'); setIsExpanded(false); }}
              aria-label={isAr ? "عرض جميع المشاريع" : "Filter by all projects"}
            >
              <i className="fa-solid fa-border-all" aria-hidden="true"></i>
              <span>{t('filter_all')}</span>
            </button>
            <button
              type="button"
              className={`project-filter-btn ${selectedFilter === 'retail' ? 'active' : ''}`}
              onClick={() => { setSelectedFilter('retail'); setIsExpanded(false); }}
              aria-label={isAr ? "فلترة مشاريع المحلات والبيع بالتجزئة" : "Filter by retail projects"}
            >
              <i className="fa-solid fa-bag-shopping" aria-hidden="true"></i>
              <span>{t('filter_retail')}</span>
            </button>
            <button
              type="button"
              className={`project-filter-btn ${selectedFilter === 'dining' ? 'active' : ''}`}
              onClick={() => { setSelectedFilter('dining'); setIsExpanded(false); }}
              aria-label={isAr ? "فلترة مشاريع المطاعم والكافيهات" : "Filter by dining projects"}
            >
              <i className="fa-solid fa-utensils" aria-hidden="true"></i>
              <span>{t('filter_dining')}</span>
            </button>
            <button
              type="button"
              className={`project-filter-btn ${selectedFilter === 'showrooms' ? 'active' : ''}`}
              onClick={() => { setSelectedFilter('showrooms'); setIsExpanded(false); }}
              aria-label={isAr ? "فلترة مشاريع المعارض والسيارات" : "Filter by showroom projects"}
            >
              <i className="fa-solid fa-car" aria-hidden="true"></i>
              <span>{t('filter_showrooms')}</span>
            </button>
          </div>

          {/* Infinite Marquee Ticker */}
          <div className="brand-ticker-wrapper">
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
              <div className="project-card glass-panel" key={p.id}>
                <div 
                  className="project-img-wrapper" 
                  onClick={() => setSelectedProject(p)}
                >
                  <Image 
                    src={p.image} 
                    alt={isAr ? p.titleAr : p.titleEn} 
                    fill
                    loading="lazy"
                    sizes="(max-width: 480px) 440px, (max-width: 768px) 600px, (max-width: 1200px) 480px, 360px"
                    style={{ objectFit: 'cover' }}
                  />
                  <span className="project-category">{isAr ? p.catAr : p.catEn}</span>
                  <div className="project-hover-overlay">
                    <div className="project-zoom-btn">
                      <i className="fa-solid fa-up-right-and-down-left-from-center" aria-hidden="true"></i>
                      <span>{isAr ? 'عرض التفاصيل' : 'View High-Res'}</span>
                    </div>
                  </div>
                </div>
                <div className="project-details">
                  <h3 className="project-title">
                    {isAr ? p.titleAr : p.titleEn}
                  </h3>
                  <p className="project-desc">
                    {isAr ? p.descAr : p.descEn}
                  </p>
                  <div className="project-meta">
                    <span>
                      <i className="fa-solid fa-circle-check red-text" aria-hidden="true"></i> 
                      {isAr ? 'تم التسليم والتشغيل' : 'Delivered & Operational'}
                    </span>
                    <span>
                      <i className="fa-solid fa-bolt" aria-hidden="true"></i> 
                      MEP Scope
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Show More / Show Less Toggle Button */}
          {filteredProjects.length > 3 && (
            <div className="projects-load-more-wrap" id="projectsLoadMoreWrap">
              <button 
                type="button"
                className="btn btn-primary load-more-btn" 
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
              >
                <i className={`fa-solid ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}`} aria-hidden="true"></i>
                <span id="loadMoreBtnText">
                  {isExpanded 
                    ? t('btn_show_less') 
                    : `${t('btn_show_more')} (+${remainingCount})`}
                </span>
              </button>
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
                <a href="mailto:Info@emep-egy.com" className="channel-card glass-panel">
                  <div className="channel-icon red-glow flex-shrink-0"><i className="fa-solid fa-envelope" aria-hidden="true"></i></div>
                  <div className="channel-text">
                    <span className="channel-label">{t('channel_email_label')}</span>
                    <span className="channel-value">Info@emep-egy.com</span>
                  </div>
                </a>

                {/* WhatsApp Line 1 */}
                <a
                  href="https://wa.me/201111079467?text=Hello%20E-MEP%20Engineering%20Team,%20I%20have%20a%20project%20inquiry."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="channel-card glass-panel"
                >
                  <div className="channel-icon red-glow flex-shrink-0"><i className="fa-brands fa-whatsapp" aria-hidden="true"></i></div>
                  <div className="channel-text">
                    <span className="channel-label">{t('channel_whatsapp_label1')}</span>
                    <span className="channel-value">{t('channel_whatsapp_val1')}</span>
                  </div>
                </a>

                {/* WhatsApp Line 2 */}
                <a
                  href="https://wa.me/201030834372?text=Hello%20E-MEP%20Engineering%20Team,%20I%20have%20a%20project%20inquiry."
                  target="_blank"
                  rel="noopener noreferrer"
                  id="whatsapp-link"
                  data-testid="whatsapp-link"
                  data-phone="01030834372"
                  className="channel-card glass-panel"
                >
                  <div className="channel-icon red-glow flex-shrink-0"><i className="fa-brands fa-whatsapp" aria-hidden="true"></i></div>
                  <div className="channel-text">
                    <span className="channel-label">{t('channel_whatsapp_label2')}</span>
                    <span className="channel-value">{t('channel_whatsapp_val2')}</span>
                  </div>
                </a>

                {/* Phone Line 1 */}
                <a
                  href="tel:+201111079467"
                  className="channel-card glass-panel"
                >
                  <div className="channel-icon red-glow flex-shrink-0"><i className="fa-solid fa-phone" aria-hidden="true"></i></div>
                  <div className="channel-text">
                    <span className="channel-label">{t('channel_phone_label1')}</span>
                    <span className="channel-value">{t('channel_phone_val1')}</span>
                  </div>
                </a>

                {/* Phone Line 2 */}
                <a
                  href="tel:+201030834372"
                  className="channel-card glass-panel"
                >
                  <div className="channel-icon red-glow flex-shrink-0"><i className="fa-solid fa-phone" aria-hidden="true"></i></div>
                  <div className="channel-text">
                    <span className="channel-label">{t('channel_phone_label2')}</span>
                    <span className="channel-value">{t('channel_phone_val2')}</span>
                  </div>
                </a>

                {/* Headquarters Address */}
                <a 
                  href="https://maps.app.goo.gl/3kx4MnDFTmaykXjCA?g_st=ac"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="channel-card glass-panel"
                >
                  <div className="channel-icon red-glow flex-shrink-0"><i className="fa-solid fa-location-dot" aria-hidden="true"></i></div>
                  <div className="channel-text">
                    <span className="channel-label">{t('channel_address_label')}</span>
                    <span className="channel-value">{t('channel_address_val')}</span>
                  </div>
                </a>
              </div>

              {/* Social Media Channels Grid */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <h3 className="text-xs font-bold text-[#94A3B8] mb-3 uppercase tracking-wider">
                  {t('social_heading')}
                </h3>
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    type="button"
                    onClick={() => window.open("https://www.facebook.com/profile.php?id=100087241140432", "_blank", "noopener,noreferrer")}
                    className="glass-panel hover:bg-[#1877F2]/20 hover:border-[#1877F2]/50 text-[#F8FAFC] hover:text-[#1877F2] p-3 rounded-xl flex items-center gap-2.5 text-xs font-bold transition-all duration-300 shadow-md group focus:ring-2 focus:ring-[#1877F2] outline-none cursor-pointer border-0"
                    aria-label="Facebook Page"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#1877F2]/10 group-hover:bg-[#1877F2] text-[#1877F2] group-hover:text-white flex items-center justify-center text-sm transition-all duration-300">
                      <i className="fa-brands fa-facebook-f"></i>
                    </div>
                    <span>Facebook</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => window.open("https://www.instagram.com/e__mep/", "_blank", "noopener,noreferrer")}
                    className="glass-panel hover:bg-[#E4405F]/20 hover:border-[#E4405F]/50 text-[#F8FAFC] hover:text-[#E4405F] p-3 rounded-xl flex items-center gap-2.5 text-xs font-bold transition-all duration-300 shadow-md group focus:ring-2 focus:ring-[#E4405F] outline-none cursor-pointer border-0"
                    aria-label="Instagram Account"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#E4405F]/10 group-hover:bg-gradient-to-tr group-hover:from-[#F58529] group-hover:via-[#DD2A7B] group-hover:to-[#8134AF] text-[#E4405F] group-hover:text-white flex items-center justify-center text-sm transition-all duration-300">
                      <i className="fa-brands fa-instagram"></i>
                    </div>
                    <span>Instagram</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => window.open("https://www.linkedin.com/in/e-mep-electromechanical-works-3559b2422", "_blank", "noopener,noreferrer")}
                    className="glass-panel hover:bg-[#0A66C2]/20 hover:border-[#0A66C2]/50 text-[#F8FAFC] hover:text-[#0A66C2] p-3 rounded-xl flex items-center gap-2.5 text-xs font-bold transition-all duration-300 shadow-md group group focus:ring-2 focus:ring-[#0A66C2] outline-none cursor-pointer border-0"
                    aria-label="LinkedIn Profile"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#0A66C2]/10 group-hover:bg-[#0A66C2] text-[#0A66C2] group-hover:text-white flex items-center justify-center text-sm transition-all duration-300">
                      <i className="fa-brands fa-linkedin-in"></i>
                    </div>
                    <span>LinkedIn</span>
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

      {/* Footer */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-top grid grid-4">
            <div className="footer-brand-col">
              <div className="footer-logo-badge">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo/logo.png" alt="E-MEP Logo" className="footer-logo" />
              </div>
              <p className="footer-bio">
                {t('footer_bio')}
              </p>
            </div>

            <div className="footer-links-col">
              <h3>{t('footer_col_links')}</h3>
              <ul>
                <li>
                  <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="footer-nav-item">
                    {t('nav_home')}
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="footer-nav-item">
                    {t('nav_about')}
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })} className="footer-nav-item">
                    {t('nav_services')}
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })} className="footer-nav-item">
                    {t('nav_projects')}
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="footer-nav-item">
                    {t('nav_contact')}
                  </button>
                </li>
              </ul>
            </div>

            <div className="footer-services-col">
              <h3>{t('footer_col_services')}</h3>
              <ul>
                <li>{t('feat_hvac_title')}</li>
                <li>{t('feat_elec_title')}</li>
                <li>{t('feat_plumb_title')}</li>
                <li>{t('feat_fire_title')}</li>
                <li>{t('nav_bim')}</li>
              </ul>
            </div>

            <div className="footer-contact-col">
              <h3>{t('footer_col_contact')}</h3>
              <p className="mb-2"><i className="fa-solid fa-envelope red-text" aria-hidden="true"></i> Info@emep-egy.com</p>
              
              {/* WhatsApp Eng. Osama Mohamed */}
              <a 
                href="https://wa.me/201111079467?text=Hello%20E-MEP%20Engineering%20Team,%20I%20have%20a%20project%20inquiry." 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-[#25D366] transition-colors block mb-1.5"
              >
                <p className="flex items-center gap-2 text-sm">
                  <i className="fa-brands fa-whatsapp whatsapp-text text-base flex-shrink-0" aria-hidden="true"></i>
                  <span>{isAr ? 'مهندس أسامة محمد (01111079467)' : 'Eng. Osama Mohamed (01111079467)'}</span>
                </p>
              </a>

              {/* WhatsApp Eng. Ali Rabie */}
              <a 
                href="https://wa.me/201030834372?text=Hello%20E-MEP%20Engineering%20Team,%20I%20have%20a%20project%20inquiry." 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-[#25D366] transition-colors block mb-2"
              >
                <p className="flex items-center gap-2 text-sm">
                  <i className="fa-brands fa-whatsapp whatsapp-text text-base flex-shrink-0" aria-hidden="true"></i>
                  <span>{isAr ? 'مهندس علي ربيع (01030834372)' : 'Eng. Ali Rabie (01030834372)'}</span>
                </p>
              </a>

              <a href="https://maps.app.goo.gl/3kx4MnDFTmaykXjCA?g_st=ac" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF1E27] transition-colors block">
                <p className="flex items-start gap-2 text-sm"><i className="fa-solid fa-location-dot red-text text-base flex-shrink-0 mt-1" aria-hidden="true"></i> <span>{t('channel_address_val')}</span></p>
              </a>
              
              <div className="footer-social-row flex items-center gap-2.5 mt-4">
                <button
                  type="button"
                  onClick={() => window.open('https://www.facebook.com/profile.php?id=100087241140432', '_blank', 'noopener,noreferrer')}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-[#1877F2] hover:bg-[#1877F2] text-[#94A3B8] hover:text-white flex items-center justify-center text-sm transition-all duration-300 cursor-pointer"
                  aria-label="Facebook Page"
                >
                  <i className="fa-brands fa-facebook-f"></i>
                </button>
                <button
                  type="button"
                  onClick={() => window.open('https://www.instagram.com/e__mep/', '_blank', 'noopener,noreferrer')}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-[#E4405F] hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] text-[#94A3B8] hover:text-white flex items-center justify-center text-sm transition-all duration-300 cursor-pointer"
                  aria-label="Instagram Account"
                >
                  <i className="fa-brands fa-instagram"></i>
                </button>
                <button
                  type="button"
                  onClick={() => window.open('https://www.linkedin.com/in/e-mep-electromechanical-works-3559b2422', '_blank', 'noopener,noreferrer')}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-[#0A66C2] hover:bg-[#0A66C2] text-[#94A3B8] hover:text-white flex items-center justify-center text-sm transition-all duration-300 cursor-pointer"
                  aria-label="LinkedIn Profile"
                >
                  <i className="fa-brands fa-linkedin-in"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="footer-bottom text-center">
            <p suppressHydrationWarning>&copy; {new Date().getFullYear()} E-MEP Electromechanical Works. All rights reserved.</p>
            <div style={{ marginTop: '0.5rem' }}>
              <button 
                type="button"
                onClick={() => router.push('/accessibility')} 
                className="footer-nav-item cursor-pointer bg-transparent border-0 text-inherit" 
                style={{ fontSize: '0.8rem', opacity: 0.7 }}
              >
                {isAr ? 'إمكانية الوصول' : 'Accessibility Statement'}
              </button>
            </div>
          </div>
        </div>
      </footer>

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
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProject(null);
                    handleScrollToContact();
                  }}
                  className="btn btn-primary"
                >
                  <i className="fa-solid fa-paper-plane" aria-hidden="true"></i> 
                  <span>{isAr ? 'اطلب مشروع مشابه' : 'Request Similar Project'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
