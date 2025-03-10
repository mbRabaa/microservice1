
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Calendar, ArrowRight, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { tunisianProvinces, getRoutes, BusRoute } from '@/frontend/utils/data';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface HeroSectionProps {
  loaded: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ loaded }) => {
  const { t, locale } = useLanguage();
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [searchResults, setSearchResults] = useState<BusRoute[]>([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    // Validate search inputs
    if (!departure) {
      toast.error(t('admin.form.selectDeparture'));
      return;
    }
    
    if (!destination) {
      toast.error(t('admin.form.selectDestination'));
      return;
    }
    
    // Filter routes based on search criteria
    const allRoutes = getRoutes();
    const filtered = allRoutes.filter(route => 
      route.departure.toLowerCase() === departure.toLowerCase() &&
      route.destination.toLowerCase() === destination.toLowerCase() &&
      (!date || new Date(route.date).toDateString() === date.toDateString())
    );
    
    if (filtered.length === 0) {
      toast.info(t('routes.noResults'));
      setShowResults(false);
    } else {
      setSearchResults(filtered);
      setShowResults(true);
      
      // Scroll to the results
      setTimeout(() => {
        const resultsSection = document.getElementById('search-results');
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };
  
  const handleViewAllRoutes = () => {
    navigate('/routes');
  };

  return (
    <div>
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
            
          <div className="flex justify-center pt-4">
            <Button size="lg" className="bg-tunisbus hover:bg-tunisbus-dark text-white hover-scale" onClick={handleViewAllRoutes}>
              {t('home.hero.cta')}
            </Button>
          </div>
        </div>
      </section>

      {showResults && (
        <section id="search-results" className="py-16 bg-slate-50 dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-6 text-center">{t('routes.searchResults')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((route) => (
                <div key={route.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">{t('admin.form.departure')}</span>
                        <h3 className="text-lg font-semibold">{route.departure}</h3>
                        <p className="text-lg">{route.time}</p>
                      </div>
                      
                      <div className="flex items-center flex-1 justify-center px-4">
                        <div className="relative w-full">
                          <div className="border-t-2 border-dashed border-purple-300 w-full"></div>
                          <div className="absolute -right-1 top-1/2 transform -translate-y-1/2">
                            <ArrowRight className="h-5 w-5 text-tunisbus" />
                          </div>
                        </div>
                        <div className="text-sm text-tunisbus font-medium whitespace-nowrap px-2">
                          {route.duration}
                        </div>
                      </div>
                      
                      <div className="space-y-1 text-right">
                        <span className="text-sm text-muted-foreground">{t('admin.form.destination')}</span>
                        <h3 className="text-lg font-semibold">{route.destination}</h3>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-3 border-t">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {new Date(route.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {route.availableSeats}/50
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800">
                    <div className="text-2xl font-bold text-tunisbus">
                      {route.price} <span className="text-sm font-normal">DT</span>
                    </div>
                    <Button className="bg-tunisbus hover:bg-tunisbus-dark">
                      {t('routes.book')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HeroSection;
