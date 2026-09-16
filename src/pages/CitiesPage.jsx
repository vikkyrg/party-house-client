import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { theaterService } from '../services/theaterService';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { SEO } from '../components/common/SEO';

export function CitiesPage() {
  const { data: response, isLoading, error, refetch } = useQuery({
    queryKey: ['theaters'],
    queryFn: () => theaterService.getTheaters(),
  });

  const theaters = response?.data || [];
  
  const citiesMap = theaters.reduce((acc, theater) => {
    const cityName = theater.city?.name || theater.city || 'Unknown';
    if (!acc[cityName]) {
      acc[cityName] = {
        name: cityName,
        image: theater.images?.[0] || 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=2064&auto=format&fit=crop',
        theaters: []
      };
    }
    acc[cityName].theaters.push(theater);
    return acc;
  }, {});

  const cities = Object.values(citiesMap);

  if (isLoading) return <LoadingState message="Loading locations..." />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

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
      <SEO title="Our Locations | CS Cinemas" />

      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl mb-16 border-b border-white/10 pb-8"
        >
          <span className="text-[10px] font-sans font-semibold tracking-[0.3em] uppercase text-primary mb-4 block">Our Locations</span>
          <h1 className="text-4xl md:text-6xl font-heading text-white">Find your cinema.</h1>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {cities.map((city, idx) => (
            <motion.div key={idx} variants={itemVariants} className="group relative overflow-hidden bg-surface border border-white/5 hover:border-primary/30 transition-colors duration-500">
              <div className="aspect-[4/5] overflow-hidden">
                <img 
                  src={city.image} 
                  alt={city.name}
                  className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110 opacity-80"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-90" />
              
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <div className="flex items-center gap-2 text-primary mb-3">
                  <MapPin className="w-4 h-4" />
                  <span className="text-xs font-sans font-bold uppercase tracking-widest">{city.theaters.length} Venues</span>
                </div>
                <h2 className="text-3xl font-heading text-white mb-4 group-hover:text-primary transition-colors">{city.name}</h2>
                
                <Link 
                  to={`/theaters?city=${city.name}`} 
                  className="inline-flex items-center gap-2 text-sm font-sans font-medium text-white hover:text-primary transition-colors opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 duration-500"
                >
                  Explore Theaters <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
