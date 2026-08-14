"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import SafeImage from '@/components/SafeImage';
import { useLanguage } from '@/components/LanguageContext';

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
}

interface BlogClientProps {
  articles: ArticleItem[];
}

function ArticleCard({ art, isAr, index }: { art: ArticleItem; isAr: boolean; index: number }) {
  const title = isAr ? art.titleAr : (art.titleEn || art.titleAr);
  const summary = isAr ? art.summaryAr : (art.summaryEn || art.summaryAr);

  return (
    <article
      className="group relative bg-[#111116] border border-white/[0.07] rounded-2xl overflow-hidden flex flex-col
                 hover:border-[#FF1E27]/40 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(211,16,25,0.15)]
                 transition-all duration-300 ease-out"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-[#0D0D0F] flex-shrink-0">
        <SafeImage
          src={art.image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111116] via-[#111116]/20 to-transparent opacity-60" />

        {/* Read time badge */}
        <div className="absolute top-3 end-3 flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-sm border border-white/10 rounded-full text-[10px] font-semibold text-white/80">
          <svg className="w-3 h-3 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
          {art.readTimeMin} {isAr ? 'د' : 'min'}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Author row */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FF1E27] to-[#8B0000] flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </div>
          <span className="text-[11px] font-medium text-[#94A3B8] truncate">{art.author || 'E-MEP Engineering Team'}</span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 group-hover:text-[#FF4040] transition-colors duration-200">
          <Link href={`/blog/${art.slug}`} className="after:absolute after:inset-0">
            {title}
          </Link>
        </h3>

        {/* Summary */}
        <p className="text-xs text-[#64748B] leading-relaxed line-clamp-3 flex-1">
          {summary}
        </p>

        {/* Footer */}
        <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
          <span className="text-[10px] text-[#475569] font-mono">
            #{String(art.id).padStart(3, '0')}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FF1E27] group-hover:gap-2 transition-all duration-200">
            {isAr ? 'قراءة' : 'Read'}
            <svg className={`w-3 h-3 ${isAr ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </article>
  );
}

export default function BlogClient({ articles }: BlogClientProps) {
  const { language, isMounted } = useLanguage();
  const isAr = isMounted && language === 'ar';

  const featuredArticle = articles[0];
  const regularArticles = articles.slice(1);
  const featuredTitle = isAr ? featuredArticle?.titleAr : (featuredArticle?.titleEn || featuredArticle?.titleAr);
  const featuredSummary = isAr ? featuredArticle?.summaryAr : (featuredArticle?.summaryEn || featuredArticle?.summaryAr);

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white" dir={isMounted ? (isAr ? 'rtl' : 'ltr') : 'ltr'}>
      <Header />

      {/* ── Page Hero Banner ── */}
      <section className="relative pt-28 pb-16 px-4 overflow-hidden">
        {/* Background radial glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#FF1E27]/6 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Label */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FF1E27]/10 border border-[#FF1E27]/25 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF1E27] animate-pulse" />
            <span className="text-[11px] font-bold tracking-widest uppercase text-[#FF1E27]">
              {isAr ? 'مركز المقالات الهندسية' : 'Engineering Knowledge Hub'}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tight mb-4 max-w-3xl">
            {isAr ? (
              <>أعمق المقالات في <br /><span className="text-[#FF1E27]">MEP & BIM</span></>
            ) : (
              <>Expert Insights in <br /><span className="text-[#FF1E27]">MEP & BIM</span></>
            )}
          </h1>
          <p className="text-sm md:text-base text-[#64748B] max-w-xl leading-relaxed">
            {isAr
              ? 'مكتبة هندسية متخصصة في الكود المصري للحماية المدنية، تصميم أنظمة HVAC والكهرباء، وتطبيقات Revit BIM.'
              : 'A specialized engineering library covering the Egyptian Fire Code, HVAC & Electrical design, and Revit BIM applications.'}
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-6 mt-8">
            {[
              { val: articles.length, label: isAr ? 'مقال متخصص' : 'Articles' },
              { val: '100%', label: isAr ? 'محتوى هندسي' : 'Engineering' },
              { val: isAr ? 'ع / EN' : 'AR / EN', label: isAr ? 'لغتان' : 'Bilingual' },
            ].map((s) => (
              <div key={s.label} className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">{s.val}</span>
                <span className="text-xs text-[#475569] font-medium">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-24 space-y-16">

        {/* ── Featured Article ── */}
        {featuredArticle && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-5 bg-[#FF1E27] rounded-full" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#FF1E27]">
                {isAr ? 'المقال المميز' : 'Featured Article'}
              </h2>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>

            <Link href={`/blog/${featuredArticle.slug}`} className="group block">
              <div className="relative rounded-3xl overflow-hidden border border-white/[0.08] bg-[#111116]
                              hover:border-[#FF1E27]/50 hover:shadow-[0_0_60px_rgba(211,16,25,0.12)]
                              transition-all duration-400 grid grid-cols-1 lg:grid-cols-2">

                {/* Featured image */}
                <div className="relative min-h-[280px] lg:min-h-[420px] overflow-hidden bg-[#0D0D0F]">
                  <SafeImage
                    src={featuredArticle.image}
                    alt={featuredTitle || ''}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#111116] hidden lg:block" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111116] via-transparent to-transparent lg:hidden" />
                  {/* Featured badge */}
                  <div className="absolute top-4 start-4 flex items-center gap-2 px-3 py-1.5 bg-[#FF1E27] rounded-full">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-[10px] font-black text-white tracking-wider uppercase">
                      {isAr ? 'مميز' : 'Featured'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 md:p-10 flex flex-col justify-center gap-5">
                  <div className="flex items-center gap-3 text-xs text-[#64748B]">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-[#FF1E27]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span>{featuredArticle.readTimeMin} {isAr ? 'دقائق قراءة' : 'min read'}</span>
                    </div>
                    <span className="text-white/20">•</span>
                    <span className="text-[#94A3B8] font-medium">{featuredArticle.author}</span>
                  </div>

                  <h2 className="text-xl md:text-3xl font-extrabold text-white leading-snug
                                 group-hover:text-[#FF4040] transition-colors duration-300">
                    {featuredTitle}
                  </h2>

                  <p className="text-sm text-[#64748B] leading-relaxed line-clamp-4">
                    {featuredSummary}
                  </p>

                  <div className="flex items-center gap-2 pt-2">
                    <span className="text-sm font-bold text-[#FF1E27]">
                      {isAr ? 'قراءة المقال كاملاً' : 'Read Full Article'}
                    </span>
                    <svg className={`w-4 h-4 text-[#FF1E27] group-hover:translate-x-1 transition-transform duration-200 ${isAr ? 'rotate-180 group-hover:-translate-x-1 group-hover:translate-x-0' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* ── Articles Grid ── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-5 bg-[#FF1E27] rounded-full" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#94A3B8]">
                {isAr ? 'جميع المقالات' : 'All Articles'}
              </h2>
              <span className="text-xs text-[#334155] font-mono bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.06]">
                {articles.length}
              </span>
            </div>
          </div>

          {regularArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {regularArticles.map((art, index) => (
                <ArticleCard key={art.id} art={art} isAr={isAr} index={index} />
              ))}
            </div>
          ) : (
            /* Show all articles if no "regular" ones (only 1 article total) */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {articles.map((art, index) => (
                <ArticleCard key={art.id} art={art} isAr={isAr} index={index} />
              ))}
            </div>
          )}
        </section>

        {/* ── CTA Banner ── */}
        <section className="relative rounded-3xl overflow-hidden border border-[#FF1E27]/20 bg-[#111116]">
          {/* Glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -start-32 top-1/2 -translate-y-1/2 w-64 h-64 bg-[#FF1E27]/10 blur-3xl rounded-full" />
          </div>
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#FF1E27]/60 to-transparent" />

          <div className="relative z-10 p-10 md:p-14 text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FF1E27]/10 border border-[#FF1E27]/20 rounded-full">
              <svg className="w-3 h-3 text-[#FF1E27]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              <span className="text-[10px] font-bold text-[#FF1E27] uppercase tracking-widest">
                {isAr ? 'استشارة هندسية مجانية' : 'Free Engineering Consultation'}
              </span>
            </div>

            <h2 className="text-2xl md:text-4xl font-black text-white leading-tight">
              {isAr
                ? <>هل مشروعك يحتاج <span className="text-[#FF1E27]">خبرة هندسية</span>؟</>
                : <>Need <span className="text-[#FF1E27]">Engineering Expertise</span> for Your Project?</>}
            </h2>
            <p className="text-sm text-[#64748B] max-w-lg mx-auto leading-relaxed">
              {isAr
                ? 'فريق E-MEP جاهز لمراجعة مخططاتك وتقديم الدراسة الهندسية الأولية لأنظمة MEP و BIM.'
                : 'The E-MEP team is ready to review your drawings and provide initial engineering studies for MEP & BIM systems.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#FF1E27] hover:bg-[#D31019]
                           text-white font-bold text-sm rounded-xl shadow-lg shadow-[#FF1E27]/20
                           hover:shadow-[#FF1E27]/30 transition-all duration-200 hover:-translate-y-0.5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {isAr ? 'اطلب الاستشارة' : 'Request Consultation'}
              </Link>
              <a
                href="https://wa.me/201030834372"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/[0.05] hover:bg-white/[0.09]
                           border border-white/[0.1] hover:border-white/20 text-white font-bold text-sm rounded-xl
                           transition-all duration-200 hover:-translate-y-0.5"
              >
                <svg className="w-4 h-4 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M11.999 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.948-1.42A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
                </svg>
                {isAr ? 'واتساب' : 'WhatsApp'}
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
