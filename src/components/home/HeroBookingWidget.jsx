import { useState } from 'react';
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
          <div className="relative border border-[#eaddd0] rounded-xl px-4 py-2.5 flex flex-col hover:border-[#8c5211] transition-colors focus-within:border-[#8c5211]">
            <label className="text-[10px] font-bold tracking-widest uppercase text-[#8c5211] mb-0.5 flex items-center gap-2">
              THEATER
            </label>
            <div className="relative w-full">
              <select
                value={selectedTheater}
                onChange={(event) => {
                  setSelectedTheater(event.target.value);
                  setValidationError('');
                }}
                className="w-full appearance-none bg-transparent text-[14px] font-bold text-[#1a1c21] focus:outline-none cursor-pointer"
              >
                <option value="">Select a theater</option>
                {theaters.map((theater) => (
                  <option key={theater._id} value={theater._id}>{theater.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c5211] pointer-events-none" />
            </div>
          </div>

          <div className="relative border border-[#eaddd0] rounded-xl px-4 py-2.5 flex flex-col hover:border-[#8c5211] transition-colors focus-within:border-[#8c5211]">
            <label className="text-[10px] font-bold tracking-widest uppercase text-[#8c5211] mb-0.5 flex items-center gap-2">
              <Calendar className="w-3 h-3" /> DATE
            </label>
            <div className="relative w-full">
              <input
                type="date"
                value={selectedDate}
                min={getTodayDate()}
                onChange={(event) => {
                  setSelectedDate(event.target.value);
                  setValidationError('');
                }}
                aria-label="Select booking date"
                className="w-full appearance-none bg-transparent text-[14px] font-bold text-[#1a1c21] focus:outline-none cursor-pointer"
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
