
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
      {/* Header */}
      <Header onOpenLoginModal={handleOpenLoginModal} />

      {/* Hero Section */}
      <HeroSection loaded={loaded} />

      {/* Features Section */}
      <FeaturesSection loaded={loaded} />

      {/* Footer */}
      <Footer />

      {/* Login Modal */}
      <LoginModal 
        open={loginModalOpen} 
        onOpenChange={setLoginModalOpen}
      />
    </div>
  );
};

export default Index;
