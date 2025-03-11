
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';

interface CtaButtonProps {
  onClick: () => void;
}

const CtaButton: React.FC<CtaButtonProps> = ({ onClick }) => {
  const { t } = useLanguage();

  return (
    <div className="flex justify-center pt-4">
      <Button 
        size="lg" 
        className="bg-tunisbus hover:bg-tunisbus-dark text-white hover-scale" 
        onClick={onClick}
      >
        {t('home.hero.cta')}
      </Button>
    </div>
  );
};

export default CtaButton;
