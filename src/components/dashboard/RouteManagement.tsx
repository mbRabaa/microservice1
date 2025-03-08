
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import RouteTable from '@/components/RouteTable';
import { BusRoute } from '@/utils/data';

interface RouteManagementProps {
  filteredRoutes: BusRoute[];
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const RouteManagement: React.FC<RouteManagementProps> = ({
  filteredRoutes,
  searchTerm,
  onSearchChange,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="mb-8">
      <Card className="border shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Gestion des trajets</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                type="text" 
                placeholder="Rechercher des trajets..."
                value={searchTerm}
                onChange={onSearchChange}
                className="w-64 py-2 pl-10 pr-4 rounded-full text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-tunisbus"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <RouteTable
            routes={filteredRoutes}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default RouteManagement;
