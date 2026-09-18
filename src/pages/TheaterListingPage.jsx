import { useState, useMemo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Filter, ChevronDown, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { theaterService } from '../services/theaterService';
import { cityService } from '../services/cityService';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { SEO } from '../components/common/SEO';
import { TheaterCard } from '../components/theater/TheaterCard';

export function TheaterListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '');
  const selectedDate = searchParams.get('date');
  const selectedLocation = searchParams.get('location');

  const [selectedBooking, setSelectedBooking] = useState({ theaterId: null, slotId: null });
  const dateInputRef = useRef(null);

  const handleOpenDatePicker = () => {
    if (dateInputRef.current && dateInputRef.current.showPicker) {
      dateInputRef.current.showPicker();
    } else if (dateInputRef.current) {
      dateInputRef.current.focus();
    }
  };

  const handleDateChange = (newDate) => {
    setSelectedBooking({ theaterId: null, slotId: null });
    const params = new URLSearchParams(searchParams);
    if (newDate) {
      params.set('date', newDate);
    } else {
      params.delete('date');
    }
    setSearchParams(params);
  };

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
    let list = theaters;
    
    // Filter by active
    list = list.filter(t => t.isActive);

    if (selectedCity) {
      list = list.filter(t => t.city?._id === selectedCity || t.city === selectedCity);
    }
    
    // We optionally can sort to bring the specifically requested location to the top
    if (selectedLocation) {
      list.sort((a, b) => {
        const aIsLoc = a._id === selectedLocation || a.location?._id === selectedLocation;
        const bIsLoc = b._id === selectedLocation || b.location?._id === selectedLocation;
        if (aIsLoc && !bIsLoc) return -1;
        if (!aIsLoc && bIsLoc) return 1;
        return 0;
      });
    }

    return list;
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
            
            <p className="text-[#6b5c52] text-[15px] font-medium mb-4">
               Premium private cinemas across Bangalore for unforgettable celebrations.
            </p>

            {/* Show Selected Search Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[13px] font-bold text-[#1a1c21] uppercase tracking-wide">Your Search:</span>
              {selectedCity && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f9f2eb] border border-[#ecdcd1] rounded-full text-[12px] font-bold text-[#8c5211]">
                  <MapPin className="w-3.5 h-3.5" />
                  {cities.find(c => c._id === selectedCity)?.name || 'Bengaluru'}
                </span>
              )}
              {selectedDate && (
                <div 
                  onClick={handleOpenDatePicker}
                  className="relative inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f9f2eb] border border-[#ecdcd1] rounded-full text-[12px] font-bold text-[#8c5211] cursor-pointer hover:bg-[#f2efe9] transition-colors overflow-hidden group"
                  title="Click to change date"
                >
                  <input 
                    ref={dateInputRef}
                    type="date"
                    value={selectedDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="absolute invisible w-0 h-0"
                  />
                  <Calendar className="w-3.5 h-3.5" />
                  {selectedDate}
                </div>
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

        {!selectedDate && (
           <div className="mb-8 p-4 rounded-2xl bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm font-bold flex items-center gap-3">
             <Calendar className="w-5 h-5 text-yellow-600" />
             Please select a date from the Home page search or the filters to view available time slots.
           </div>
        )}

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
          <div className="mb-6 flex justify-between items-center border-b border-[#ecdcd1] pb-4">
             <h2 className="text-[20px] font-heading font-extrabold text-[#1a1c21]">
               {filteredTheaters.length} private theater{filteredTheaters.length !== 1 ? 's' : ''} {selectedCity ? `in ${cities.find(c => c._id === selectedCity)?.name || 'your area'}` : 'available'}
             </h2>
          </div>
        )}

        {filteredTheaters.length > 0 && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 xl:gap-10 mb-16"
          >
            {filteredTheaters.map((theater) => (
              <motion.div key={theater._id} variants={itemVariants}>
                 <TheaterCard 
                   theater={theater}
                   selectedDate={selectedDate}
                   selectedBooking={selectedBooking}
                   onSelectBooking={setSelectedBooking}
                   onDateChange={handleDateChange}
                 />
              </motion.div>
            ))}
          </motion.div>
        )}

      </div>
    </div>
  );
}
