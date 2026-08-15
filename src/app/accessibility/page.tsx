"use client";

import React from 'react';
import { useLanguage } from '@/components/LanguageContext';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AccessibilityPage() {
  const { language, isMounted } = useLanguage();
  const isAr = isMounted && language === 'ar';

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#F8FAFC] font-sans antialiased py-20 px-4 selection:bg-[#FF1E27] selection:text-white" dir={isMounted ? (isAr ? 'rtl' : 'ltr') : 'ltr'}>
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Navigation back */}
        <div>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-full px-4 py-2 border-white/10 hover:border-white/25 text-[#94A3B8] hover:text-white transition-colors"
          >
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-xs font-bold"
            >
              <svg className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span>{isAr ? 'العودة للصفحة الرئيسية' : 'Back to Homepage'}</span>
            </Link>
          </Button>
        </div>

        {/* Accessibility Statement Card */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#111116] border border-white/[0.08] relative overflow-hidden shadow-2xl space-y-8">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#D31019] via-[#FF1E27] to-[#FF4040]" />

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF1E27]/10 border border-[#FF1E27]/25 rounded-full text-xs font-bold text-[#FF1E27] mb-3">
              <i className="fa-solid fa-universal-access text-xs"></i>
              <span>{isAr ? 'معايير إمكانية الوصول' : 'WCAG 2.1 AA Compliance'}</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {isAr ? 'إعلان إمكانية الوصول الشامل' : 'Accessibility Statement'}
            </h1>
            <p className="text-xs text-[#64748B] mt-1.5 font-mono">
              {isAr ? 'آخر تحديث: أغسطس 2026' : 'Last updated: August 2026'}
            </p>
          </div>

          <div className="space-y-8 text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
            
            <section className="space-y-3 bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF1E27]" />
                <span>{isAr ? 'التزامنا الكلي بالوصول الشامل' : 'Our Commitment'}</span>
              </h2>
              <p>
                {isAr 
                  ? 'تلتزم شركة E-MEP للأنظمة الكهروميكانيكية بتوفير تجربة رقمية سهلة الاستخدام ومتاحة لجميع الزوار، بغض النظر عن قدراتهم البدنية أو التقنية. نسعى جاهدين لتصميم وتطوير موقعنا بما يتوافق مع معايير إمكانية الوصول للويب (WCAG 2.1 AA) لضمان تجربة تصفح عادلة للجميع.'
                  : 'E-MEP Electromechanical Works is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone, and applying the relevant accessibility standards (WCAG 2.1 Level AA) across all pages.'}
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF1E27]" />
                <span>{isAr ? 'أهم الميزات التي قمنا بتنفيذها' : 'Accessibility Features'}</span>
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    titleAr: 'التصفح الكامل بلوحة المفاتيح',
                    titleEn: 'Keyboard Navigation',
                    descAr: 'تصفح وتفعيل جميع الأزرار والروابط والنماذج بمفتاحي Tab و Enter.',
                    descEn: 'Navigate all links, buttons and forms with Tab and Enter.',
                    icon: 'fa-keyboard'
                  },
                  {
                    titleAr: 'مؤشرات التركيز البصري',
                    titleEn: 'Visible Focus Rings',
                    descAr: 'حلقات تركيز واضحة ومتباينة الألوان حول العناصر النشطة.',
                    descEn: 'High contrast outlines around focused interactive elements.',
                    icon: 'fa-eye'
                  },
                  {
                    titleAr: 'النصوص البديلة للصور',
                    titleEn: 'Descriptive Alt Text',
                    descAr: 'نصوص بديلة دقيقة لجميع المخططات والرسومات الهندسية.',
                    descEn: 'Accurate text descriptions for all diagrams and visuals.',
                    icon: 'fa-image'
                  },
                  {
                    titleAr: 'دعم كامل للغة العربية (RTL)',
                    titleEn: 'Dynamic RTL Support',
                    descAr: 'تبديل الاتجاه وهيكلية قراءة الشاشات الصوتية بنسبة 100%.',
                    descEn: 'Full Right-to-Left bidirectional layout for screen readers.',
                    icon: 'fa-language'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white/[0.02] border border-white/[0.05] p-4 rounded-xl space-y-1.5">
                    <div className="flex items-center gap-2 text-[#FF1E27] font-bold text-xs">
                      <i className={`fa-solid ${item.icon}`}></i>
                      <span>{isAr ? item.titleAr : item.titleEn}</span>
                    </div>
                    <p className="text-[11px] text-[#64748B] leading-normal">
                      {isAr ? item.descAr : item.descEn}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-3 bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF1E27]" />
                <span>{isAr ? 'ملاحظات وتواصل' : 'Feedback & Contact'}</span>
              </h2>
              <p>
                {isAr 
                  ? 'نرحب دائماً بملاحظاتكم حول إمكانية الوصول. إذا واجهت أي صعوبة في تصفح الموقع أو استخدام أي من ميزاته، يرجى الاتصال بنا وسنعمل على حل المشكلة فوراً.'
                  : 'We welcome your feedback on the accessibility of E-MEP. If you encounter accessibility barriers, please contact us and we will assist promptly.'}
              </p>
              <div className="pt-2">
                <a 
                  href="mailto:Info@emep-egy.com" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF1E27]/10 border border-[#FF1E27]/30 text-[#FF1E27] text-xs font-bold rounded-lg hover:bg-[#FF1E27] hover:text-white transition-all"
                >
                  <i className="fa-solid fa-envelope"></i>
                  <span>Info@emep-egy.com</span>
                </a>
              </div>
            </section>
            
          </div>
        </div>

      </div>
    </div>
  );
}
