import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Search, Grid, List, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';
import { theaterService } from '../services/theaterService';
import { getImageUrl } from '../utils/imageUtils';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { SEO } from '../components/common/SEO';

export function CitiesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: response, isLoading, error, refetch } = useQuery({
    queryKey: ['theaters'],
    queryFn: () => theaterService.getTheaters(),
  });

  const theaters = response?.data || [];
  
  const citiesMap = theaters.reduce((acc, theater) => {
    const cityName = theater.city?.name || theater.city || 'Unknown';
    if (!acc[cityName]) {
      acc[cityName] = {
        _id: theater.city?._id || theater.city,
        name: cityName,
        image: theater.images?.[0] || 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=2064&auto=format&fit=crop',
        theaters: []
      };
    }
    acc[cityName].theaters.push(theater);
    return acc;
  }, {});

  const cities = Object.values(citiesMap);
  
  const filteredCities = cities.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCityName = (name) => {
    if (!name) return '';
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const getCitySubtitle = (cityName) => {
    const formattedName = formatCityName(cityName);
    const subtitles = {
      'Bengaluru': 'The cinema capital for unforgettable moments.',
      'Chennai': 'Where movies meet the coastline.',
      'Hyderabad': 'Bigger screens, bolder celebrations.',
      'Mumbai': 'A cinematic experience like no other.',
      'Delhi': 'Premium private cinemas in the capital.',
      'Kolkata': 'Classic stories, modern experiences.',
    };
    return subtitles[formattedName] || `Explore private cinemas in ${formattedName}.`;
  };

  if (isLoading) return <LoadingState message="Loading locations..." />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#FCF5EB] pt-32 pb-24 relative overflow-hidden font-sans">
      <SEO title="Our Locations | CS Cinemas" />

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

      {/* Background Film Strip SVG (Bottom Left) */}
      <div className="absolute bottom-10 -left-20 pointer-events-none overflow-hidden w-[600px] h-[600px] z-0 opacity-40">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
          <g transform="translate(0, 600)">
            <circle cx="0" cy="0" r="550" fill="none" stroke="#eaddd0" strokeWidth="50" />
            <circle cx="0" cy="0" r="535" fill="none" stroke="#FAF4ED" strokeWidth="12" strokeDasharray="15 15" />
            <circle cx="0" cy="0" r="565" fill="none" stroke="#FAF4ED" strokeWidth="12" strokeDasharray="15 15" />
          </g>
        </svg>
      </div>

      {/* Left Cursive Logo Overlap */}
      <div className="absolute top-1/2 -left-4 -translate-y-1/2 pointer-events-none z-10 hidden xl:block">
         <div className="font-[cursive] text-[32px] text-[#c2a290] leading-[1.1] transform -rotate-12 opacity-80 pl-8">
           More <br/> Than <br/> Movies
         </div>
      </div>

      <div className="w-full mx-auto px-6 sm:px-12 lg:px-20 xl:px-24 2xl:px-32 relative z-10 max-w-[1920px]">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8"
        >
          {/* Title & Subtitle */}
          <div className="max-w-2xl xl:pl-16">
            <span className="font-sans text-[11px] font-bold tracking-[0.15em] uppercase text-[#8c5211] mb-4 block">
              OUR LOCATIONS
            </span>
            <h1 className="text-[40px] md:text-[56px] font-heading text-[#1a1c21] font-extrabold leading-[1.1] mb-4">
              Find your <span className="bg-gradient-to-r from-[#d18428] to-[#991c4d] bg-clip-text text-transparent">cinema.</span>
            </h1>
            <p className="text-[14px] md:text-[15px] font-medium text-[#6b5c52] leading-[1.6]">
              Experience private cinemas in your city. Choose a location to explore theaters, amenities and special offers.
            </p>
          </div>

          {/* Controls Panel */}
          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
             
             {/* Search Bar */}
             <div className="relative flex-1 sm:min-w-[280px]">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MapPin className="w-4 h-4 text-[#8c5211]" />
                </div>
                <input 
                  type="text"
                  placeholder="Search city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#FCF5EB] border border-[#ecdcd1] rounded-full pl-11 pr-11 py-3 text-[13px] font-medium text-[#1a1c21] focus:outline-none focus:border-[#8c5211] placeholder:text-[#a6998f]"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-[#8c5211] opacity-80" />
                </div>
             </div>

             {/* View Toggles */}
             <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#9e6223] text-white hover:bg-[#7a4b1b] transition-colors shadow-sm">
                  <Grid className="w-4 h-4" />
                  <span className="text-[13px] font-bold">Grid</span>
                </button>
                <button className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#f4e6d9] text-[#9e6223] hover:bg-[#e4cdbb] transition-colors shadow-sm">
                  <List className="w-4 h-4" />
                  <span className="text-[13px] font-bold">List</span>
                </button>
             </div>
          </div>
        </motion.div>

        {/* Grid Container */}
        {filteredCities.length === 0 ? (
          <div className="bg-white rounded-[32px] p-16 text-center shadow-sm xl:ml-16">
            <h3 className="text-[22px] font-heading text-[#1a1c21] font-bold mb-4">No cities found</h3>
            <p className="text-[#6b5c52] font-medium text-[14px] mb-8">Try adjusting your search criteria.</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="bg-[#9e6223] text-white px-6 py-2.5 rounded-full font-bold text-[13px]"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-6 xl:pl-16"
          >
            {filteredCities.map((city, idx) => (
              <motion.div key={idx} variants={itemVariants} className="group relative h-full">
                
                <Link to={`/theaters?city=${city._id}`} className="block h-full">
                  <div className="flex flex-col h-full bg-white rounded-[28px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 border border-[#f0e6dd]">
                    
                    {/* Image Section (Top Half) */}
                    <div className="relative h-[220px] w-full overflow-hidden bg-[#1a1c21] shrink-0">
                      <img 
                        src={getImageUrl(city.image)} 
                        alt={city.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      
                      {/* Top Left Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white font-sans text-[11px] font-bold text-[#1a1c21] shadow-sm">
                          <svg className="w-3.5 h-3.5 text-[#8c5211]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.5v5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5v-5"/><path d="M4 14.5A2.5 2.5 0 0 1 6.5 12h11a2.5 2.5 0 0 1 2.5 2.5"/><path d="M8 12V7a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v5"/><path d="M12 9v3"/></svg>
                          {city.theaters.length}+ Theaters
                        </span>
                      </div>
                    </div>

                    {/* Content Section (Bottom Half - White) */}
                    <div className="p-6 flex flex-col flex-1">
                      <h2 className="text-[22px] md:text-[24px] font-heading text-[#1a1c21] font-bold leading-tight mb-2 group-hover:text-[#9e6223] transition-colors">
                        {formatCityName(city.name)}
                      </h2>
                      <p className="text-[13px] font-medium text-[#6b5c52] leading-relaxed line-clamp-2 mb-6">
                        {getCitySubtitle(city.name)}
                      </p>
                      
                      {/* Bottom action row */}
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-[#f0e6dd]">
                         <span className="flex items-center gap-2 text-[13px] font-bold text-[#8c5211] group-hover:text-[#9e6223] transition-colors">
                           Explore <ArrowRight className="w-4 h-4" />
                         </span>
                         <div className="w-9 h-9 rounded-full bg-[#9e6223] text-white flex items-center justify-center shrink-0 shadow-sm group-hover:bg-[#d18428] transition-colors">
                           <ArrowRight className="w-4 h-4" />
                         </div>
                      </div>
                    </div>

                  </div>
                </Link>

              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
