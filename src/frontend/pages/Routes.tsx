
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { getRoutes, BusRoute } from '@/utils/data';
import Layout from '@/frontend/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Bus, MapPin, CreditCard, ArrowRight, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

// Filter component for routes page
const RouteFilter: React.FC<{
  onFilterChange: (filter: { departure: string; destination: string; date: string }) => void;
}> = ({ onFilterChange }) => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState({
    departure: '',
    destination: '',
    date: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilter((prev) => {
      const updated = { ...prev, [name]: value };
      onFilterChange(updated);
      return updated;
    });
  };

  return (
    <Card className="mb-6 shadow-sm border-slate-200 dark:border-slate-800">
      <CardHeader className="pb-3">
        <CardTitle>{t('routes.filterTitle')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label htmlFor="departure" className="text-sm font-medium">
              {t('routes.departure')}
            </label>
            <input
              id="departure"
              name="departure"
              type="text"
              value={filter.departure}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
              placeholder={t('routes.enterDeparture')}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="destination" className="text-sm font-medium">
              {t('routes.destination')}
            </label>
            <input
              id="destination"
              name="destination"
              type="text"
              value={filter.destination}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
              placeholder={t('routes.enterDestination')}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="date" className="text-sm font-medium">
              {t('routes.date')}
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={filter.date}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Routes: React.FC = () => {
  const { t } = useLanguage();
  const [routes, setRoutes] = useState<BusRoute[]>([]);
  const [filteredRoutes, setFilteredRoutes] = useState<BusRoute[]>([]);

  useEffect(() => {
    const fetchedRoutes = getRoutes();
    setRoutes(fetchedRoutes);
    setFilteredRoutes(fetchedRoutes);
  }, []);

  const handleFilterChange = (filter: { departure: string; destination: string; date: string }) => {
    let filtered = [...routes];

    if (filter.departure) {
      filtered = filtered.filter((route) =>
        route.departure.toLowerCase().includes(filter.departure.toLowerCase())
      );
    }

    if (filter.destination) {
      filtered = filtered.filter((route) =>
        route.destination.toLowerCase().includes(filter.destination.toLowerCase())
      );
    }

    if (filter.date) {
      filtered = filtered.filter((route) => route.date === filter.date);
    }

    setFilteredRoutes(filtered);
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

        <RouteFilter onFilterChange={handleFilterChange} />

        <div className="grid grid-cols-1 gap-4">
          {filteredRoutes.map((route) => (
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
                      {t('routes.bookNow')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredRoutes.length === 0 && (
            <div className="text-center p-8">
              <p className="text-gray-500">{t('routes.noRoutesFound')}</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Routes;
