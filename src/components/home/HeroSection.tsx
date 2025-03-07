
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { tunisianProvinces } from '@/utils/data';

interface HeroSectionProps {
  loaded: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ loaded }) => {
  const { t, locale } = useLanguage();
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');

  const handleSearch = () => {
    // Simuler une recherche
    console.log('Recherche:', { departure, destination });
    // Dans une application réelle, on redirigerait vers une page de résultats
  };

  return (
    <section className="pt-32 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
        <div className="absolute top-20 right-10 w-64 h-64 bg-tunisbus/10 rounded-full filter blur-3xl animate-pulse-light"></div>
        <div className="absolute bottom-10 left-20 w-72 h-72 bg-tunisbus/5 rounded-full filter blur-3xl animate-pulse-light" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className={cn(
            "max-w-xl space-y-6 text-center md:text-left",
            loaded ? "animate-fade-in" : "opacity-0"
          )}>
            <div className="inline-block px-3 py-1 bg-tunisbus/10 rounded-full text-tunisbus text-sm font-medium mb-2">
              TunisBus - {t('common.appName')}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {t('home.hero.title')}
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              {t('home.hero.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="bg-tunisbus hover:bg-tunisbus-dark text-white hover-scale">
                {t('home.hero.cta')}
              </Button>
              <Button variant="outline" size="lg" asChild className="hover-scale">
                <Link to="/routes">
                  {t('navigation.routes')}
                </Link>
              </Button>
            </div>
          </div>
          
          <div className={cn(
            "relative w-full max-w-md glass-card rounded-2xl p-6 shadow-lg fancy-border-gradient",
            loaded ? "animate-fade-in" : "opacity-0",
            "transition-all duration-500 ease-out"
          )} style={{ animationDelay: '300ms' }}>
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-tunisbus/20 rounded-full filter blur-xl"></div>
            <h3 className="text-xl font-semibold mb-5">
              {t('home.hero.searchPlaceholder')}
            </h3>
            
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">
                  {t('admin.form.departure')}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <select 
                    className="pl-10 w-full h-11 rounded-md border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-tunisbus"
                    value={departure}
                    onChange={(e) => setDeparture(e.target.value)}
                  >
                    <option value="">{t('admin.form.selectDeparture')}</option>
                    {tunisianProvinces.map(province => (
                      <option key={`dep-${province.id}`} value={province.name}>
                        {locale === 'ar' ? province.nameAr : province.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">
                  {t('admin.form.destination')}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <select 
                    className="pl-10 w-full h-11 rounded-md border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-tunisbus"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  >
                    <option value="">{t('admin.form.selectDestination')}</option>
                    {tunisianProvinces.map(province => (
                      <option key={`dest-${province.id}`} value={province.name}>
                        {locale === 'ar' ? province.nameAr : province.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <Button 
                className="w-full h-11 mt-2 bg-tunisbus hover:bg-tunisbus-dark"
                onClick={handleSearch}
              >
                <Search className="h-4 w-4 mr-2" />
                {t('common.search')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
