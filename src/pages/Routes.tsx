import React, { useState, useEffect } from 'react';
import { ArrowRight, Calendar, Users, Search, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { tunisianProvinces, getRoutes, BusRoute } from '@/frontend/utils/data';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from 'date-fns';

const Routes: React.FC = () => {
  const { t, locale } = useLanguage();
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [routes, setRoutes] = useState<BusRoute[]>([]);
  const [filteredRoutes, setFilteredRoutes] = useState<BusRoute[]>([]);

  useEffect(() => {
    const allRoutes = getRoutes();
    setRoutes(allRoutes);
    setFilteredRoutes(allRoutes);
  }, []);

  const handleSearch = () => {
    let results = getRoutes();

    if (departure) {
      results = results.filter(route =>
        route.departure.toLowerCase().includes(departure.toLowerCase())
      );
    }

    if (destination) {
      results = results.filter(route =>
        route.destination.toLowerCase().includes(destination.toLowerCase())
      );
    }

    if (date) {
      results = results.filter(route =>
        new Date(route.date).toDateString() === date.toDateString()
      );
    }

    if (searchTerm) {
      results = results.filter(route =>
        route.departure.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.destination.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (results.length === 0) {
      toast.info(t('routes.noResults'));
    }

    setFilteredRoutes(results);
  };

  const clearFilters = () => {
    setDeparture('');
    setDestination('');
    setDate(undefined);
    setSearchTerm('');
    setFilteredRoutes(routes);
  };

  return (
    <div className="container mx-auto py-16">
      <h1 className="text-3xl font-bold text-center mb-8">{t('routes.title')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Departure Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('admin.form.departure')}</label>
          <div className="relative mt-1">
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

        {/* Destination Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('admin.form.destination')}</label>
          <div className="relative mt-1">
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

        {/* Date Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('admin.form.date')}</label>
          <div className="relative mt-1">
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

      {/* Search and Clear Buttons */}
      <div className="flex items-center justify-between mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            className="pl-10 w-64"
            placeholder={t('common.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="space-x-2">
          <Button onClick={handleSearch} className="bg-tunisbus hover:bg-tunisbus-dark">
            {t('common.search')}
          </Button>
          <Button variant="outline" onClick={clearFilters}>
            {t('common.clear')}
          </Button>
        </div>
      </div>

      {/* Routes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoutes.map((route) => (
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
  );
};

export default Routes;
