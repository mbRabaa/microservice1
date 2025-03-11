
import React from 'react';

const HeroBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
      <div className="absolute top-20 right-10 w-64 h-64 bg-tunisbus/10 rounded-full filter blur-3xl animate-pulse-light"></div>
      <div className="absolute bottom-10 left-20 w-72 h-72 bg-tunisbus/5 rounded-full filter blur-3xl animate-pulse-light" style={{ animationDelay: '2s' }}></div>
    </div>
  );
};

export default HeroBackground;
