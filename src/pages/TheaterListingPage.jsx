import { useState, useMemo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { theaterService } from '../services/theaterService';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { SEO } from '../components/common/SEO';
import { TheaterCard } from '../components/theater/TheaterCard';

export function TheaterListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedDate = searchParams.get('date');

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

  const theaters = theatersResponse?.data || [];

  const filteredTheaters = useMemo(() => {
    let list = theaters;
    
    // Filter by active
    list = list.filter(t => t.isActive);

    return list;
  }, [theaters]);

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

      <div className="w-full mx-auto px-5 sm:px-8 lg:px-12 relative z-10 max-w-[1240px]">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-7 pb-2"
        >
          <div className="max-w-3xl mb-6 md:mb-0">
            <span className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-[#8c5211] mb-3 flex items-center gap-2">
              <span className="w-4 h-px bg-[#8c5211]"></span> SELECT YOUR THEATRE
            </span>
            <h1 className="text-[34px] md:text-[42px] font-heading text-[#17171c] font-extrabold leading-[1.05] mb-2">
              Choose Your Perfect <span className="text-[#a9651c]">Theatre</span>
            </h1>
            
            <p className="text-[#6b5c52] text-[13px] font-medium mb-3">
               Premium private theatres for your special moments.
            </p>

            {/* Show Selected Search Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[11px] font-bold text-[#17171c] uppercase tracking-wide">Browse available theaters</span>
              {selectedDate && (
                <div 
                  onClick={handleOpenDatePicker}
                  className="relative inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#fffaf5] border border-[#ead9ca] rounded-full text-[11px] font-bold text-[#8c5211] cursor-pointer hover:bg-[#f2efe9] transition-colors overflow-hidden group"
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

          <div className="hidden md:block" />
        </motion.div>

        {!selectedDate && (
           <div className="mb-6 p-3.5 rounded-2xl bg-[#fff9d9] border border-[#eadb91] text-[#80651a] text-[12px] font-bold flex items-center gap-3">
             <Calendar className="w-4 h-4 text-[#a17d17]" />
             Please select a date from the Home page search or the filters to view available time slots.
           </div>
        )}

        {filteredTheaters.length === 0 ? (
           <div className="bg-[#fffaf5] rounded-[24px] p-16 text-center shadow-sm border border-[#ead9ca]">
            <h3 className="text-[22px] font-heading text-[#17171c] font-bold mb-4">No venues found</h3>
            <p className="text-[#6b5c52] font-medium text-[14px] mb-8">We couldn't find any theaters matching your criteria.</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-[#9e6223] text-white px-6 py-2.5 rounded-full font-bold text-[13px]"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="mb-4 flex justify-between items-center border-b border-[#ead9ca] pb-3">
             <h2 className="text-[16px] font-heading font-extrabold text-[#17171c]">
               {filteredTheaters.length} private theatre{filteredTheaters.length !== 1 ? 's' : ''} available
             </h2>
          </div>
        )}

        {filteredTheaters.length > 0 && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-[1040px] mb-16"
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
