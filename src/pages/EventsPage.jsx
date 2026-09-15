import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, PartyPopper } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { contentService } from '../services/contentService';
import { SEO } from '../components/common/SEO';

export function EventsPage() {
  const { data: eventTypesRes, isLoading, error } = useQuery({
    queryKey: ['eventTypes'],
    queryFn: () => contentService.getEventTypes(),
  });

  const eventTypes = eventTypesRes?.data || [];

  return (
    <div className="min-h-screen bg-background pb-24 pt-28 relative overflow-hidden">
      <SEO title="Celebrations & Occasions | CS Cinemas" description="Discover the perfect event type for your next gathering at our premium private theaters." />
      
      {/* Subtle ambient background glow */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <span className="inline-block text-primary/70 font-semibold tracking-[0.3em] uppercase text-xs mb-4">Occasions</span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 font-heading tracking-tight">Celebrate Your <span className="text-primary">Way</span></h1>
          <p className="text-text-muted text-lg leading-relaxed">Whether it's a romantic date, a surprise birthday, or a group screening, we have the perfect setup for you.</p>
        </motion.div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-80 rounded-3xl border border-white/5 bg-white/[0.02] overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-white/5" />
                <div className="p-6">
                  <div className="h-6 bg-white/5 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-white/5 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center text-error bg-error/5 rounded-2xl border border-error/10 glass max-w-2xl mx-auto">
            <p className="font-medium">Failed to load events. Please try again later.</p>
          </div>
        ) : eventTypes.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 px-4 glass-card rounded-3xl border border-white/10 max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <PartyPopper className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 font-heading">No events found</h3>
            <p className="text-text-muted text-lg">We are currently updating our celebration packages. Check back soon!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {eventTypes.map((event, i) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                >
                  <Link 
                    to={`/theaters?eventType=${event._id}`}
                    className="group block h-full rounded-3xl overflow-hidden border border-white/5 bg-surface hover:border-primary/40 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 flex flex-col"
                  >
                    <div className="h-56 relative bg-background overflow-hidden w-full">
                      {event.image?.url || event.image ? (
                        <img 
                          src={event.image?.url || event.image} 
                          alt={event.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                          <Calendar className="h-12 w-12 text-white/20" />
                        </div>
                      )}
                      
                      {/* Dark gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-300" />
                      
                      {event.price > 0 && (
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-primary border border-white/10 shadow-lg">
                          +₹{event.price}
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="p-8 flex flex-col flex-1 relative bg-surface">
                      <div className="absolute -top-12 inset-x-8">
                        <h3 className="text-2xl font-bold text-white font-heading tracking-wide drop-shadow-md group-hover:text-primary transition-colors">{event.name}</h3>
                      </div>
                      
                      <p className="text-text-muted text-sm leading-relaxed mb-6 mt-2 flex-1">
                        Curated experiences tailored specifically for {event.name.toLowerCase()} celebrations. Includes specialized decorations and arrangements.
                      </p>
                      
                      <div className="mt-auto">
                        <span className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-hover transition-colors">
                          Find Venues
                          <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                        </span>
                      </div>
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
