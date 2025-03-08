
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { tunisianProvinces } from '@/utils/data';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

interface HeroSectionProps {
  loaded: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ loaded }) => {
  const { t, locale } = useLanguage();
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);

  const handleSearch = () => {
    // Simuler une recherche
    console.log('Recherche:', { departure, destination, date });
    // Dans une application réelle, on redirigerait vers une page de résultats
  };

  return (
    <section className="pt-32 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
        <div className="absolute top-20 right-10 w-64 h-64 bg-tunisbus/10 rounded-full filter blur-3xl animate-pulse-light"></div>
        <div className="absolute bottom-10 left-20 w-72 h-72 bg-tunisbus/5 rounded-full filter blur-3xl animate-pulse-light" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
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

        <div className={cn(
          "max-w-3xl mx-auto relative glass-card rounded-2xl p-6 shadow-lg fancy-border-gradient mb-10",
          loaded ? "animate-fade-in" : "opacity-0",
          "transition-all duration-500 ease-out"
        )} style={{ animationDelay: '300ms' }}>
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-tunisbus/20 rounded-full filter blur-xl"></div>
          <h3 className="text-xl font-semibold mb-5 text-center">
            {t('home.hero.searchPlaceholder')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                {t('admin.form.date')}
              </label>
              <div className="relative">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="pl-10 w-full h-11 justify-start text-left font-normal">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      {date ? format(date, 'PP') : <span>{t('admin.form.date')}</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          
          <Button 
            className="w-full h-11 mt-6 bg-tunisbus hover:bg-tunisbus-dark"
            onClick={handleSearch}
          >
            <Search className="h-4 w-4 mr-2" />
            {t('common.search')}
          </Button>
        </div>
          
        <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
          <Button size="lg" className="bg-tunisbus hover:bg-tunisbus-dark text-white hover-scale">
            {t('home.hero.cta')}
          </Button>
          <Button variant="outline" size="lg" asChild className="hover-scale">
            <Link to="#features">
              {t('navigation.about')}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
