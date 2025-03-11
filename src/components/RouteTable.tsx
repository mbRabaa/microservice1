
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { BusRoute } from '@/frontend/utils/data';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type RouteTableProps = {
  routes: BusRoute[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

const RouteTable: React.FC<RouteTableProps> = ({ routes, onEdit, onDelete }) => {
  const { t } = useLanguage();

  if (routes.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">{t('admin.routesList')} {t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border animate-fade-in">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('admin.table.departure')}</TableHead>
            <TableHead>{t('admin.table.destination')}</TableHead>
            <TableHead>{t('admin.table.date')}</TableHead>
            <TableHead>{t('admin.table.time')}</TableHead>
            <TableHead>{t('admin.table.price')}</TableHead>
            <TableHead>{t('admin.table.availableSeats')}</TableHead>
            <TableHead className="w-24 text-right">{t('admin.table.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {routes.map((route) => (
            <TableRow key={route.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <TableCell>{route.departure}</TableCell>
              <TableCell>{route.destination}</TableCell>
              <TableCell>{new Date(route.date).toLocaleDateString()}</TableCell>
              <TableCell>{route.time}</TableCell>
              <TableCell>{route.price.toFixed(2)} TND</TableCell>
              <TableCell>{route.availableSeats}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(route.id)}
                    className="h-8 w-8"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onDelete(route.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RouteTable;
