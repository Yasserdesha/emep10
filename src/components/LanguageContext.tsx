"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations } from '@/data/translations';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
  isMounted: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [isMounted, setIsMounted] = useState(false);

  const updateHtmlAttributes = useCallback((lang: Language) => {
    if (typeof document !== 'undefined') {
      const dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
      document.documentElement.dir = dir;
    }
  }, []);

  // Always default to English ('en') on first open and page refresh
  useEffect(() => {
    setIsMounted(true);
    setLanguageState('en');
    updateHtmlAttributes('en');
    try {
      localStorage.removeItem('emep_lang');
      sessionStorage.removeItem('emep_session_lang');
    } catch {
      // Ignore
    }
  }, [updateHtmlAttributes]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    updateHtmlAttributes(lang);
  };

  const t = (key: string): string => {
    const langDict = translations[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    const fallbackDict = translations['en'];
    if (fallbackDict && fallbackDict[key]) {
      return fallbackDict[key];
    }
    return key;
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir, isMounted }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
