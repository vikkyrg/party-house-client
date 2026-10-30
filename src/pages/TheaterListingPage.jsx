import { useState, useMemo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { theaterService } from '../services/theaterService';
import { CinemaFilmStripLoader } from '../components/theater/CinemaFilmStripLoader';
import { ErrorState } from '../components/common/ErrorState';
import { SEO } from '../components/common/SEO';
import { TheaterCard } from '../components/theater/TheaterCard';

import { getKolkataTodayString } from '../utils/dateUtils';

export function TheaterListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedDate = searchParams.get('date');

  const [selectedBooking, setSelectedBooking] = useState({ theaterId: null, slotId: null });
  const [isAnimationFinished, setIsAnimationFinished] = useState(false);
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

  const {
    data: theatersResponse,
    isLoading: isLoadingTheaters,
    error: theatersError,
    refetch: refetchTheaters,
  } = useQuery({
    queryKey: ['theaters'],
    queryFn: () => theaterService.getTheaters(),
  });

  const theaters = theatersResponse?.data || [];

  const filteredTheaters = useMemo(() => {
    let list = theaters;
    
    // Filter by active
    list = list.filter(t => t.isActive);

    return list;
  }, [theaters]);

  // If there's an error and not loading, show the ErrorState with retry button
  if (theatersError && !isLoadingTheaters) {
    return (
      <div className="min-h-screen bg-[#fcf5eb] pt-28 pb-20 flex items-center justify-center">
        <ErrorState error={theatersError} onRetry={refetchTheaters} />
      </div>
    );
  }

  // Display cinema film-strip progress bar until API request finishes AND animation reaches 100%
  if (isLoadingTheaters || !isAnimationFinished) {
    return (
      <div className="min-h-screen bg-[#fcf5eb] pt-28 pb-20 flex items-center justify-center">
        <CinemaFilmStripLoader
          isLoading={isLoadingTheaters}
          onComplete={() => setIsAnimationFinished(true)}
          error={theatersError}
        />
      </div>
    );
  }

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
    <div className="min-h-screen bg-[#fcf5eb] pt-28 pb-20 relative overflow-hidden font-sans text-[#6b5c52]">
      <SEO title="Our Premium Theaters | RIO PARTY HOUSE" />

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

      <div className="container mx-auto px-4 relative z-10">
        {/* Header & Filter Controls */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#ebdcd0] pb-8">
          <div>
            <span className="text-[#8c5211] font-bold text-xs uppercase tracking-widest block mb-2">
              Private Cinema Experiences
            </span>
            <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-[#17171c] tracking-tight">
              Our Theaters
            </h1>
            <p className="mt-2 text-[#6b5c52] text-sm md:text-base max-w-xl">
              Choose your private theater room and time slot to celebrate your special moments.
            </p>
          </div>

          {/* Quick Date Selector */}
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-[#ebdcd0] shadow-sm">
            <button 
              type="button"
              onClick={handleOpenDatePicker}
              className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#8c5211] bg-[#fcf5eb] hover:bg-[#f4e6d9] rounded-xl transition-colors cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>{selectedDate ? new Date(selectedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Select Date'}</span>
            </button>
            <input 
              ref={dateInputRef}
              type="date" 
              value={selectedDate || ''} 
              min={getKolkataTodayString()}
              onChange={(e) => handleDateChange(e.target.value)}
              className="opacity-0 w-0 h-0 pointer-events-none absolute"
            />
            {selectedDate && (
              <button
                type="button"
                onClick={() => handleDateChange('')}
                className="text-[11px] font-bold text-slate-400 hover:text-rose-600 px-2 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Theaters List */}
        {filteredTheaters.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#ebdcd0] p-8 shadow-sm">
            <h3 className="text-lg font-bold text-[#17171c]">No theaters available</h3>
            <p className="text-xs text-[#6b5c52] mt-1">Please check back later or contact customer support.</p>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-10"
          >
            {filteredTheaters.map((theater) => (
              <motion.div key={theater._id} variants={itemVariants}>
                <TheaterCard 
                  theater={theater} 
                  selectedDate={selectedDate}
                  selectedBooking={selectedBooking}
                  setSelectedBooking={setSelectedBooking}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default TheaterListingPage;
