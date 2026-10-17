import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { contentService } from '../services/contentService';
import { bookingService } from '../services/bookingService';
import { paymentService } from '../services/paymentService';
import { theaterService } from '../services/theaterService';
import { roomService } from '../services/roomService';
import { useAuthStore } from '../store/authStore';
import { LoadingState } from '../components/common/LoadingState';
import { BookingStepper } from '../components/booking/BookingStepper';
import { handleApiError } from '../lib/apiClient';
import { Check, ArrowLeft, ArrowRight, ShieldCheck, MapPin, Calendar, Clock, Edit, AlertCircle, Users, Sparkles, Cake as CakeIcon, Gift } from 'lucide-react';
import { PaymentModal } from '../components/booking/PaymentModal';
import { SEO } from '../components/common/SEO';
import { calculateBookingTotal } from '../utils/bookingCalculator';
import { getImageUrl, handleImageError } from '../utils/imageUtils';
import { useCakes } from '../hooks/useCakes';
import { getRoomPriceForDuration } from '../utils/dateUtils';

const STEPS = [
  { id: 'details', title: 'Guest Details' },
  { id: 'occasion', title: 'Occasion' },
  { id: 'cakes', title: 'Cakes' },
  { id: 'addons', title: 'Add-ons' },
  { id: 'review', title: 'Review & Pay' }
];

export function BookingPage() {
  const { theaterId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const { user, setGuestDetails } = useAuthStore();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [theater, setTheater] = useState(null);
  const [eventTypes, setEventTypes] = useState([]);
  const [addons, setAddons] = useState([]);
  
  // Get date and slot from URL
  const selectedDate = searchParams.get('date');
  const selectedTimeSlot = searchParams.get('slot');
  const selectedTimeSlotId = searchParams.get('slotId');
  const durationStr = searchParams.get('duration');
  const duration = parseInt(durationStr, 10) || 2;
  const roomId = searchParams.get('roomId');
  const [room, setRoom] = useState(null);
  
  const displayTimeSlot = selectedTimeSlot;

  const [selectedEventType, setSelectedEventType] = useState('');
  const [selectedCake, setSelectedCake] = useState(null); // { cakeId, size }
  const [cakeCategory, setCakeCategory] = useState('standard');
  const [selectedAddons, setSelectedAddons] = useState({}); 

  const [customerDetails, setCustomerDetails] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    members: 1,
    kids: 0,
    specialRequest: ''
  });

  const { data: cakesData } = useCakes();
  const cakesList = cakesData?.data || [];
  const visibleCakes = cakesList.filter((cake) => (cake.category || 'standard') === cakeCategory && cake.isActive !== false);

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);
  
  useEffect(() => {
    if (!roomId || !selectedDate || !selectedTimeSlot) {
      // If accessed without date/slot, redirect to theater details to force selection
      navigate(`/theaters/${theaterId}`);
      return;
    }

    const fetchData = async () => {
      try {
        const [theaterRes, roomRes, eventsRes, addonsRes] = await Promise.all([
          theaterService.getTheaterById(theaterId),
          roomService.getRoom(roomId),
          contentService.getEventTypes(),
          contentService.getAddons()
        ]);
        
        if (theaterRes.success) setTheater(theaterRes.data);
        if (roomRes?.success && roomRes.data) setRoom(roomRes.data);
        if (eventsRes.success) setEventTypes(eventsRes.data);
        if (addonsRes.success) setAddons(addonsRes.data);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [theaterId, roomId, selectedDate, selectedTimeSlot, navigate]);

  const handleAddonToggle = (addonId) => {
    setSelectedAddons(prev => {
      const next = { ...prev };
      if (next[addonId]) {
        delete next[addonId];
      } else {
        next[addonId] = { quantity: 1 };
      }
      return next;
    });
  }; 
  
  const {
    theaterPrice,
    cakePrice,
    addOnsTotal,
    subtotal,
    advanceAmount,
    balanceAmount,
    processedCake,
    processedAddons
  } = useMemo(() => {
    const currentPrice = getRoomPriceForDuration(room, duration);
      
    return calculateBookingTotal(
      room ? { ...theater, price: currentPrice } : theater,
      eventTypes.find(e => e._id === selectedEventType), 
      selectedCake,
      cakesList,
      selectedAddons, 
      addons
    );
  }, [theater, room, customerDetails.members, eventTypes, selectedEventType, selectedCake, cakesList, selectedAddons, addons, selectedDate, duration]);

  const validateStep = () => {
    if (currentStep === 1) { // Guest Details
      if (!customerDetails.name?.trim()) {
        setError('Please provide your full name.');
        return false;
      }
      const rawPhone = (customerDetails.phone || '').trim().replace(/[\s\-()]/g, '').replace(/^(\+91|91|0)/, '');
      if (!rawPhone || !/^\d{10}$/.test(rawPhone)) {
        setError('Please enter a valid 10-digit mobile number (e.g. 9876543210).');
        return false;
      }
      if (!customerDetails.email?.trim()) {
        setError('Please provide your email address for the booking receipt.');
        return false;
      }
      if (Number(customerDetails.members) > Number(room?.maximumMembers)) {
        setError(`Maximum ${room.maximumMembers} members allowed for this room.`);
        return false;
      }
    }
    if (currentStep === 2 && !selectedEventType) { // Occasion
      setError('Please select an occasion for your celebration.');
      return false;
    }
    if (currentStep === 5 && !termsAccepted) { // Review & Pay
      setError('You must accept the terms and conditions to proceed.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep === 1) {
        setGuestDetails({ name: customerDetails.name, phone: customerDetails.phone, email: customerDetails.email });
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setCurrentStep(p => Math.min(p + 1, STEPS.length));
    }
  };
  
  const handleBack = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStep(p => Math.max(p - 1, 1));
  };

  const handleCreateBooking = async () => {
    if (!validateStep()) return;

    setSubmitting(true);
    setError(null);
    try {
      const cleanedPhone = (customerDetails.phone || '').trim().replace(/[\s\-()]/g, '').replace(/^(\+91|91|0)/, '');



      // Single Booking flow
      // Real-time re-check availability before single booking
      const availRes = await bookingService.checkAvailability(theaterId, selectedDate, roomId);
      if (availRes.success) {
        if (!availRes.data.availableSlots.includes(selectedTimeSlot)) {
           setError('This slot is no longer available. Please choose another time.');
           setSubmitting(false);
           return;
        }
      }

      const payload = {
        theaterId,
        locationId: theater?.location?._id || theater?.location,
        roomId,
        date: selectedDate,
        bookingDate: selectedDate,
        duration,
        timeSlot: selectedTimeSlot,
        timeSlotId: selectedTimeSlotId || undefined,
        eventTypeId: selectedEventType,
        cake: selectedCake ? {
          cakeId: selectedCake.cakeId,
          size: selectedCake.size
        } : null,
        addOns: Object.entries(selectedAddons).map(([id, selection]) => ({ 
          id, 
          quantity: selection.quantity || 1
        })),
        customerDetails: {
          ...customerDetails,
          phone: cleanedPhone || customerDetails.phone,
        }
      };
      
      const bookingRes = await bookingService.createBooking(payload);
      if (bookingRes.success) {
        const bookingRecord = bookingRes.data;
        setCreatedBooking(bookingRecord);
        // Open professional QR payment modal
        setIsPaymentModalOpen(true);
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const groupedAddons = useMemo(() => {
    return addons.reduce((acc, addon) => {
      const cat = addon.category || 'Other';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(addon);
      return acc;
    }, {});
  }, [addons]);

  if (loading) return <LoadingState />;

  const theaterImage = theater?.images?.length ? getImageUrl(theater.images[0]) : null;
  const roomImage = room?.image ? getImageUrl(room.image) : theaterImage;

  return (
    <div className="min-h-screen bg-[#fcf5eb] pb-16 pt-24 relative overflow-x-clip font-sans flex flex-col">
      <SEO title="Complete Booking | RIO PARTY HOUSE" />

      {/* Subtle cinema backdrop kept behind the booking interface. */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-[#252b59] via-[#b94d5c] to-[#f0a11b]" />
        <div className="absolute -left-24 top-16 hidden xl:block -rotate-12 opacity-[0.1]">
          <svg width="360" height="760" viewBox="0 0 100 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 0V400 M85 0V400" stroke="#8c5211" strokeWidth="4" />
            <path d="M5 0V400 M95 0V400" stroke="#8c5211" strokeWidth="4" strokeDasharray="8 8" />
            <rect x="25" y="20" width="50" height="40" stroke="#8c5211" strokeWidth="2" />
            <rect x="25" y="80" width="50" height="40" stroke="#8c5211" strokeWidth="2" />
            <rect x="25" y="140" width="50" height="40" stroke="#8c5211" strokeWidth="2" />
            <rect x="25" y="200" width="50" height="40" stroke="#8c5211" strokeWidth="2" />
            <rect x="25" y="260" width="50" height="40" stroke="#8c5211" strokeWidth="2" />
            <rect x="25" y="320" width="50" height="40" stroke="#8c5211" strokeWidth="2" />
          </svg>
        </div>
        <div className="absolute -right-10 top-12 hidden xl:block rotate-12 text-right font-[cursive] text-[5rem] leading-[0.82] text-[#a9651c] opacity-[0.2]">
          More<br />Than<br />Movies
        </div>
        <div className="absolute bottom-8 left-8 hidden xl:block font-sans text-[9px] font-bold uppercase tracking-[0.24em] text-[#b28a68] opacity-60">
          Private cinema experiences
        </div>
        <div className="absolute bottom-8 right-8 hidden xl:block font-sans text-[9px] font-bold uppercase tracking-[0.24em] text-[#b28a68] opacity-60">
          Celebrate · Watch · Create memories
        </div>
      </div>
      
      <div className="container relative z-10 mx-auto max-w-[1340px] px-4 md:px-6 flex flex-col lg:flex-row items-start gap-6">
        
        {/* Main Content Area */}
        <div className="flex-1">
          
          {/* Booking Context Header */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-3 md:p-4 bg-[#fffaf5] border border-[#ead9ca] rounded-[18px] shadow-[0_4px_18px_rgba(75,43,20,0.06)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                {roomImage ? (
                  <img src={roomImage} alt={room?.name || theater?.name} onError={handleImageError} className="h-14 w-20 shrink-0 rounded-lg object-cover object-center border border-[#ead9ca]" />
                ) : (
                  <div className="h-14 w-20 shrink-0 rounded-lg bg-[#f4e7da] border border-[#ead9ca]" aria-hidden="true" />
                )}
                <div className="min-w-0">
                  <h2 className="text-[17px] font-heading font-extrabold text-[#17171c] truncate">
                    {theater?.name} · {room?.name}
                  </h2>
                  <div className="text-[11px] font-bold text-[#8c5211] mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {theater?.city?.name || 'Bengaluru'} · {theater?.name}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {selectedTimeSlot}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button onClick={() => navigate(`/theaters/${theaterId}`)} className="px-3.5 py-2 bg-[#f9f2eb] hover:bg-[#f4e6d9] text-[#8c5211] text-[11px] font-bold rounded-full transition border border-[#ead9ca] flex items-center justify-center gap-1.5 w-full sm:w-auto whitespace-nowrap">
                  Change Theater / Time
                </button>
              </div>
          </motion.div>

          <div className="mb-6">
            <BookingStepper steps={STEPS} currentStep={currentStep} />
          </div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-8 overflow-hidden">
                <div className="flex items-center gap-3 rounded-2xl border border-error/20 bg-error/10 p-4 text-error">
                  <div className="h-2.5 w-2.5 rounded-full bg-error" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-[#fffaf5] rounded-[24px] border border-[#ead9ca] p-5 shadow-[0_8px_30px_rgba(75,43,20,0.06)] md:p-8">
            <AnimatePresence mode="wait">
              <motion.div key={currentStep} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.2, ease: 'easeOut' }}>
                
                {/* STEP 1: DETAILS */}
                {currentStep === 1 && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="mb-2 text-[22px] font-bold text-[#17171c] font-heading">Guest details</h2>
                      <p className="text-[14px] text-[#6b5c52]">
                        {room?.couple ? `Couple: ${room.couple} · ` : ''}Maximum Members: {room?.maximumMembers} · ₹{getRoomPriceForDuration(room, duration)} / {duration} Hour{duration > 1 ? 's' : ''}
                      </p>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="mb-2 block text-[11px] font-bold text-[#17171c] uppercase tracking-wide">Full Name *</label>
                        <input type="text" value={customerDetails.name} onChange={(e) => setCustomerDetails((prev) => ({ ...prev, name: e.target.value }))} placeholder="John Doe" className="h-11 w-full rounded-full border border-[#ead9ca] bg-[#f9f6f0] px-4 text-[13px] text-[#17171c] font-medium outline-none transition focus:border-[#a9651c] focus:ring-1 focus:ring-[#a9651c]/20 placeholder:text-[#a6998f]" />
                      </div>

                      <div className="grid gap-5 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-[11px] font-bold text-[#17171c] uppercase tracking-wide">
                            Phone Number (10 Digits) *
                          </label>
                          <input
                            type="tel"
                            maxLength={10}
                            value={customerDetails.phone}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                              setCustomerDetails((prev) => ({ ...prev, phone: val }));
                            }}
                            placeholder="e.g. 9876543210"
                            className="h-11 w-full rounded-full border border-[#ead9ca] bg-[#f9f6f0] px-4 text-[13px] text-[#17171c] font-medium outline-none transition focus:border-[#a9651c] focus:ring-1 focus:ring-[#a9651c]/20 placeholder:text-[#a6998f]"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-[11px] font-bold text-[#17171c] uppercase tracking-wide">Email Address</label>
                          <input type="email" value={customerDetails.email} onChange={(e) => setCustomerDetails((prev) => ({ ...prev, email: e.target.value }))} placeholder="For booking receipt" className="h-11 w-full rounded-full border border-[#ead9ca] bg-[#f9f6f0] px-4 text-[13px] text-[#17171c] font-medium outline-none transition focus:border-[#a9651c] focus:ring-1 focus:ring-[#a9651c]/20 placeholder:text-[#a6998f]" />
                        </div>
                      </div>
                      
                      <div className="grid gap-5 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-[11px] font-bold text-[#17171c] uppercase tracking-wide">Number of Members *</label>
                          <input type="number" min="1" value={customerDetails.members} onChange={(e) => setCustomerDetails((prev) => ({ ...prev, members: e.target.value }))} className="h-11 w-full rounded-full border border-[#ead9ca] bg-[#f9f6f0] px-4 text-[13px] text-[#17171c] font-medium outline-none transition focus:border-[#a9651c] focus:ring-1 focus:ring-[#a9651c]/20" />
                        </div>
                        <div>
                          <label className="mb-2 block text-[11px] font-bold text-[#17171c] uppercase tracking-wide">Number of Kids</label>
                          <input type="number" min="0" value={customerDetails.kids} onChange={(e) => setCustomerDetails((prev) => ({ ...prev, kids: e.target.value }))} className="h-11 w-full rounded-full border border-[#ead9ca] bg-[#f9f6f0] px-4 text-[13px] text-[#17171c] font-medium outline-none transition focus:border-[#a9651c] focus:ring-1 focus:ring-[#a9651c]/20" />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-[11px] font-bold text-[#17171c] uppercase tracking-wide">Special Requests</label>
                        <textarea value={customerDetails.specialRequest} onChange={(e) => setCustomerDetails((prev) => ({ ...prev, specialRequest: e.target.value }))} placeholder="Any setup or décor notes..." className="h-24 w-full resize-none rounded-2xl border border-[#ead9ca] bg-[#f9f6f0] p-4 text-[13px] text-[#17171c] font-medium outline-none transition focus:border-[#a9651c] focus:ring-1 focus:ring-[#a9651c]/20 placeholder:text-[#a6998f]" />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: OCCASION */}
                {currentStep === 2 && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="mb-2 text-[24px] font-bold text-[#1a1c21] font-heading">Select occasion</h2>
                      <p className="text-[14px] text-[#6b5c52]">Choose what you’re celebrating.</p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                      {eventTypes.map((type) => (
                        <button
                          key={type._id}
                          onClick={() => { setSelectedEventType(type._id); setError(null); }}
                          className={`relative overflow-hidden rounded-2xl border text-left transition-all duration-300 h-48 group ${
                            selectedEventType === type._id
                              ? 'border-[#8c5211] shadow-md ring-2 ring-[#8c5211]'
                              : 'border-[#ecdcd1] hover:shadow-lg'
                          }`}
                        >
                          <img src={getImageUrl(type.image)} alt={type.name} onError={handleImageError} className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                          <div className="absolute bottom-0 left-0 w-full p-4">
                            <span className="text-lg font-bold text-white block drop-shadow-md">{type.name}</span>
                          </div>
                          {selectedEventType === type._id && (
                            <div className="absolute top-3 right-3 bg-[#8c5211] text-white rounded-full p-1 shadow-md">
                              <Check className="h-4 w-4" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 3: CAKES */}
                {currentStep === 3 && (
                  <div className="space-y-8">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                      <div>
                        <h2 className="mb-2 text-[24px] font-bold text-[#1a1c21] font-heading">Select Cake</h2>
                        <p className="text-[14px] text-[#6b5c52]">Choose a cake for your celebration (optional).</p>
                      </div>
                      
                      <div className="inline-flex items-center rounded-full border border-[#ead9ca] bg-[#fffaf5] p-1 shadow-sm">
                        {[['standard', 'Standard Cakes'], ['premium', 'Premium Cakes']].map(([category, label]) => (
                          <button
                            key={category}
                            type="button"
                            onClick={() => setCakeCategory(category)}
                            className={`relative rounded-full px-5 py-2 text-[13px] font-bold transition-all duration-300 ${cakeCategory === category ? 'text-white' : 'text-[#8c5211] hover:text-[#a9651c]'}`}
                          >
                            {cakeCategory === category && (
                              <motion.div layoutId="cakeCategoryBg" className="absolute inset-0 rounded-full bg-[#a9651c] shadow-md" />
                            )}
                            <span className="relative z-10">{label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedCake(null)}
                      className={`group relative flex w-full items-center justify-between overflow-hidden rounded-2xl border px-4 py-3 text-left transition-all duration-300 ${!selectedCake ? 'border-[#a9651c] bg-[#fffaf5] shadow-[0_0_0_2px_rgba(169,101,28,0.2)]' : 'border-[#ead9ca] bg-white hover:border-[#a9651c] hover:bg-[#fffaf5]'}`}
                    >
                      <div className="flex items-center gap-3 relative z-10">
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${!selectedCake ? 'bg-[#a9651c]/10 text-[#a9651c]' : 'bg-[#fcf5eb] text-[#8c5211]'}`}>
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2">
                          <span className="text-[14px] font-bold text-[#1a1c21]">No Cake</span>
                          <span className="text-[12px] text-[#6b5c52]">Skip cake selection</span>
                        </div>
                      </div>
                      <div className={`relative z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${!selectedCake ? 'border-[#a9651c] bg-[#a9651c]' : 'border-[#ead9ca] bg-transparent group-hover:border-[#a9651c]'}`}>
                        {!selectedCake && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                      </div>
                    </button>

                    {!visibleCakes.length ? (
                      <div className="rounded-[24px] border border-dashed border-[#ecdcd1] bg-[#faf8f5] p-10 text-center">
                        <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-[#fcf5eb] flex items-center justify-center text-[#a9651c]">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="text-[15px] font-bold text-[#1a1c21] mb-1">No {cakeCategory} cakes available</p>
                        <p className="text-[13px] text-[#6b5c52]">Please check back later or try another category.</p>
                      </div>
                    ) : (
                      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {visibleCakes.map(cake => {
                          const isSelected = selectedCake?.cakeId === cake._id;
                          const cakeSizes = cake.sizes || [];
                          
                          return (
                            <div key={cake._id} className={`group relative flex flex-col overflow-hidden rounded-[20px] border transition-all duration-300 ${isSelected ? 'border-[#a9651c] bg-[#fffaf5] shadow-[0_0_0_1px_rgba(169,101,28,0.3)] z-10' : 'border-[#ead9ca] bg-white hover:border-[#a9651c]/60 hover:shadow-md'}`}>
                              
                              <div className="relative aspect-[4/3] w-full overflow-hidden bg-white">
                                {getImageUrl(cake.image) ? (
                                  <img src={getImageUrl(cake.image)} alt={cake.name} onError={handleImageError} className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-[#c2b4a7]">No Image</div>
                                )}
                                
                                {isSelected && (
                                  <div className="absolute top-3 right-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-[#a9651c] shadow-sm">
                                    <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                                  </div>
                                )}
                              </div>

                              <div className="flex flex-1 flex-col p-4 pt-2 border-t border-[#f4e7da]/50">
                                <div className="mb-4">
                                  <h3 className="text-[15px] font-bold text-[#1a1c21] leading-tight mb-1 line-clamp-1">{cake.name}</h3>
                                  {cake.description && (
                                    <p className="text-[12px] text-[#6b5c52] line-clamp-2 leading-relaxed">{cake.description}</p>
                                  )}
                                </div>
                                
                                <div className="mt-auto space-y-2">
                                  <div className="flex flex-wrap gap-2">
                                    {cakeSizes.map(size => {
                                      const isSizeSelected = isSelected && selectedCake.size === size.name;
                                      return (
                                        <button
                                          key={size.name}
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedCake({ cakeId: cake._id, category: cake.category || 'standard', name: cake.name, size: size.name, price: size.price, image: cake.image });
                                          }}
                                          className={`flex-1 min-w-[100px] whitespace-nowrap rounded-lg border px-3 py-2 text-[12px] font-bold transition-all duration-200 ${isSizeSelected ? 'border-[#a9651c] bg-[#a9651c] text-white shadow-sm' : 'border-[#ead9ca] bg-[#faf8f5] text-[#1a1c21] hover:border-[#a9651c] hover:bg-white'}`}
                                        >
                                          {size.label} · ₹{size.price}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 4: ADD ONS */}
                {currentStep === 4 && (
                  <div className="space-y-10">
                    <div>
                      <h2 className="mb-2 text-[24px] font-bold text-[#1a1c21] font-heading">Finishing Touches</h2>
                      <p className="text-[14px] text-[#6b5c52]">Add cakes and special services.</p>
                    </div>

                    {['Special Services'].map(cat => {
                      const catAddons = groupedAddons[cat] || [];
                      if (catAddons.length === 0) return (
                        <div key={cat} className="space-y-4">
                          <h3 className="text-lg font-bold font-heading text-[#1a1c21] border-b border-[#ecdcd1] pb-2 uppercase tracking-wider">{cat} (optional)</h3>
                          <div className="rounded-[22px] border border-[#ecdcd1] bg-white p-6 text-center">
                            <p className="text-[14px] text-[#6b5c52]">No {cat.toLowerCase()} available.</p>
                          </div>
                        </div>
                      );
                      
                      return (
                        <div key={cat} className="space-y-4">
                          <h3 className="text-lg font-bold font-heading text-[#1a1c21] border-b border-[#ecdcd1] pb-2 uppercase tracking-wider">{cat} (optional)</h3>
                          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                            {catAddons.map(addon => {
                              const isSelected = !!selectedAddons[addon._id];
                              const displayPrice = addon.price || 0;

                              return (
                                <button
                                  key={addon._id}
                                  onClick={() => handleAddonToggle(addon._id)}
                                  className={`relative flex flex-col items-center justify-center rounded-[22px] border p-4 text-center transition-all ${isSelected ? 'border-[#8c5211] bg-[#f9f2eb] shadow-md ring-1 ring-[#8c5211]' : 'border-[#ecdcd1] bg-white hover:border-[#8c5211] hover:shadow-sm'}`}
                                >
                                  <div className="h-28 w-28 shrink-0 mb-4 mx-auto flex items-center justify-center">
                                    <img src={getImageUrl(addon.image) || '/placeholder.png'} alt={addon.name} onError={handleImageError} className="h-full w-full object-contain" />
                                  </div>
                                  <p className="text-[15px] font-bold text-[#1a1c21] mb-1">{addon.name}</p>
                                  <p className="text-[14px] text-[#8c5211] font-bold">₹{displayPrice}</p>
                                  
                                  {isSelected && (
                                    <div className="absolute top-3 right-3 bg-[#8c5211] text-white rounded-full p-1 shadow-md">
                                      <Check className="h-4 w-4" />
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* STEP 5: REVIEW */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="mb-1 text-[24px] font-bold text-[#1a1c21] font-heading">Review & Confirm</h2>
                      <p className="text-[13px] text-[#6b5c52]">Check your booking details carefully before proceeding to payment.</p>
                    </div>

                    <div className="space-y-5 rounded-[26px] border border-[#ecdcd1] bg-[#FCF5EB] p-5 md:p-6 shadow-sm">
                      {/* Date & Time Header Card */}
                      <div className="rounded-[20px] bg-white border border-[#ecdcd1] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                          <div>
                            <div className="flex items-center gap-2 mb-1.5">
                              <Calendar className="h-3.5 w-3.5 text-[#8c5211]" />
                              <span className="text-[11px] font-bold uppercase tracking-widest text-[#8c5211]">Date & Time Slot</span>
                            </div>
                            <p className="text-[18px] md:text-[20px] font-bold text-[#1a1c21]">
                              {selectedDate} <span className="mx-2 text-[#8c5211]">|</span> {displayTimeSlot}
                            </p>
                            <p className="mt-1 text-[13px] font-medium text-[#6b5c52]">
                              {theater?.name} · <span className="text-[#8c5211] font-semibold">{room?.name}</span> ({duration} Hour{duration > 1 ? 's' : ''})
                            </p>
                          </div>
                          <div className="inline-flex items-center gap-1.5 self-start sm:self-center rounded-full bg-[#fcf8f3] px-3.5 py-1.5 text-[12px] font-bold text-[#8c5211] border border-[#ecdcd1]">
                            <ShieldCheck className="h-4 w-4 text-[#8c5211]" /> Secure booking
                          </div>
                        </div>
                      </div>

                      {/* Organized Details Grid */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        {/* Guest Details Card */}
                        <div className="rounded-[18px] bg-white border border-[#ecdcd1] p-4 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Users className="h-3.5 w-3.5 text-[#8c5211]" />
                              <span className="text-[11px] font-bold uppercase tracking-widest text-[#8c5211]">Guest Details</span>
                            </div>
                            <p className="text-[15px] font-bold text-[#1a1c21]">{customerDetails.name}</p>
                            <p className="text-[13px] text-[#6b5c52] mt-0.5">{customerDetails.phone}</p>
                            {customerDetails.email && (
                              <p className="text-[12px] text-[#8c5211] truncate mt-0.5">{customerDetails.email}</p>
                            )}
                          </div>
                          <div className="mt-3 pt-2.5 border-t border-[#f4e7da] flex items-center justify-between text-[12px] text-[#6b5c52]">
                            <span>Party Size</span>
                            <span className="font-bold text-[#1a1c21]">{customerDetails.members} Members, {customerDetails.kids} Kids</span>
                          </div>
                        </div>

                        {/* Occasion Card */}
                        <div className="rounded-[18px] bg-white border border-[#ecdcd1] p-4 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Sparkles className="h-3.5 w-3.5 text-[#8c5211]" />
                              <span className="text-[11px] font-bold uppercase tracking-widest text-[#8c5211]">Occasion</span>
                            </div>
                            <p className="text-[16px] font-bold text-[#1a1c21]">
                              {eventTypes.find(e => e._id === selectedEventType)?.name || 'Celebration'}
                            </p>
                            <p className="text-[12px] text-[#6b5c52] mt-1">Special private theater arrangement included.</p>
                          </div>
                          <div className="mt-3 pt-2.5 border-t border-[#f4e7da] flex items-center justify-between text-[12px] text-[#6b5c52]">
                            <span>Status</span>
                            <span className="font-bold text-[#8c5211]">Selected</span>
                          </div>
                        </div>

                        {/* Cake Card (if selected) */}
                        {processedCake && (
                          <div className="rounded-[18px] bg-white border border-[#ecdcd1] p-4 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <CakeIcon className="h-3.5 w-3.5 text-[#8c5211]" />
                                <span className="text-[11px] font-bold uppercase tracking-widest text-[#8c5211]">Celebration Cake</span>
                              </div>
                              <p className="text-[15px] font-bold text-[#1a1c21]">{processedCake.name}</p>
                              <p className="text-[12px] text-[#6b5c52] mt-0.5">{processedCake.sizeLabel}</p>
                            </div>
                            <div className="mt-3 pt-2.5 border-t border-[#f4e7da] flex items-center justify-between text-[12px] text-[#6b5c52]">
                              <span>Price</span>
                              <span className="font-bold text-[#1a1c21]">₹{processedCake.total}</span>
                            </div>
                          </div>
                        )}

                        {/* Add-ons Card (if selected) */}
                        {processedAddons.length > 0 && (
                          <div className="rounded-[18px] bg-white border border-[#ecdcd1] p-4 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Gift className="h-3.5 w-3.5 text-[#8c5211]" />
                                <span className="text-[11px] font-bold uppercase tracking-widest text-[#8c5211]">Custom Add-ons</span>
                              </div>
                              <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                                {processedAddons.map(addon => (
                                  <div key={addon._id} className="flex justify-between items-center text-[13px]">
                                    <span className="font-medium text-[#1a1c21] truncate max-w-[150px]">{addon.name}</span>
                                    <span className="font-semibold text-[#8c5211]">₹{addon.finalPrice}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="mt-3 pt-2.5 border-t border-[#f4e7da] flex items-center justify-between text-[12px] text-[#6b5c52]">
                              <span>Total Add-ons</span>
                              <span className="font-bold text-[#1a1c21]">₹{addOnsTotal}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Refund Policy Card */}
                      <div className="rounded-[18px] bg-[#fff8ee] border border-[#f3d9b5] p-4 md:p-5">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#fde9cf] flex items-center justify-center shrink-0 mt-0.5">
                            <AlertCircle className="w-4 h-4 text-[#9e6223]" />
                          </div>
                          <div>
                            <h4 className="text-[14px] font-bold text-[#1a1c21] mb-1">Refund Policy</h4>
                            <p className="text-[13px] leading-relaxed text-[#6b5c52]">
                              Advance amount is <strong className="text-[#1a1c21]">fully refundable</strong> if slot is cancelled at least <span className="font-semibold text-[#9e6223]">72 hrs before the slot time</span>. If your slot is less than 72 hrs away from time of payment, then advance is <span className="font-semibold text-[#b91c1c]">non-refundable</span>.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Terms agreement checkbox */}
                      <div className="pt-1">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={e => setTermsAccepted(e.target.checked)}
                            className="mt-0.5 h-4 w-4 rounded border-[#ecdcd1] text-[#9e6223] focus:ring-[#9e6223]"
                          />
                          <span className="text-[13px] text-[#6b5c52] leading-tight">
                            I have reviewed the booking details, refund policy, and agree to the <a href="/terms" target="_blank" className="text-[#9e6223] underline font-semibold">Terms & Conditions</a> and cancellation policy.
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex items-center justify-between border-t border-[#ecdcd1] pt-8">
              {currentStep > 1 ? (
                <button type="button" onClick={handleBack} disabled={submitting} className="flex items-center gap-2 px-2 text-[14px] font-bold text-[#6b5c52] transition hover:text-[#9e6223] disabled:opacity-50">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              ) : <div />}

              {currentStep < STEPS.length ? (
                <button onClick={handleNext} className="h-11 flex items-center justify-center rounded-full bg-[#a9651c] px-8 text-white hover:bg-[#8e5217] font-bold text-[13px] transition-colors shadow-sm">
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCreateBooking}
                  disabled={submitting || !termsAccepted}
                  className={`h-11 flex items-center justify-center rounded-full px-10 font-bold text-[13px] transition-all shadow-sm ${
                    !termsAccepted || submitting
                      ? 'bg-[#d6ccc2] text-[#857a70] cursor-not-allowed border border-[#c4b8ac]'
                      : 'bg-[#a9651c] text-white hover:bg-[#8e5217] cursor-pointer'
                  }`}
                >
                  {submitting ? 'Processing...' : `Pay Advance ₹${advanceAmount}`}
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Sticky Booking Summary on Desktop, full-width block on mobile */}
        <div className="w-full lg:w-[350px] xl:w-[370px] shrink-0 self-start lg:sticky top-24 z-20">
          <div className="bg-[#fffaf5] rounded-[22px] border border-[#ead9ca] p-5 shadow-[0_10px_30px_rgba(75,43,20,0.07)] max-h-[calc(100vh-7rem)] overflow-y-auto">
            <h3 className="text-[18px] font-bold font-heading text-[#17171c] mb-2">Booking Summary</h3>
            <p className="text-[12px] text-[#6b5c52] mb-3">Here’s a quick look at your booking.</p>
            <div className="flex items-center gap-3 rounded-xl border border-[#ead9ca] bg-white p-2.5 mb-4">
              {theaterImage ? (
                <img src={theaterImage} alt={theater?.name} onError={handleImageError} className="h-12 w-16 rounded-lg object-cover object-center" />
              ) : (
                <div className="h-12 w-16 rounded-lg bg-[#f4e7da]" aria-hidden="true" />
              )}
              <div className="min-w-0">
                <p className="text-[12px] font-bold text-[#17171c] truncate">{theater?.name}</p>
                <p className="text-[10px] text-[#6b5c52] truncate">
                  {room?.name} · {theater?.city?.name || 'Bengaluru'}
                </p>
                <p className="text-[10px] text-[#a9651c] font-bold mt-1">
                  {selectedDate} · {displayTimeSlot}
                </p>
              </div>
            </div>
            
            <div className="space-y-4 text-[14px]">
              <div className="space-y-1 border-b border-dashed border-[#ecdcd1] pb-3">
                <div className="flex justify-between"><span className="text-[#6b5c52]">Theater</span><span className="font-bold text-[#1a1c21]">{theater?.name}</span></div>
                <div className="flex justify-between"><span className="text-[#6b5c52]">Room</span><span className="font-bold text-[#1a1c21]">{room?.name}</span></div>
                {room?.couple ? <div className="flex justify-between"><span className="text-[#6b5c52]">Couple</span><span className="font-bold text-[#1a1c21]">{room?.couple}</span></div> : null}
                <div className="flex justify-between"><span className="text-[#6b5c52]">Maximum Members</span><span className="font-bold text-[#1a1c21]">{room?.maximumMembers}</span></div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[#6b5c52] font-medium">Room Price ({duration} Hour{duration > 1 ? 's' : ''})</span>
                </div>
                <span className="font-bold text-[#1a1c21]">₹{theaterPrice}</span>
              </div>
              
              {processedCake && (
                <div className="flex justify-between items-start border-t border-dashed border-[#ecdcd1] pt-3 mt-3">
                  <div className="flex flex-col">
                    <span className="text-[#6b5c52] font-medium text-[#1a1c21]">{processedCake.name}</span>
                    <span className="text-[12px] text-[#6b5c52]">{processedCake.sizeLabel}</span>
                  </div>
                  <span className="font-bold text-[#1a1c21]">₹{processedCake.total}</span>
                </div>
              )}
              
              {processedAddons.map((addon) => (
                <div key={addon._id} className="flex justify-between items-start border-t border-dashed border-[#ecdcd1] pt-3 mt-3">
                  <div className="flex flex-col">
                    <span className="text-[#6b5c52]">{addon.name}</span>
                  </div>
                  <span className="font-bold text-[#1a1c21]">₹{addon.total}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-[#ecdcd1]">
              <div className="flex justify-between items-end mb-4">
                <span className="text-[14px] font-bold text-[#1a1c21]">Subtotal</span>
                <span className="text-[20px] font-bold text-[#1a1c21]">₹{subtotal}</span>
              </div>
              <div className="bg-[#f9f2eb] rounded-xl p-4 border border-[#ead9ca]/50">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[13px] font-bold text-[#9e6223]">Advance Payable</span>
                  <span className="text-[18px] font-extrabold text-[#9e6223]">₹{advanceAmount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[12px] text-[#6b5c52]">Balance Amount</span>
                  <span className="text-[12px] font-bold text-[#6b5c52]">₹{balanceAmount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>

      {/* Responsive QR Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        booking={createdBooking}
        theaterName={theater?.name}
        roomName={room?.name}
        bookingDate={selectedDate}
        timeSlot={displayTimeSlot}
        advanceAmount={advanceAmount}
        onPaymentSuccess={(id) => {
          setIsPaymentModalOpen(false);
          navigate(`/booking/success/${id || createdBooking?._id}`);
        }}
      />
    </div>
  );
}
