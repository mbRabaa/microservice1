
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Bus } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="py-8 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Bus className="h-6 w-6 text-tunisbus" />
            <span className="font-bold text-lg">
              {t('common.appName')}
            </span>
          </div>
          
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 md:mt-0">
            &copy; {new Date().getFullYear()} TunisBus. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
