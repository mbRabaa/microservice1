
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import WeeklyStats from '@/components/WeeklyStats';

const WeeklyStatsCard: React.FC = () => {
  return (
    <Card className="mb-8 border shadow-sm">
      <CardHeader>
        <CardTitle>Statistiques hebdomadaires</CardTitle>
      </CardHeader>
      <CardContent>
        <WeeklyStats />
      </CardContent>
    </Card>
  );
};

export default WeeklyStatsCard;
