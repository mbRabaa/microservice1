
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Calendar } from 'lucide-react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { tunisianProvinces } from '@/frontend/utils/data';

interface SearchFormProps {
  departure: string;
  setDeparture: (value: string) => void;
  destination: string;
  setDestination: (value: string) => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  handleSearch: () => void;
}

const SearchForm: React.FC<SearchFormProps> = ({
  departure,
  setDeparture,
  destination,
  setDestination,
  date,
  setDate,
  handleSearch
}) => {
  const { t, locale } = useLanguage();

  return (
    <div className="space-y-6">
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
  );
};

export default SearchForm;
