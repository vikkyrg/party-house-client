import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, ChevronDown, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { theaterService } from '../../services/theaterService';
import { buildTheaterBookingUrl } from '../../utils/bookingFlow';

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function HeroBookingWidget() {
  const navigate = useNavigate();
  const [selectedTheater, setSelectedTheater] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [validationError, setValidationError] = useState('');

  const { data: theatersResponse } = useQuery({
    queryKey: ['theaters'],
    queryFn: () => theaterService.getTheaters(),
  });
  const theaters = theatersResponse?.data || [];

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dateInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateClick = () => {
    if (dateInputRef.current) {
      try {
        dateInputRef.current.showPicker();
      } catch (e) {
        dateInputRef.current.focus();
      }
    }
  };

  const handleBookNow = () => {
    if (!selectedTheater) {
      setValidationError('Please select a theater.');
      return;
    }

    if (!selectedDate) {
      setValidationError('Please select a date.');
      return;
    }

    setValidationError('');
    navigate(buildTheaterBookingUrl(selectedTheater, {
      date: selectedDate,
    }));
  };

  const handleBookOnCall = () => {
    window.location.href = 'tel:+918000000000';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="w-full max-w-[800px] mx-auto mt-6 bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden text-left font-sans border border-[#f0e6dd]"
    >
      <div className="p-4 md:p-6">
        <div className="space-y-3">
          <div 
            ref={dropdownRef}
            className="relative border border-[#eaddd0] rounded-xl px-4 py-2.5 flex flex-col hover:border-[#8c5211] transition-colors focus-within:border-[#8c5211] cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <label className="text-[10px] font-bold tracking-widest uppercase text-[#8c5211] mb-0.5 flex items-center gap-2 cursor-pointer pointer-events-none">
              THEATER
            </label>
            <div className="relative w-full h-[21px] flex items-center">
              <span className={`text-[14px] font-bold ${selectedTheater ? 'text-[#1a1c21]' : 'text-[#1a1c21]/60'}`}>
                {selectedTheater ? theaters.find(t => t._id === selectedTheater)?.name : 'Select a theater'}
              </span>
              <ChevronDown className={`absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c5211] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>
            
            {isDropdownOpen && (
              <div className="absolute top-[105%] left-0 w-full bg-white border border-[#eaddd0] rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] z-50 max-h-[220px] overflow-y-auto py-1">
                {theaters.length === 0 ? (
                  <div className="px-4 py-3 text-[13px] text-[#6b5c52]">Loading theaters...</div>
                ) : (
                  theaters.map((theater) => (
                    <div 
                      key={theater._id}
                      className={`px-4 py-2.5 text-[14px] font-bold cursor-pointer transition-colors hover:bg-[#fffaf5] hover:text-[#8c5211] ${selectedTheater === theater._id ? 'bg-[#fffaf5] text-[#8c5211]' : 'text-[#1a1c21]'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTheater(theater._id);
                        setValidationError('');
                        setIsDropdownOpen(false);
                      }}
                    >
                      {theater.name}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div 
            className="relative border border-[#eaddd0] rounded-xl px-4 py-2.5 flex flex-col hover:border-[#8c5211] transition-colors focus-within:border-[#8c5211] cursor-pointer"
            onClick={handleDateClick}
          >
            <label className="text-[10px] font-bold tracking-widest uppercase text-[#8c5211] mb-0.5 flex items-center gap-2 cursor-pointer pointer-events-none">
              <Calendar className="w-3 h-3" /> DATE
            </label>
            <div className="relative w-full h-[21px] flex items-center">
              {/* Custom Display Layer */}
              <div className="absolute inset-0 flex items-center pointer-events-none justify-between">
                <span className={`text-[14px] font-bold ${selectedDate ? 'text-[#1a1c21]' : 'text-[#1a1c21]/60'}`}>
                  {selectedDate ? selectedDate.split('-').reverse().join('-') : 'dd-mm-yyyy'}
                </span>
                <Calendar className="w-4 h-4 text-[#8c5211] opacity-70" />
              </div>
              
              {/* Native Input Layer */}
              <input
                ref={dateInputRef}
                type="date"
                value={selectedDate}
                min={getTodayDate()}
                onChange={(event) => {
                  setSelectedDate(event.target.value);
                  setValidationError('');
                }}
                onClick={(e) => e.stopPropagation()}
                aria-label="Select booking date"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {validationError && (
            <p className="rounded-lg border border-[#f3d0c6] bg-[#fff0ee] px-3 py-2 text-[11px] font-medium text-[#a23d2e]">
              {validationError}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          <button
            onClick={handleBookNow}
            className="bg-[#7a420b] text-white font-bold text-[15px] py-4 rounded-xl shadow-md hover:bg-[#5e3208] transition-colors flex items-center justify-center gap-2"
          >
            Book Now
          </button>

          <button
            onClick={handleBookOnCall}
            className="bg-white border-2 border-[#7a420b] text-[#7a420b] font-bold text-[15px] py-4 rounded-xl shadow-sm hover:bg-[#faf4ed] transition-colors flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" /> Book On Call
          </button>
        </div>
      </div>
    </motion.div>
  );
}
