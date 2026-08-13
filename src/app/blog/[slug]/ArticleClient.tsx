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
  author: string;
  readTimeMin: number;
  createdAt?: string;
}

interface ArticleClientProps {
  article: ArticleItem;
  relatedArticles: ArticleItem[];
}

export default function ArticleClient({ article, relatedArticles }: ArticleClientProps) {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const title = isAr ? article.titleAr : (article.titleEn || article.titleAr);
  const summary = isAr ? article.summaryAr : (article.summaryEn || article.summaryAr);
  const content = isAr ? (article.contentAr || article.summaryAr) : (article.contentEn || article.contentAr || article.summaryEn || article.summaryAr);

  const shareText = encodeURIComponent(`${title} - E-MEP`);
  const articleUrl = encodeURIComponent(`https://emep.vercel.app/blog/${article.slug}`);

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white" dir={isAr ? 'rtl' : 'ltr'}>
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-12 space-y-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-[#FF1E27] transition"
          >
            <i className={`fa-solid ${isAr ? 'fa-arrow-right' : 'fa-arrow-left'}`}></i>
            <span>{isAr ? 'العودة لمدونة E-MEP الهندسية' : 'Back to E-MEP Engineering Blog'}</span>
          </Link>

          <span className="text-xs text-gray-500 font-mono">ID: #{article.id}</span>
        </div>

        {/* Title & Metadata Header */}
        <div className="space-y-4 border-b border-white/10 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF1E27]/15 border border-[#FF1E27]/30 rounded-full text-[#FF1E27] text-xs font-bold">
            <i className="fa-solid fa-fire"></i>
            <span>{isAr ? 'مقال هندسي متخصص' : 'Specialized Engineering Article'}</span>
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">
            {title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-gray-400 pt-2">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-white">{article.author}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <i className="fa-solid fa-clock"></i>
                {article.readTimeMin} {isAr ? 'دقائق قراءة' : 'min read'}
              </span>
            </div>

            {/* Share links */}
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-[11px]">{isAr ? 'مشاركة المقال:' : 'Share Article:'}</span>
              <a
                href={`https://api.whatsapp.com/send?text=${shareText}%20${articleUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 flex items-center justify-center transition"
                aria-label="Share on WhatsApp"
              >
                <i className="fa-brands fa-whatsapp text-xs"></i>
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${articleUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 flex items-center justify-center transition"
                aria-label="Share on LinkedIn"
              >
                <i className="fa-brands fa-linkedin-in text-xs"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative aspect-video w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-white/5">
          <SafeImage
            src={article.image}
            alt={title}
            className="w-full h-full object-cover"
            priority
          />
        </div>

        {/* Summary Callout Box */}
        {summary && (
          <div className="bg-[#131317] border-l-4 border-[#FF1E27] p-6 rounded-2xl space-y-2">
            <h3 className="text-xs font-bold text-[#FF1E27] uppercase tracking-wider">
              {isAr ? 'الملخص الهندسي' : 'Engineering Summary'}
            </h3>
            <p className="text-sm md:text-base text-gray-200 leading-relaxed italic">
              "{summary}"
            </p>
          </div>
        )}

        {/* Article Body Content */}
        <div className="prose prose-invert max-w-none space-y-6 text-sm md:text-base text-gray-300 leading-loose">
          {content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="bg-[#131317]/50 border border-white/5 p-5 rounded-2xl whitespace-pre-line">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Technical Support Banner */}
        <div className="bg-gradient-to-r from-[#131317] to-[#1A1A24] border border-[#FF1E27]/30 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
          <h3 className="text-xl font-bold text-white">
            {isAr ? 'هل تريد استشارة متخصصة حول موضوع هذا المقال؟' : 'Need Specialized Advice on This Topic?'}
          </h3>
          <p className="text-xs md:text-sm text-gray-300 max-w-xl mx-auto">
            {isAr
              ? 'تواصل مباشرة مع مهندسي E-MEP لمراجعة اشتراطات مشروعك والحصول على الاستشارة الفنية المعتمدة.'
              : 'Contact E-MEP engineers directly to review your project requirements and receive expert engineering advice.'}
          </p>
          <div className="pt-2">
            <a
              href="https://wa.me/201019973019"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg transition"
            >
              <i className="fa-brands fa-whatsapp text-sm"></i>
              <span>{isAr ? 'تواصل عبر الواتساب الفوري' : 'Instant WhatsApp Consultation'}</span>
            </a>
          </div>
        </div>

        {/* Related Articles Grid */}
        {relatedArticles.length > 0 && (
          <div className="space-y-6 pt-8 border-t border-white/10">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <i className="fa-solid fa-layer-group text-[#FF1E27]"></i>
              <span>{isAr ? 'مقالات هندسية ذات صلة' : 'Related Engineering Articles'}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/blog/${rel.slug}`}
                  className="bg-[#131317] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition group flex gap-4 items-center"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                    <SafeImage
                      src={rel.image}
                      alt={isAr ? rel.titleAr : (rel.titleEn || rel.titleAr)}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-white group-hover:text-[#FF1E27] transition truncate">
                      {isAr ? rel.titleAr : (rel.titleEn || rel.titleAr)}
                    </h4>
                    <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                      {isAr ? rel.summaryAr : (rel.summaryEn || rel.summaryAr)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
