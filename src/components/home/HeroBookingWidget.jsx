import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, ChevronDown, PhoneCall, Sparkles, Users, MapPin, Building2, Phone } from 'lucide-react';
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
    const params = new URLSearchParams();
    if (selectedCity) params.append('city', selectedCity);
    if (selectedDate) params.append('date', selectedDate);

    if (selectedLocation) {
      navigate(`/book/${selectedLocation}?${params.toString()}`);
    } else {
      navigate(`/theaters?${params.toString()}`);
    }
  };

  const handleBookOnCall = () => {
    window.location.href = "tel:+918000000000"; // Placeholder phone number
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="w-full max-w-[800px] mx-auto mt-6 bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden text-left font-sans border border-[#f0e6dd]"
    >
      <div className="p-4 md:p-6">
        
        {/* Inputs Stack */}
        <div className="space-y-3">
          
          {/* City Select */}
          <div className="relative border border-[#eaddd0] rounded-xl px-4 py-2.5 flex flex-col hover:border-[#8c5211] transition-colors focus-within:border-[#8c5211]">
            <label className="text-[10px] font-bold tracking-widest uppercase text-[#8c5211] mb-0.5 flex items-center gap-2">
              <MapPin className="w-3 h-3" /> CITY
            </label>
            <div className="relative w-full">
              <select 
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setSelectedLocation('');
                }}
                className="w-full appearance-none bg-transparent text-[14px] font-bold text-[#1a1c21] focus:outline-none cursor-pointer"
              >
                <option value="">{`Select from ${cities.length} options`}</option>
                {cities.map(city => (
                  <option key={city._id} value={city._id}>{city.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c5211] pointer-events-none" />
            </div>
          </div>

          {/* Location Select */}
          <div className="relative border border-[#eaddd0] rounded-xl px-4 py-2.5 flex flex-col hover:border-[#8c5211] transition-colors focus-within:border-[#8c5211]">
            <label className="text-[10px] font-bold tracking-widest uppercase text-[#8c5211] mb-0.5 flex items-center gap-2">
              <Building2 className="w-3 h-3" /> LOCATION
            </label>
            <div className="relative w-full">
              <select 
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full appearance-none bg-transparent text-[14px] font-bold text-[#1a1c21] focus:outline-none cursor-pointer"
              >
                <option value="">Choose a location</option>
                {availableLocations.map(t => (
                  <option key={t._id} value={t._id}>{t.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c5211] pointer-events-none" />
            </div>
          </div>

          {/* Date Select */}
          <div className="relative border border-[#eaddd0] rounded-xl px-4 py-2.5 flex flex-col hover:border-[#8c5211] transition-colors focus-within:border-[#8c5211]">
            <label className="text-[10px] font-bold tracking-widest uppercase text-[#8c5211] mb-0.5 flex items-center gap-2">
              <Calendar className="w-3 h-3" /> DATE
            </label>
            <div className="relative w-full">
              <input 
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full appearance-none bg-transparent text-[14px] font-bold text-[#1a1c21] focus:outline-none cursor-pointer"
              />
            </div>
          </div>

        </div>

        {/* Action Buttons */}
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
