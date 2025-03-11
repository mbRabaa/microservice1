
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

interface HeroTitleProps {
  loaded: boolean;
}

const HeroTitle: React.FC<HeroTitleProps> = ({ loaded }) => {
  const { t } = useLanguage();

  return (
    <div className={cn(
      "max-w-3xl mx-auto space-y-6 text-center mb-10",
      loaded ? "animate-fade-in" : "opacity-0"
    )}>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
        {t('home.hero.title')}
      </h1>
      <p className="text-xl text-slate-600 dark:text-slate-300">
        {t('home.hero.subtitle')}
      </p>
    </div>
  );
};

export default HeroTitle;
