
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Layout from '@/components/Layout';
import RouteForm from '@/components/RouteForm';
import RouteTable from '@/components/RouteTable';
import { BusRoute, mockRoutes } from '@/utils/data';
import { Button } from '@/components/ui/button';
import { Plus, X, Users, Calendar, DollarSign, PercentCircle } from 'lucide-react';
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
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
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
          <div className="flex items-center gap-2">
            <Button onClick={handleAddRoute} className="shrink-0 bg-tunisbus hover:bg-tunisbus-dark">
              <Plus className="h-4 w-4 mr-2" />
              {t('admin.addRoute')}
            </Button>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border shadow-sm">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Trajets totaux</p>
                  <h2 className="text-3xl font-bold mt-1">{routes.length}</h2>
                  <p className="flex items-center text-sm text-green-500 mt-2">
                    <span>+12% vs</span>
                    <span className="ml-1 text-muted-foreground">la semaine dernière</span>
                  </p>
                </div>
                <div className="bg-tunisbus/10 p-3 rounded-full">
                  <Users className="h-5 w-5 text-tunisbus" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border shadow-sm">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Réservations totales</p>
                  <h2 className="text-3xl font-bold mt-1">156</h2>
                  <p className="flex items-center text-sm text-green-500 mt-2">
                    <span>+18% vs</span>
                    <span className="ml-1 text-muted-foreground">la semaine dernière</span>
                  </p>
                </div>
                <div className="bg-cyan-100 p-3 rounded-full">
                  <Calendar className="h-5 w-5 text-cyan-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border shadow-sm">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Taux d'occupation</p>
                  <h2 className="text-3xl font-bold mt-1">78%</h2>
                  <p className="flex items-center text-sm text-green-500 mt-2">
                    <span>+5% vs</span>
                    <span className="ml-1 text-muted-foreground">la semaine dernière</span>
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <PercentCircle className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border shadow-sm">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Revenu total</p>
                  <h2 className="text-3xl font-bold mt-1">5,640 DT</h2>
                  <p className="flex items-center text-sm text-green-500 mt-2">
                    <span>+22% vs</span>
                    <span className="ml-1 text-muted-foreground">la semaine dernière</span>
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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

        <div className="mb-8">
          <Card className="border shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{t('admin.routesManagement')}</CardTitle>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Rechercher des trajets..."
                    className="w-64 py-2 px-4 rounded-full text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-tunisbus"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <RouteTable
                routes={routes}
                onEdit={handleEditRoute}
                onDelete={handleDeleteClick}
              />
            </CardContent>
          </Card>
        </div>
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
