
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
  const [showAll, setShowAll] = useState(false);
  const [displayedRoutes, setDisplayedRoutes] = useState<BusRoute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Load routes when component mounts
    loadRoutes();
  }, []);

  // Update displayed routes when filteredRoutes or showAll changes
  useEffect(() => {
    if (showAll) {
      setDisplayedRoutes(filteredRoutes);
    } else {
      setDisplayedRoutes(filteredRoutes.slice(0, 3));
    }
  }, [filteredRoutes, showAll]);

  const loadRoutes = async () => {
    setIsLoading(true);
    try {
      // Use the sync version for initial quick loading
      const allRoutes = getRoutesSync();
      setRoutes(allRoutes);
      setFilteredRoutes(allRoutes);
      setDisplayedRoutes(showAll ? allRoutes : allRoutes.slice(0, 3));
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
    
    const filtered = routes.filter(route => 
      route.departure.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.date.includes(searchTerm)
    );
    
    setFilteredRoutes(filtered);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setTimeout(handleSearch, 300);
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
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
        ) : displayedRoutes.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayedRoutes.map((route) => (
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
          {filteredRoutes.length > 3 && (
            <Button 
              variant="outline" 
              onClick={toggleShowAll}
              className="mx-2"
            >
              {showAll ? t('home.showLess') : t('home.showMore')}
            </Button>
          )}
          <Button onClick={navigateToRoutes} className="mx-2">
            {t('home.viewAllRoutes')}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AvailableRoutes;
