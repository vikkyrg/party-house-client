import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { MapPin, Users, ArrowRight, Filter, Heart, Star, ChevronDown, Monitor, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { theaterService } from '../services/theaterService';
import { cityService } from '../services/cityService';
import { getImageUrl } from '../utils/imageUtils';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { Button } from '../components/common/Button';
import { SEO } from '../components/common/SEO';

export function TheaterListingPage() {
  const [searchParams] = useSearchParams();
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '');
  const selectedDate = searchParams.get('date');
  const selectedLocation = searchParams.get('location');

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

  const { primaryTheater, otherTheaters } = useMemo(() => {
    let list = theaters;
    if (selectedCity) {
      list = theaters.filter(t => t.city?._id === selectedCity || t.city === selectedCity);
    }
    
    let primary = null;
    let others = list;

    if (selectedLocation) {
      primary = list.find(t => t._id === selectedLocation || t.location?._id === selectedLocation);
      if (primary) {
        others = list.filter(t => t._id !== primary._id);
      }
    }

    return { primaryTheater: primary, otherTheaters: others };
  }, [theaters, selectedCity, selectedLocation]);

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
            
            {/* Show Selected Search Filters */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="text-[13px] font-bold text-[#1a1c21] uppercase tracking-wide">Your Search:</span>
              {selectedCity && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f9f2eb] border border-[#ecdcd1] rounded-full text-[12px] font-bold text-[#8c5211]">
                  <MapPin className="w-3.5 h-3.5" />
                  {cities.find(c => c._id === selectedCity)?.name || 'Bengaluru'}
                </span>
              )}
              {selectedDate && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f9f2eb] border border-[#ecdcd1] rounded-full text-[12px] font-bold text-[#8c5211]">
                  <Calendar className="w-3.5 h-3.5" />
                  {selectedDate}
                </span>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-6 md:mt-0">
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

        {primaryTheater && !otherTheaters.length && (
          <div className="mb-12">
             <PrimaryTheaterCard theater={primaryTheater} selectedDate={selectedDate} />
          </div>
        )}

        {primaryTheater && otherTheaters.length > 0 && (
          <div className="mb-16">
            <PrimaryTheaterCard theater={primaryTheater} selectedDate={selectedDate} />
            <div className="mt-16 mb-8 border-b border-[#ecdcd1] pb-4">
               <h2 className="text-[24px] font-heading font-extrabold text-[#1a1c21]">Other Theaters</h2>
               <p className="text-[#6b5c52] text-[14px]">Explore more premium venues in your selected area.</p>
            </div>
          </div>
        )}

        {otherTheaters.length === 0 && !primaryTheater ? (
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
            {otherTheaters.map((theater) => (
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
                      
                      <p className="text-[#6b5c52] font-medium text-[13px] leading-[1.6] line-clamp-2 mb-6 flex-1">
                        {theater.description || "A cozy and premium theater perfect for small gatherings and special moments."}
                      </p>
                      
                      {/* Card Footer */}
                      <div className="flex items-center justify-between pt-1">
                        <Link 
                          to={`/theaters/${theater._id}${selectedDate ? `?date=${selectedDate}` : ''}`}
                          onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
                          className="w-full text-center py-2.5 rounded-xl border border-[#ecdcd1] text-[13px] font-bold text-[#8c5211] hover:bg-[#f9f2eb] transition-colors"
                        >
                          View Details & Slots
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

// Sub-component for the Primary Theater Card
function PrimaryTheaterCard({ theater, selectedDate }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-[32px] overflow-hidden shadow-lg border border-[#f4e6d9] flex flex-col lg:flex-row group"
    >
      <div className="lg:w-[55%] h-[300px] lg:h-[400px] relative overflow-hidden">
        <img 
          src={theater.images?.[0] ? getImageUrl(theater.images[0]) : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070'} 
          alt={theater.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/40"></div>
      </div>
      <div className="lg:w-[45%] p-8 lg:p-12 flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-4">
           <span className="px-3 py-1 rounded-full bg-[#f9f2eb] text-[#8c5211] text-[10px] font-extrabold uppercase tracking-widest border border-[#ecdcd1]">
             Matched Location
           </span>
        </div>
        <h2 className="text-[32px] md:text-[40px] font-heading font-extrabold text-[#1a1c21] mb-2 leading-tight">
          {theater.name}
        </h2>
        <div className="flex items-center gap-2 text-[#6b5c52] mb-6 text-[14px]">
           <MapPin className="w-4 h-4" /> {theater.city?.name || 'Bengaluru'} · {theater.location?.name || 'Premium'}
        </div>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-[#6b5c52] uppercase tracking-widest">Price</span>
            <span className="text-[24px] font-extrabold text-[#9e6223]">₹{theater.pricePerHour}/hr</span>
          </div>
          <div className="w-px h-10 bg-[#ecdcd1]"></div>
          <div className="flex flex-col">
             <span className="text-[11px] font-bold text-[#6b5c52] uppercase tracking-widest">Capacity</span>
             <span className="text-[16px] font-bold text-[#1a1c21] mt-1 flex items-center gap-1.5">
               <Users className="w-4 h-4 text-[#8c5211]" /> Up to {theater.capacity}
             </span>
          </div>
        </div>

        <p className="text-[#6b5c52] text-[15px] mb-8 line-clamp-3">
          {theater.description || "Experience cinematic perfection in our state-of-the-art private screening room. Designed for ultimate comfort and acoustic brilliance."}
        </p>

        <Link 
          to={`/theaters/${theater._id}${selectedDate ? `?date=${selectedDate}` : ''}`}
          className="inline-flex items-center justify-center bg-[#9e6223] text-white px-8 py-4 rounded-xl font-bold text-[15px] hover:bg-[#7a4b1b] transition-colors shadow-md w-full sm:w-auto"
        >
          Select Time Slot <ArrowRight className="ml-2 w-5 h-5" />
        </Link>
      </div>
    </motion.div>
  );
}
