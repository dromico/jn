'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { enTranslations } from '../translations/en';
import { msTranslations } from '../translations/ms';

type TranslationsType = typeof enTranslations;

interface LanguageContextType {
  language: 'en' | 'ms';
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  en: enTranslations,
  ms: msTranslations,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<'en' | 'ms'>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'en' | 'ms';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ms' : 'en';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  // Translation function to get text by key
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (!value || !value[k]) return key; // Return key if translation not found
      value = value[k];
    }
    
    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
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