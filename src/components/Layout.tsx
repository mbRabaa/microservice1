
import React from 'react';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';

type LayoutProps = {
  children: React.ReactNode;
  className?: string;
};

const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <main className={cn('ml-20 lg:ml-64 min-h-screen p-4 md:p-6 transition-all', className)}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
