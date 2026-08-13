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
  const [language, setLanguageState] = useState<Language>('ar');
  const [isMounted, setIsMounted] = useState(false);

  const updateHtmlAttributes = useCallback((lang: Language) => {
    if (typeof document !== 'undefined') {
      const dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
      document.documentElement.dir = dir;
    }
  }, []);

  // Synchronize language state from localStorage or default to Arabic ('ar')
  useEffect(() => {
    setIsMounted(true);
    let savedLang: Language = 'ar';
    try {
      const stored = localStorage.getItem('emep_lang') as Language | null;
      if (stored === 'ar' || stored === 'en') {
        savedLang = stored;
      }
    } catch {
      // Ignore
    }

    setLanguageState(savedLang);
    updateHtmlAttributes(savedLang);
  }, [updateHtmlAttributes]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('emep_lang', lang);
    } catch {
      // Ignore
    }
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
