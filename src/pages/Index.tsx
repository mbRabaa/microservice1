
import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import LoginModal from '@/components/LoginModal';

const Index: React.FC = () => {
  const { locale } = useLanguage();
  const [loaded, setLoaded] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleOpenLoginModal = () => {
    setLoginModalOpen(true);
  };

  return (
    <div className={cn("min-h-screen", locale === 'ar' ? 'text-right' : 'text-left')}>
      {/* Header avec Sidebar */}
      <Header onOpenLoginModal={handleOpenLoginModal} />

      {/* Hero Section - ajusté pour prendre en compte le Sidebar */}
      <div className="ml-20 lg:ml-64">
        <HeroSection loaded={loaded} />

        {/* Features Section */}
        <FeaturesSection loaded={loaded} />

        {/* Footer */}
        <Footer />
      </div>

      {/* Login Modal */}
      <LoginModal 
        open={loginModalOpen} 
        onOpenChange={setLoginModalOpen}
      />
    </div>
  );
};

export default Index;
