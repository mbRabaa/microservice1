
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { BusRoute } from '@/utils/data';
import { tunisianProvinces } from '@/utils/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

type RouteFormProps = {
  onSubmit: (route: Omit<BusRoute, 'id'>) => void;
  onCancel: () => void;
  initialData?: BusRoute;
};

const RouteForm: React.FC<RouteFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const { t, locale } = useLanguage();
  const isEditing = !!initialData;

  const [formData, setFormData] = useState<Omit<BusRoute, 'id'>>({
    departure: initialData?.departure || '',
    destination: initialData?.destination || '',
    date: initialData?.date || '',
    time: initialData?.time || '',
    price: initialData?.price || 0,
    duration: initialData?.duration || '',
    availableSeats: initialData?.availableSeats || 30,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.departure) {
      newErrors.departure = t('common.required');
    }
    
    if (!formData.destination) {
      newErrors.destination = t('common.required');
    }
    
    if (formData.departure === formData.destination) {
      newErrors.destination = 'Departure and destination cannot be the same';
    }
    
    if (!formData.date) {
      newErrors.date = t('common.required');
    }
    
    if (!formData.time) {
      newErrors.time = t('common.required');
    }
    
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    if (!formData.duration) {
      newErrors.duration = t('common.required');
    }
    
    if (formData.availableSeats <= 0) {
      newErrors.availableSeats = 'Available seats must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'availableSeats' ? Number(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      toast.success(
        isEditing 
          ? t('admin.notifications.routeUpdated') 
          : t('admin.notifications.routeAdded')
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="departure">{t('admin.form.departure')}</Label>
          <Select
            value={formData.departure}
            onValueChange={(value) => handleSelectChange('departure', value)}
          >
            <SelectTrigger className={errors.departure ? 'border-red-500' : ''}>
              <SelectValue placeholder={t('admin.form.selectDeparture')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {tunisianProvinces.map((province) => (
                  <SelectItem key={province.id} value={province.name}>
                    {locale === 'ar' ? province.nameAr : province.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.departure && (
            <p className="text-sm text-red-500">{errors.departure}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="destination">{t('admin.form.destination')}</Label>
          <Select
            value={formData.destination}
            onValueChange={(value) => handleSelectChange('destination', value)}
          >
            <SelectTrigger className={errors.destination ? 'border-red-500' : ''}>
              <SelectValue placeholder={t('admin.form.selectDestination')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {tunisianProvinces.map((province) => (
                  <SelectItem key={province.id} value={province.name}>
                    {locale === 'ar' ? province.nameAr : province.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.destination && (
            <p className="text-sm text-red-500">{errors.destination}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">{t('admin.form.date')}</Label>
          <Input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            className={errors.date ? 'border-red-500' : ''}
          />
          {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">{t('admin.form.time')}</Label>
          <Input
            id="time"
            name="time"
            type="time"
            value={formData.time}
            onChange={handleChange}
            className={errors.time ? 'border-red-500' : ''}
          />
          {errors.time && <p className="text-sm text-red-500">{errors.time}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">{t('admin.form.price')}</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min="1"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            className={errors.price ? 'border-red-500' : ''}
          />
          {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">{t('admin.form.duration')}</Label>
          <Input
            id="duration"
            name="duration"
            type="text"
            value={formData.duration}
            onChange={handleChange}
            className={errors.duration ? 'border-red-500' : ''}
            placeholder="2h 30min"
          />
          {errors.duration && (
            <p className="text-sm text-red-500">{errors.duration}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="availableSeats">
            {t('admin.form.availableSeats')}
          </Label>
          <Input
            id="availableSeats"
            name="availableSeats"
            type="number"
            min="1"
            value={formData.availableSeats}
            onChange={handleChange}
            className={errors.availableSeats ? 'border-red-500' : ''}
          />
          {errors.availableSeats && (
            <p className="text-sm text-red-500">{errors.availableSeats}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" type="button" onClick={onCancel}>
          {t('common.cancel')}
        </Button>
        <Button type="submit">
          {isEditing ? t('common.save') : t('admin.addRoute')}
        </Button>
      </div>
    </form>
  );
};

export default RouteForm;
