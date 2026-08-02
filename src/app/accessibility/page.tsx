"use client";

import React from 'react';
import { useLanguage } from '@/components/LanguageContext';
import Link from 'next/link';

export default function AccessibilityPage() {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#F8FAFC] font-sans antialiased py-16 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Navigation back */}
        <div>
          <Link 
            href="/" 
            className="text-sm font-semibold text-[#94A3B8] hover:text-[#FF1E27] flex items-center gap-2"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>{isAr ? 'العودة للصفحة الرئيسية' : 'Back to Homepage'}</span>
          </Link>
        </div>

        {/* Accessibility Statement Card */}
        <div className="glass-panel p-8 md:p-10 rounded-2xl border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#D31019] to-[#FF1E27]"></div>

          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
              <i className="fa-solid fa-universal-access text-[#FF1E27]"></i>
              <span>
                {isAr ? 'إعلان إمكانية الوصول' : 'Accessibility Statement'}
              </span>
            </h1>
            <p className="text-xs text-[#94A3B8] mt-2">
              {isAr ? 'آخر تحديث: 31 يوليو 2026' : 'Last updated: July 31, 2026'}
            </p>
          </div>

          <div className="space-y-6 text-sm text-[#94A3B8] leading-relaxed">
            
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">
                {isAr ? 'التزامنا الكلي بالوصول الشامل' : 'Our Commitment'}
              </h2>
              <p>
                {isAr 
                  ? 'تلتزم شركة E-MEP للأنظمة الكهروميكانيكية بتوفير تجربة رقمية سهلة الاستخدام ومتاحة لجميع الزوار، بغض النظر عن قدراتهم البدنية أو التقنية. نسعى جاهدين لتصميم وتطوير موقعنا بما يتوافق مع معايير إمكانية الوصول للويب (WCAG 2.1 AA) لضمان تجربة تصفح عادلة للجميع.'
                  : 'E-MEP Electromechanical Works is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone, and applying the relevant accessibility standards (WCAG 2.1 Level AA) across all pages.'}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">
                {isAr ? 'أهم الميزات التي قمنا بتنفيذها' : 'Accessibility Features'}
              </h2>
              <ul className="list-disc pl-5 rtl:pr-5 rtl:pl-0 space-y-2">
                <li>
                  <strong>{isAr ? 'التصفح الكامل بلوحة المفاتيح:' : 'Keyboard Navigation:'}</strong>{' '}
                  {isAr 
                    ? 'يمكن تصفح جميع الأزرار، الروابط، القوائم المنسدلة، والنماذج بشكل كامل باستخدام مفتاحي Tab و Shift+Tab، وتفعيلها بضغطة زر Enter أو المسافة (Space).'
                    : 'All buttons, interactive links, dropdown menus, and contact forms are fully navigable using standard Tab and Shift+Tab, and can be activated using Enter or Spacebar keys.'}
                </li>
                <li>
                  <strong>{isAr ? 'مؤشرات التركيز البصري:' : 'Visible Focus Indicators:'}</strong>{' '}
                  {isAr
                    ? 'تظهر حلقات تركيز بصرية واضحة ومتباينة الألوان حول أي عنصر يتم الوقوف عليه عبر لوحة المفاتيح لتسهيل التصفح البصري.'
                    : 'High contrast outlines appear around focused components to guide keyboard users visually.'}
                </li>
                <li>
                  <strong>{isAr ? 'النصوص البديلة للصور:' : 'Alt Text for Images:'}</strong>{' '}
                  {isAr
                    ? 'تحتوي جميع الصور الهامة والرسومات التوضيحية على نصوص بديلة (Alt Text) دقيقة باللغتين تصف محتواها لمساعدة قوارئ الشاشة.'
                    : 'All descriptive images and branding graphics contain meaningful Alt text in both languages to support screen-reader engines.'}
                </li>
                <li>
                  <strong>{isAr ? 'دعم اتجاه RTL الصحيح:' : 'Proper RTL Direction Support:'}</strong>{' '}
                  {isAr
                    ? 'يتم تبديل اتجاهات التصفح بالكامل (Right-to-Left) ولغة المستند ديناميكياً لتناسب قوارئ الشاشة العربية بشكل صحيح، وليس مجرد ترجمة نصوص.'
                    : 'The page layout flips completely (RTL) and updates HTML document lang attributes dynamically to support Arabic voice synthesizers correctly.'}
                </li>
                <li>
                  <strong>{isAr ? 'بنية هيكلية دقيقة:' : 'Semantic HTML Hierarchy:'}</strong>{' '}
                  {isAr
                    ? 'تأسس الموقع بالاعتماد على وسوم HTML5 الدلالية وبنية عناوين هرمية دقيقة (H1, H2, H3) لتسهيل التنقل والتصفح السريع.'
                    : 'The application uses semantic HTML5 tags and structured heading tags (H1, H2, H3) to map layout sections logically.'}
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">
                {isAr ? 'تأكيد التوافقية' : 'Compatibility Status'}
              </h2>
              <p>
                {isAr 
                  ? 'تم تصميم موقعنا ليعمل بشكل متوافق تماماً مع متصفحات الويب الحديثة (Chrome, Edge, Safari, Firefox) وقوارئ الشاشة القياسية على الهواتف والأجهزة المكتبية.'
                  : 'Our codebase is designed to be fully compatible with major modern browsers (Chrome, Edge, Safari, Firefox) and standard assistive screen-readers on both mobile and desktop platforms.'}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">
                {isAr ? 'ملاحظات وتواصل' : 'Feedback & Contact'}
              </h2>
              <p>
                {isAr 
                  ? 'نرحب دائماً بملاحظاتكم حول إمكانية الوصول. إذا واجهت أي صعوبة في تصفح الموقع أو استخدام أي من ميزاته، يرجى الاتصال بنا عبر البريد الإلكتروني Info@emep-egy.com وسنعمل على حل المشكلة فوراً.'
                  : 'We welcome your feedback on the accessibility of E-MEP Electromechanical Works. If you encounter accessibility barriers or have suggestions for improvement, please let us know at Info@emep-egy.com. We make every effort to respond within 24 hours.'}
              </p>
            </section>
            
          </div>
        </div>

      </div>
    </div>
  );
}
