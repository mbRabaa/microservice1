
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useLanguage } from '@/context/LanguageContext';

const data = [
  { name: 'Lun', reservations: 120, revenue: 2500 },
  { name: 'Mar', reservations: 145, revenue: 3100 },
  { name: 'Mer', reservations: 135, revenue: 2800 },
  { name: 'Jeu', reservations: 180, revenue: 3800 },
  { name: 'Ven', reservations: 210, revenue: 4500 },
  { name: 'Sam', reservations: 190, revenue: 4000 },
  { name: 'Dim', reservations: 160, revenue: 3400 },
];

const WeeklyStats: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">{t('admin.reservationsChart')}</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorReservations" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="reservations" 
                stroke="#8884d8" 
                fillOpacity={1} 
                fill="url(#colorReservations)" 
                name={t('admin.reservations')}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">{t('admin.revenueChart')}</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} DT`, t('admin.revenue')]} />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#82ca9d" 
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
                name={t('admin.revenue')}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default WeeklyStats;
