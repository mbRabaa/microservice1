
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import RouteForm from '@/components/RouteForm';
import { useLanguage } from '@/context/LanguageContext';
import { BusRoute } from '@/frontend/utils/data';

interface RouteFormCardProps {
  editingRouteId: string | null;
  onCancel: () => void;
  onSubmit: (routeData: Omit<BusRoute, 'id'>) => void;
  currentlyEditingRoute?: BusRoute;
}

const RouteFormCard: React.FC<RouteFormCardProps> = ({
  editingRouteId,
  onCancel,
  onSubmit,
  currentlyEditingRoute,
}) => {
  const { t } = useLanguage();

  return (
    <Card className="mb-8 border shadow-sm animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>
          {editingRouteId ? t('admin.editRoute') : t('admin.addRoute')}
        </CardTitle>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onCancel}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <RouteForm
          onSubmit={onSubmit}
          onCancel={onCancel}
          initialData={currentlyEditingRoute}
        />
      </CardContent>
    </Card>
  );
};

export default RouteFormCard;
