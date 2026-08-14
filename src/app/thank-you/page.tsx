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
  const { language, isMounted } = useLanguage();
  const router = useRouter();
  const isAr = isMounted && language === 'ar';

  const [inquiry, setInquiry] = useState<InquiryData | null>(null);
  const [redirectCount, setRedirectCount] = useState(5);

  // Safely read sessionStorage only after mount on client
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('emep_inquiry');
      if (saved) {
        setInquiry(JSON.parse(saved));
      }
    } catch {
      // Ignore
    }
  }, []);

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

  // Countdown timer
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
    <div className="min-h-screen bg-[#0A0A0C] text-[#F8FAFC] flex items-center justify-center p-4 selection:bg-[#FF1E27] selection:text-white" dir={isMounted ? (isAr ? 'rtl' : 'ltr') : 'ltr'}>
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#25D366]/10 blur-[130px] rounded-full" />
      </div>

      <div className="max-w-md w-full p-8 sm:p-10 rounded-3xl bg-[#111116]/90 border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden text-center z-10 backdrop-blur-xl space-y-6">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#25D366] to-[#10B981]" />

        {/* Success icon */}
        <div className="w-16 h-16 bg-[#25D366]/10 border border-[#25D366]/30 rounded-2xl flex items-center justify-center mx-auto text-2xl text-[#25D366] shadow-[0_0_30px_rgba(37,211,102,0.3)]">
          <i className="fa-solid fa-circle-check"></i>
        </div>

        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-black text-white">
            {isAr ? 'تم التحقق من بياناتك بنجاح!' : 'Inquiry Received Successfully!'}
          </h1>

          <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
            {inquiry ? (
              inquiry.method === 'email' ? (
                isAr 
                  ? 'جاري توجيهك إلى تطبيق البريد الإلكتروني لإرسال رسالتك. إذا لم يتم التوجيه تلقائياً، انقر أدناه:'
                  : 'Redirecting to your email client to send your inquiry. If it does not open automatically, click below:'
              ) : (
                isAr
                  ? 'جاري فتح تطبيق الواتساب لإرسال رسالتك وتأكيد طلبك. إذا لم يتم الفتح تلقائياً، انقر أدناه:'
                  : 'Opening WhatsApp to complete your message. If it does not open automatically, click below:'
              )
            ) : (
              isAr 
                ? 'شكراً لتواصلك مع شركة E-MEP للأنظمة الكهروميكانيكية! لقد تم استلام استفسارك وسيتواصل معك فريقنا الهندسي في أقرب وقت.'
                : 'Thank you for reaching out to E-MEP Electromechanical Works! Our engineering team will review your inquiry and reach out shortly.'
            )}
          </p>
        </div>

        {inquiry && (
          <button
            onClick={handleManualAction}
            className={`w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 text-white shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer ${
              inquiry.method === 'whatsapp' 
                ? 'bg-[#25D366] hover:bg-[#20ba5a] shadow-[#25D366]/25' 
                : 'bg-gradient-to-r from-[#FF1E27] to-[#D31019] shadow-[#FF1E27]/25'
            }`}
          >
            {inquiry.method === 'whatsapp' ? (
              <i className="fa-brands fa-whatsapp text-sm"></i>
            ) : (
              <i className="fa-solid fa-envelope text-xs"></i>
            )}
            <span>
              {inquiry.method === 'whatsapp' 
                ? (isAr ? 'إرسال عبر الواتساب الآن' : 'Send via WhatsApp Now')
                : (isAr ? 'إرسال عبر الإيميل الآن' : 'Send via Email Now')}
            </span>
          </button>
        )}

        <div className="pt-4 border-t border-white/[0.06] space-y-2">
          <p className="text-[11px] text-[#64748B] font-mono">
            {isAr 
              ? `سيتم إرجاعك تلقائياً للرئيسية خلال ${redirectCount} ثوانٍ...`
              : `Returning to homepage in ${redirectCount}s...`}
          </p>
          <Link 
            href="/" 
            className="text-xs font-bold text-[#94A3B8] hover:text-[#FF1E27] inline-flex items-center gap-1.5 transition-colors"
          >
            <i className="fa-solid fa-arrow-left rtl:rotate-180 text-[10px]"></i>
            <span>{isAr ? 'الرجوع للرئيسية فوراً' : 'Return to Home immediately'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
