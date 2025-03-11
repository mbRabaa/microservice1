
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Users } from 'lucide-react';
import { BusRoute } from '@/frontend/utils/data';

interface SearchResultsProps {
  searchResults: BusRoute[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ searchResults }) => {
  const { t } = useLanguage();

  return (
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
  );
};

export default SearchResults;
