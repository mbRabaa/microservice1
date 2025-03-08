
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface DashboardHeaderProps {
  onAddRoute: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onAddRoute }) => {
  const { t } = useLanguage();

  return (
    <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t('admin.title')}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t('admin.routesList')}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={onAddRoute} className="shrink-0 bg-tunisbus hover:bg-tunisbus-dark">
          <Plus className="h-4 w-4 mr-2" />
          {t('admin.addRoute')}
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;
