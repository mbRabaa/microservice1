import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { BusRoute } from '@/frontend/utils/data';
import { Edit, Trash2, Calendar, MapPin, Clock, CreditCard } from 'lucide-react';
import DeleteRouteDialog from './dashboard/DeleteRouteDialog';

interface RouteTableProps {
  routes: BusRoute[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const RouteTable: React.FC<RouteTableProps> = ({ routes, onEdit, onDelete }) => {
  const { t } = useLanguage();
  const [deleteRouteId, setDeleteRouteId] = React.useState<string | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  const confirmDelete = () => {
    if (deleteRouteId) {
      onDelete(deleteRouteId);
      setDeleteRouteId(null);
      setOpenDeleteDialog(false);
    }
  };

  const cancelDelete = () => {
    setDeleteRouteId(null);
    setOpenDeleteDialog(false);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.form.departure')}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.form.destination')}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.form.date')}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.form.time')}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.form.duration')}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.form.price')}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.form.availableSeats')}</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700">
          {routes.map((route) => (
            <tr key={route.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{route.departure}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  <div className="text-sm text-gray-900 dark:text-white">{route.destination}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <div className="text-sm text-gray-900 dark:text-white">{new Date(route.date).toLocaleDateString()}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  <div className="text-sm text-gray-900 dark:text-white">{route.time}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  <div className="text-sm text-gray-900 dark:text-white">{route.duration}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
                  <div className="text-sm text-gray-900 dark:text-white">{route.price}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white">{route.availableSeats}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <Button variant="ghost" size="icon" onClick={() => onEdit(route.id)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => {
                  setDeleteRouteId(route.id);
                  setOpenDeleteDialog(true);
                }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <DeleteRouteDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        confirmDelete={confirmDelete}
        cancelDelete={cancelDelete}
      />
    </div>
  );
};

export default RouteTable;
