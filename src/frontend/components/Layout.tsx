
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';

type LayoutProps = {
  children: React.ReactNode;
  className?: string;
};

const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  
  // Listen for custom event from Sidebar component
  useEffect(() => {
    const handleSidebarToggle = (e: CustomEvent) => {
      setIsSidebarCollapsed(e.detail.collapsed);
    };
    
    window.addEventListener('sidebarToggle' as any, handleSidebarToggle);
    
    return () => {
      window.removeEventListener('sidebarToggle' as any, handleSidebarToggle);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      <Sidebar />
      <main className={cn(
        'flex-1 min-h-screen transition-all duration-300 ease-in-out',
        isSidebarCollapsed ? 'ml-20' : 'ml-64',
        className
      )}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
