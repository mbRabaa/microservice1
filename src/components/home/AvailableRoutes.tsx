
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { mockRoutes } from '@/utils/data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ArrowRight, Calendar, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const AvailableRoutes: React.FC = () => {
  const { t, locale } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRoutes, setFilteredRoutes] = useState(mockRoutes);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredRoutes(mockRoutes);
      return;
    }
    
    const filtered = mockRoutes.filter(route => 
      route.departure.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.destination.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredRoutes(filtered);
  };

  const handleShowAll = () => {
    setSearchTerm('');
    setFilteredRoutes(mockRoutes);
  };

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <h2 className="text-3xl font-bold mb-4 md:mb-0">
            {t('routes.popularRoutes')}
          </h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                className="w-64 pl-10"
                placeholder={t('common.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} className="bg-tunisbus hover:bg-tunisbus-dark">
              {t('common.search')}
            </Button>
            <Button onClick={handleShowAll} variant="outline">
              {t('routes.showAll')}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoutes.map((route) => (
            <Card key={route.id} className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">{t('admin.form.departure')}</span>
                      <h3 className="text-lg font-semibold">{route.departure}</h3>
                      <p className="text-lg">{route.time.split('-')[0].trim()}</p>
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
                      <p className="text-lg">{route.time.split('-')[1].trim()}</p>
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
                        {t('routes.availableSeats', { seats: route.availableSeats })}
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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AvailableRoutes;
