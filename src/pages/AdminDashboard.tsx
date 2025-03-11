
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsCards from '@/components/dashboard/StatsCards';
import WeeklyStatsCard from '@/components/dashboard/WeeklyStatsCard';
import RouteFormCard from '@/components/dashboard/RouteFormCard';
import RouteManagement from '@/components/dashboard/RouteManagement';
import DeleteRouteDialog from '@/components/dashboard/DeleteRouteDialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { BusRoute, getRoutes, addRoute, updateRoute, deleteRoute } from '@/frontend/utils/data';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';

const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [routes, setRoutes] = useState<BusRoute[]>([]);
  const [filteredRoutes, setFilteredRoutes] = useState<BusRoute[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRouteId, setEditingRouteId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingRouteId, setDeletingRouteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Load routes on initial render
  useEffect(() => {
    loadRoutes();
  }, []);

  // Filter routes when search term or routes change
  useEffect(() => {
    handleSearch();
  }, [searchTerm, routes]);

  // Function to load routes from storage
  const loadRoutes = () => {
    const loadedRoutes = getRoutes();
    setRoutes(loadedRoutes);
    console.log('Routes loaded:', loadedRoutes.length);
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredRoutes(routes);
      return;
    }
    
    const filtered = routes.filter(route => 
      route.departure.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(route.date).toLocaleDateString().includes(searchTerm) ||
      route.time.includes(searchTerm) ||
      route.price.toString().includes(searchTerm) ||
      route.availableSeats.toString().includes(searchTerm)
    );
    
    setFilteredRoutes(filtered);
  };

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
      deleteRoute(deletingRouteId);
      loadRoutes(); // Reload routes after deletion
      
      toast.success(t('admin.notifications.routeDeleted'));
      setDeleteDialogOpen(false);
      setDeletingRouteId(null);
    }
  };

  const handleSubmitRoute = (routeData: Omit<BusRoute, 'id'>) => {
    if (editingRouteId) {
      updateRoute(editingRouteId, routeData);
      loadRoutes(); // Reload routes after update
      toast.success(t('admin.notifications.routeUpdated'));
    } else {
      const newId = addRoute(routeData);
      loadRoutes(); // Reload routes after adding
      toast.success(t('admin.notifications.routeAdded'));
    }
    setShowForm(false);
    setEditingRouteId(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Layout>
      <div className="container mx-auto animate-fade-in">
        <DashboardHeader onAddRoute={handleAddRoute} />
        
        <StatsCards routesCount={routes.length} />
        
        <WeeklyStatsCard />
        
        {showForm && (
          <RouteFormCard 
            editingRouteId={editingRouteId}
            onCancel={handleCancelForm}
            onSubmit={handleSubmitRoute}
            currentlyEditingRoute={routes.find(route => route.id === editingRouteId)}
          />
        )}

        <RouteManagement 
          filteredRoutes={filteredRoutes}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onEdit={handleEditRoute}
          onDelete={handleDeleteClick}
        />
      </div>

      <DeleteRouteDialog 
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
    </Layout>
  );
};

export default AdminDashboard;
