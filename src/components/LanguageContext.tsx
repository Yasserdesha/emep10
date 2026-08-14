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
  // Always default to 'en' (English) on every page refresh / visit as requested
  const [language, setLanguageState] = useState<Language>('en');
  const [isMounted, setIsMounted] = useState(false);

  const updateHtmlAttributes = useCallback((lang: Language) => {
    if (typeof document !== 'undefined') {
      const dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
      document.documentElement.dir = dir;
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    // On fresh load / refresh, always initiate in English
    setLanguageState('en');
    updateHtmlAttributes('en');
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

  const contextValue: LanguageContextType = {
    language: isMounted ? language : 'en',
    setLanguage,
    t: isMounted ? t : (key: string) => {
      const fallbackDict = translations['en'];
      return (fallbackDict && fallbackDict[key]) ? fallbackDict[key] : key;
    },
    dir: isMounted ? dir : 'ltr',
    isMounted,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
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
