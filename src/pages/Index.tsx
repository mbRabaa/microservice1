
import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Bus, TicketCheck, Bell, CreditCard, MapPin } from 'lucide-react';
import LanguageSelector from '@/components/LanguageSelector';
import { cn } from '@/lib/utils';
import { tunisianProvinces } from '@/utils/data';
import LoginModal from '@/components/LoginModal';

const Index: React.FC = () => {
  const { t, locale } = useLanguage();
  const [loaded, setLoaded] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleSearch = () => {
    // Simuler une recherche
    console.log('Recherche:', { departure, destination });
    // Dans une application réelle, on redirigerait vers une page de résultats
  };

  return (
    <div className={cn("min-h-screen", locale === 'ar' ? 'text-right' : 'text-left')}>
      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-200 dark:bg-slate-900/80 dark:border-slate-800">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <Bus className="h-8 w-8 text-tunisbus" />
            <span className="font-bold text-xl">
              {t('common.appName')}
            </span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-tunisbus transition-colors">
              {t('navigation.home')}
            </Link>
            <Link to="/routes" className="text-sm font-medium hover:text-tunisbus transition-colors">
              {t('navigation.routes')}
            </Link>
          </nav>
          
          <div className="flex items-center gap-3">
            <LanguageSelector />
            <Button onClick={() => setLoginModalOpen(true)}>
              {t('common.adminLogin')}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
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

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">
              {t('home.features.title')}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className={cn(
              "flex flex-col items-center text-center p-6 rounded-xl hover-scale fancy-border-gradient bg-white dark:bg-slate-800",
              loaded ? "animate-fade-in" : "opacity-0",
            )} style={{ animationDelay: '100ms' }}>
              <div className="h-14 w-14 flex items-center justify-center rounded-full bg-tunisbus/10 text-tunisbus mb-4">
                <TicketCheck className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {t('home.features.onlineBooking.title')}
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                {t('home.features.onlineBooking.description')}
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className={cn(
              "flex flex-col items-center text-center p-6 rounded-xl hover-scale fancy-border-gradient bg-white dark:bg-slate-800",
              loaded ? "animate-fade-in" : "opacity-0",
            )} style={{ animationDelay: '200ms' }}>
              <div className="h-14 w-14 flex items-center justify-center rounded-full bg-tunisbus/10 text-tunisbus mb-4">
                <CreditCard className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {t('home.features.easyPayment.title')}
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                {t('home.features.easyPayment.description')}
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className={cn(
              "flex flex-col items-center text-center p-6 rounded-xl hover-scale fancy-border-gradient bg-white dark:bg-slate-800",
              loaded ? "animate-fade-in" : "opacity-0",
            )} style={{ animationDelay: '300ms' }}>
              <div className="h-14 w-14 flex items-center justify-center rounded-full bg-tunisbus/10 text-tunisbus mb-4">
                <Bell className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {t('home.features.notifications.title')}
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                {t('home.features.notifications.description')}
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className={cn(
              "flex flex-col items-center text-center p-6 rounded-xl hover-scale fancy-border-gradient bg-white dark:bg-slate-800",
              loaded ? "animate-fade-in" : "opacity-0",
            )} style={{ animationDelay: '400ms' }}>
              <div className="h-14 w-14 flex items-center justify-center rounded-full bg-tunisbus/10 text-tunisbus mb-4">
                <Bus className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {t('home.features.routeManagement.title')}
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                {t('home.features.routeManagement.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
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

      {/* Login Modal */}
      <LoginModal 
        open={loginModalOpen} 
        onOpenChange={setLoginModalOpen}
      />
    </div>
  );
};

export default Index;
