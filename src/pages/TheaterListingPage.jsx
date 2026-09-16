import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { theaterService } from '../services/theaterService';
import { LoadingState } from '../components/common/LoadingState';
import { SEO } from '../components/common/SEO';
import { handleApiError } from '../lib/apiClient';
import { Button } from '../components/common/Button';
import { MapPin, Users, Star, IndianRupee, Search, FilterX } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { cityService } from '../services/cityService';
import { contentService } from '../services/contentService';
import { motion, AnimatePresence } from 'framer-motion';

export function TheaterListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Parse filters from URL
  const city = searchParams.get('city') || '';
  const location = searchParams.get('location') || '';
  const eventType = searchParams.get('eventType') || '';

  const { data: citiesRes } = useQuery({
    queryKey: ['cities'],
    queryFn: () => cityService.getCities(),
  });
  
  const { data: eventTypesRes } = useQuery({
    queryKey: ['eventTypes'],
    queryFn: () => contentService.getEventTypes(),
  });

  const { data: locationsRes } = useQuery({
    queryKey: ['locations', city],
    queryFn: async () => {
      const res = await fetch(`https://party-house-server.onrender.com/api/v1/locations${city ? `?city=${city}` : ''}`);
      return res.json();
    },
    enabled: !!city,
  });

  const cities = citiesRes?.data || [];
  const eventTypes = eventTypesRes?.data || [];
  const locations = locationsRes?.data || [];

  useEffect(() => {
    const fetchTheaters = async () => {
      setLoading(true);
      try {
        const params = Object.fromEntries(searchParams.entries());
        const response = await theaterService.getTheaters(params);
        if (response.success) {
          setTheaters(response.data);
        }
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };
    fetchTheaters();
  }, [searchParams]);

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters = city || location || eventType;

  return (
    <div className="min-h-screen bg-background pb-20 pt-28">
      <SEO title="Private Theaters" description="Browse and book premium private theaters for your next celebration." />
      
      <div className="container mx-auto px-4 md:px-6">
        {/* Header & Sticky Filter Bar */}
        <div className="mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-3 font-heading tracking-tight">Available Spaces</h1>
            <p className="text-text-muted text-lg">Curated premium venues for your perfect celebration</p>
          </motion.div>
          
          <div className="sticky top-20 z-40 p-4 glass-card rounded-2xl flex flex-col md:flex-row gap-4 shadow-xl shadow-black/40">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/70" />
                <select 
                  value={city} 
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-11 pr-10 text-white text-sm appearance-none focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all cursor-pointer"
                >
                  <option value="" className="bg-surface text-white">All Cities</option>
                  {cities.map(c => (
                    <option key={c._id} value={c._id} className="bg-surface">{c.name}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>

              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/70" />
                <select 
                  value={location} 
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-11 pr-10 text-white text-sm appearance-none focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!city && locations.length === 0}
                >
                  <option value="" className="bg-surface text-white">All Locations</option>
                  {locations.map(l => (
                    <option key={l._id} value={l._id} className="bg-surface">{l.name}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>

              <div className="relative">
                <Star className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/70" />
                <select 
                  value={eventType} 
                  onChange={(e) => handleFilterChange('eventType', e.target.value)}
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-11 pr-10 text-white text-sm appearance-none focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all cursor-pointer"
                >
                  <option value="" className="bg-surface text-white">All Occasions</option>
                  {eventTypes.map(eType => (
                    <option key={eType._id} value={eType._id} className="bg-surface">{eType.name}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {hasActiveFilters && (
                <motion.button
                  initial={{ opacity: 0, width: 0, padding: 0 }}
                  animate={{ opacity: 1, width: 'auto', paddingLeft: 16, paddingRight: 16 }}
                  exit={{ opacity: 0, width: 0, padding: 0 }}
                  onClick={clearFilters}
                  className="h-12 flex items-center justify-center gap-2 text-sm font-medium text-error hover:bg-error/10 border border-transparent rounded-xl transition-colors overflow-hidden whitespace-nowrap"
                >
                  <FilterX className="w-4 h-4 shrink-0" /> Clear
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden animate-pulse">
                <div className="h-64 bg-white/5" />
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-white/5 rounded w-3/4" />
                  <div className="h-4 bg-white/5 rounded w-1/2" />
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="h-4 bg-white/5 rounded" />
                    <div className="h-4 bg-white/5 rounded" />
                  </div>
                  <div className="h-12 bg-white/5 rounded-xl mt-6" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center text-error bg-error/5 rounded-2xl border border-error/10 glass">
            <p className="font-medium">{error}</p>
          </div>
        ) : theaters.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 px-4 glass-card rounded-3xl border border-white/10 max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 font-heading">No venues found</h3>
            <p className="text-text-muted mb-8 text-lg">We couldn't find any theaters matching your current filters. Try adjusting your search criteria.</p>
            <Button onClick={clearFilters} size="lg" className="h-12 px-8 font-bold">Clear All Filters</Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {theaters.map((theater, i) => (
                <motion.div 
                  key={theater._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="group relative bg-surface hover:bg-surface-hover rounded-3xl border border-white/5 hover:border-primary/30 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1"
                >
                  <div className="h-[280px] relative bg-background overflow-hidden">
                    {theater.images?.length > 0 ? (
                      <img 
                        src={theater.images[0]?.url || 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80'} 
                        alt={theater.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-text-muted bg-white/5">No Image</div>
                    )}
                    
                    {/* Dark gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                    
                    {/* Top Badges */}
                    <div className="absolute top-4 inset-x-4 flex justify-between items-start">
                      <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-white/90 border border-white/10 shadow-sm flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-primary" />
                        Up to {theater.capacity}
                      </div>
                      
                      {theater.rating && (
                        <div className="bg-primary/90 backdrop-blur-md px-2.5 py-1.5 rounded-full text-xs font-bold text-black shadow-lg shadow-black/20 flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-black" />
                          {theater.rating}
                        </div>
                      )}
                    </div>

                    {/* Bottom Info inside image */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-bold text-white mb-1.5 font-heading drop-shadow-md">{theater.name}</h3>
                      <div className="flex items-center gap-1.5 text-sm text-white/80 font-medium">
                        <MapPin className="w-4 h-4 text-primary shrink-0" />
                        <span className="truncate">{theater.location?.name || 'Location unavailable'}, {theater.city?.name || 'City unavailable'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-1">Starting from</p>
                        <div className="flex items-end gap-1">
                          <span className="text-2xl font-bold text-white leading-none">₹{theater.pricePerHour}</span>
                          <span className="text-text-muted text-sm pb-0.5">/hr</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-auto">
                      <Link 
                        to={`/theaters/${theater._id}`}
                        className="flex w-full items-center justify-center h-12 rounded-xl bg-white/5 text-white font-bold hover:bg-primary hover:text-black border border-white/10 hover:border-primary transition-all duration-300"
                      >
                        View Details & Book
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
