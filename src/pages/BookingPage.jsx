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
import { Check, ArrowLeft, ArrowRight, ShieldCheck, MapPin, Calendar, Clock, Edit } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { calculateBookingTotal } from '../utils/bookingCalculator';
import { getImageUrl } from '../utils/imageUtils';
import { useCakes } from '../hooks/useCakes';

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
  
  const { user, isAuthenticated } = useAuthStore();
  
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
    const roomId = searchParams.get('roomId');
    const [room, setRoom] = useState(null);
  
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
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { returnTo: `/book/${theaterId}?roomId=${roomId}&date=${selectedDate}&slot=${selectedTimeSlot}` } });
      return;
    }

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
        if (roomRes.success) setRoom(roomRes.data);
        if (eventsRes.success) setEventTypes(eventsRes.data);
        if (addonsRes.success) setAddons(addonsRes.data);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [theaterId, roomId, selectedDate, selectedTimeSlot, isAuthenticated, navigate]);

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
    extraGuestPrice,
    extraGuestCount,
    extraGuestTotal,
    cakePrice,
    addOnsTotal,
    subtotal,
    advanceAmount,
    balanceAmount,
    processedCake,
    processedAddons
  } = useMemo(() => calculateBookingTotal(
    room ? { ...theater, pricePerHour: room.basePrice, capacity: room.capacity, additionalGuestPrice: room.additionalGuestPrice ?? room.extraGuestPrice, selectedMembers: customerDetails.members } : theater,
    eventTypes.find(e => e._id === selectedEventType), 
    selectedCake,
    cakesList,
    selectedAddons, 
    addons
  ), [theater, room, customerDetails.members, eventTypes, selectedEventType, selectedCake, cakesList, selectedAddons, addons]);

  const validateStep = () => {
    if (currentStep === 1) { // Guest Details
      if (!customerDetails.name || !customerDetails.phone) {
        setError('Please provide your name and phone number.');
        return false;
      }
      const totalGuests = Number(customerDetails.members) + Number(customerDetails.kids);
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
      // Real-time re-check availability before booking
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
        timeSlot: selectedTimeSlot,
        timeSlotId: undefined,
        eventTypeId: selectedEventType,
        cake: selectedCake ? {
          cakeId: selectedCake.cakeId,
          size: selectedCake.size
        } : null,
        addOns: Object.entries(selectedAddons).map(([id, selection]) => ({ 
          id, 
          quantity: selection.quantity || 1
        })),
        customerDetails
      };
      
      const bookingRes = await bookingService.createBooking(payload);
      if (bookingRes.success) {
        const bookingId = bookingRes.data._id;
        
        const orderRes = await paymentService.createOrder(bookingId);
        if (orderRes.success) {
          const { orderId, amount, currency, key } = orderRes.data;
          
          const options = {
            key: key || import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: amount,
            currency: currency,
            name: 'CS Cinemas',
            description: `Advance Payment for ${theater?.name}`,
            order_id: orderId,
            handler: async function (response) {
              try {
                await paymentService.verifyPayment({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  bookingId
                });
                navigate(`/booking/success/${bookingId}`);
              } catch (err) {
                navigate('/booking/failure');
              }
            },
            prefill: {
              name: customerDetails.name,
              email: customerDetails.email,
              contact: customerDetails.phone
            },
            theme: { color: '#eab308' }
          };
          
          const rzp = new window.Razorpay(options);
          rzp.open();
        }
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
  if (!isAuthenticated) return null;

  const theaterImage = theater?.images?.length ? getImageUrl(theater.images[0]) : null;
  const roomImage = room?.image ? getImageUrl(room.image) : theaterImage;

  return (
    <div className="min-h-screen bg-[#fcf5eb] pb-16 pt-24 relative overflow-hidden font-sans flex flex-col">
      <SEO title="Complete Booking | CS Cinemas" />

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
      
      <div className="container relative z-10 mx-auto max-w-[1200px] px-4 md:px-6 flex flex-col lg:flex-row gap-5">
        
        {/* Main Content Area */}
        <div className="flex-1">
          
          {/* Booking Context Header */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-3 md:p-4 bg-[#fffaf5] border border-[#ead9ca] rounded-[18px] shadow-[0_4px_18px_rgba(75,43,20,0.06)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
             <div className="flex items-center gap-3 min-w-0">
               {roomImage ? (
                 <img src={roomImage} alt={room?.name || theater?.name} className="h-14 w-20 shrink-0 rounded-lg object-cover border border-[#ead9ca]" />
               ) : (
                 <div className="h-14 w-20 shrink-0 rounded-lg bg-[#f4e7da] border border-[#ead9ca]" aria-hidden="true" />
               )}
               <div className="min-w-0">
                 <h2 className="text-[17px] font-heading font-extrabold text-[#17171c] truncate">
                   {theater?.name} · {room?.name}
                 </h2>
                 <div className="text-[11px] font-bold text-[#8c5211] mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                 <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {theater?.city?.name || 'Bengaluru'} · {theater?.location?.name || 'Premium'}</span>
                 <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}</span>
                 <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {selectedTimeSlot}</span>
                 </div>
               </div>
             </div>
             <div className="flex gap-2 w-full sm:w-auto">
               <button onClick={() => navigate(`/theaters?city=${theater?.city?._id || theater?.city}&date=${selectedDate}`)} className="px-3.5 py-2 bg-[#f9f2eb] hover:bg-[#f4e6d9] text-[#8c5211] text-[11px] font-bold rounded-full transition border border-[#ead9ca] flex items-center justify-center gap-1.5 w-full sm:w-auto whitespace-nowrap">
                 Change Theater
               </button>
               <button onClick={() => navigate(`/theaters?city=${theater?.city?._id || theater?.city}&location=${theaterId}&date=${selectedDate}`)} className="px-3.5 py-2 bg-[#f9f2eb] hover:bg-[#f4e6d9] text-[#8c5211] text-[11px] font-bold rounded-full transition border border-[#ead9ca] flex items-center justify-center gap-1.5 w-full sm:w-auto whitespace-nowrap">
                 Change Time
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
                      <p className="text-[14px] text-[#6b5c52]">Room capacity: {room?.capacity} guests · Additional guest: ₹{room?.additionalGuestPrice ?? room?.extraGuestPrice ?? 0}</p>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="mb-2 block text-[11px] font-bold text-[#17171c] uppercase tracking-wide">Full Name *</label>
                        <input type="text" value={customerDetails.name} onChange={(e) => setCustomerDetails((prev) => ({ ...prev, name: e.target.value }))} placeholder="John Doe" className="h-11 w-full rounded-full border border-[#ead9ca] bg-[#f9f6f0] px-4 text-[13px] text-[#17171c] font-medium outline-none transition focus:border-[#a9651c] focus:ring-1 focus:ring-[#a9651c]/20 placeholder:text-[#a6998f]" />
                      </div>

                      <div className="grid gap-5 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-[11px] font-bold text-[#17171c] uppercase tracking-wide">Phone Number *</label>
                          <input type="tel" value={customerDetails.phone} onChange={(e) => setCustomerDetails((prev) => ({ ...prev, phone: e.target.value }))} placeholder="10-digit number" className="h-11 w-full rounded-full border border-[#ead9ca] bg-[#f9f6f0] px-4 text-[13px] text-[#17171c] font-medium outline-none transition focus:border-[#a9651c] focus:ring-1 focus:ring-[#a9651c]/20 placeholder:text-[#a6998f]" />
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
                          <img src={getImageUrl(type.image)} alt={type.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
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
                  <div className="space-y-10">
                    <div>
                      <h2 className="mb-2 text-[24px] font-bold text-[#1a1c21] font-heading">Select Cake</h2>
                      <p className="text-[14px] text-[#6b5c52]">Choose a cake for your celebration (optional).</p>
                    </div>

                    <div className="flex gap-2 rounded-xl border border-[#ead9ca] bg-[#f9f2eb] p-1">
                      {[['standard', 'Standard Cakes'], ['premium', 'Premium Cakes']].map(([category, label]) => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => setCakeCategory(category)}
                          className={`flex-1 rounded-lg px-4 py-2.5 text-[12px] font-bold transition-colors ${cakeCategory === category ? 'bg-[#a9651c] text-white shadow-sm' : 'text-[#6b5c52] hover:bg-[#fffaf5]'}`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedCake(null)}
                      className={`w-full rounded-2xl border p-4 text-left transition-all ${!selectedCake ? 'border-[#a9651c] bg-[#f9f2eb] ring-1 ring-[#a9651c]' : 'border-[#ead9ca] bg-[#fffaf5] hover:border-[#a9651c]'}`}
                    >
                      <span className="block text-[15px] font-bold text-[#17171c]">No Cake</span>
                      <span className="text-[12px] text-[#6b5c52]">Skip cake selection</span>
                    </button>

                    {!visibleCakes.length ? (
                      <div className="rounded-[22px] border border-[#ecdcd1] bg-white p-6 text-center">
                        <p className="text-[14px] text-[#6b5c52]">No {cakeCategory} cakes available.</p>
                      </div>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {visibleCakes.map(cake => {
                          const isSelected = selectedCake?.cakeId === cake._id;
                          const cakeSizes = cake.sizes || [];
                          const currentSize = isSelected ? selectedCake.size : cakeSizes[0]?.name;
                          const displayPrice = cakeSizes.find(s => s.name === currentSize)?.price || 0;

                          return (
                            <div key={cake._id} className={`relative flex flex-col items-center justify-between rounded-[22px] border p-4 text-center transition-all ${isSelected ? 'border-[#a9651c] bg-[#f9f2eb] shadow-md ring-1 ring-[#a9651c]' : 'border-[#ead9ca] bg-[#fffaf5] hover:border-[#a9651c] hover:shadow-sm'}`}>
                              <div className="h-28 w-28 shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 mb-4 mx-auto">
                                {getImageUrl(cake.image) ? <img src={getImageUrl(cake.image)} alt={cake.name} className="h-full w-full object-cover" /> : <div className="h-full w-full bg-[#f4e7da]" />}
                              </div>
                              <p className="text-[15px] font-bold text-[#1a1c21] mb-1">{cake.name}</p>
                              <p className="text-[12px] text-[#6b5c52] mb-3 line-clamp-2">{cake.description}</p>
                              
                              <div className="w-full space-y-2 mt-auto">
                                <div className="grid grid-cols-2 gap-2">
                                  {cakeSizes.map(size => (
                                    <button
                                      key={size.name}
                                      type="button"
                                      onClick={() => setSelectedCake({ cakeId: cake._id, category: cake.category || 'standard', name: cake.name, size: size.name, price: size.price, image: cake.image })}
                                      className={`text-[12px] rounded-lg border px-2 py-1.5 font-medium transition-all ${isSelected && selectedCake.size === size.name ? 'border-[#a9651c] bg-[#a9651c] text-white' : 'border-[#ead9ca] bg-[#fffaf5] text-[#17171c] hover:border-[#a9651c]'}`}
                                    >
                                      {size.label}
                                      <br/>
                                      ₹{size.price}
                                    </button>
                                  ))}
                                </div>
                                {isSelected && (
                                  <button
                                    onClick={() => setSelectedCake(null)}
                                    className="text-[12px] text-red-500 hover:underline mt-2 block w-full"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>
                              
                              {isSelected && (
                                <div className="absolute top-3 right-3 bg-[#8c5211] text-white rounded-full p-1 shadow-md">
                                  <Check className="h-4 w-4" />
                                </div>
                              )}
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
                      <p className="text-[14px] text-[#6b5c52]">Add cakes, decorations, and gifts.</p>
                    </div>

                    {['Extra Decoration', 'Choose Gifts', 'Special Services'].map(cat => {
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
                                  <div className="h-28 w-28 shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 mb-4 mx-auto">
                                    <img src={getImageUrl(addon.image) || '/placeholder.png'} alt={addon.name} className="h-full w-full object-cover" />
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
                  <div className="space-y-8">
                    <div>
                      <h2 className="mb-2 text-[24px] font-bold text-[#1a1c21] font-heading">Review & Confirm</h2>
                      <p className="text-[14px] text-[#6b5c52]">Check your booking details carefully.</p>
                    </div>

                    <div className="space-y-6 rounded-[26px] border border-[#ecdcd1] bg-[#FCF5EB] p-6 shadow-sm">
                      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                        <div>
                          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[#8c5211]">Date & time</p>
                          <p className="text-[20px] font-bold text-[#1a1c21]">{selectedDate} <span className="mx-2 text-[#8c5211]">|</span> {selectedTimeSlot}</p>
                          <p className="mt-2 font-medium text-[#6b5c52]">{theater?.name}</p>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-[#f9f2eb] px-3 py-1.5 text-[13px] font-bold text-[#8c5211] border border-[#ecdcd1]">
                          <ShieldCheck className="h-4 w-4" /> Secure booking
                        </div>
                      </div>

                      <div className="h-px bg-[#ecdcd1]" />

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-widest text-[#8c5211] mb-2">Guest Details</p>
                          <p className="font-bold text-[#1a1c21]">{customerDetails.name}</p>
                          <p className="text-sm text-[#6b5c52]">{customerDetails.phone}</p>
                          <p className="text-sm text-[#6b5c52]">{customerDetails.members} Members, {customerDetails.kids} Kids</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-widest text-[#8c5211] mb-2">Occasion</p>
                          <p className="font-bold text-[#1a1c21]">{eventTypes.find(e => e._id === selectedEventType)?.name}</p>
                        </div>
                        {processedCake && (
                          <div>
                            <p className="text-[11px] font-bold uppercase tracking-widest text-[#8c5211] mb-2">Cake</p>
                            <p className="font-bold text-[#1a1c21]">{processedCake.name}</p>
                            <p className="text-sm text-[#6b5c52]">{processedCake.sizeLabel}</p>
                          </div>
                        )}
                        {processedAddons.length > 0 && (
                          <div>
                            <p className="text-[11px] font-bold uppercase tracking-widest text-[#8c5211] mb-2">Add-ons</p>
                            {processedAddons.map(addon => (
                              <div key={addon._id} className="mb-2">
                                <p className="font-bold text-[#1a1c21]">{addon.name}</p>
                                <p className="text-sm text-[#6b5c52]">₹{addon.finalPrice}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="h-px bg-[#ecdcd1]" />

                      <div>
                        <label className="flex items-start gap-3 cursor-pointer mt-4">
                          <input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} className="mt-1 h-4 w-4 rounded border-[#ecdcd1] text-[#9e6223] focus:ring-[#9e6223]" />
                          <span className="text-[13px] text-[#6b5c52]">I agree to the <a href="/terms" target="_blank" className="text-[#9e6223] underline">Terms & Conditions</a> and cancellation policy.</span>
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
                <button onClick={handleCreateBooking} disabled={submitting} className="h-11 flex items-center justify-center rounded-full bg-[#a9651c] px-10 text-white hover:bg-[#8e5217] font-bold text-[13px] transition-colors shadow-sm">
                  {submitting ? 'Processing...' : `Pay Advance ₹${advanceAmount}`}
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Sticky Booking Summary on Desktop */}
        <div className="lg:w-[300px] shrink-0">
          <div className="sticky top-24 bg-[#fffaf5] rounded-[18px] border border-[#ead9ca] p-4 shadow-[0_8px_25px_rgba(75,43,20,0.06)] overflow-hidden">
            <h3 className="text-[17px] font-bold font-heading text-[#17171c] mb-3">Booking Summary</h3>
            <p className="text-[11px] text-[#6b5c52] mb-3">Here’s a quick look at your booking.</p>
            <div className="flex items-center gap-3 rounded-xl border border-[#ead9ca] bg-white p-2.5 mb-4">
              {theaterImage ? (
                <img src={theaterImage} alt={theater?.name} className="h-12 w-16 rounded-lg object-cover" />
              ) : (
                <div className="h-12 w-16 rounded-lg bg-[#f4e7da]" aria-hidden="true" />
              )}
              <div className="min-w-0">
                <p className="text-[12px] font-bold text-[#17171c] truncate">{theater?.name}</p>
                <p className="text-[10px] text-[#6b5c52] truncate">{room?.name} · {theater?.city?.name || 'Bengaluru'} · {theater?.location?.name || 'Premium'}</p>
                <p className="text-[10px] text-[#a9651c] font-bold mt-1">{selectedDate} · {selectedTimeSlot}</p>
              </div>
            </div>
            
            <div className="space-y-4 text-[14px]">
              <div className="flex justify-between items-center">
                <span className="text-[#6b5c52]">Room Base</span>
                <span className="font-bold text-[#1a1c21]">₹{theaterPrice}</span>
              </div>
              {extraGuestTotal > 0 && (
                <div className="flex justify-between items-center border-t border-dashed border-[#ecdcd1] pt-3">
                  <span className="text-[#6b5c52]">Extra Guests ({extraGuestCount} × ₹{extraGuestPrice})</span>
                  <span className="font-bold text-[#1a1c21]">₹{extraGuestTotal}</span>
                </div>
              )}
              
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
    </div>
  );
}
