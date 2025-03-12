
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { getRoutesSync, BusRoute } from '@/frontend/utils/data';
import { MapPin, Calendar, Clock, CreditCard } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from "@/components/ui/skeleton";

const AvailableRoutes: React.FC = () => {
  const { t } = useLanguage();
  const [routes, setRoutes] = useState<BusRoute[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRoutes, setFilteredRoutes] = useState<BusRoute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    setIsLoading(true);
    try {
      const allRoutes = getRoutesSync();
      setRoutes(allRoutes);
      setFilteredRoutes(allRoutes.slice(0, 3));
    } catch (error) {
      console.error('Error loading routes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredRoutes(routes.slice(0, 3));
      return;
    }
    
    const filtered = routes.filter(route => 
      route.departure.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.date.includes(searchTerm)
    ).slice(0, 3);
    
    setFilteredRoutes(filtered);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setTimeout(handleSearch, 300);
  };

  const navigateToRoutes = () => {
    navigate('/routes');
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight">{t('home.availableRoutes')}</h2>
          <p className="text-muted-foreground mt-2">{t('home.exploreRoutes')}</p>
          
          <div className="max-w-md mx-auto mt-6">
            <div className="relative">
              <Input
                type="text"
                placeholder={t('home.searchRoutes')}
                value={searchTerm}
                onChange={handleSearchChange}
                className="pr-10"
              />
              <button 
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={handleSearch}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="p-0">
                  <Skeleton className="h-40 w-full" />
                </CardHeader>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredRoutes.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredRoutes.map((route) => (
              <Card key={route.id} className="overflow-hidden">
                <div className="h-40 bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
                  <div className="text-white text-center">
                    <h3 className="text-xl font-bold">{route.departure} → {route.destination}</h3>
                    <p>{new Date(route.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                      <span>{t('home.from')} {route.departure} {t('home.to')} {route.destination}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                      <span>{new Date(route.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-gray-500" />
                      <span>{route.time} • {route.duration}</span>
                    </div>
                    <div className="flex items-center font-bold">
                      <CreditCard className="h-5 w-5 mr-2 text-gray-500" />
                      <span>{route.price} TND</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 p-6 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {route.availableSeats} {t('home.seatsAvailable')}
                  </div>
                  <Button variant="outline">{t('home.bookNow')}</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">{t('home.noRoutesFound')}</p>
          </div>
        )}

        <div className="text-center mt-8">
          <Button onClick={navigateToRoutes} className="bg-tunisbus hover:bg-tunisbus-dark">
            {t('home.viewAllRoutes')}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AvailableRoutes;
