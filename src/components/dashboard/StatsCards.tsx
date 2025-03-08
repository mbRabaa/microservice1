
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Calendar, DollarSign, PercentCircle } from 'lucide-react';

interface StatsCardsProps {
  routesCount: number;
}

const StatsCards: React.FC<StatsCardsProps> = ({ routesCount }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card className="border shadow-sm">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Trajets totaux</p>
              <h2 className="text-3xl font-bold mt-1">{routesCount}</h2>
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
  );
};

export default StatsCards;
