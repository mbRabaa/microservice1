
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { translations, LocaleType } from '../utils/translations';

type LanguageContextType = {
  locale: LocaleType;
  setLocale: (locale: LocaleType) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<LocaleType>('fr');

  const t = (key: string): string => {
    const keys = key.split('.');
    let translation: any = translations[locale];
    
    for (const k of keys) {
      if (!translation[k]) {
        console.warn(`Translation key "${key}" not found for locale "${locale}"`);
        return key;
      }
      translation = translation[k];
    }
    
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
