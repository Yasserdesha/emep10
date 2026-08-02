"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageContext';
import Link from 'next/link';

interface InquiryData {
  name: string;
  email: string;
  service: string;
  message: string;
  method: 'email' | 'whatsapp';
}

export default function ThankYouPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const [inquiry] = useState<InquiryData | null>(() => {
    if (typeof window === 'undefined') return null;
    const saved = sessionStorage.getItem('emep_inquiry');
    if (saved) {
      try {
        return JSON.parse(saved) as InquiryData;
      } catch {
        return null;
      }
    }
    return null;
  });
  const [redirectCount, setRedirectCount] = useState(5);
  const isAr = language === 'ar';

  useEffect(() => {
    if (inquiry) {
      const { name, email, service, message, method } = inquiry;

      if (method === 'email') {
        const subject = encodeURIComponent(`E-MEP Engineering Inquiry: ${service} - ${name}`);
        const body = encodeURIComponent(`Client Name: ${name}\nClient Email: ${email}\nRequested Scope: ${service}\n\nProject Details:\n${message}`);
        const mailtoUrl = `mailto:Info@emep-egy.com?subject=${subject}&body=${body}`;
        
        const timer = setTimeout(() => {
          window.location.href = mailtoUrl;
        }, 2000);
        return () => clearTimeout(timer);
      } else if (method === 'whatsapp') {
        const waText = encodeURIComponent(`Hello E-MEP Engineering Team,\n\nName: ${name}\nEmail: ${email}\nService Required: ${service}\n\nMessage:\n${message}`);
        const waUrl = `https://wa.me/201030834372?text=${waText}`;
        
        const timer = setTimeout(() => {
          window.open(waUrl, '_blank');
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [inquiry]);

  // Countdown timer to return home automatically if no action taken
  useEffect(() => {
    if (redirectCount > 0) {
      const timer = setTimeout(() => setRedirectCount(redirectCount - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      router.push('/');
    }
  }, [redirectCount, router]);

  const getManualLink = (): string => {
    if (!inquiry) return '/';
    const { name, email, service, message, method } = inquiry;
    if (method === 'email') {
      const subject = encodeURIComponent(`E-MEP Engineering Inquiry: ${service} - ${name}`);
      const body = encodeURIComponent(`Client Name: ${name}\nClient Email: ${email}\nRequested Scope: ${service}\n\nProject Details:\n${message}`);
      return `mailto:Info@emep-egy.com?subject=${subject}&body=${body}`;
    } else {
      const waText = encodeURIComponent(`Hello E-MEP Engineering Team,\n\nName: ${name}\nEmail: ${email}\nService Required: ${service}\n\nMessage:\n${message}`);
      return `https://wa.me/201030834372?text=${waText}`;
    }
  };

  const handleManualAction = () => {
    const url = getManualLink();
    if (inquiry?.method === 'whatsapp') {
      window.open(url, '_blank');
    } else {
      window.location.href = url;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#F8FAFC] flex items-center justify-center p-4">
      <div className="max-w-md w-full glass-panel p-8 rounded-xl border border-white/10 shadow-2xl relative overflow-hidden text-center">
        {/* Glow accent */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#D31019] to-[#FF1E27]"></div>

        {/* Success icon */}
        <div className="w-16 h-16 bg-[#25D366]/10 border border-[#25D366]/30 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl text-[#25D366] animate-bounce">
          <i className="fa-solid fa-check-circle"></i>
        </div>

        <h1 className="text-2xl font-bold text-white mb-4">
          {isAr ? 'تم التحقق من بياناتك بنجاح!' : 'Inquiry Validated Successfully!'}
        </h1>

        {inquiry ? (
          <div className="space-y-4">
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              {inquiry.method === 'email' ? (
                isAr 
                  ? 'جاري توجيهك إلى تطبيق البريد الإلكتروني لإرسال رسالتك الرسمية. إذا لم يتم التوجيه تلقائياً، انقر على الزر أدناه:'
                  : 'You are being redirected to your email client to send your inquiry. If it does not open automatically, click the button below:'
              ) : (
                isAr
                  ? 'جاري فتح تطبيق الواتساب لإرسال رسالتك وتأكيد استفسارك. إذا لم يتم فتح التطبيق تلقائياً، انقر على الزر أدناه:'
                  : 'Opening WhatsApp to complete sending your message. If it does not open automatically, click the button below:'
              )}
            </p>

            <button
              onClick={handleManualAction}
              className={`btn ${inquiry.method === 'whatsapp' ? 'btn-whatsapp' : 'btn-primary'} w-full py-3 rounded font-bold text-sm tracking-wide flex items-center justify-center gap-2`}
            >
              {inquiry.method === 'whatsapp' ? (
                <i className="fa-brands fa-whatsapp"></i>
              ) : (
                <i className="fa-solid fa-envelope"></i>
              )}
              <span>
                {inquiry.method === 'whatsapp' 
                  ? (isAr ? 'إرسال عبر الواتساب الآن' : 'Send via WhatsApp Now')
                  : (isAr ? 'إرسال عبر الإيميل الآن' : 'Send via Email Now')}
              </span>
            </button>
          </div>
        ) : (
          <p className="text-sm text-[#94A3B8] leading-relaxed mb-6">
            {isAr 
              ? 'شكراً لتواصلك مع شركة E-MEP للأنظمة الكهروميكانيكية! لقد تم استلام استفسارك بنجاح وسيتواصل معك فريقنا الهندسي في أقرب وقت.'
              : 'Thank you for contacting E-MEP Electromechanical Works! We have received your inquiry and our engineering team will get back to you shortly.'}
          </p>
        )}

        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-2">
          <p className="text-xs text-[#64748B]">
            {isAr 
              ? `سيتم إرجاعك تلقائياً للصفحة الرئيسية خلال ${redirectCount} ثوانٍ...`
              : `Automatically returning to Homepage in ${redirectCount}s...`}
          </p>
          <Link 
            href="/" 
            className="text-xs text-[#94A3B8] hover:text-[#FF1E27] font-semibold flex items-center gap-1.5 mt-2"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>{isAr ? 'الرجوع للصفحة الرئيسية فوراً' : 'Return to Home immediately'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
