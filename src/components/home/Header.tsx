
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bus } from 'lucide-react';
import LanguageSelector from '@/components/LanguageSelector';

interface HeaderProps {
  onOpenLoginModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenLoginModal }) => {
  const { t } = useLanguage();

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-200 dark:bg-slate-900/80 dark:border-slate-800">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-2">
          <Bus className="h-8 w-8 text-tunisbus" />
          <span className="font-bold text-xl">
            {t('common.appName')}
          </span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-tunisbus transition-colors">
            {t('navigation.home')}
          </Link>
          <Link to="/routes" className="text-sm font-medium hover:text-tunisbus transition-colors">
            {t('navigation.routes')}
          </Link>
        </nav>
        
        <div className="flex items-center gap-3">
          <LanguageSelector />
          <Button onClick={onOpenLoginModal}>
            {t('common.adminLogin')}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
