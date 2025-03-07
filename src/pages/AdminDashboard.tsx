
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Layout from '@/components/Layout';
import RouteForm from '@/components/RouteForm';
import RouteTable from '@/components/RouteTable';
import { BusRoute, mockRoutes } from '@/utils/data';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();
  const [routes, setRoutes] = useState<BusRoute[]>(mockRoutes);
  const [showForm, setShowForm] = useState(false);
  const [editingRouteId, setEditingRouteId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingRouteId, setDeletingRouteId] = useState<string | null>(null);

  const currentlyEditingRoute = routes.find(route => route.id === editingRouteId);

  const handleAddRoute = () => {
    setEditingRouteId(null);
    setShowForm(true);
  };

  const handleEditRoute = (id: string) => {
    setEditingRouteId(id);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingRouteId(null);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingRouteId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingRouteId) {
      setRoutes(routes.filter(route => route.id !== deletingRouteId));
      toast.success(t('admin.notifications.routeDeleted'));
      setDeleteDialogOpen(false);
      setDeletingRouteId(null);
    }
  };

  const handleSubmitRoute = (routeData: Omit<BusRoute, 'id'>) => {
    if (editingRouteId) {
      // Edit existing route
      setRoutes(
        routes.map(route =>
          route.id === editingRouteId ? { ...route, ...routeData } : route
        )
      );
    } else {
      // Add new route
      const newRoute: BusRoute = {
        id: Date.now().toString(),
        ...routeData,
      };
      setRoutes([...routes, newRoute]);
    }
    setShowForm(false);
    setEditingRouteId(null);
  };

  return (
    <Layout>
      <div className="container mx-auto animate-fade-in">
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t('admin.title')}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t('admin.routesList')}
            </p>
          </div>
          <Button onClick={handleAddRoute} className="shrink-0">
            <Plus className="h-4 w-4 mr-2" />
            {t('admin.addRoute')}
          </Button>
        </header>

        {showForm ? (
          <Card className="mb-8 border shadow-sm animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>
                {editingRouteId ? t('admin.editRoute') : t('admin.addRoute')}
              </CardTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleCancelForm}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <RouteForm
                onSubmit={handleSubmitRoute}
                onCancel={handleCancelForm}
                initialData={currentlyEditingRoute}
              />
            </CardContent>
          </Card>
        ) : null}

        <RouteTable
          routes={routes}
          onEdit={handleEditRoute}
          onDelete={handleDeleteClick}
        />
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('admin.deleteRoute')}</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              route.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default AdminDashboard;
