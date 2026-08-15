"use client";

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from './LanguageContext';
import { Button } from '@/components/ui/button';
import StarBorder from '@/components/StarBorder';

export default function ContactForm() {
  const { t, language, isMounted } = useLanguage();
  const router = useRouter();
  const isAr = isMounted && language === 'ar';

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState('All MEP Scope');
  const [message, setMessage] = useState('');
  
  // Honeypot field for bot/spam protection
  const [honeypot, setHoneypot] = useState('');

  // Math Captcha variables (Deterministic initial state to prevent SSR/hydration mismatch)
  const [num1, setNum1] = useState(5);
  const [num2, setNum2] = useState(3);
  const [captchaAnswer, setCaptchaAnswer] = useState('');

  // Validation states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const generateCaptcha = useCallback(() => {
    setNum1(Math.floor(Math.random() * 9) + 1);
    setNum2(Math.floor(Math.random() * 9) + 1);
    setCaptchaAnswer('');
  }, []);

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (name.trim().length < 3) {
      newErrors.name = language === 'ar' 
        ? 'الاسم يجب أن يكون 3 أحرف على الأقل.' 
        : 'Name must be at least 3 characters.';
    }

    const emailRegex = /^[^s@]+@[^s@]+.[^s@]+$/;
    if (!emailRegex.test(email.trim())) {
      newErrors.email = language === 'ar'
        ? 'يرجى إدخال بريد إلكتروني صالح.'
        : 'Please enter a valid email address.';
    }

    if (message.trim().length < 10) {
      newErrors.message = language === 'ar'
        ? 'الرسالة يجب أن تكون 10 أحرف على الأقل.'
        : 'Message must be at least 10 characters.';
    }

    // Verify Captcha
    const expected = num1 + num2;
    if (parseInt(captchaAnswer, 10) !== expected) {
      newErrors.captcha = language === 'ar'
        ? 'رمز التحقق غير صحيح، يرجى المحاولة مرة أخرى.'
        : 'Verification answer is incorrect. Please try again.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (method: 'email' | 'whatsapp') => {
    // If honeypot is filled, silent reject (bot detected)
    if (honeypot) {
      console.warn("Spam detected");
      router.push('/thank-you');
      return;
    }

    // Direct Instant WhatsApp redirection without requiring captcha or validation
    if (method === 'whatsapp') {
      const clientName = name.trim() || (language === 'ar' ? 'عميل جديد' : 'New Client');
      const clientEmail = email.trim() ? `\nEmail: ${email.trim()}` : '';
      const clientMsg = message.trim() ? `\n\nMessage:\n${message.trim()}` : '';

      const waText = encodeURIComponent(
        `Hello E-MEP Engineering Team,\n\nName: ${clientName}${clientEmail}\nRequested Scope: ${service}${clientMsg}`
      );
      const waUrl = `https://wa.me/201030834372?text=${waText}`;

      window.open(waUrl, '_blank');
      return;
    }

    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const expectedAnswer = num1 + num2;
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          service,
          message,
          captchaAnswer: parseInt(captchaAnswer, 10),
          expectedAnswer,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Submission failed');
      }

      // Success: Save form values in session storage for the thank-you page to utilize
      sessionStorage.setItem('emep_inquiry', JSON.stringify({
        name,
        email,
        service,
        message,
        method,
      }));

      // Redirect to thank you page
      router.push('/thank-you');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during submission.';
      setSubmitError(
        language === 'ar'
          ? 'حدث خطأ أثناء الإرسال. يرجى المحاولة لاحقاً.'
          : errorMessage
      );
      generateCaptcha();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-panel contact-form-card p-6 md:p-8 h-full flex flex-col justify-between">
      <h3 className="text-xl md:text-2xl font-bold mb-2" id="form-heading">
        {t('form_heading')}
      </h3>
      <p className="form-sub text-sm mb-6 text-[#94A3B8]">
        {t('form_sub')}
      </p>

      <form onSubmit={(e) => e.preventDefault()} noValidate aria-labelledby="form-heading" className="flex-1 flex flex-col justify-between">
        {/* Honeypot field (hidden from users, exposed to bots) */}
        <div style={{ display: 'none' }} aria-hidden="true">
          <label htmlFor="username_field">Do not fill this out if you are human</label>
          <input
            id="username_field"
            type="text"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* Name input */}
        <div className="form-group mb-4">
          <label htmlFor="userName" className="block text-sm font-semibold mb-2">
            {t('lbl_name')} <span className="text-[#FF1E27]">*</span>
          </label>
          <input
            type="text"
            id="userName"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
            }}
            className={`w-full bg-[#1A1A22] border ${errors.name ? 'border-[#FF1E27]' : 'border-white/10'} rounded-xl p-3.5 text-base text-white focus:border-[#D31019] outline-none transition-colors min-h-[48px]`}
            placeholder={isAr ? 'مثال: محمد أحمد / شركة المقاولات' : 'e.g. John Doe / Contracting Co.'}
            required
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'userName-error' : undefined}
          />
          {errors.name && (
            <span id="userName-error" className="text-xs text-[#FF1E27] mt-1.5 block font-medium">
              {errors.name}
            </span>
          )}
        </div>

        {/* Email input */}
        <div className="form-group mb-4">
          <label htmlFor="userEmail" className="block text-sm font-semibold mb-2">
            {t('lbl_email')} <span className="text-[#FF1E27]">*</span>
          </label>
          <input
            type="email"
            id="userEmail"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
            }}
            className={`w-full bg-[#1A1A22] border ${errors.email ? 'border-[#FF1E27]' : 'border-white/10'} rounded-xl p-3.5 text-base text-white focus:border-[#D31019] outline-none transition-colors min-h-[48px]`}
            placeholder="name@company.com"
            required
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'userEmail-error' : undefined}
          />
          {errors.email && (
            <span id="userEmail-error" className="text-xs text-[#FF1E27] mt-1.5 block font-medium">
              {errors.email}
            </span>
          )}
        </div>

        {/* Service select */}
        <div className="form-group mb-4">
          <label htmlFor="serviceType" className="block text-sm font-semibold mb-2">
            {t('lbl_service')}
          </label>
          <div className="relative">
            <select
              id="serviceType"
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full bg-[#1A1A22] border border-white/10 rounded-xl p-3.5 text-base text-white focus:border-[#D31019] outline-none transition-colors appearance-none cursor-pointer min-h-[48px]"
            >
              <option value="All MEP Scope">
                {isAr ? 'كامل نطاق أعمال الكهروميكانيك MEP' : 'Full MEP Turnkey Scope'}
              </option>
              <option value="HVAC Systems">
                {isAr ? 'أنظمة الميكانيكا والتكييف HVAC' : 'Mechanical & HVAC Systems'}
              </option>
              <option value="Electrical Systems">
                {isAr ? 'الأنظمة الكهربائية والقدرة' : 'Electrical & Power Systems'}
              </option>
              <option value="Plumbing & Piping">
                {isAr ? 'شبكات السباكة والبنية التحتية' : 'Plumbing & Infrastructure'}
              </option>
              <option value="Firefighting Systems">
                {isAr ? 'أنظمة مكافحة الحريق والسلامة' : 'Firefighting & Life Safety'}
              </option>
              <option value="BIM 3D Modeling">
                {isAr ? 'نمذجة 3D واللوحات التنفيذية BIM' : 'BIM & Shop Drawings'}
              </option>
            </select>
            <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-white/50 rtl:left-3.5 rtl:right-auto">
              <i className="fa-solid fa-chevron-down text-xs"></i>
            </div>
          </div>
        </div>

        {/* Message input (expanding textarea to fill column height) */}
        <div className="form-group mb-4 flex-1 flex flex-col">
          <label htmlFor="userMessage" className="block text-sm font-semibold mb-2">
            {t('lbl_message')} <span className="text-[#FF1E27]">*</span>
          </label>
          <textarea
            id="userMessage"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (errors.message) setErrors((prev) => ({ ...prev, message: '' }));
            }}
            className={`w-full flex-1 min-h-[130px] bg-[#1A1A22] border ${errors.message ? 'border-[#FF1E27]' : 'border-white/10'} rounded-xl p-3.5 text-base text-white focus:border-[#D31019] outline-none transition-colors resize-none`}
            placeholder={isAr ? 'صف نطاق مشروعك، موقعه، ومتطلباتك...' : 'Describe your project scope, location, and requirements...'}
            required
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'userMessage-error' : undefined}
          />
          {errors.message && (
            <span id="userMessage-error" className="text-xs text-[#FF1E27] mt-1.5 block font-medium">
              {errors.message}
            </span>
          )}
        </div>

        {/* Math Captcha Protection */}
        <div className="form-group mb-6">
          <label htmlFor="captchaAnswer" className="block text-sm font-semibold mb-2" suppressHydrationWarning>
            {isAr 
              ? `التحقق الأمني: كم ناتج ${num1} + ${num2}؟` 
              : `Security Check: What is ${num1} + ${num2}?`}{' '}
            <span className="text-[#FF1E27]">*</span>
          </label>
          <input
            type="text"
            id="captchaAnswer"
            value={captchaAnswer}
            onChange={(e) => {
              setCaptchaAnswer(e.target.value);
              if (errors.captcha) setErrors((prev) => ({ ...prev, captcha: '' }));
            }}
            className={`w-full bg-[#1A1A22] border ${errors.captcha ? 'border-[#FF1E27]' : 'border-white/10'} rounded-xl p-3.5 text-base text-white focus:border-[#D31019] outline-none transition-colors min-h-[48px]`}
            placeholder={isAr ? 'أدخل الإجابة هنا' : 'Enter answer here'}
            required
            aria-invalid={!!errors.captcha}
            aria-describedby={errors.captcha ? 'captcha-error' : undefined}
          />
          {errors.captcha && (
            <span id="captcha-error" className="text-xs text-[#FF1E27] mt-1.5 block font-medium">
              {errors.captcha}
            </span>
          )}
        </div>

        {/* General Error Message */}
        {submitError && (
          <div className="mb-4 bg-[#FF1E27]/10 border border-[#FF1E27]/30 text-[#FF1E27] p-3 rounded-xl text-sm font-semibold">
            <i className="fa-solid fa-triangle-exclamation mr-2 rtl:ml-2"></i> {submitError}
          </div>
        )}

        {/* Action Row with StarBorder Buttons */}
        <div className="flex gap-3 flex-col sm:flex-row mt-6">
          <StarBorder
            as="button"
            color="#FF1E27"
            speed="4s"
            className="flex-1 py-1 text-center font-bold text-sm cursor-pointer"
            disabled={isSubmitting}
            onClick={() => handleSubmit('email')}
          >
            {isSubmitting ? (
              <i className="fa-solid fa-spinner animate-spin"></i>
            ) : (
              <i className="fa-solid fa-paper-plane"></i>
            )}
            <span>{t('btn_send_email')}</span>
          </StarBorder>
          
          <StarBorder
            as="button"
            color="#25D366"
            speed="4s"
            className="flex-1 py-1 text-center font-bold text-sm cursor-pointer"
            disabled={isSubmitting}
            onClick={() => handleSubmit('whatsapp')}
          >
            {isSubmitting ? (
              <i className="fa-solid fa-spinner animate-spin"></i>
            ) : (
              <i className="fa-brands fa-whatsapp text-base text-[#25D366]"></i>
            )}
            <span>{t('btn_send_wa')}</span>
          </StarBorder>
        </div>
      </form>
    </div>
  );
}
