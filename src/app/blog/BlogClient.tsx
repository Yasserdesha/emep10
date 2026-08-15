"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SafeImage from '@/components/SafeImage';
import { useLanguage } from '@/components/LanguageContext';
import { Button } from '@/components/ui/button';

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

  // Filtered articles based on search and category
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

      {/* ── Top Hero Statement & Interactive Filter Bar ── */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 overflow-hidden border-b border-white/[0.08] bg-[#050507]">
        {/* Ambient Radial Glow Layers */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#FF1E27]/12 blur-[140px] rounded-full" />
          <div className="absolute top-1/3 start-1/4 w-[300px] h-[200px] bg-red-600/10 blur-[100px] rounded-full" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-7">
          {/* Animated Glowing Tag */}
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-[#FF1E27]/10 border border-[#FF1E27]/30 text-[#FF1E27] text-xs font-bold uppercase tracking-widest shadow-[0_0_25px_rgba(255,30,39,0.2)] mx-auto">
            <span className="w-2 h-2 rounded-full bg-[#FF1E27] animate-pulse" />
            <span>{isAr ? 'مركز المعرفة والأبحاث الهندسية' : 'Engineering Knowledge & Technical Studies'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-[1.15] tracking-tight max-w-4xl mx-auto">
            {isAr ? (
              <>أحدث الدراسات الهندسية في <br /><span className="text-[#FF1E27] drop-shadow-[0_0_35px_rgba(255,30,39,0.4)]">MEP & BIM Modeling</span></>
            ) : (
              <>Technical Insights & Standards in <br /><span className="text-[#FF1E27] drop-shadow-[0_0_35px_rgba(255,30,39,0.4)]">MEP & BIM Modeling</span></>
            )}
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-[#94A3B8] max-w-2xl mx-auto leading-relaxed font-normal">
            {isAr
              ? 'دراسات معتمدة تغطي الكود المصري للحريق، اشتراطات الحماية المدنية، كفاءة أنظمة التكييف والتهوية، والتنسيق الرقمي بنماذج Revit BIM.'
              : 'Certified engineering articles on Egyptian Fire Codes, Civil Defense regulations, HVAC & Electrical designs, and coordinated Revit BIM execution.'}
          </p>

          {/* Interactive Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-3xl mx-auto pt-2">
            {[
              { val: `${articles.length}+`, label: isAr ? 'دراسة هندسية' : 'Technical Studies' },
              { val: '100%', label: isAr ? 'كود مصري معتمد' : 'Egyptian Codes' },
              { val: 'BIM', label: isAr ? 'نمذجة رقمية' : 'LOD 350-400' },
              { val: '24/7', label: isAr ? 'استشارات فنية' : 'Engineering Support' },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md hover:border-[#FF1E27]/40 hover:bg-white/[0.05] transition-all duration-300 shadow-sm"
              >
                <div className="text-xl sm:text-2xl font-black text-white">{stat.val}</div>
                <div className="text-[11px] text-[#94A3B8] font-medium mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Search Input */}
          <div className="max-w-2xl mx-auto pt-3">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'ابحث في موضوعات التكييف، الحريق، الكهرباء، أو الـ BIM...' : 'Search HVAC, Firefighting, Electrical, or BIM topics...'}
                className="w-full bg-[#131317] border border-white/10 rounded-2xl py-3.5 px-5 ps-12 text-sm text-white placeholder:text-[#64748B] focus:border-[#FF1E27] focus:ring-2 focus:ring-[#FF1E27]/25 outline-none shadow-xl transition-all"
              />
              <svg className="w-5 h-5 text-[#94A3B8] absolute start-4 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute end-4 text-xs font-bold text-[#94A3B8] hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  {isAr ? 'مسح' : 'Clear'}
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Tabs with Home Style Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-b from-[#FF2B33] to-[#D31019] text-white shadow-lg shadow-[#FF1E27]/40 border border-white/20 scale-105'
                      : 'bg-white/[0.04] text-[#94A3B8] hover:text-white hover:bg-white/[0.08] border border-white/10'
                  }`}
                >
                  <i className={`${cat.icon} text-xs`}></i>
                  <span>{isAr ? cat.labelAr : cat.labelEn}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Main Articles Content ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-14 space-y-16 flex-1 w-full">
        {/* ── Featured Study Showcase (When no filter active) ── */}
        {featuredArticle && searchQuery.trim() === '' && activeCategory === 'all' && (
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-[#FF1E27] rounded-full" />
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-[#FF1E27]">
                {isAr ? 'الدراسة الهندسية المميزة' : 'Featured Technical Study'}
              </h2>
              <div className="flex-1 h-px bg-white/[0.08]" />
            </div>

            <div className="relative rounded-3xl overflow-hidden border border-white/[0.1] bg-[#111116] hover:border-[#FF1E27]/60 hover:shadow-[0_0_60px_rgba(211,16,25,0.25)] transition-all duration-500 grid grid-cols-1 lg:grid-cols-2">
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

                {/* Badge */}
                <div className="absolute top-4 start-4 flex items-center gap-2 px-3.5 py-1.5 bg-[#FF1E27] rounded-full shadow-lg">
                  <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-xs font-black text-white tracking-wider uppercase">
                    {isAr ? 'دراسة متعمقة' : 'Featured Study'}
                  </span>
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

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button
                    type="button"
                    variant="default"
                    size="lg"
                    onClick={() => router.push(`/blog/${featuredArticle.slug}`)}
                    className="rounded-full px-6 font-bold shadow-lg shadow-[#FF1E27]/30 cursor-pointer"
                  >
                    <span>{isAr ? 'قراءة الدراسة كاملة' : 'Read Full Study'}</span>
                    <svg className={`w-4 h-4 mr-2 rtl:ml-2 ${isAr ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => setSelectedArticle(featuredArticle)}
                    className="rounded-full px-5 font-bold cursor-pointer"
                  >
                    <i className="fa-solid fa-eye text-xs mr-2 rtl:ml-2"></i>
                    <span>{isAr ? 'معاينة سريعة' : 'Quick Preview'}</span>
                  </Button>
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
                    className="group relative bg-[#111116] border border-white/[0.08] rounded-2xl overflow-hidden flex flex-col hover:border-[#FF1E27]/50 hover:-translate-y-2 hover:shadow-[0_15px_45px_rgba(211,16,25,0.25)] transition-all duration-300 ease-out"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Image Container with Aspect Ratio */}
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
                        <span className="text-[11px] text-[#475569] font-mono">
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
                      <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between mt-auto">
                        <button
                          type="button"
                          onClick={() => setSelectedArticle(art)}
                          className="text-xs font-semibold text-[#94A3B8] hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <i className="fa-solid fa-expand text-[10px]"></i>
                          <span>{isAr ? 'نظرة عامة' : 'Preview'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => router.push(`/blog/${art.slug}`)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF1E27] group-hover:text-white group-hover:gap-2.5 transition-all duration-200 cursor-pointer"
                        >
                          <span>{isAr ? 'قراءة المقال' : 'Read Article'}</span>
                          <svg className={`w-3.5 h-3.5 ${isAr ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="py-20 text-center bg-[#111116] border border-white/[0.06] rounded-3xl space-y-4">
              <div className="w-12 h-12 rounded-full bg-white/5 mx-auto flex items-center justify-center text-[#94A3B8]">
                <i className="fa-solid fa-magnifying-glass text-xl"></i>
              </div>
              <h3 className="text-lg font-bold text-white">
                {isAr ? 'لم يتم العثور على مقالات تطابق بحثك' : 'No articles match your search'}
              </h3>
              <p className="text-sm text-[#64748B] max-w-sm mx-auto">
                {isAr ? 'جرب البحث بكلمات أخرى أو اختر قسماً هندسياً مختلفاً من الأزرار أعلاه.' : 'Try searching with other keywords or select a different category above.'}
              </p>
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                className="px-5 py-2 rounded-xl bg-[#FF1E27] text-white text-xs font-bold shadow-lg shadow-[#FF1E27]/30 hover:bg-[#FF3D44] transition-all cursor-pointer"
              >
                {isAr ? 'إعادة ضبط الفلتر' : 'Reset Filters'}
              </button>
            </div>
          )}
        </section>

        {/* ── Consultation CTA Banner with Homepage Gradient Buttons ── */}
        <section className="relative rounded-3xl overflow-hidden border border-[#FF1E27]/30 bg-[#111116] shadow-2xl">
          {/* Ambient Glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -start-32 top-1/2 -translate-y-1/2 w-80 h-80 bg-[#FF1E27]/15 blur-3xl rounded-full" />
          </div>
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#FF1E27]/80 to-transparent" />

          <div className="relative z-10 p-10 md:p-14 text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FF1E27]/10 border border-[#FF1E27]/25 rounded-full shadow-[0_0_20px_rgba(255,30,39,0.15)]">
              <svg className="w-3.5 h-3.5 text-[#FF1E27]" fill="currentColor" viewBox="0 0 20 20">
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
              <Button
                type="button"
                variant="default"
                size="lg"
                onClick={() => router.push('/#contact')}
                className="rounded-full px-8 py-6 font-bold text-sm shadow-xl shadow-[#FF1E27]/30 hover:shadow-[#FF1E27]/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
              >
                <svg className="w-4 h-4 mr-2 rtl:ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{isAr ? 'اطلب الاستشارة الآن' : 'Request Consultation'}</span>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8 py-6 font-bold text-sm bg-gradient-to-b from-[#25D366] to-[#128C7E] text-white border-0 hover:from-[#2fe472] hover:to-[#17a594] shadow-xl shadow-[#25D366]/30 hover:shadow-[#25D366]/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
              >
                <a
                  href="https://wa.me/201030834372?text=Hello%20E-MEP%20Engineering%20Team,%20I%20have%20a%20project%20inquiry."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="w-4 h-4 mr-2 rtl:ml-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M11.999 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.948-1.42A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
                  </svg>
                  <span>{isAr ? 'تواصل واتساب' : 'WhatsApp Us'}</span>
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* ── Quick Preview Lightbox Modal (Homepage-style interactive modal) ── */}
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
          <div className="relative w-full max-w-2xl bg-[#111116] border border-white/15 rounded-3xl overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.8)] flex flex-col max-h-[90vh]">
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
                <Button
                  type="button"
                  variant="default"
                  size="lg"
                  onClick={() => {
                    const slug = selectedArticle.slug;
                    setSelectedArticle(null);
                    router.push(`/blog/${slug}`);
                  }}
                  className="rounded-full px-7 font-bold shadow-lg shadow-[#FF1E27]/30 cursor-pointer"
                >
                  <span>{isAr ? 'قراءة المقال بالكامل' : 'Read Full Article'}</span>
                  <i className="fa-solid fa-arrow-right text-xs mr-2 rtl:ml-2 rtl:rotate-180"></i>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setSelectedArticle(null)}
                  className="rounded-full px-6 font-bold cursor-pointer"
                >
                  <span>{isAr ? 'إغلاق' : 'Close'}</span>
                </Button>
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
