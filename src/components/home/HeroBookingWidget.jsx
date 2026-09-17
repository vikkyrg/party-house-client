import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, ChevronDown, PhoneCall, Sparkles, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { theaterService } from '../../services/theaterService';
import { cityService } from '../../services/cityService';

export function HeroBookingWidget() {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const { data: citiesResponse } = useQuery({
    queryKey: ['cities'],
    queryFn: () => cityService.getCities(),
  });
  const cities = citiesResponse?.data || [];

  const { data: theatersResponse } = useQuery({
    queryKey: ['theaters'],
    queryFn: () => theaterService.getTheaters(),
  });
  const theaters = theatersResponse?.data || [];

  const availableLocations = useMemo(() => {
    if (!selectedCity) return theaters;
    return theaters.filter(t => (t.city?._id === selectedCity) || (t.city === selectedCity));
  }, [theaters, selectedCity]);

  const handleBookNow = () => {
    if (selectedLocation) {
      navigate(`/theaters/${selectedLocation}`);
    } else {
      navigate(`/theaters?city=${selectedCity}`);
    }
  };

  return (
    <div className="w-full max-w-2xl mt-8">
      {/* Tabs */}
      <div className="flex gap-2">
        <button className="bg-surface-container-lowest text-on-surface font-bold text-sm px-6 py-3 rounded-t-2xl flex items-center gap-2 shadow-sm">
          <Calendar className="w-4 h-4 text-primary" /> Book a Theater
        </button>
        <button className="bg-surface-container/50 text-on-surface-variant font-semibold text-sm px-6 py-3 rounded-t-2xl flex items-center gap-2 hover:bg-surface-container transition-colors">
          <Sparkles className="w-4 h-4 text-on-surface-variant" /> Plan an Event
        </button>
        <button className="bg-surface-container/50 text-on-surface-variant font-semibold text-sm px-6 py-3 rounded-t-2xl flex items-center gap-2 hover:bg-surface-container transition-colors hidden sm:flex">
          <Users className="w-4 h-4 text-on-surface-variant" /> For Businesses
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="bg-surface-container-lowest rounded-tr-3xl rounded-b-3xl shadow-lg p-3 relative text-left w-full flex flex-col md:flex-row gap-2 border border-surface-container"
      >
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* City Select */}
          <div className="relative group bg-surface-container-low rounded-2xl p-2 px-3 border border-transparent hover:border-surface-variant transition-colors cursor-pointer">
            <label className="block font-label-sm text-[10px] font-bold tracking-widest uppercase text-on-surface-variant mb-1">City</label>
            <div className="relative">
              <select 
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setSelectedLocation('');
                }}
                className="w-full appearance-none bg-transparent text-sm font-bold text-on-surface focus:outline-none cursor-pointer"
              >
                <option value="" className="bg-surface-container-lowest text-on-surface">Bengaluru</option>
                {cities.map(city => (
                  <option key={city._id} value={city._id} className="bg-surface-container-lowest">{city.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none" />
            </div>
          </div>

          {/* Date Select */}
          <div className="relative group bg-surface-container-low rounded-2xl p-2 px-3 border border-transparent hover:border-surface-variant transition-colors cursor-pointer">
            <label className="block font-label-sm text-[10px] font-bold tracking-widest uppercase text-on-surface-variant mb-1">Date</label>
            <div className="relative">
              <input 
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full appearance-none bg-transparent text-sm font-bold text-on-surface focus:outline-none cursor-pointer placeholder:text-on-surface-variant"
                placeholder="Select date"
              />
            </div>
          </div>

          {/* People Select (Mock) */}
          <div className="relative group bg-surface-container-low rounded-2xl p-2 px-3 border border-transparent hover:border-surface-variant transition-colors cursor-pointer">
            <label className="block font-label-sm text-[10px] font-bold tracking-widest uppercase text-on-surface-variant mb-1">People</label>
            <div className="relative flex items-center justify-between">
              <span className="text-sm font-bold text-on-surface">2 - 10</span>
              <ChevronDown className="w-4 h-4 text-primary pointer-events-none" />
            </div>
          </div>
        </div>

        <button 
          onClick={handleBookNow}
          className="bg-primary text-on-primary font-bold text-sm px-8 py-3 rounded-2xl hover:bg-primary-hover transition-colors shadow-sm flex items-center justify-center gap-2 whitespace-nowrap mt-2 md:mt-0"
        >
          Find Theaters <span className="text-lg leading-none">→</span>
        </button>
      </motion.div>
    </div>
  );
}
