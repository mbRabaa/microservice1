
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Bus } from 'lucide-react';
import LanguageSelector from '@/components/LanguageSelector';
import Sidebar from '@/components/Sidebar';

interface HeaderProps {
  onOpenLoginModal: () => void;
  onAboutClick: () => void;
  onRoutesClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenLoginModal, onAboutClick }) => {
  const { t } = useLanguage();

  return (
    <>
      <Sidebar className="z-50" />
      <header className="fixed top-0 inset-x-0 z-40 bg-white/80 backdrop-blur-sm border-b border-slate-200 dark:bg-slate-900/80 dark:border-slate-800 ml-20 lg:ml-64">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <Bus className="h-8 w-8 text-tunisbus" />
            <span className="font-bold text-xl">
              {t('common.appName')}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              onClick={onAboutClick} 
              variant="ghost" 
              className="text-slate-700 hover:text-tunisbus hover:bg-tunisbus/10"
            >
              {t('navigation.about')}
            </Button>
            <LanguageSelector />
            <Button 
              onClick={onOpenLoginModal} 
              variant="outline" 
              className="border-tunisbus text-tunisbus hover:bg-tunisbus/10"
            >
              {t('common.adminLogin')}
            </Button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
