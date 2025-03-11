
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import { getRoutes, BusRoute } from '@/frontend/utils/data';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

// Import the new components
import HeroBackground from './hero/HeroBackground';
import HeroTitle from './hero/HeroTitle';
import SearchForm from './hero/SearchForm';
import SearchResults from './hero/SearchResults';
import CtaButton from './hero/CtaButton';

interface HeroSectionProps {
  loaded: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ loaded }) => {
  const { t } = useLanguage();
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [searchResults, setSearchResults] = useState<BusRoute[]>([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    // Validate search inputs
    if (!departure) {
      toast.error(t('admin.form.selectDeparture'));
      return;
    }
    
    if (!destination) {
      toast.error(t('admin.form.selectDestination'));
      return;
    }
    
    // Filter routes based on search criteria
    const allRoutes = getRoutes();
    const filtered = allRoutes.filter(route => 
      route.departure.toLowerCase() === departure.toLowerCase() &&
      route.destination.toLowerCase() === destination.toLowerCase() &&
      (!date || new Date(route.date).toDateString() === date.toDateString())
    );
    
    if (filtered.length === 0) {
      toast.info(t('routes.noResults'));
      setShowResults(false);
    } else {
      setSearchResults(filtered);
      setShowResults(true);
      
      // Scroll to the results
      setTimeout(() => {
        const resultsSection = document.getElementById('search-results');
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };
  
  const handleViewAllRoutes = () => {
    navigate('/routes');
  };

  return (
    <div>
      <section className="pt-32 pb-24 relative overflow-hidden">
        <HeroBackground />
        
        <div className="container mx-auto px-4 relative z-10">
          <HeroTitle loaded={loaded} />

          <div className={cn(
            "max-w-3xl mx-auto relative glass-card rounded-2xl p-6 shadow-lg fancy-border-gradient mb-10",
            loaded ? "animate-fade-in" : "opacity-0",
            "transition-all duration-500 ease-out"
          )} style={{ animationDelay: '300ms' }}>
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-tunisbus/20 rounded-full filter blur-xl"></div>
            
            <SearchForm 
              departure={departure}
              setDeparture={setDeparture}
              destination={destination}
              setDestination={setDestination}
              date={date}
              setDate={setDate}
              handleSearch={handleSearch}
            />
          </div>
            
          <CtaButton onClick={handleViewAllRoutes} />
        </div>
      </section>

      {showResults && <SearchResults searchResults={searchResults} />}
    </div>
  );
};

export default HeroSection;
