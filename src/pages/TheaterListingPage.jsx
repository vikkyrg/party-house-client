import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { MapPin, Users, ArrowRight, Filter, Heart, Star, ChevronDown, Monitor, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { theaterService } from '../services/theaterService';
import { cityService } from '../services/cityService';
import { getImageUrl } from '../utils/imageUtils';
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
    <div className="min-h-screen bg-[#FCF5EB] pt-32 pb-24 relative overflow-hidden font-sans text-[#6b5c52]">
      <SEO title="Our Premium Theaters | CS Cinemas" />

      {/* Background Film Strip SVG (Top Right) */}
      <div className="absolute top-0 right-0 pointer-events-none overflow-hidden w-[600px] h-[600px] z-0 opacity-40">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
          <g transform="translate(600, 0)">
            <circle cx="0" cy="0" r="550" fill="none" stroke="#eaddd0" strokeWidth="50" />
            <circle cx="0" cy="0" r="535" fill="none" stroke="#FAF4ED" strokeWidth="12" strokeDasharray="15 15" />
            <circle cx="0" cy="0" r="565" fill="none" stroke="#FAF4ED" strokeWidth="12" strokeDasharray="15 15" />
          </g>
        </svg>
      </div>

      {/* Background Film Strip SVG (Bottom Right) */}
      <div className="absolute bottom-10 right-0 pointer-events-none overflow-hidden w-full h-[300px] z-0 opacity-40">
         <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1000 300">
          <g transform="translate(1000, 300)">
            <circle cx="0" cy="0" r="700" fill="none" stroke="#eaddd0" strokeWidth="50" />
            <circle cx="0" cy="0" r="685" fill="none" stroke="#FAF4ED" strokeWidth="12" strokeDasharray="15 15" />
            <circle cx="0" cy="0" r="715" fill="none" stroke="#FAF4ED" strokeWidth="12" strokeDasharray="15 15" />
          </g>
        </svg>
      </div>

      <div className="w-full mx-auto px-6 sm:px-12 lg:px-20 xl:px-24 relative z-10 max-w-[1920px]">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 pb-4"
        >
          <div className="max-w-3xl mb-8 md:mb-0">
            <span className="font-sans text-[11px] font-bold tracking-[0.15em] uppercase text-[#8c5211] mb-4 flex items-center gap-2">
              <span className="w-4 h-[2px] bg-[#8c5211] rounded-full"></span> HANDPICKED LOCATIONS
            </span>
            <h1 className="text-[36px] md:text-[54px] font-heading text-[#1a1c21] font-extrabold leading-[1.1] mb-4">
              Top Bangalore <span className="bg-gradient-to-r from-[#d18428] to-[#991c4d] bg-clip-text text-transparent">Theaters.</span>
            </h1>
            <p className="text-[14px] md:text-[15px] font-medium text-[#6b5c52]">
              Premium private cinemas across Bangalore for unforgettable celebrations.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 md:gap-4">
             {/* Filter 1 */}
             <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MapPin className="w-4 h-4 text-[#8c5211]" />
                </div>
                <select 
                  className="appearance-none bg-[#FCF5EB] border border-[#ecdcd1] rounded-full pl-10 pr-10 py-2.5 text-[13px] font-bold text-[#1a1c21] focus:outline-none focus:border-[#8c5211] cursor-pointer"
                >
                  <option>Bangalore</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-[#8c5211] opacity-70" />
                </div>
             </div>

             {/* Filter 2 */}
             <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Filter className="w-4 h-4 text-[#8c5211]" />
                </div>
                <select 
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="appearance-none bg-[#f4e6d9] border border-[#ecdcd1] rounded-full pl-10 pr-10 py-2.5 text-[13px] font-bold text-[#1a1c21] focus:outline-none focus:border-[#8c5211] cursor-pointer"
                >
                  <option value="">All Locations</option>
                  {cities.map(city => (
                    <option key={city._id} value={city._id}>{city.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-[#8c5211] opacity-70" />
                </div>
             </div>
          </div>
        </motion.div>

        {filteredTheaters.length === 0 ? (
           <div className="bg-white rounded-[32px] p-16 text-center shadow-sm">
            <h3 className="text-[22px] font-heading text-[#1a1c21] font-bold mb-4">No venues found</h3>
            <p className="text-[#6b5c52] font-medium text-[14px] mb-8">We couldn't find any theaters matching your criteria.</p>
            <button 
              onClick={() => setSelectedCity('')}
              className="bg-[#9e6223] text-white px-6 py-2.5 rounded-full font-bold text-[13px]"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8 mb-16"
          >
            {filteredTheaters.map((theater, idx) => (
              <motion.div key={theater._id} variants={itemVariants} className="group relative">
                  <div className="bg-white rounded-[28px] overflow-hidden shadow-sm border border-[#f4e6d9] flex flex-col h-full hover:shadow-md transition-shadow duration-300">
                    
                    {/* Card Image Section */}
                    <div className="h-[220px] overflow-hidden relative">
                      <img 
                        src={theater.images?.[0] ? getImageUrl(theater.images[0]) : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070'} 
                        alt={theater.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                      
                      {/* Top Left Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1.5 rounded-full bg-white font-sans text-[9px] font-extrabold text-[#1a1c21] tracking-widest uppercase shadow-sm">
                          {theater.city?.name || 'BENGALURU'}
                        </span>
                      </div>


                    </div>
                    
                    {/* Card Content Section */}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <h3 className="text-[20px] font-heading font-extrabold text-[#1a1c21] truncate">
                          {theater.name}
                        </h3>
                        <span className="text-[15px] font-extrabold text-[#9e6223] shrink-0">
                          ₹{theater.pricePerHour}/hr
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-4 flex-wrap">
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f9f2eb] text-[11px] font-bold text-[#8c5211]">
                          <Users className="w-3.5 h-3.5" /> Up to {theater.capacity} Guests
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f9f2eb] text-[11px] font-bold text-[#8c5211]">
                          <Monitor className="w-3.5 h-3.5" /> {theater.features?.[0] || 'Dolby Atmos'}
                        </span>
                      </div>
                      
                      <p className="text-[#6b5c52] font-medium text-[13px] leading-[1.6] line-clamp-2 mb-6 flex-1">
                        {theater.description || "A cozy and premium theater perfect for small gatherings and special moments."}
                      </p>
                      
                      {/* Card Footer */}
                      <div className="flex items-center justify-between pt-1">
                        <Link 
                          to={`/book/${theater._id}`}
                          onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
                          className="text-[13px] font-bold text-[#8c5211] hover:text-[#5e370b] transition-colors"
                        >
                          View Details <ArrowRight className="inline-block w-4 h-4 ml-1 relative -top-[1px]" />
                        </Link>
                        
                        <Link 
                           to={`/book/${theater._id}`}
                           onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
                           className="w-8 h-8 rounded-full bg-[#9e6223] text-white flex items-center justify-center hover:bg-[#7a4b1b] transition-colors"
                        >
                           <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
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
