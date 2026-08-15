"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SafeImage from '@/components/SafeImage';
import { useLanguage } from '@/components/LanguageContext';
import SpecularButton from '@/components/SpecularButton';

interface ArticleItem {
  id: number;
  slug: string;
  titleEn: string;
  titleAr: string;
  summaryEn: string;
  summaryAr: string;
  contentEn?: string;
  contentAr?: string;
  image: string;
  author?: string;
  readTimeMin: number;
  createdAt?: string;
  category?: string;
}

interface BlogClientProps {
  articles: ArticleItem[];
}

export default function BlogClient({ articles }: BlogClientProps) {
  const { language, isMounted } = useLanguage();
  const router = useRouter();
  const isAr = isMounted && language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);

  const categories = [
    { id: 'all', labelEn: 'All Insights', labelAr: 'جميع الدراسات', icon: 'fa-solid fa-layer-group' },
    { id: 'mep', labelEn: 'MEP Systems', labelAr: 'أنظمة MEP', icon: 'fa-solid fa-gears' },
    { id: 'hvac', labelEn: 'HVAC & Ventilation', labelAr: 'التكييف والتهوية', icon: 'fa-solid fa-wind' },
    { id: 'fire', labelEn: 'Firefighting & Codes', labelAr: 'مكافحة الحريق', icon: 'fa-solid fa-fire-extinguisher' },
    { id: 'bim', labelEn: 'Revit & BIM Modeling', labelAr: 'نمذجة الـ BIM', icon: 'fa-solid fa-cube' },
  ];

  // Filtered articles based on search query and category
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const title = isAr ? art.titleAr : (art.titleEn || art.titleAr);
      const summary = isAr ? art.summaryAr : (art.summaryEn || art.summaryAr);
      const searchTarget = `${title} ${summary} ${art.author || ''}`.toLowerCase();
      const matchesSearch = searchQuery.trim() === '' || searchTarget.includes(searchQuery.toLowerCase().trim());

      if (!matchesSearch) return false;

      if (activeCategory === 'all') return true;
      if (activeCategory === 'mep') return searchTarget.includes('mep') || searchTarget.includes('كهروميكانيك') || searchTarget.includes('electromechanical');
      if (activeCategory === 'hvac') return searchTarget.includes('hvac') || searchTarget.includes('تكييف') || searchTarget.includes('تهوية');
      if (activeCategory === 'fire') return searchTarget.includes('fire') || searchTarget.includes('حريق') || searchTarget.includes('إطفاء') || searchTarget.includes('مكافحة');
      if (activeCategory === 'bim') return searchTarget.includes('bim') || searchTarget.includes('revit') || searchTarget.includes('نمذجة') || searchTarget.includes('ريفت');

      return true;
    });
  }, [articles, searchQuery, activeCategory, isAr]);

  const featuredArticle = articles[0];
  const featuredTitle = isAr ? featuredArticle?.titleAr : (featuredArticle?.titleEn || featuredArticle?.titleAr);
  const featuredSummary = isAr ? featuredArticle?.summaryAr : (featuredArticle?.summaryEn || featuredArticle?.summaryAr);

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white flex flex-col selection:bg-[#FF1E27] selection:text-white" dir={isMounted ? (isAr ? 'rtl' : 'ltr') : 'ltr'}>
      <Header />

      {/* ── Top Hero Section with Kinetic Glow & Centered Statement ── */}
      <section className="relative pt-32 sm:pt-36 pb-20 px-4 sm:px-6 overflow-hidden border-b border-white/[0.08] bg-[#07070A] flex flex-col items-center justify-center text-center">
        {/* Subtle Tech Grid & Ambient Radial Glow Layers */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:28px_28px] opacity-70" />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#FF1E27]/12 blur-[150px] rounded-full" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[450px] h-[250px] bg-red-600/10 blur-[110px] rounded-full" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center justify-center text-center space-y-8 w-full">
          {/* Animated Pulse Tag Badge */}
          <div className="inline-flex items-center justify-center gap-2.5 px-4 py-1.5 rounded-full bg-[#FF1E27]/10 border border-[#FF1E27]/30 text-[#FF1E27] text-xs font-bold uppercase tracking-widest shadow-[0_0_25px_rgba(255,30,39,0.25)] mx-auto backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#FF1E27] animate-ping" />
            <span>{isAr ? 'مركز المعرفة والأبحاث الهندسية' : 'Engineering Knowledge & Technical Studies'}</span>
          </div>

          {/* Perfectly Centered & Responsive Kinetic Title */}
          <div className="space-y-4 max-w-4xl mx-auto flex flex-col items-center justify-center text-center">
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[4rem] font-black text-white leading-[1.15] tracking-tight text-center mx-auto">
              {isAr ? (
                <>
                  <span>الريادة الهندسية ونمذجة الـ BIM</span>
                  <br />
                  <span className="text-[#FF1E27] drop-shadow-[0_0_40px_rgba(255,30,39,0.45)]">
                    MEP & BIM Modeling
                  </span>
                </>
              ) : (
                <>
                  <span>Technical Insights & Standards in</span>
                  <br />
                  <span className="text-[#FF1E27] drop-shadow-[0_0_40px_rgba(255,30,39,0.45)]">
                    MEP & BIM Modeling
                  </span>
                </>
              )}
            </h1>

            {/* Perfectly Centered Supporting Statement */}
            <p className="text-sm sm:text-base md:text-lg text-[#94A3B8] max-w-3xl mx-auto leading-relaxed font-normal text-center">
              {isAr
                ? 'دراسات معتمدة تغطي الكود المصري للحريق، اشتراطات الحماية المدنية، كفاءة أنظمة التكييف والتهوية، والتنسيق الرقمي بنماذج Revit BIM.'
                : 'Certified engineering articles on Egyptian Fire Codes, Civil Defense regulations, HVAC & Electrical designs, and coordinated Revit BIM execution.'}
            </p>
          </div>

          {/* Interactive Metric Cards (Centered Grid) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-3xl w-full mx-auto pt-2">
            {[
              { val: `${articles.length}+`, label: isAr ? 'دراسة هندسية' : 'Technical Studies', icon: 'fa-solid fa-book-bookmark' },
              { val: '100%', label: isAr ? 'كود مصري معتمد' : 'Egyptian Codes', icon: 'fa-solid fa-certificate' },
              { val: 'LOD 400', label: isAr ? 'نمذجة رقمية BIM' : 'BIM Modeling', icon: 'fa-solid fa-cube' },
              { val: '24/7', label: isAr ? 'دعم واستشارات' : 'Expert Support', icon: 'fa-solid fa-headset' },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md hover:border-[#FF1E27]/40 hover:bg-white/[0.06] hover:-translate-y-1 transition-all duration-300 shadow-sm text-center flex flex-col items-center justify-center group cursor-default"
              >
                <div className="text-[#FF1E27] text-sm mb-1.5 opacity-80 group-hover:scale-110 transition-transform">
                  <i className={stat.icon}></i>
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">{stat.val}</div>
                <div className="text-[11px] text-[#94A3B8] font-medium mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Polished Glass Search Bar (Centered) */}
          <div className="w-full max-w-2xl mx-auto pt-3">
            <div className="relative flex items-center w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'ابحث في موضوعات التكييف، الحريق، الكهرباء، أو الـ BIM...' : 'Search HVAC, Firefighting, Electrical, or BIM topics...'}
                className="w-full bg-[#131317]/90 backdrop-blur-xl border border-white/10 rounded-2xl py-3.5 px-5 ps-12 text-sm text-white placeholder:text-[#64748B] focus:border-[#FF1E27] focus:ring-2 focus:ring-[#FF1E27]/25 outline-none shadow-2xl transition-all"
              />
              <svg className="w-5 h-5 text-[#94A3B8] absolute start-4 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute end-3 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-[#FF1E27] text-white text-xs font-semibold transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
                >
                  {isAr ? 'مسح' : 'Clear'}
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Bar (Centered) */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2 mx-auto">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <SpecularButton
                  key={cat.id}
                  size="sm"
                  radius={16}
                  lineColor={isActive ? "#FF1E27" : "#64748B"}
                  baseColor={isActive ? "#521014" : "#14141c"}
                  intensity={isActive ? 1.3 : 0.8}
                  shineSize={12}
                  shineFade={35}
                  thickness={1.5}
                  followMouse
                  autoAnimate
                  onClick={() => setActiveCategory(cat.id)}
                  className={`font-semibold text-xs transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "shadow-[0_0_20px_rgba(255,30,39,0.35)] scale-[1.02]"
                      : "text-[#94A3B8]"
                  }`}
                >
                  <i className={`${cat.icon} text-xs`}></i>
                  <span>{isAr ? cat.labelAr : cat.labelEn}</span>
                </SpecularButton>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Main Articles Content ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-14 space-y-16 flex-1 w-full">
        {/* ── Featured Study Showcase (When no filter is active) ── */}
        {featuredArticle && searchQuery.trim() === '' && activeCategory === 'all' && (
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-[#FF1E27] rounded-full" />
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-[#FF1E27]">
                {isAr ? 'الدراسة الهندسية المميزة' : 'Featured Technical Study'}
              </h2>
              <div className="flex-1 h-px bg-white/[0.08]" />
            </div>

            <div className="glass-panel relative rounded-3xl overflow-hidden border border-white/[0.1] bg-[#111116] hover:border-[#FF1E27]/60 hover:shadow-[0_0_60px_rgba(211,16,25,0.25)] transition-all duration-500 grid grid-cols-1 lg:grid-cols-2">
              {/* Featured Image */}
              <div className="relative min-h-[300px] lg:min-h-[440px] overflow-hidden bg-[#0D0D0F]">
                <SafeImage
                  src={featuredArticle.image}
                  alt={featuredTitle || ''}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out cursor-pointer"
                  priority
                  onClick={() => router.push(`/blog/${featuredArticle.slug}`)}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#111116] hidden lg:block pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111116] via-transparent to-transparent lg:hidden pointer-events-none" />

                {/* Top Badge */}
                <div className="bim-badge-overlay !top-4 !bottom-auto !start-4 !end-auto">
                  <i className="fa-solid fa-star text-xs"></i>
                  <span>{isAr ? 'دراسة متعمقة' : 'Featured Study'}</span>
                </div>
              </div>

              {/* Featured Details */}
              <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center gap-6">
                <div className="flex items-center gap-3 text-xs text-[#94A3B8]">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-[#FF1E27]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>{featuredArticle.readTimeMin} {isAr ? 'دقائق قراءة' : 'min read'}</span>
                  </div>
                  <span className="text-white/20">•</span>
                  <span className="text-white font-semibold">{featuredArticle.author || 'E-MEP Engineering Team'}</span>
                </div>

                <h2
                  onClick={() => router.push(`/blog/${featuredArticle.slug}`)}
                  className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight hover:text-[#FF3D44] transition-colors duration-300 cursor-pointer"
                >
                  {featuredTitle}
                </h2>

                <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed line-clamp-4 font-normal">
                  {featuredSummary}
                </p>

                {/* Action Buttons using SpecularButton */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <SpecularButton
                    size="md"
                    radius={16}
                    lineColor="#FF1E27"
                    baseColor="#521014"
                    intensity={1.3}
                    shineSize={14}
                    shineFade={40}
                    thickness={1.5}
                    followMouse
                    autoAnimate
                    onClick={() => router.push(`/blog/${featuredArticle.slug}`)}
                    className="px-7 py-3 text-sm font-bold shadow-lg shadow-[#FF1E27]/30 cursor-pointer"
                  >
                    <span>{isAr ? 'قراءة الدراسة كاملة' : 'Read Full Study'}</span>
                    <i className={`fa-solid fa-arrow-right text-xs ${isAr ? 'rotate-180' : ''}`}></i>
                  </SpecularButton>

                  <SpecularButton
                    size="md"
                    radius={16}
                    lineColor="#94A3B8"
                    baseColor="#1e1e28"
                    intensity={1.0}
                    shineSize={12}
                    shineFade={35}
                    thickness={1.2}
                    followMouse
                    autoAnimate
                    onClick={() => setSelectedArticle(featuredArticle)}
                    className="px-5 py-3 text-sm font-bold bg-white/[0.04] text-white cursor-pointer"
                  >
                    <i className="fa-solid fa-eye text-xs"></i>
                    <span>{isAr ? 'معاينة سريعة' : 'Quick Preview'}</span>
                  </SpecularButton>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Articles Grid ── */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-[#FF1E27] rounded-full" />
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-white">
                {isAr ? 'جميع الدراسات والمقالات' : 'Engineering Articles'}
              </h2>
              <span className="text-xs text-[#FF1E27] font-mono bg-[#FF1E27]/10 px-2.5 py-0.5 rounded-full border border-[#FF1E27]/30 font-bold">
                {filteredArticles.length}
              </span>
            </div>
          </div>

          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((art, index) => {
                const title = isAr ? art.titleAr : (art.titleEn || art.titleAr);
                const summary = isAr ? art.summaryAr : (art.summaryEn || art.summaryAr);

                return (
                  <article
                    key={art.id}
                    className="glass-panel group relative bg-[#111116] border border-white/[0.08] rounded-2xl overflow-hidden flex flex-col hover:border-[#FF1E27]/50 hover:-translate-y-2 hover:shadow-[0_15px_45px_rgba(211,16,25,0.25)] transition-all duration-300 ease-out"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Image Container */}
                    <div
                      onClick={() => router.push(`/blog/${art.slug}`)}
                      className="relative aspect-[16/9] overflow-hidden bg-[#0D0D0F] flex-shrink-0 cursor-pointer"
                    >
                      <SafeImage
                        src={art.image}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111116] via-[#111116]/30 to-transparent opacity-70" />

                      {/* Read Time Badge */}
                      <div className="absolute top-3 end-3 flex items-center gap-1.5 px-3 py-1 bg-black/70 backdrop-blur-md border border-white/10 rounded-full text-[11px] font-semibold text-white/90 shadow-md">
                        <svg className="w-3.5 h-3.5 text-[#FF1E27]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span>{art.readTimeMin} {isAr ? 'د' : 'min'}</span>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="flex flex-col flex-1 p-5 sm:p-6 gap-3.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FF1E27] to-[#8B0000] flex items-center justify-center flex-shrink-0 shadow-sm font-black text-white text-[10px]">
                            E
                          </div>
                          <span className="text-xs font-semibold text-[#94A3B8] truncate">{art.author || 'E-MEP Team'}</span>
                        </div>
                        <span className="text-[11px] text-[#475569] font-mono font-medium">
                          #{String(art.id).padStart(3, '0')}
                        </span>
                      </div>

                      <h3
                        onClick={() => router.push(`/blog/${art.slug}`)}
                        className="text-base sm:text-lg font-extrabold text-white leading-snug line-clamp-2 group-hover:text-[#FF3D44] transition-colors duration-200 cursor-pointer"
                      >
                        {title}
                      </h3>

                      <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed line-clamp-3 flex-1 font-normal">
                        {summary}
                      </p>

                      {/* Card Action Row */}
                      <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between mt-auto gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedArticle(art)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] hover:border-white/20 text-xs font-semibold text-white transition-all duration-200 cursor-pointer active:scale-95"
                        >
                          <i className="fa-solid fa-expand text-[11px] text-[#94A3B8]"></i>
                          <span>{isAr ? 'معاينة' : 'Preview'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => router.push(`/blog/${art.slug}`)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF1E27] to-[#D31019] hover:from-[#ff3840] hover:to-[#e0151f] text-white text-xs font-bold shadow-lg shadow-[#FF1E27]/25 hover:shadow-[#FF1E27]/40 transition-all duration-200 cursor-pointer active:scale-95 group/btn"
                        >
                          <span>{isAr ? 'قراءة المقال' : 'Read Article'}</span>
                          <i className={`fa-solid fa-arrow-right text-[11px] ${isAr ? 'rotate-180 group-hover/btn:-translate-x-1' : 'group-hover/btn:translate-x-1'} transition-transform`}></i>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="glass-panel py-20 text-center bg-[#111116] border border-white/[0.06] rounded-3xl space-y-4">
              <div className="w-12 h-12 rounded-full bg-white/5 mx-auto flex items-center justify-center text-[#94A3B8]">
                <i className="fa-solid fa-magnifying-glass text-xl"></i>
              </div>
              <h3 className="text-lg font-bold text-white">
                {isAr ? 'لم يتم العثور على مقالات تطابق بحثك' : 'No articles match your search'}
              </h3>
              <p className="text-sm text-[#64748B] max-w-sm mx-auto">
                {isAr ? 'جرب البحث بكلمات أخرى أو اختر قسماً هندسياً مختلفاً من الأزرار أعلاه.' : 'Try searching with other keywords or select a different category above.'}
              </p>
              <SpecularButton
                size="md"
                radius={16}
                lineColor="#FF1E27"
                baseColor="#521014"
                intensity={1.3}
                shineSize={14}
                shineFade={40}
                thickness={1.5}
                followMouse
                autoAnimate
                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                className="px-7 py-3 text-xs font-bold cursor-pointer shadow-lg shadow-[#FF1E27]/30"
              >
                <i className="fa-solid fa-rotate-left text-xs"></i>
                <span>{isAr ? 'إعادة ضبط الفلتر' : 'Reset Filters'}</span>
              </SpecularButton>
            </div>
          )}
        </section>

        {/* ── Consultation CTA Banner with SpecularButtons ── */}
        <section className="glass-panel relative rounded-3xl overflow-hidden border border-[#FF1E27]/30 bg-[#111116] shadow-2xl">
          {/* Ambient Glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -start-32 top-1/2 -translate-y-1/2 w-80 h-80 bg-[#FF1E27]/15 blur-3xl rounded-full" />
          </div>
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#FF1E27]/80 to-transparent" />

          <div className="relative z-10 p-8 sm:p-10 md:p-14 text-center space-y-5 flex flex-col items-center justify-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 bg-[#FF1E27]/10 border border-[#FF1E27]/25 rounded-full shadow-[0_0_20px_rgba(255,30,39,0.15)] mx-auto">
              <svg className="w-3.5 h-3.5 text-[#FF1E27] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-bold text-[#FF1E27] uppercase tracking-widest">
                {isAr ? 'استشارة هندسية معتمدة' : 'Certified Engineering Consultation'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              {isAr
                ? <>هل مشروعك يحتاج <span className="text-[#FF1E27]">دراسة أو اعتماد هندسي</span>؟</>
                : <>Need <span className="text-[#FF1E27]">Engineering Consultation</span> for Your Project?</>}
            </h2>
            <p className="text-sm sm:text-base text-[#94A3B8] max-w-xl mx-auto leading-relaxed font-normal">
              {isAr
                ? 'فريق E-MEP جاهز لمراجعة واعتماد مخططاتك الهندسية وتقديم دراسات الـ MEP ونمذجة الـ BIM الاحترافية.'
                : 'The E-MEP team is ready to review drawings and provide initial studies for MEP & BIM systems.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3.5 justify-center pt-3">
              <SpecularButton
                size="lg"
                radius={20}
                lineColor="#FF1E27"
                baseColor="#521014"
                intensity={1.4}
                shineSize={16}
                shineFade={45}
                thickness={1.6}
                followMouse
                autoAnimate
                onClick={() => router.push('/#contact')}
                className="px-8 py-3.5 text-sm font-bold shadow-xl shadow-[#FF1E27]/40 cursor-pointer"
              >
                <i className="fa-solid fa-envelope text-sm"></i>
                <span>{isAr ? 'اطلب الاستشارة الآن' : 'Request Consultation'}</span>
              </SpecularButton>

              <SpecularButton
                size="lg"
                radius={20}
                lineColor="#25D366"
                baseColor="#0e3820"
                intensity={1.4}
                shineSize={16}
                shineFade={45}
                thickness={1.6}
                followMouse
                autoAnimate
                onClick={() => window.open('https://wa.me/201030834372?text=Hello%20E-MEP%20Engineering%20Team,%20I%20have%20a%20project%20inquiry.', '_blank')}
                className="px-8 py-3.5 text-sm font-bold shadow-xl shadow-[#25D366]/30 cursor-pointer"
              >
                <i className="fa-brands fa-whatsapp text-base text-[#25D366]"></i>
                <span>{isAr ? 'تواصل واتساب' : 'WhatsApp Us'}</span>
              </SpecularButton>
            </div>
          </div>
        </section>
      </main>

      {/* ── Quick Preview Lightbox Modal (Glass Panel Modal) ── */}
      {selectedArticle && (
        <div
          className="fixed inset-0 z-[1200] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 transition-all duration-300"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedArticle(null);
            }
          }}
        >
          <div className="glass-panel relative w-full max-w-2xl bg-[#111116] border border-white/15 rounded-3xl overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.85)] flex flex-col max-h-[90vh]">
            <button
              type="button"
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 end-4 z-20 w-9 h-9 rounded-full bg-black/70 border border-white/15 text-white hover:bg-[#FF1E27] hover:border-[#FF1E27] flex items-center justify-center transition-all cursor-pointer shadow-lg"
              aria-label={isAr ? "إغلاق" : "Close"}
            >
              &times;
            </button>

            <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#0D0D0F]">
              <SafeImage
                src={selectedArticle.image}
                alt={isAr ? selectedArticle.titleAr : selectedArticle.titleEn}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111116] via-transparent to-transparent" />
            </div>

            <div className="p-6 sm:p-8 space-y-4 overflow-y-auto custom-scrollbar">
              <div className="flex items-center gap-3 text-xs text-[#FF1E27] font-bold">
                <i className="fa-solid fa-clock"></i>
                <span>{selectedArticle.readTimeMin} {isAr ? 'دقائق قراءة' : 'min read'}</span>
                <span className="text-white/20">•</span>
                <span className="text-[#94A3B8]">{selectedArticle.author || 'E-MEP Engineering Team'}</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
                {isAr ? selectedArticle.titleAr : (selectedArticle.titleEn || selectedArticle.titleAr)}
              </h3>

              <p className="text-sm text-[#94A3B8] leading-relaxed font-normal">
                {isAr ? selectedArticle.summaryAr : (selectedArticle.summaryEn || selectedArticle.summaryAr)}
              </p>

              <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
                <SpecularButton
                  size="md"
                  radius={16}
                  lineColor="#FF1E27"
                  baseColor="#521014"
                  intensity={1.3}
                  shineSize={14}
                  shineFade={40}
                  thickness={1.5}
                  followMouse
                  autoAnimate
                  onClick={() => {
                    const slug = selectedArticle.slug;
                    setSelectedArticle(null);
                    router.push(`/blog/${slug}`);
                  }}
                  className="px-7 py-3 text-sm font-bold shadow-lg shadow-[#FF1E27]/30 cursor-pointer"
                >
                  <span>{isAr ? 'قراءة المقال بالكامل' : 'Read Full Article'}</span>
                  <i className={`fa-solid fa-arrow-right text-xs ${isAr ? 'rotate-180' : ''}`}></i>
                </SpecularButton>

                <SpecularButton
                  size="md"
                  radius={16}
                  lineColor="#94A3B8"
                  baseColor="#1e1e28"
                  intensity={1.0}
                  shineSize={12}
                  shineFade={35}
                  thickness={1.2}
                  followMouse
                  autoAnimate
                  onClick={() => setSelectedArticle(null)}
                  className="px-6 py-3 text-sm font-bold text-white bg-white/[0.04] cursor-pointer"
                >
                  <span>{isAr ? 'إغلاق' : 'Close'}</span>
                </SpecularButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shared Unified Footer */}
      <Footer />
    </div>
  );
}
