
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { getRoutes, BusRoute } from '@/utils/data';
import { ArrowLeft, Search, Calendar, Users, ArrowRight, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';

const Routes: React.FC = () => {
  const { t } = useLanguage();
  const [routes, setRoutes] = useState<BusRoute[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRoutes, setFilteredRoutes] = useState<BusRoute[]>([]);
  const [isFetchingRoutes, setIsFetchingRoutes] = useState(false);

  useEffect(() => {
    setIsFetchingRoutes(true);
    setRoutes(getRoutes());
    setIsFetchingRoutes(false);
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, routes]);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredRoutes(routes);
      return;
    }
    
    const filtered = routes.filter(route => 
      route.departure.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(route.date).toLocaleDateString().includes(searchTerm) ||
      route.time.includes(searchTerm)
    );
    
    setFilteredRoutes(filtered);
  };

  const calculateArrivalTime = (departureTime: string, duration: string) => {
    const durationMatch = duration.match(/(\d+)h\s+(\d+)min/);
    if (!durationMatch) return "";
    
    const durationHours = parseInt(durationMatch[1], 10);
    const durationMinutes = parseInt(durationMatch[2], 10);
    
    const [depHours, depMinutes] = departureTime.split(':').map(num => parseInt(num, 10));
    
    let totalMinutes = depMinutes + durationMinutes;
    let totalHours = depHours + durationHours + Math.floor(totalMinutes / 60);
    totalMinutes %= 60;
    totalHours %= 24;
    
    return `${totalHours.toString().padStart(2, '0')}:${totalMinutes.toString().padStart(2, '0')}`;
  };

  const noResultsText = isFetchingRoutes 
    ? t('routes.loading') 
    : t('routes.noResults');

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 w-full">
        <div className="flex items-center mb-6">
          <Link to="/" className="mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{t('routes.allRoutes')}</h1>
        </div>
        
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              className="pl-10 py-6 text-lg"
              placeholder={t('common.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          {filteredRoutes.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              {noResultsText}
            </div>
          ) : (
            filteredRoutes.map((route) => (
              <div 
                key={route.id} 
                className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-col md:flex-row md:items-center gap-6 w-full">
                    <div className="flex-1">
                      <div className="flex items-start">
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">{t('routes.from')}</p>
                          <h3 className="text-xl font-bold">{route.departure}</h3>
                          <p className="text-lg">{route.time}</p>
                        </div>

                        <div className="flex items-center flex-1 px-4 max-w-[200px]">
                          <div className="relative w-full">
                            <div className="border-t-2 border-dashed border-purple-300 w-full"></div>
                            <div className="absolute -right-1 top-1/2 transform -translate-y-1/2">
                              <ArrowRight className="h-5 w-5 text-tunisbus" />
                            </div>
                          </div>
                        </div>

                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">{t('routes.to')}</p>
                          <h3 className="text-xl font-bold">{route.destination}</h3>
                          <p className="text-lg">{calculateArrivalTime(route.time, route.duration)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 mt-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-tunisbus" />
                          <span className="text-sm">{route.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-tunisbus" />
                          <span className="text-sm">{new Date(route.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-tunisbus" />
                          <span className="text-sm">{t('routes.availableSeats', { seats: route.availableSeats })}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end justify-between md:min-w-36 mt-4 md:mt-0">
                      <div className="text-2xl font-bold text-tunisbus">
                        {route.price} <span className="text-sm font-normal">DT</span>
                      </div>
                      <Button className="bg-tunisbus hover:bg-tunisbus-dark w-full md:w-auto mt-2">
                        {t('routes.book')}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Routes;
