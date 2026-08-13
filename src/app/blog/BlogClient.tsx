"use client";

import React from 'react';
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

export default function BlogClient({ articles }: BlogClientProps) {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const featuredArticle = articles[0];
  const regularArticles = articles.slice(1);

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white" dir={isAr ? 'rtl' : 'ltr'}>
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {/* Ambient Glow Hero Banner */}
        <section className="relative rounded-3xl bg-gradient-to-b from-[#131317] to-[#0A0A0C] border border-white/10 p-8 md:p-14 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FF1E27]/10 blur-[120px] pointer-events-none rounded-full"></div>
          
          <div className="relative z-10 max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FF1E27]/15 border border-[#FF1E27]/30 rounded-full text-[#FF1E27] text-xs font-bold tracking-wide">
              <i className="fa-solid fa-book-bookmark"></i>
              <span>{isAr ? 'مركز الأبحاث والمدونة الهندسية' : 'Engineering Blog & Research Hub'}</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
              {isAr ? (
                <>أحدث المقالات والدراسات الهندسية في <span className="text-[#FF1E27]">MEP & BIM</span></>
              ) : (
                <>Latest Engineering Insights & Articles in <span className="text-[#FF1E27]">MEP & BIM</span></>
              )}
            </h1>
            
            <p className="text-sm md:text-base text-gray-300 leading-relaxed">
              {isAr
                ? 'دليلك الهندسي المتكامل لاشتراطات الكود المصري للحماية المدنية، وتصميم شبكات التكييف والكهرباء والإنذار، مع أحدث تطبيقات نمذجة معلومات البناء Revit.'
                : 'Your integrated engineering guide for Egyptian Fire Protection Code, HVAC, Electrical, Fire Alarm design, and Revit BIM applications.'}
            </p>
          </div>
        </section>

        {/* Featured Article Spotlight */}
        {featuredArticle && (
          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#FF1E27] flex items-center gap-2">
              <i className="fa-solid fa-fire"></i>
              <span>{isAr ? 'المقال البارز هذا الأسبوع' : 'Featured Article This Week'}</span>
            </h2>

            <div className="bg-[#131317] border border-white/10 rounded-3xl overflow-hidden shadow-2xl hover:border-white/20 transition group grid grid-cols-1 lg:grid-cols-12 gap-0">
              <div className="lg:col-span-7 relative min-h-[300px] lg:min-h-[420px] overflow-hidden bg-white/5">
                <SafeImage
                  src={featuredArticle.image}
                  alt={isAr ? featuredArticle.titleAr : (featuredArticle.titleEn || featuredArticle.titleAr)}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#131317] via-transparent to-transparent lg:hidden"></div>
              </div>

              <div className="lg:col-span-5 p-8 md:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="px-2.5 py-1 bg-[#FF1E27]/20 text-[#FF1E27] rounded-full font-bold">
                      {isAr ? 'مميز' : 'Featured'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <i className="fa-solid fa-clock"></i>
                      {featuredArticle.readTimeMin} {isAr ? 'دقائق قراءة' : 'min read'}
                    </span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-extrabold text-[#F8FAFC] group-hover:text-[#FF1E27] transition leading-snug">
                    <Link href={`/blog/${featuredArticle.slug}`}>
                      {isAr ? featuredArticle.titleAr : (featuredArticle.titleEn || featuredArticle.titleAr)}
                    </Link>
                  </h3>

                  <p className="text-xs md:text-sm text-gray-300 leading-relaxed line-clamp-4">
                    {isAr ? featuredArticle.summaryAr : (featuredArticle.summaryEn || featuredArticle.summaryAr)}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-semibold">{featuredArticle.author}</span>
                  <Link
                    href={`/blog/${featuredArticle.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF1E27] hover:bg-[#D31019] text-white text-xs font-bold rounded-xl shadow-lg transition"
                  >
                    <span>{isAr ? 'قراءة المقال بالكامل' : 'Read Full Article'}</span>
                    <i className={`fa-solid ${isAr ? 'fa-arrow-left' : 'fa-arrow-right'}`}></i>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Regular Articles Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <i className="fa-solid fa-layer-group text-[#FF1E27]"></i>
              <span>{isAr ? 'جميع المقالات والدراسات الهندسية' : 'All Engineering Articles & Studies'}</span>
            </h2>
            <span className="text-xs text-gray-400 font-semibold">
              {articles.length} {isAr ? 'مقال متاح' : 'articles available'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(regularArticles.length > 0 ? regularArticles : articles).map((art) => (
              <article key={art.id} className="bg-[#131317] border border-white/10 rounded-2xl overflow-hidden shadow-xl hover:border-white/25 hover:-translate-y-1 transition duration-300 flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="relative aspect-video w-full overflow-hidden bg-white/5">
                    <SafeImage
                      src={art.image}
                      alt={isAr ? art.titleAr : (art.titleEn || art.titleAr)}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-3 text-[11px] text-gray-400">
                      <span className="text-[#FF1E27] font-semibold">{art.author}</span>
                      <span>•</span>
                      <span>{art.readTimeMin} {isAr ? 'دقائق' : 'min'}</span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-[#FF1E27] transition leading-snug line-clamp-2">
                      <Link href={`/blog/${art.slug}`}>
                        {isAr ? art.titleAr : (art.titleEn || art.titleAr)}
                      </Link>
                    </h3>

                    <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                      {isAr ? art.summaryAr : (art.summaryEn || art.summaryAr)}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href={`/blog/${art.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#FF1E27] hover:text-white transition"
                  >
                    <span>{isAr ? 'قراءة التفاصيل' : 'Read Details'}</span>
                    <i className={`fa-solid ${isAr ? 'fa-arrow-left' : 'fa-arrow-right'} text-[10px]`}></i>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Technical Consultation CTA Card */}
        <section className="bg-gradient-to-r from-[#131317] via-[#1A1A24] to-[#131317] border border-[#FF1E27]/30 rounded-3xl p-8 md:p-12 text-center space-y-5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#FF1E27]/10 blur-3xl pointer-events-none rounded-full"></div>
          
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            {isAr ? 'هل تحتاج إلى استشارة هندسية لمشروعك القادم؟' : 'Need Engineering Consultation for Your Next Project?'}
          </h2>
          <p className="text-xs md:text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {isAr
              ? 'فريق المهندسين في E-MEP جاهز لمراجعة المخططات الكهروميكانيكية وتوفير الدراسة المبدئية وحسابات الحماية المدنية وBIM.'
              : 'E-MEP engineering team is ready to review electromechanical drawings and provide initial BIM & code compliance studies.'}
          </p>
          <div className="pt-2">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF1E27] hover:bg-[#D31019] text-white font-bold text-xs rounded-2xl shadow-xl hover:shadow-red-600/30 transition transform hover:-translate-y-0.5"
            >
              <i className="fa-solid fa-paper-plane"></i>
              <span>{isAr ? 'اطلب استشارة هندسية الآن' : 'Request Consultation Now'}</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
