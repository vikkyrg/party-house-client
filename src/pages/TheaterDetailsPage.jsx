import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Users, Info, ArrowLeft, Calendar, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { theaterService } from '../services/theaterService';
import { bookingService } from '../services/bookingService';
import { getImageUrl } from '../utils/imageUtils';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { SEO } from '../components/common/SEO';

export function TheaterDetailsPage() {
  const { theaterId } = useParams();
  // Ensure we check both id and theaterId depending on router config, though it's likely theaterId now
  const id = theaterId || useParams().id; 
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [selectedDate, setSelectedDate] = useState(searchParams.get('date') || '');
  const [slotsData, setSlotsData] = useState([]);
  const [fetchingSlots, setFetchingSlots] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [slotError, setSlotError] = useState('');

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['theater', id],
    queryFn: () => theaterService.getTheaterById(id),
    enabled: !!id,
  });

  const theater = response?.data;

  useEffect(() => {
    if (selectedDate && id) {
      setFetchingSlots(true);
      setSelectedTimeSlot('');
      setSlotError('');
      bookingService.checkAvailability(id, selectedDate)
        .then(res => {
          if (res.success) {
            const allSlots = [...res.data.availableSlots, ...res.data.bookedSlots];
            const structured = allSlots.map(s => ({
              id: s,
              time: s,
              available: res.data.availableSlots.includes(s)
            })).sort((a, b) => a.time.localeCompare(b.time));
            setSlotsData(structured);
          }
        })
        .catch(err => {
          setSlotError('Failed to fetch availability.');
        })
        .finally(() => {
          setFetchingSlots(false);
        });
    } else {
      setSlotsData([]);
      setSelectedTimeSlot('');
    }
  }, [selectedDate, id]);

  const handleContinueBooking = () => {
    if (!selectedDate || !selectedTimeSlot) {
      setSlotError('Please select a date and time slot to continue.');
      return;
    }
    const params = new URLSearchParams();
    params.append('date', selectedDate);
    params.append('slot', selectedTimeSlot);
    navigate(`/book/${id}?${params.toString()}`);
  };

  if (isLoading) return <LoadingState message="Opening doors..." />;
  if (error) return <ErrorState error={error} />;
  if (!theater) return <div className="text-center py-20 text-[#1a1c21] font-heading">Venue not found.</div>;

  return (
    <div className="min-h-screen bg-[#FCF5EB] pt-32 pb-24 font-sans text-[#6b5c52]">
      <SEO title={`${theater.name} | CS Cinemas`} />

      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-[11px] font-bold text-[#8c5211] hover:text-[#5e370b] transition-colors uppercase tracking-widest bg-white border border-[#ecdcd1] px-4 py-1.5 rounded-full shadow-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Theaters
          </button>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-7 space-y-10"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-heading text-[#1a1c21] font-extrabold mb-4">{theater.name}</h1>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f9f2eb] text-[#8c5211] text-[11px] uppercase tracking-widest font-bold border border-[#ecdcd1]">
                  <MapPin className="w-3.5 h-3.5" /> {theater.city?.name || 'Bengaluru'}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#1a1c21] text-[11px] uppercase tracking-widest font-bold border border-[#ecdcd1]">
                  <Users className="w-3.5 h-3.5 text-[#8c5211]" /> Up to {theater.capacity} guests
                </span>
              </div>
            </div>

            <div className="aspect-video bg-[#f9f2eb] overflow-hidden rounded-[24px] relative shadow-md border border-[#ecdcd1]">
              <img 
                src={theater.images?.[0] ? getImageUrl(theater.images[0]) : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070'} 
                alt={theater.name} 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="prose prose-lg max-w-none">
              <h2 className="text-[24px] font-heading text-[#1a1c21] font-bold mb-4">About this space</h2>
              <p className="text-[#6b5c52] font-medium leading-relaxed text-[15px]">
                {theater.description || 'Experience cinematic perfection in our state-of-the-art private screening room. Designed for ultimate comfort and acoustic brilliance, this space is ideal for private premieres, romantic date nights, and exclusive gatherings.'}
              </p>
            </div>

            {theater.features && theater.features.length > 0 && (
              <div className="border-t border-[#ecdcd1] pt-8">
                <h2 className="text-[24px] font-heading text-[#1a1c21] font-bold mb-6">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {theater.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[#1a1c21] font-bold text-[14px]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#8c5211]" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Sticky Booking/Availability Sidebar */}
          <div className="lg:col-span-5 relative">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="sticky top-32 bg-white p-8 md:p-8 rounded-[32px] border border-[#ecdcd1] shadow-[0_20px_60px_rgba(0,0,0,0.06)]"
            >
              <div className="mb-6 pb-6 border-b border-[#ecdcd1] flex justify-between items-end">
                <div>
                   <p className="font-label-sm text-[11px] font-bold tracking-widest uppercase text-[#8c5211] mb-2">Reservation Base</p>
                   <div className="flex items-end gap-1">
                     <span className="text-[32px] font-heading text-[#1a1c21] font-extrabold leading-none">₹{theater.pricePerHour}</span>
                     <span className="text-[#6b5c52] text-[14px] font-medium mb-1">/hr</span>
                   </div>
                </div>
              </div>

              {/* Step 1: Select Date */}
              <div className="mb-6">
                <label className="mb-2 block text-[13px] font-bold text-[#1a1c21] uppercase tracking-wide flex items-center gap-2">
                   <Calendar className="w-4 h-4 text-[#8c5211]" /> Select Date
                </label>
                <input 
                  type="date" 
                  min={new Date().toISOString().split('T')[0]}
                  value={selectedDate} 
                  onChange={(e) => setSelectedDate(e.target.value)} 
                  className="h-12 w-full rounded-xl border border-[#ecdcd1] bg-[#F9F6F0] px-4 text-[#1a1c21] font-medium outline-none transition focus:border-[#8c5211] focus:ring-1 focus:ring-[#8c5211]/20 cursor-pointer" 
                />
              </div>

              {/* Step 2: Select Slot */}
              <div className="mb-8 min-h-[150px]">
                <label className="mb-3 block text-[13px] font-bold text-[#1a1c21] uppercase tracking-wide flex items-center gap-2">
                   <Clock className="w-4 h-4 text-[#8c5211]" /> Select Time
                </label>
                
                {!selectedDate ? (
                   <div className="text-[13px] text-[#6b5c52] p-4 bg-[#F9F6F0] rounded-xl border border-dashed border-[#ecdcd1] text-center">
                     Please select a date to view available time slots.
                   </div>
                ) : fetchingSlots ? (
                   <div className="text-[13px] text-[#8c5211] font-bold text-center py-6">Checking availability...</div>
                ) : slotsData.length === 0 ? (
                   <div className="text-[13px] text-error p-4 bg-error/5 rounded-xl border border-error/20 text-center font-medium">
                     No slots configured for this theater.
                   </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {slotsData.map(slot => (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => { setSelectedTimeSlot(slot.time); setSlotError(''); }}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          !slot.available 
                            ? 'opacity-40 bg-gray-50 border-gray-200 cursor-not-allowed line-through' 
                            : selectedTimeSlot === slot.time
                              ? 'border-[#8c5211] bg-[#f9f2eb] shadow-sm ring-2 ring-[#8c5211]'
                              : 'border-[#ecdcd1] hover:border-[#8c5211] bg-white'
                        }`}
                      >
                        <div className={`text-[12px] font-bold ${!slot.available ? 'text-gray-500' : selectedTimeSlot === slot.time ? 'text-[#8c5211]' : 'text-[#1a1c21]'}`}>
                          {slot.time}
                        </div>
                        <div className="text-[10px] mt-1 uppercase font-bold tracking-wider">
                          {!slot.available ? <span className="text-error">Full</span> : <span className="text-success">Available</span>}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                
                {slotError && (
                  <p className="mt-3 text-[12px] font-bold text-error">{slotError}</p>
                )}
              </div>

              {/* Summary & CTA */}
              <div className="pt-6 border-t border-[#ecdcd1]">
                {selectedDate && selectedTimeSlot ? (
                  <div className="mb-4 p-4 rounded-xl bg-[#f9f2eb] border border-[#ecdcd1]">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#8c5211] mb-1">Your Selection</p>
                    <p className="text-[14px] font-bold text-[#1a1c21]">{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'})}</p>
                    <p className="text-[14px] font-bold text-[#1a1c21]">{selectedTimeSlot}</p>
                  </div>
                ) : null}

                <button 
                  onClick={handleContinueBooking}
                  disabled={!selectedDate || !selectedTimeSlot}
                  className={`w-full flex items-center justify-center py-4 rounded-xl font-bold text-[15px] transition-all shadow-sm ${
                    !selectedDate || !selectedTimeSlot
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-[#9e6223] text-white hover:bg-[#7a4b1b]'
                  }`}
                >
                  Continue Booking <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
