import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { MapPin, Users, ArrowRight, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { theaterService } from '../services/theaterService';
import { cityService } from '../services/cityService';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { Button } from '../components/common/Button';
import { SEO } from '../components/common/SEO';

export function TheaterListingPage() {
  const [selectedCity, setSelectedCity] = useState('');

  const { data: theatersResponse, isLoading: isLoadingTheaters, error: theatersError } = useQuery({
    queryKey: ['theaters'],
    queryFn: () => theaterService.getTheaters(),
  });

  const { data: citiesResponse } = useQuery({
    queryKey: ['cities'],
    queryFn: () => cityService.getCities(),
  });

  const theaters = theatersResponse?.data || [];
  const cities = citiesResponse?.data || [];

  const filteredTheaters = useMemo(() => {
    if (!selectedCity) return theaters;
    return theaters.filter(t => t.city?._id === selectedCity || t.city === selectedCity);
  }, [theaters, selectedCity]);

  if (isLoadingTheaters) return <LoadingState message="Preparing venues..." />;
  if (theatersError) return <ErrorState error={theatersError} />;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <SEO title="Our Premium Theaters | CS Cinemas" />

      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b border-white/10 pb-8"
        >
          <div className="max-w-2xl mb-8 md:mb-0">
            <span className="text-[10px] font-sans font-semibold tracking-[0.3em] uppercase text-primary mb-4 block">Venues</span>
            <h1 className="text-4xl md:text-6xl font-heading text-white">Find your screen.</h1>
          </div>

          <div className="flex items-center gap-4 text-sm font-sans text-text-muted">
            <Filter className="w-4 h-4" />
            <select 
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent border-b border-white/20 pb-1 text-white focus:outline-none focus:border-primary cursor-pointer uppercase tracking-widest text-xs"
            >
              <option value="" className="bg-surface">All Locations</option>
              {cities.map(city => (
                <option key={city._id} value={city._id} className="bg-surface">{city.name}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {filteredTheaters.length === 0 ? (
          <div className="bg-surface border border-white/5 p-16 text-center">
            <h3 className="text-2xl font-heading text-white mb-4">No venues found</h3>
            <p className="text-text-muted font-sans mb-8">We couldn't find any theaters matching your criteria.</p>
            <Button onClick={() => setSelectedCity('')}>Clear Filters</Button>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid gap-12 md:gap-16"
          >
            {filteredTheaters.map((theater, idx) => (
              <motion.div key={theater._id} variants={itemVariants} className="group relative">
                <div className="grid md:grid-cols-2 gap-8 items-center bg-surface border border-white/5 p-4 md:p-8 hover:border-primary/30 transition-colors duration-500">
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img 
                      src={theater.images?.[0] || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070'} 
                      alt={theater.name}
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-background/20" />
                  </div>
                  
                  <div className="flex flex-col justify-center h-full p-4 md:p-8">
                    <div className="flex items-center gap-2 text-primary mb-4">
                      <MapPin className="w-4 h-4" />
                      <span className="text-xs font-sans font-bold uppercase tracking-widest">
                        {theater.city?.name || 'Bengaluru'}
                      </span>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-heading text-white mb-4 group-hover:text-primary transition-colors">
                      {theater.name}
                    </h2>
                    
                    <div className="flex items-center gap-6 mb-8 text-sm font-sans text-text-muted">
                      <span className="flex items-center gap-2">
                        <Users className="w-4 h-4" /> Up to {theater.capacity} guests
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="font-heading italic">₹{theater.pricePerHour}/hr</span>
                      </span>
                    </div>
                    
                    <Button asChild className="w-fit">
                      <Link to={`/theaters/${theater._id}`}>
                        View Details <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
