import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { tunisianProvinces } from '@/frontend/utils/data';
import { BusRoute } from '@/frontend/utils/data';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Info } from 'lucide-react';
import { toast } from 'sonner';

interface RouteFormProps {
  onSubmit: (routeData: Omit<BusRoute, 'id'>) => void;
  onCancel: () => void;
  initialData?: BusRoute;
}

const RouteForm: React.FC<RouteFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const { t, locale } = useLanguage();
  const [departure, setDeparture] = useState(initialData?.departure || '');
  const [destination, setDestination] = useState(initialData?.destination || '');
  const [date, setDate] = useState<Date | undefined>(initialData ? new Date(initialData.date) : undefined);
  const [time, setTime] = useState(initialData?.time || '');
  const [duration, setDuration] = useState(initialData?.duration || '');
  const [price, setPrice] = useState(initialData?.price || '');
  const [availableSeats, setAvailableSeats] = useState(initialData?.availableSeats || 50);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!departure || !destination || !date || !time || !duration || !price) {
      toast.error(t('admin.form.requiredFields'));
      return;
    }

    const routeData: Omit<BusRoute, 'id'> = {
      departure,
      destination,
      date: date.toISOString(),
      time,
      duration,
      price,
      availableSeats,
    };
    onSubmit(routeData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">{t('admin.form.departure')}</label>
        <select
          className="w-full h-11 rounded-md border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-tunisbus"
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
      <div>
        <label className="block text-sm font-medium mb-1">{t('admin.form.destination')}</label>
        <select
          className="w-full h-11 rounded-md border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-tunisbus"
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
      <div>
        <label className="block text-sm font-medium mb-1">{t('admin.form.date')}</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full h-11 justify-start text-left font-normal"
            >
              <Calendar className="mr-2 h-4 w-4" />
              {date ? format(date, 'PP') : <span>{t('admin.form.selectDate')}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">{t('admin.form.time')}</label>
        <Input
          type="time"
          className="w-full"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">{t('admin.form.duration')}</label>
        <Input
          type="text"
          className="w-full"
          placeholder={t('admin.form.durationPlaceholder')}
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">{t('admin.form.price')}</label>
        <Input
          type="number"
          className="w-full"
          placeholder={t('admin.form.pricePlaceholder')}
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">{t('admin.form.availableSeats')}</label>
        <Input
          type="number"
          className="w-full"
          placeholder={t('admin.form.availableSeatsPlaceholder')}
          value={availableSeats}
          onChange={(e) => setAvailableSeats(Number(e.target.value))}
          min="1"
          max="50"
        />
        {availableSeats < 10 && (
          <div className="flex items-center text-sm text-amber-500 mt-1">
            <Info className="h-4 w-4 mr-1" />
            {t('admin.form.lowSeatsWarning')}
          </div>
        )}
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" className="bg-tunisbus hover:bg-tunisbus-dark">
          {t('common.save')}
        </Button>
      </div>
    </form>
  );
};

export default RouteForm;
