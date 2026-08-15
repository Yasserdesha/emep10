"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
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
}

interface ArticleClientProps {
  article: ArticleItem;
  relatedArticles: ArticleItem[];
}

export default function ArticleClient({ article, relatedArticles }: ArticleClientProps) {
  const { language, isMounted } = useLanguage();
  const isAr = isMounted && language === 'ar';

  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        setScrollProgress((totalScroll / windowHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const title = isAr ? article.titleAr : (article.titleEn || article.titleAr);
  const summary = isAr ? article.summaryAr : (article.summaryEn || article.summaryAr);
  const content = isAr 
    ? (article.contentAr || article.summaryAr) 
    : (article.contentEn || article.contentAr || article.summaryEn || article.summaryAr);

  const shareText = encodeURIComponent(`${title} - E-MEP Electromechanical Works`);
  const articleUrl = typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : encodeURIComponent(`https://emep.vercel.app/blog/${article.slug}`);

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white selection:bg-[#FF1E27] selection:text-white" dir={isMounted ? (isAr ? 'rtl' : 'ltr') : 'ltr'}>
      {/* Reading Progress Indicator */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-[#FF1E27] via-[#D31019] to-[#FF4040] z-[1100] transition-all duration-100 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-20 space-y-12">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#94A3B8] hover:text-[#FF1E27] transition-colors group"
          >
            <svg className={`w-4 h-4 group-hover:-translate-x-1 transition-transform ${isAr ? 'rotate-180 group-hover:translate-x-1 group-hover:-translate-x-0' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>{isAr ? 'العودة لمدونة E-MEP الهندسية' : 'Back to E-MEP Engineering Hub'}</span>
          </Link>

          <span className="text-[11px] text-[#475569] font-mono">
            Article #{String(article.id).padStart(3, '0')}
          </span>
        </nav>

        {/* Header Header */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF1E27]/10 border border-[#FF1E27]/25 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF1E27] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-wider text-[#FF1E27]">
              {isAr ? 'دراسة هندسية متخصصة' : 'Specialized Engineering Article'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-[1.2] tracking-tight">
            {title}
          </h1>

          {/* Author & Meta Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-b border-white/[0.06] py-4 text-xs text-[#94A3B8]">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FF1E27] to-[#8B0000] flex items-center justify-center font-black text-white text-xs shadow-md">
                  E
                </div>
                <div>
                  <div className="font-bold text-white leading-none">{article.author || 'E-MEP Engineering Team'}</div>
                  <div className="text-[10px] text-[#64748B] mt-0.5">{isAr ? 'استشارات كهروميكانيكية' : 'MEP & BIM Consultants'}</div>
                </div>
              </div>

              <span className="text-white/20">•</span>

              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-[#FF1E27]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                <span>{article.readTimeMin} {isAr ? 'دقائق قراءة' : 'min read'}</span>
              </div>
            </div>

            {/* Share links */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#64748B] font-medium">{isAr ? 'مشاركة:' : 'Share:'}</span>
              
              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${shareText}%20${articleUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/80 hover:text-[#25D366] hover:bg-[#25D366]/10 hover:border-[#25D366]/30 flex items-center justify-center transition-all"
                aria-label="Share on WhatsApp"
              >
                <i className="fa-brands fa-whatsapp text-sm"></i>
              </a>

              {/* LinkedIn */}
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${articleUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/80 hover:text-[#0A66C2] hover:bg-[#0A66C2]/10 hover:border-[#0A66C2]/30 flex items-center justify-center transition-all"
                aria-label="Share on LinkedIn"
              >
                <i className="fa-brands fa-linkedin-in text-xs"></i>
              </a>

              {/* Copy Link */}
              <button
                type="button"
                onClick={handleCopyLink}
                className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/80 hover:text-white hover:bg-white/[0.1] flex items-center justify-center transition-all cursor-pointer"
                aria-label="Copy article link"
                title={copied ? 'Copied!' : 'Copy link'}
              >
                {copied ? (
                  <svg className="w-3.5 h-3.5 text-[#25D366]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden border border-white/[0.08] bg-[#0D0D0F] shadow-2xl">
          <SafeImage
            src={article.image}
            alt={title}
            className="w-full h-full object-cover"
            priority
          />
        </div>

        {/* Executive Summary Box */}
        {summary && (
          <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#16161D] via-[#111116] to-[#16161D] border border-white/[0.08] border-s-4 border-s-[#FF1E27] space-y-2 shadow-xl">
            <div className="flex items-center gap-2 text-xs font-bold text-[#FF1E27] uppercase tracking-wider">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{isAr ? 'الملخص الهندسي التنفيذي' : 'Executive Engineering Summary'}</span>
            </div>
            <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-medium">
              "{summary}"
            </p>
          </div>
        )}

        {/* Article Body Content */}
        <div className="space-y-6 text-sm sm:text-base text-[#CBD5E1] leading-relaxed">
          {content.split('\n\n').map((paragraph, index) => (
            <div 
              key={index} 
              className="bg-[#111116]/80 border border-white/[0.05] p-6 rounded-2xl whitespace-pre-line hover:border-white/[0.1] transition-colors leading-loose"
            >
              {paragraph}
            </div>
          ))}
        </div>

        {/* Technical Support Banner */}
        <section className="relative rounded-3xl overflow-hidden border border-[#FF1E27]/30 bg-gradient-to-br from-[#1A1114] via-[#111116] to-[#13131A] p-8 sm:p-10 text-center space-y-4 shadow-2xl">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#FF1E27]/80 to-transparent" />
          
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF1E27]/10 border border-[#FF1E27]/25 rounded-full text-xs font-bold text-[#FF1E27]">
            <i className="fa-solid fa-headset text-xs"></i>
            <span>{isAr ? 'استشارة فنية متخصصة' : 'Specialized Engineering Consultation'}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white">
            {isAr ? 'هل تريد استشارة متخصصة حول موضوع هذا المقال لمشروعك؟' : 'Need Specialized Advice on This Topic for Your Project?'}
          </h3>
          <p className="text-xs sm:text-sm text-[#94A3B8] max-w-xl mx-auto leading-relaxed">
            {isAr
              ? 'تواصل مباشرة مع مهندسي E-MEP لمراجعة اشتراطات مشروعك والحصول على الاستشارة الفنية المعتمدة.'
              : 'Contact E-MEP engineers directly to review your project requirements and receive expert engineering advice.'}
          </p>
          <div className="pt-3 flex flex-wrap gap-3.5 justify-center">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full px-6 py-5 font-bold text-xs bg-gradient-to-b from-[#25D366] to-[#128C7E] text-white border-0 hover:from-[#2fe472] hover:to-[#17a594] shadow-xl shadow-[#25D366]/30 hover:shadow-[#25D366]/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
            >
              <a
                href="https://wa.me/201030834372"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-brands fa-whatsapp text-sm mr-2 rtl:ml-2"></i>
                <span>{isAr ? 'استشارة واتساب فورية' : 'Instant WhatsApp Consultation'}</span>
              </a>
            </Button>

            <Button
              asChild
              variant="default"
              size="lg"
              className="rounded-full px-6 py-5 font-bold text-xs shadow-xl shadow-[#FF1E27]/30 hover:shadow-[#FF1E27]/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
            >
              <Link href="/#contact">
                <i className="fa-solid fa-envelope text-xs mr-2 rtl:ml-2"></i>
                <span>{isAr ? 'طلب عرض أسعار' : 'Request a Proposal'}</span>
              </Link>
            </Button>
          </div>
        </section>

        {/* Related Articles Grid */}
        {relatedArticles.length > 0 && (
          <section className="space-y-6 pt-10 border-t border-white/[0.08]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-[#FF1E27] rounded-full" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-white">
                  {isAr ? 'مقالات هندسية ذات صلة' : 'Related Engineering Articles'}
                </h3>
              </div>
              <Link href="/blog" className="text-xs font-bold text-[#FF1E27] hover:underline">
                {isAr ? 'عرض الكل' : 'View All'}
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/blog/${rel.slug}`}
                  className="group bg-[#111116] border border-white/[0.06] hover:border-[#FF1E27]/40 rounded-2xl p-4 transition-all duration-300 flex gap-4 items-center hover:-translate-y-0.5"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#0D0D0F] flex-shrink-0 relative">
                    <SafeImage
                      src={rel.image}
                      alt={isAr ? rel.titleAr : (rel.titleEn || rel.titleAr)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="text-[10px] text-[#FF1E27] font-semibold flex items-center gap-1">
                      <i className="fa-solid fa-clock text-[9px]"></i>
                      <span>{rel.readTimeMin} {isAr ? 'دقائق' : 'min'}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white group-hover:text-[#FF1E27] transition-colors truncate">
                      {isAr ? rel.titleAr : (rel.titleEn || rel.titleAr)}
                    </h4>
                    <p className="text-[11px] text-[#64748B] line-clamp-2 leading-relaxed">
                      {isAr ? rel.summaryAr : (rel.summaryEn || rel.summaryAr)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
