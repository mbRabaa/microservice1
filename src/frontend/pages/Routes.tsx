
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { getRoutesSync, BusRoute } from '@/frontend/utils/data';
import Layout from '@/frontend/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, Bus, MapPin, CreditCard, ArrowRight, ChevronLeft, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';

const Routes: React.FC = () => {
  const { t } = useLanguage();
  const [routes, setRoutes] = useState<BusRoute[]>([]);
  const [filteredRoutes, setFilteredRoutes] = useState<BusRoute[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    setIsLoading(true);
    try {
      // Use synchronous version for immediate UI
      const initialRoutes = getRoutesSync();
      setRoutes(initialRoutes);
      setFilteredRoutes(initialRoutes);
      console.log('Routes page loaded:', initialRoutes.length);
      
      // Then update with latest data from API (async)
      const refreshedRoutes = await fetch('/api/routes')
        .then(res => res.ok ? res.json() : initialRoutes)
        .catch(() => initialRoutes);
      
      setRoutes(refreshedRoutes);
      setFilteredRoutes(refreshedRoutes);
    } catch (error) {
      console.error('Error loading routes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredRoutes(routes);
      return;
    }
    
    const filtered = routes.filter((route) =>
      route.departure.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.date.includes(searchTerm)
    );
    
    setFilteredRoutes(filtered);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 w-full">
        <div className="flex items-center mb-6">
          <Link to="/" className="mr-4">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{t('routes.availableRoutes')}</h1>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 max-w-md mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={t('common.searchPlaceholder')}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} className="bg-tunisbus hover:bg-tunisbus-dark">
              {t('common.search')}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {isLoading ? (
            // Loading skeleton
            Array(3).fill(0).map((_, i) => (
              <Card key={`skeleton-${i}`} className="animate-pulse">
                <CardContent className="p-6 h-32"></CardContent>
              </Card>
            ))
          ) : (
            filteredRoutes.map((route) => (
              <Card
                key={route.id}
                className="hover:shadow-md transition-shadow border-slate-200 dark:border-slate-800"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <MapPin className="text-tunisbus h-5 w-5 mr-2" />
                        <div className="flex flex-col md:flex-row md:items-center">
                          <span className="font-semibold text-lg">{route.departure}</span>
                          <ArrowRight className="h-4 w-4 mx-2 hidden md:block" />
                          <span className="font-semibold text-lg">{route.destination}</span>
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center text-gray-600 text-sm gap-1 md:gap-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{format(new Date(route.date), 'dd/MM/yyyy')}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{route.time}</span>
                        </div>
                        <div className="flex items-center">
                          <Bus className="h-4 w-4 mr-1" />
                          <span>{route.duration}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                      <div className="flex items-center justify-center bg-green-50 text-green-700 px-3 py-1 rounded-full">
                        <CreditCard className="h-4 w-4 mr-1" />
                        <span className="font-semibold">{route.price} DT</span>
                      </div>
                      <Button className="bg-tunisbus hover:bg-tunisbus-dark">
                        {t('routes.book')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}

          {!isLoading && filteredRoutes.length === 0 && (
            <div className="text-center p-8">
              <p className="text-gray-500">{t('routes.noResults')}</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Routes;
