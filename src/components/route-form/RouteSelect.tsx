
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { tunisianProvinces } from '@/frontend/utils/data';

interface RouteSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const RouteSelect: React.FC<RouteSelectProps> = ({ 
  label, 
  value, 
  onChange, 
  placeholder 
}) => {
  const { t, locale } = useLanguage();

  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <select
        className="w-full h-11 rounded-md border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-tunisbus"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{placeholder}</option>
        {tunisianProvinces.map(province => (
          <option key={`${label}-${province.id}`} value={province.name}>
            {locale === 'ar' ? province.nameAr : province.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RouteSelect;
