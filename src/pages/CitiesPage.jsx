import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cityService } from '../services/cityService';
import { handleApiError } from '../lib/apiClient';
import { MapPin, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SEO } from '../components/common/SEO';

export function CitiesPage() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await cityService.getCities();
        if (response.success) {
          setCities(response.data);
        }
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };
    fetchCities();
  }, []);

  return (
    <div className="min-h-screen bg-background pb-24 pt-28 relative overflow-hidden">
      <SEO title="Cities" description="Explore private theaters across top cities in India." />
      
      {/* Subtle ambient background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <span className="inline-block text-primary/70 font-semibold tracking-[0.3em] uppercase text-xs mb-4">Locations</span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 font-heading tracking-tight">Explore <span className="text-primary">Cities</span></h1>
          <p className="text-text-muted text-lg leading-relaxed">Select your city to discover premium private theater experiences tailored for your celebrations.</p>
        </motion.div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="h-64 rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden animate-pulse">
                <div className="w-full h-full bg-white/5" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center text-error bg-error/5 rounded-2xl border border-error/10 glass max-w-2xl mx-auto">
            <p className="font-medium">{error}</p>
          </div>
        ) : cities.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 px-4 glass-card rounded-3xl border border-white/10 max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 font-heading">No cities found</h3>
            <p className="text-text-muted text-lg">We are currently expanding our locations. Check back soon!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {cities.map((city, i) => (
                <motion.div
                  key={city._id || city.slug}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                >
                  <Link 
                    to={`/theaters?city=${city._id}`}
                    className="group block relative h-64 rounded-3xl overflow-hidden border border-white/5 bg-surface hover:border-primary/40 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1"
                  >
                    {city.image?.url || city.image ? (
                      <img 
                        src={city.image?.url || city.image} 
                        alt={city.name} 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                        <MapPin className="h-12 w-12 text-white/20" />
                      </div>
                    )}
                    
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-300" />
                    
                    {/* Content */}
                    <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col items-center text-center">
                      <h3 className="text-2xl font-bold text-white font-heading tracking-wide mb-1 group-hover:text-primary transition-colors">{city.name}</h3>
                      <div className="h-0.5 w-8 bg-primary/50 rounded-full mb-3 transform origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                      <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors flex items-center gap-1">
                        View Venues
                        <svg className="w-3.5 h-3.5 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-1 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
