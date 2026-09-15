import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { theaterService } from '../services/theaterService';
import { handleApiError } from '../lib/apiClient';
import { Button } from '../components/common/Button';
import { SEO } from '../components/common/SEO';
import { MapPin, Users, Star, IndianRupee, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';

export function TheaterDetailsPage() {
  const { theaterId } = useParams();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  
  const [theater, setTheater] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedDate, setSelectedDate] = useState('');
  const [availability, setAvailability] = useState([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    const fetchTheaterDetails = async () => {
      try {
        const response = await theaterService.getTheaterById(theaterId);
        if (response.success) {
          setTheater(response.data);
        }
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };
    fetchTheaterDetails();
  }, [theaterId]);

  useEffect(() => {
    if (!selectedDate) return;
    const fetchAvailability = async () => {
      setAvailabilityLoading(true);
      setSelectedSlot(null);
      try {
        const response = await theaterService.getAvailability(theaterId, selectedDate);
        if (response.success) {
          setAvailability(response.data.slots);
        }
      } catch (err) {
        console.error('Failed to fetch availability', err);
        setAvailability([]);
      } finally {
        setAvailabilityLoading(false);
      }
    };
    fetchAvailability();
  }, [selectedDate, theaterId]);

  const handleBookNow = () => {
    if (!selectedDate || !selectedSlot) return;
    
    // Navigate to booking flow
    navigate(`/book/${theaterId}`, {
      state: { date: selectedDate, timeSlot: selectedSlot }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-20 container mx-auto px-4">
        <div className="h-[400px] bg-white/5 rounded-3xl animate-pulse mb-12" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-10 bg-white/5 rounded-lg w-1/2 animate-pulse" />
            <div className="h-24 bg-white/5 rounded-lg animate-pulse" />
          </div>
          <div className="lg:col-span-1 h-96 bg-white/5 rounded-3xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) return <div className="pt-32 pb-20 px-4 text-center"><div className="inline-block p-8 text-error bg-error/10 border border-error/20 rounded-2xl glass">{error}</div></div>;
  if (!theater) return <div className="pt-32 pb-20 px-4 text-center text-xl">Theater not found</div>;

  return (
    <div className="min-h-screen bg-background pb-24 pt-28">
      <SEO title={theater.name} description={theater.description?.substring(0, 160) || 'Book this premium private theater.'} />
      
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Title Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4 font-heading tracking-tight">{theater.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                <div className="flex items-center gap-1.5 text-white/80">
                  <MapPin className="w-4 h-4 text-primary" />
                  {theater.location?.name || 'Location unavailable'}, {theater.city?.name || 'City unavailable'}
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                <div className="flex items-center gap-1.5 text-white/80">
                  <Users className="w-4 h-4 text-primary" />
                  Up to {theater.capacity} Guests
                </div>
                {theater.rating && (
                  <>
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    <div className="flex items-center gap-1.5 text-white/80">
                      <Star className="w-4 h-4 text-primary fill-primary" />
                      {theater.rating} Rating
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Gallery Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[350px] md:h-[500px] mb-16"
        >
          <div className="md:col-span-3 h-full rounded-3xl overflow-hidden relative group cursor-pointer">
            {theater.images?.[0] ? (
              <img src={theater.images[0]?.url || 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80'} alt={theater.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            ) : (
              <div className="w-full h-full bg-white/5 flex items-center justify-center">No Image</div>
            )}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
          </div>
          <div className="hidden md:flex flex-col gap-4 h-full">
            {theater.images?.slice(1, 3).map((img, i) => (
              <div key={i} className="flex-1 rounded-3xl overflow-hidden relative group cursor-pointer">
                <img src={img?.url || img} alt={`Gallery ${i+1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
              </div>
            )) || (
              <>
                <div className="flex-1 rounded-3xl bg-white/5" />
                <div className="flex-1 rounded-3xl bg-white/5" />
              </>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Details */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* About */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="text-2xl font-bold text-white mb-6 font-heading">The Experience</h2>
              <p className="text-text-muted text-lg leading-relaxed whitespace-pre-line">
                {theater.description || "Experience a premium private theater celebration. Perfect for birthdays, anniversaries, romantic dates, and surprises. Enjoy high-quality audio and video in a beautifully decorated private space."}
              </p>
            </motion.section>

            {/* Amenities (Chips) */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h2 className="text-2xl font-bold text-white mb-6 font-heading">Premium Amenities</h2>
              <div className="flex flex-wrap gap-3">
                {(theater.amenities || ['4K Ultra HD Projector', 'Dolby Atmos Sound', 'Plush Recliner Seats', 'Climate Control AC', 'Gourmet Food Available']).map((amenity, i) => (
                  <div key={i} className="chip text-sm py-2 px-4 border-white/10 hover:border-primary/50 text-white/80 hover:text-white hover:bg-primary/5 cursor-default">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-primary" />
                    {amenity}
                  </div>
                ))}
              </div>
            </motion.section>
            
          </div>

          {/* Sticky Booking Sidebar */}
          <div className="lg:col-span-5 relative">
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.4 }}
              className="sticky top-28 glass-card border border-white/10 rounded-3xl p-8"
            >
              <div className="flex items-end gap-2 mb-8">
                <span className="text-4xl font-black text-white leading-none tracking-tight">₹{theater.pricePerHour}</span>
                <span className="text-text-muted font-medium mb-1">/ hour</span>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                    <Calendar className="w-4 h-4 text-primary" /> Select Date
                  </label>
                  <input 
                    type="date" 
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full h-12 rounded-xl border border-white/10 bg-white/5 px-4 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all [color-scheme:dark]"
                  />
                </div>

                <AnimatePresence>
                  {selectedDate && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                      <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                        <Clock className="w-4 h-4 text-primary" /> Select Time Slot
                      </label>
                      
                      {availabilityLoading ? (
                        <div className="h-24 flex items-center justify-center text-primary text-sm animate-pulse">Loading slots...</div>
                      ) : availability.length > 0 ? (
                        <div className="grid grid-cols-3 gap-3">
                          {availability.map((slot, i) => {
                            const isSelected = selectedSlot === slot.id;
                            const isAvailable = slot.available;
                            return (
                              <button
                                key={i}
                                disabled={!isAvailable}
                                onClick={() => setSelectedSlot(slot.id)}
                                className={`h-11 text-xs font-semibold rounded-xl border transition-all duration-200 ${
                                  !isAvailable 
                                    ? 'bg-white/5 border-white/5 text-white/30 cursor-not-allowed'
                                    : isSelected
                                      ? 'bg-primary border-primary text-black shadow-lg shadow-primary/25'
                                      : 'bg-transparent border-white/10 text-white hover:border-primary/50 hover:bg-white/5'
                                }`}
                              >
                                {slot.time}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl border border-white/5 bg-white/5 text-sm text-center text-white/60">
                          No slots available for this date.
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-8 pt-8 border-t border-white/10">
                <Button 
                  className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all" 
                  disabled={!selectedDate || !selectedSlot}
                  onClick={handleBookNow}
                >
                  Reserve Theater
                </Button>
                {!isAuthenticated && (
                  <p className="text-xs text-center text-text-muted mt-4">You can log in during checkout.</p>
                )}
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
