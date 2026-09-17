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
    <div className="w-full mt-8 bg-[#FAF4ED] p-2 rounded-[2rem] shadow-sm border border-[#f0e6dd]">
      {/* Tabs */}
      <div className="flex gap-2 mb-2 px-2 pt-2">
        <button className="bg-[#9e6223] text-white font-bold text-[13px] px-6 py-2.5 rounded-full flex items-center gap-2 shadow-sm transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
          Book a Theater
        </button>
        <button onClick={() => navigate('/events')} className="bg-transparent text-[#6b5c52] font-bold text-[13px] px-6 py-2.5 rounded-full flex items-center gap-2 hover:bg-[#F0E6DD] transition-colors">
          <Sparkles className="w-4 h-4" /> Plan an Event
        </button>
        <button onClick={() => navigate('/contact')} className="bg-transparent text-[#6b5c52] font-bold text-[13px] px-6 py-2.5 rounded-full flex items-center gap-2 hover:bg-[#F0E6DD] transition-colors hidden sm:flex">
          <Users className="w-4 h-4" /> For Businesses
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="bg-[#FAF4ED] rounded-[2rem] p-1 flex flex-col md:flex-row gap-2 relative text-left w-full"
      >
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-5 gap-2">
          {/* City */}
          <div className="relative group bg-[#F4EBE1] rounded-[1.5rem] p-3 px-4 flex items-center gap-3 cursor-pointer border border-transparent hover:border-[#eaddd0] transition-colors">
            <div className="flex flex-col w-full">
              <label className="block text-[9px] font-bold tracking-widest uppercase text-[#8c5211] mb-0.5">City</label>
              <div className="relative w-full">
                <select 
                  value={selectedCity}
                  onChange={(e) => {
                    setSelectedCity(e.target.value);
                    setSelectedLocation('');
                  }}
                  className="w-full appearance-none bg-transparent text-[13px] font-medium text-[#1a1c21] focus:outline-none cursor-pointer"
                >
                  <option value="" className="bg-white">Bengaluru</option>
                  {cities.map(city => (
                    <option key={city._id} value={city._id} className="bg-white">{city.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8c5211] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="relative group bg-[#F4EBE1] rounded-[1.5rem] p-3 px-4 flex items-center gap-3 cursor-pointer border border-transparent hover:border-[#eaddd0] transition-colors">
            <div className="flex flex-col w-full">
              <label className="block text-[9px] font-bold tracking-widest uppercase text-[#8c5211] mb-0.5">Location</label>
              <div className="relative w-full">
                <select 
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full appearance-none bg-transparent text-[13px] font-medium text-[#1a1c21] focus:outline-none cursor-pointer"
                >
                  <option value="" className="bg-white">Choose a location</option>
                  {availableLocations.map(t => (
                    <option key={t._id} value={t._id} className="bg-white">{t.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8c5211] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Date */}
          <div className="relative group bg-[#F4EBE1] rounded-[1.5rem] p-3 px-4 flex items-center gap-3 cursor-pointer border border-transparent hover:border-[#eaddd0] transition-colors">
            <div className="flex flex-col w-full">
              <label className="block text-[9px] font-bold tracking-widest uppercase text-[#8c5211] mb-0.5">Date</label>
              <div className="relative w-full">
                <input 
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full appearance-none bg-transparent text-[13px] font-medium text-[#1a1c21] focus:outline-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* People */}
          <div className="relative group bg-[#F4EBE1] rounded-[1.5rem] p-3 px-4 flex items-center gap-3 cursor-pointer border border-transparent hover:border-[#eaddd0] transition-colors">
            <div className="flex flex-col w-full">
              <label className="block text-[9px] font-bold tracking-widest uppercase text-[#8c5211] mb-0.5">People</label>
              <div className="relative w-full">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                  <Users className="w-3.5 h-3.5 text-[#8c5211]" />
                </div>
                <select className="w-full appearance-none bg-transparent text-[13px] font-medium text-[#1a1c21] focus:outline-none cursor-pointer pl-6">
                  <option value="2-10" className="bg-white">2 - 10</option>
                  <option value="11-20" className="bg-white">11 - 20</option>
                  <option value="21-30" className="bg-white">21 - 30</option>
                  <option value="31+" className="bg-white">31+</option>
                </select>
                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8c5211] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Experience Level */}
          <div className="relative group bg-[#F4EBE1] rounded-[1.5rem] p-3 px-4 flex items-center gap-3 cursor-pointer border border-transparent hover:border-[#eaddd0] transition-colors">
            <div className="flex flex-col w-full">
              <label className="block text-[9px] font-bold tracking-widest uppercase text-[#8c5211] mb-0.5">Experience Level</label>
              <div className="relative w-full">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                  <svg className="w-3.5 h-3.5 text-[#8c5211]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                </div>
                <select className="w-full appearance-none bg-transparent text-[13px] font-medium text-[#1a1c21] focus:outline-none cursor-pointer pl-6">
                  <option value="all" className="bg-white">All Levels</option>
                  <option value="premium" className="bg-white">Premium</option>
                  <option value="luxury" className="bg-white">Luxury</option>
                  <option value="vip" className="bg-white">VIP</option>
                </select>
                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8c5211] pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={handleBookNow}
          className="bg-[#8c5211] text-white font-bold text-[13px] px-8 py-3 rounded-[1.5rem] hover:bg-[#6b3e0d] transition-colors flex items-center justify-center gap-2 whitespace-nowrap mt-2 md:mt-0"
        >
          Find Theaters <span className="text-lg leading-none">→</span>
        </button>
      </motion.div>
    </div>
  );
}
