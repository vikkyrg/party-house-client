import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { contentService } from '../services/contentService';
import { bookingService } from '../services/bookingService';
import { paymentService } from '../services/paymentService';
import { theaterService } from '../services/theaterService';
import { useAuthStore } from '../store/authStore';
import { LoadingState } from '../components/common/LoadingState';
import { BookingStepper } from '../components/booking/BookingStepper';
import { handleApiError } from '../lib/apiClient';
import { Check, ArrowLeft, ArrowRight, ShieldCheck, MapPin, Calendar, Clock, Edit } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { calculateBookingTotal } from '../utils/bookingCalculator';
import { getImageUrl } from '../utils/imageUtils';

const STEPS = [
  { id: 'details', title: 'Guest Details' },
  { id: 'occasion', title: 'Occasion' },
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
  
  const [selectedEventType, setSelectedEventType] = useState('');
  const [selectedAddons, setSelectedAddons] = useState({}); 
  
  const [customerDetails, setCustomerDetails] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    members: 1,
    kids: 0,
    specialRequest: ''
  });

  const [termsAccepted, setTermsAccepted] = useState(false);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { returnTo: `/book/${theaterId}?date=${selectedDate}&slot=${selectedTimeSlot}` } });
      return;
    }

    if (!selectedDate || !selectedTimeSlot) {
      // If accessed without date/slot, redirect to theater details to force selection
      navigate(`/theaters/${theaterId}`);
      return;
    }

    const fetchData = async () => {
      try {
        const [theaterRes, eventsRes, addonsRes] = await Promise.all([
          theaterService.getTheaterById(theaterId),
          contentService.getEventTypes(),
          contentService.getAddons()
        ]);
        
        if (theaterRes.success) setTheater(theaterRes.data);
        if (eventsRes.success) setEventTypes(eventsRes.data);
        if (addonsRes.success) setAddons(addonsRes.data);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [theaterId, selectedDate, selectedTimeSlot, isAuthenticated, navigate]);

  const handleAddonToggle = (addonId, defaultVariant = '') => {
    setSelectedAddons(prev => {
      const next = { ...prev };
      if (next[addonId]) {
        delete next[addonId];
      } else {
        next[addonId] = { quantity: 1, variantName: defaultVariant };
      }
      return next;
    });
  };

  const handleVariantChange = (addonId, variantName) => {
    setSelectedAddons(prev => {
      const next = { ...prev };
      if (next[addonId]) {
        next[addonId].variantName = variantName;
      }
      return next;
    });
  };

  const {
    theaterPrice,
    eventTypePrice,
    addOnsTotal,
    subtotal,
    advanceAmount,
    balanceAmount,
    processedAddons
  } = useMemo(() => calculateBookingTotal(
    theater, 
    eventTypes.find(e => e._id === selectedEventType), 
    selectedAddons, 
    addons
  ), [theater, eventTypes, selectedEventType, selectedAddons, addons]);

  const validateStep = () => {
    if (currentStep === 1) { // Guest Details
      if (!customerDetails.name || !customerDetails.phone) {
        setError('Please provide your name and phone number.');
        return false;
      }
      const totalGuests = Number(customerDetails.members) + Number(customerDetails.kids);
      if (totalGuests > (theater?.capacity || 999)) {
        setError(`Maximum capacity for this theater is ${theater?.capacity} guests.`);
        return false;
      }
    }
    if (currentStep === 2 && !selectedEventType) { // Occasion
      setError('Please select an occasion for your celebration.');
      return false;
    }
    if (currentStep === 4 && !termsAccepted) { // Review & Pay
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
      const availRes = await bookingService.checkAvailability(theaterId, selectedDate);
      if (availRes.success) {
        if (!availRes.data.availableSlots.includes(selectedTimeSlot)) {
           setError('This slot is no longer available. Please choose another time.');
           setSubmitting(false);
           return;
        }
      }

      const payload = {
        theaterId,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        eventTypeId: selectedEventType,
        addOns: Object.entries(selectedAddons).map(([id, selection]) => ({ 
          id, 
          quantity: selection.quantity,
          variantName: selection.variantName
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

  return (
    <div className="min-h-screen bg-[#FCF5EB] pb-20 pt-28 relative overflow-hidden font-sans flex flex-col">
      <SEO title="Complete Booking | CS Cinemas" />
      
      <div className="container relative z-10 mx-auto max-w-6xl px-4 flex flex-col lg:flex-row gap-8">
        
        {/* Main Content Area */}
        <div className="flex-1">
          
          {/* Booking Context Header */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 md:p-6 bg-white border border-[#ecdcd1] rounded-[24px] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
             <div>
               <h2 className="text-[20px] font-heading font-extrabold text-[#1a1c21] flex items-center gap-2">
                 {theater?.name}
               </h2>
               <div className="text-[13px] font-bold text-[#8c5211] mt-1 flex flex-wrap items-center gap-x-4 gap-y-2">
                 <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {theater?.city?.name || 'Bengaluru'} · {theater?.location?.name || 'Premium'}</span>
                 <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}</span>
                 <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {selectedTimeSlot}</span>
               </div>
             </div>
             <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
               <button onClick={() => navigate('/theaters')} className="px-4 py-2 bg-[#f9f2eb] hover:bg-[#f4e6d9] text-[#8c5211] text-[12px] font-bold rounded-lg transition border border-[#ecdcd1] flex items-center justify-center gap-1.5 w-full sm:w-auto">
                 Change Theater
               </button>
               <button onClick={() => navigate(`/theaters/${theaterId}?date=${selectedDate}`)} className="px-4 py-2 bg-[#f9f2eb] hover:bg-[#f4e6d9] text-[#8c5211] text-[12px] font-bold rounded-lg transition border border-[#ecdcd1] flex items-center justify-center gap-1.5 w-full sm:w-auto">
                 Change Time
               </button>
             </div>
          </motion.div>

          <div className="mb-8">
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

          <div className="bg-white rounded-[32px] border border-[#ecdcd1] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:p-10">
            <AnimatePresence mode="wait">
              <motion.div key={currentStep} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.2, ease: 'easeOut' }}>
                
                {/* STEP 1: DETAILS */}
                {currentStep === 1 && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="mb-2 text-[24px] font-bold text-[#1a1c21] font-heading">Guest details</h2>
                      <p className="text-[14px] text-[#6b5c52]">Maximum capacity for this theater is {theater?.capacity} guests.</p>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="mb-2 block text-[13px] font-bold text-[#1a1c21] uppercase tracking-wide">Full Name *</label>
                        <input type="text" value={customerDetails.name} onChange={(e) => setCustomerDetails((prev) => ({ ...prev, name: e.target.value }))} placeholder="John Doe" className="h-12 w-full rounded-xl border border-[#ecdcd1] bg-[#F9F6F0] px-4 text-[#1a1c21] font-medium outline-none transition focus:border-[#8c5211] focus:ring-1 focus:ring-[#8c5211]/20 placeholder:text-[#a6998f]" />
                      </div>

                      <div className="grid gap-5 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-[13px] font-bold text-[#1a1c21] uppercase tracking-wide">Phone Number *</label>
                          <input type="tel" value={customerDetails.phone} onChange={(e) => setCustomerDetails((prev) => ({ ...prev, phone: e.target.value }))} placeholder="10-digit number" className="h-12 w-full rounded-xl border border-[#ecdcd1] bg-[#F9F6F0] px-4 text-[#1a1c21] font-medium outline-none transition focus:border-[#8c5211] focus:ring-1 focus:ring-[#8c5211]/20 placeholder:text-[#a6998f]" />
                        </div>
                        <div>
                          <label className="mb-2 block text-[13px] font-bold text-[#1a1c21] uppercase tracking-wide">Email Address</label>
                          <input type="email" value={customerDetails.email} onChange={(e) => setCustomerDetails((prev) => ({ ...prev, email: e.target.value }))} placeholder="For booking receipt" className="h-12 w-full rounded-xl border border-[#ecdcd1] bg-[#F9F6F0] px-4 text-[#1a1c21] font-medium outline-none transition focus:border-[#8c5211] focus:ring-1 focus:ring-[#8c5211]/20 placeholder:text-[#a6998f]" />
                        </div>
                      </div>
                      
                      <div className="grid gap-5 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-[13px] font-bold text-[#1a1c21] uppercase tracking-wide">Number of Members *</label>
                          <input type="number" min="1" max={theater?.capacity} value={customerDetails.members} onChange={(e) => setCustomerDetails((prev) => ({ ...prev, members: e.target.value }))} className="h-12 w-full rounded-xl border border-[#ecdcd1] bg-[#F9F6F0] px-4 text-[#1a1c21] font-medium outline-none transition focus:border-[#8c5211] focus:ring-1 focus:ring-[#8c5211]/20" />
                        </div>
                        <div>
                          <label className="mb-2 block text-[13px] font-bold text-[#1a1c21] uppercase tracking-wide">Number of Kids</label>
                          <input type="number" min="0" value={customerDetails.kids} onChange={(e) => setCustomerDetails((prev) => ({ ...prev, kids: e.target.value }))} className="h-12 w-full rounded-xl border border-[#ecdcd1] bg-[#F9F6F0] px-4 text-[#1a1c21] font-medium outline-none transition focus:border-[#8c5211] focus:ring-1 focus:ring-[#8c5211]/20" />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-[13px] font-bold text-[#1a1c21] uppercase tracking-wide">Special Requests</label>
                        <textarea value={customerDetails.specialRequest} onChange={(e) => setCustomerDetails((prev) => ({ ...prev, specialRequest: e.target.value }))} placeholder="Any setup or décor notes..." className="h-32 w-full resize-none rounded-xl border border-[#ecdcd1] bg-[#F9F6F0] p-4 text-[#1a1c21] font-medium outline-none transition focus:border-[#8c5211] focus:ring-1 focus:ring-[#8c5211]/20 placeholder:text-[#a6998f]" />
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
                            {type.basePrice > 0 && (
                              <span className="mt-1 inline-block rounded bg-[#8c5211] px-2 py-0.5 text-[11px] font-bold text-white uppercase tracking-wider">
                                +₹{type.basePrice}
                              </span>
                            )}
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

                {/* STEP 3: ADD ONS */}
                {currentStep === 3 && (
                  <div className="space-y-10">
                    <div>
                      <h2 className="mb-2 text-[24px] font-bold text-[#1a1c21] font-heading">Finishing Touches</h2>
                      <p className="text-[14px] text-[#6b5c52]">Add cakes, decorations, and gifts.</p>
                    </div>

                    {['Cake', 'Decoration', 'Gift', 'Special Service'].map(cat => {
                      const catAddons = groupedAddons[cat] || [];
                      if (catAddons.length === 0) return null;
                      
                      return (
                        <div key={cat} className="space-y-4">
                          <h3 className="text-lg font-bold font-heading text-[#1a1c21] border-b border-[#ecdcd1] pb-2 uppercase tracking-wider">{cat}s</h3>
                          <div className="grid gap-4 sm:grid-cols-2">
                            {catAddons.map(addon => {
                              const isSelected = !!selectedAddons[addon._id];
                              const hasVariants = addon.variants && addon.variants.length > 0;
                              const currentVariant = selectedAddons[addon._id]?.variantName || (hasVariants ? addon.variants[0].name : '');
                              const displayPrice = isSelected && hasVariants 
                                ? addon.variants.find(v => v.name === currentVariant)?.price 
                                : (addon.price || 0);

                              return (
                                <div key={addon._id} className={`flex flex-col justify-between rounded-[22px] border p-4 transition-all ${isSelected ? 'border-[#8c5211] bg-[#f9f2eb]' : 'border-[#ecdcd1] bg-white'}`}>
                                  <div className="flex gap-4">
                                    <div className="h-16 w-16 shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                                      <img src={getImageUrl(addon.image) || '/placeholder.png'} alt={addon.name} className="h-full w-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-[15px] font-bold text-[#1a1c21]">{addon.name}</p>
                                      {hasVariants ? (
                                        <div className="mt-1">
                                          <select 
                                            disabled={!isSelected}
                                            value={currentVariant}
                                            onChange={(e) => handleVariantChange(addon._id, e.target.value)}
                                            className="text-[12px] bg-white border border-[#ecdcd1] rounded px-2 py-1 outline-none focus:border-[#8c5211]"
                                          >
                                            {addon.variants.map(v => (
                                              <option key={v.name} value={v.name}>{v.name} - ₹{v.price}</option>
                                            ))}
                                          </select>
                                        </div>
                                      ) : (
                                        <p className="mt-1 text-[13px] text-[#8c5211] font-bold">₹{addon.price}</p>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="mt-4 flex justify-end">
                                    <button
                                      type="button"
                                      onClick={() => handleAddonToggle(addon._id, hasVariants ? addon.variants[0].name : '')}
                                      className={`flex h-10 w-full sm:w-auto items-center justify-center rounded-xl px-5 text-[13px] font-bold transition-all ${isSelected ? 'bg-[#9e6223] text-white shadow-sm' : 'bg-[#F9F6F0] text-[#1a1c21] hover:bg-[#eaddd0]'}`}
                                    >
                                      {isSelected ? <><Check className="mr-1.5 h-4 w-4" /> Added (₹{displayPrice})</> : 'Add'}
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* STEP 4: REVIEW */}
                {currentStep === 4 && (
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
                <button onClick={handleNext} className="h-12 flex items-center justify-center rounded-full bg-[#9e6223] px-8 text-white hover:bg-[#7a4b1b] font-bold text-[14px] transition-colors shadow-sm">
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              ) : (
                <button onClick={handleCreateBooking} disabled={submitting} className="h-12 flex items-center justify-center rounded-full bg-[#9e6223] px-10 text-white hover:bg-[#7a4b1b] font-bold text-[14px] transition-colors shadow-sm">
                  {submitting ? 'Processing...' : `Pay Advance ₹${advanceAmount}`}
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Sticky Booking Summary on Desktop */}
        <div className="lg:w-80 shrink-0">
          <div className="sticky top-28 bg-white rounded-[24px] border border-[#ecdcd1] p-6 shadow-sm overflow-hidden">
            <h3 className="text-[18px] font-bold font-heading text-[#1a1c21] mb-6">Booking Summary</h3>
            
            <div className="space-y-4 text-[14px]">
              <div className="flex justify-between items-center">
                <span className="text-[#6b5c52]">Theater Base</span>
                <span className="font-bold text-[#1a1c21]">₹{theaterPrice}</span>
              </div>
              
              {selectedEventType && eventTypePrice > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-[#6b5c52]">{eventTypes.find(e => e._id === selectedEventType)?.name}</span>
                  <span className="font-bold text-[#1a1c21]">₹{eventTypePrice}</span>
                </div>
              )}
              
              {processedAddons.map((addon) => (
                <div key={addon._id} className="flex justify-between items-start border-t border-dashed border-[#ecdcd1] pt-3 mt-3">
                  <div className="flex flex-col">
                    <span className="text-[#6b5c52]">{addon.name}</span>
                    {addon.selectedVariant && <span className="text-[11px] text-[#8c5211] font-medium">{addon.selectedVariant}</span>}
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
              <div className="bg-[#f9f2eb] rounded-xl p-4 border border-[#ecdcd1]/50">
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
