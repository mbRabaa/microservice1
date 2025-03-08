
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import { TicketCheck, CreditCard, Bell, Bus } from 'lucide-react';

interface FeaturesSectionProps {
  loaded: boolean;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ loaded }) => {
  const { t } = useLanguage();

  return (
    <section id="features" className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">
            {t('home.features.title')}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <div className={cn(
            "flex flex-col items-center text-center p-6 rounded-xl hover-scale fancy-border-gradient bg-white dark:bg-slate-800",
            loaded ? "animate-fade-in" : "opacity-0",
          )} style={{ animationDelay: '100ms' }}>
            <div className="h-14 w-14 flex items-center justify-center rounded-full bg-tunisbus/10 text-tunisbus mb-4">
              <TicketCheck className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-semibold mb-3">
              {t('home.features.onlineBooking.title')}
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              {t('home.features.onlineBooking.description')}
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className={cn(
            "flex flex-col items-center text-center p-6 rounded-xl hover-scale fancy-border-gradient bg-white dark:bg-slate-800",
            loaded ? "animate-fade-in" : "opacity-0",
          )} style={{ animationDelay: '200ms' }}>
            <div className="h-14 w-14 flex items-center justify-center rounded-full bg-tunisbus/10 text-tunisbus mb-4">
              <CreditCard className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-semibold mb-3">
              {t('home.features.easyPayment.title')}
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              {t('home.features.easyPayment.description')}
            </p>
          </div>
          
          {/* Feature 3 */}
          <div className={cn(
            "flex flex-col items-center text-center p-6 rounded-xl hover-scale fancy-border-gradient bg-white dark:bg-slate-800",
            loaded ? "animate-fade-in" : "opacity-0",
          )} style={{ animationDelay: '300ms' }}>
            <div className="h-14 w-14 flex items-center justify-center rounded-full bg-tunisbus/10 text-tunisbus mb-4">
              <Bell className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-semibold mb-3">
              {t('home.features.notifications.title')}
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              {t('home.features.notifications.description')}
            </p>
          </div>
          
          {/* Feature 4 */}
          <div className={cn(
            "flex flex-col items-center text-center p-6 rounded-xl hover-scale fancy-border-gradient bg-white dark:bg-slate-800",
            loaded ? "animate-fade-in" : "opacity-0",
          )} style={{ animationDelay: '400ms' }}>
            <div className="h-14 w-14 flex items-center justify-center rounded-full bg-tunisbus/10 text-tunisbus mb-4">
              <Bus className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-semibold mb-3">
              {t('home.features.routeManagement.title')}
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              {t('home.features.routeManagement.description')}
            </p>
          </div>
        </div>
        
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="rounded-xl overflow-hidden shadow-xl fancy-border-gradient">
            <img 
              src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
              alt="Bus travel in Tunisia" 
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
