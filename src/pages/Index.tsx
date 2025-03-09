
import React, { useEffect, useState, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import LoginModal from '@/components/LoginModal';
import AvailableRoutes from '@/components/home/AvailableRoutes';
import { useNavigate } from 'react-router-dom';

const Index: React.FC = () => {
  const { locale } = useLanguage();
  const [loaded, setLoaded] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const featuresRef = useRef<HTMLDivElement>(null);
  const availableRoutesRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleOpenLoginModal = () => {
    setLoginModalOpen(true);
  };

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const scrollToRoutes = () => {
    availableRoutesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const navigateToRoutes = () => {
    navigate('/routes');
  };

  const handleLoginSuccess = () => {
    navigate('/admin');
  };

  return (
    <div className={cn("min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50", locale === 'ar' ? 'text-right' : 'text-left')}>
      {/* Header */}
      <Header 
        onOpenLoginModal={handleOpenLoginModal} 
        onAboutClick={scrollToFeatures}
        onRoutesClick={navigateToRoutes}
      />

      {/* Main content with sidebar space */}
      <div className="ml-20 lg:ml-64">
        <HeroSection loaded={loaded} />

        {/* Features Section */}
        <div ref={featuresRef} id="features">
          <FeaturesSection loaded={loaded} />
        </div>

        {/* Available Routes Section */}
        <div ref={availableRoutesRef} id="available-routes">
          <AvailableRoutes />
        </div>

        {/* Footer */}
        <Footer />
      </div>

      {/* Login Modal */}
      <LoginModal 
        open={loginModalOpen} 
        onOpenChange={setLoginModalOpen}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default Index;
