
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { LocaleType } from '@/utils/translations';
import { Button } from '@/components/ui/button';
import { LanguagesIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const languageOptions: { value: LocaleType; label: string; flag: string }[] = [
  { value: 'fr', label: 'Français', flag: '🇫🇷' },
  { value: 'en', label: 'English', flag: '🇬🇧' },
  { value: 'ar', label: 'العربية', flag: '🇹🇳' },
];

const LanguageSelector: React.FC = () => {
  const { locale, setLocale, t } = useLanguage();

  const handleLanguageChange = (newLocale: LocaleType) => {
    setLocale(newLocale);
    // Update document direction for Arabic (RTL)
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
  };

  const currentLanguage = languageOptions.find((option) => option.value === locale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 px-3">
          <LanguagesIcon className="h-4 w-4" />
          <span className="hidden sm:inline-block">
            {currentLanguage?.flag} {currentLanguage?.label}
          </span>
          <span className="inline-block sm:hidden">{currentLanguage?.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {languageOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleLanguageChange(option.value)}
            className={`cursor-pointer ${locale === option.value ? 'bg-accent' : ''}`}
          >
            <span className="mr-2">{option.flag}</span>
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
