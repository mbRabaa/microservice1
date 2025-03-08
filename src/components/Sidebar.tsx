
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import { 
  Home, Gauge, MapPin, CalendarCheck, CreditCard, 
  Bell, Settings, ChevronLeft, ChevronRight, 
  Bus, LogOut
} from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import LanguageSelector from './LanguageSelector';
import { toast } from 'sonner';

type SidebarProps = {
  className?: string;
};

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const { t } = useLanguage();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleDashboardClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Si nous ne sommes pas déjà sur la page admin, ouvrir le modal de connexion
    if (location.pathname !== '/admin') {
      e.preventDefault();
      // Naviguer vers la page d'accueil
      navigate('/');
      // Ouvrir le modal de connexion après un court délai
      setTimeout(() => {
        const loginButton = document.querySelector('.border-tunisbus.text-tunisbus');
        if (loginButton) {
          (loginButton as HTMLElement).click();
        }
      }, 100);
    }
  };

  const navItems = [
    { path: '/', icon: Home, label: t('navigation.home') },
    { 
      path: '/admin', 
      icon: Gauge, 
      label: t('navigation.dashboard'),
      onClick: handleDashboardClick 
    },
    { path: '/routes', icon: MapPin, label: t('navigation.routes') },
    { path: '/reservations', icon: CalendarCheck, label: t('navigation.reservations') },
    { path: '/payments', icon: CreditCard, label: t('navigation.payments') },
    { path: '/notifications', icon: Bell, label: t('navigation.notifications') },
  ];

  const bottomNavItems = [
    { path: '/settings', icon: Settings, label: t('navigation.settings') },
  ];

  const handleLogout = () => {
    // Dans une application réelle, vous effectueriez ici la déconnexion
    toast.success(t('login.logoutSuccess'));
    navigate('/');
  };

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 h-screen z-40 transition-width duration-300 ease-in-out shadow-md bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800',
        collapsed ? 'w-20' : 'w-64',
        className
      )}
    >
      <div className="h-full flex flex-col">
        <div className={cn(
          'flex items-center p-4 border-b border-slate-200 dark:border-slate-800',
          collapsed ? 'justify-center' : 'justify-between'
        )}>
          <div className="flex items-center gap-2">
            <Bus className="h-8 w-8 text-tunisbus" />
            {!collapsed && (
              <span className="font-bold text-lg">
                {t('common.appName')}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => cn(
                    'flex items-center py-2 px-3 rounded-md transition-all hover:bg-slate-100 dark:hover:bg-slate-800',
                    isActive 
                      ? 'bg-tunisbus-light text-tunisbus dark:bg-tunisbus-dark dark:text-white font-medium' 
                      : 'text-slate-600 dark:text-slate-300',
                    collapsed ? 'justify-center' : 'gap-3'
                  )}
                  onClick={item.onClick}
                >
                  <item.icon className={cn('flex-shrink-0', collapsed ? 'h-6 w-6' : 'h-5 w-5')} />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <ul className="space-y-1 px-1 mb-4">
            {bottomNavItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => cn(
                    'flex items-center py-2 px-3 rounded-md transition-all hover:bg-slate-100 dark:hover:bg-slate-800',
                    isActive 
                      ? 'bg-tunisbus-light text-tunisbus dark:bg-tunisbus-dark dark:text-white font-medium' 
                      : 'text-slate-600 dark:text-slate-300',
                    collapsed ? 'justify-center' : 'gap-3'
                  )}
                >
                  <item.icon className={cn('flex-shrink-0', collapsed ? 'h-6 w-6' : 'h-5 w-5')} />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
          
          <div className={cn(
            'flex items-center',
            collapsed ? 'justify-center' : 'justify-between'
          )}>
            {!collapsed && <LanguageSelector />}
            <Button
              variant="ghost"
              size={collapsed ? 'icon' : 'sm'}
              className={cn(
                'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
                collapsed ? 'h-10 w-10' : 'gap-2'
              )}
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && <span>{t('common.logout')}</span>}
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
