import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, ChevronDown, PhoneCall, Sparkles } from 'lucide-react';
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
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="w-full max-w-4xl mx-auto mt-12 bg-surface/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-6 relative text-left"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* City Select */}
        <div className="relative group">
          <label className="block text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-text-muted mb-2 px-1">City</label>
          <div className="relative">
            <select 
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setSelectedLocation('');
              }}
              className="w-full appearance-none bg-[#151515] border border-white/10 rounded-xl py-3.5 pl-4 pr-10 text-sm font-medium text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all cursor-pointer group-hover:border-white/20"
            >
              <option value="" className="bg-[#151515]">Select from {cities.length || 9} options</option>
              {cities.map(city => (
                <option key={city._id} value={city._id} className="bg-[#151515]">{city.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none group-hover:text-white transition-colors" />
          </div>
        </div>

        {/* Location Select */}
        <div className="relative group">
          <label className="block text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-text-muted mb-2 px-1">Location</label>
          <div className="relative">
            <select 
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full appearance-none bg-[#151515] border border-white/10 rounded-xl py-3.5 pl-4 pr-10 text-sm font-medium text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all cursor-pointer group-hover:border-white/20"
            >
              <option value="" className="bg-[#151515]">Choose a location</option>
              {availableLocations.map(theater => (
                <option key={theater._id} value={theater._id} className="bg-[#151515]">{theater.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none group-hover:text-white transition-colors" />
          </div>
        </div>

        {/* Date Select */}
        <div className="relative group">
          <label className="block text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-text-muted mb-2 px-1">Date</label>
          <div className="relative">
            <input 
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full appearance-none bg-[#151515] border border-white/10 rounded-xl py-3 pl-4 pr-10 text-sm font-medium text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all cursor-pointer group-hover:border-white/20 [color-scheme:dark]"
            />
            <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none group-hover:text-white transition-colors" />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <button 
          onClick={handleBookNow}
          className="flex-1 bg-primary text-background font-sans font-semibold py-4 rounded-xl hover:bg-primary-hover transition-colors shadow-[0_0_15px_rgba(255,215,0,0.15)] hover:shadow-[0_0_25px_rgba(255,215,0,0.3)]"
        >
          Book Now
        </button>
        <button 
          onClick={() => window.location.href = 'tel:+919876543210'}
          className="flex-1 bg-transparent border border-white/20 text-white font-sans font-semibold py-4 rounded-xl hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
        >
          <PhoneCall className="w-4 h-4" /> Book On Call
        </button>
      </div>

      <div className="bg-[#231505] border border-primary/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30 shadow-[0_0_10px_rgba(255,215,0,0.2)]">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-white font-sans font-bold text-lg leading-tight">218,267</p>
            <p className="text-white/80 text-xs font-sans font-medium tracking-wide">bookings completed</p>
          </div>
        </div>
        
        <div className="sm:ml-auto text-left sm:text-right relative z-10">
          <p className="text-primary text-sm font-sans font-semibold italic drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]">72 People searching right now!</p>
        </div>
      </div>
    </motion.div>
  );
}
