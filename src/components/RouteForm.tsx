
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { BusRoute } from '@/frontend/utils/data';
import { toast } from 'sonner';
import RouteSelect from './route-form/RouteSelect';
import DatePicker from './route-form/DatePicker';
import FormInput from './route-form/FormInput';
import AvailableSeatsInput from './route-form/AvailableSeatsInput';
import FormActions from './route-form/FormActions';

interface RouteFormProps {
  onSubmit: (routeData: Omit<BusRoute, 'id'>) => void;
  onCancel: () => void;
  initialData?: BusRoute;
}

const RouteForm: React.FC<RouteFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const { t } = useLanguage();
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
      price: Number(price),
      availableSeats,
    };
    onSubmit(routeData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <RouteSelect
        label={t('admin.form.departure')}
        value={departure}
        onChange={setDeparture}
        placeholder={t('admin.form.selectDeparture')}
      />
      
      <RouteSelect
        label={t('admin.form.destination')}
        value={destination}
        onChange={setDestination}
        placeholder={t('admin.form.selectDestination')}
      />
      
      <DatePicker
        label={t('admin.form.date')}
        date={date}
        onDateChange={setDate}
        placeholder={t('admin.form.selectDate')}
      />
      
      <FormInput
        label={t('admin.form.time')}
        type="time"
        value={time}
        onChange={setTime}
      />
      
      <FormInput
        label={t('admin.form.duration')}
        type="text"
        value={duration}
        onChange={setDuration}
        placeholder={t('admin.form.durationPlaceholder')}
      />
      
      <FormInput
        label={t('admin.form.price')}
        type="number"
        value={price}
        onChange={setPrice}
        placeholder={t('admin.form.pricePlaceholder')}
      />
      
      <AvailableSeatsInput
        label={t('admin.form.availableSeats')}
        value={availableSeats}
        onChange={setAvailableSeats}
        placeholder={t('admin.form.availableSeatsPlaceholder')}
        lowSeatsWarning={t('admin.form.lowSeatsWarning')}
      />
      
      <FormActions
        onCancel={onCancel}
        cancelLabel={t('common.cancel')}
        submitLabel={t('common.save')}
      />
    </form>
  );
};

export default RouteForm;
