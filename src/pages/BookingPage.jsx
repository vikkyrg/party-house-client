import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { contentService } from '../services/contentService';
import { bookingService } from '../services/bookingService';
import { paymentService } from '../services/paymentService';
import { theaterService } from '../services/theaterService';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/common/Button';
import { LoadingState } from '../components/common/LoadingState';
import { BookingStepper } from '../components/booking/BookingStepper';
import { handleApiError } from '../lib/apiClient';
import { Check, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { SEO } from '../components/common/SEO';

const STEPS = [
  { id: 'datetime', title: 'Date & Time' },
  { id: 'occasion', title: 'Occasion' },
  { id: 'addons', title: 'Add-ons' },
  { id: 'details', title: 'Details' },
  { id: 'review', title: 'Review & Pay' }
];

export function BookingPage() {
  const { theaterId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const { user, isAuthenticated } = useAuthStore();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [theater, setTheater] = useState(null);
  const [eventTypes, setEventTypes] = useState([]);
  const [addons, setAddons] = useState([]);
  
  const [initialDate, setInitialDate] = useState(location.state?.date || '');
  const [initialTimeSlot, setInitialTimeSlot] = useState(location.state?.timeSlot || '');
  
  const [selectedEventType, setSelectedEventType] = useState('');
  const [selectedAddons, setSelectedAddons] = useState({}); // { addonId: quantity }
  const [customerDetails, setCustomerDetails] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    specialRequest: ''
  });
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { returnTo: `/book/${theaterId}`, bookingState: location.state } });
      return;
    }

    // We no longer require initialDate/initialTimeSlot because we let them select it in step 1

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
  }, [theaterId, isAuthenticated, navigate, location.state, initialDate, initialTimeSlot]);

  const handleAddonToggle = (addonId) => {
    setSelectedAddons(prev => {
      const next = { ...prev };
      if (next[addonId]) {
        delete next[addonId];
      } else {
        next[addonId] = 1;
      }
      return next;
    });
  };

  const calculateTotal = () => {
    let total = theater?.pricePerHour || 0; 
    
    const eventType = eventTypes.find(e => e._id === selectedEventType);
    if (eventType?.price) total += eventType.price;
    
    Object.entries(selectedAddons).forEach(([id, qty]) => {
      const addon = addons.find(a => a._id === id);
      if (addon) total += addon.price * qty;
    });
    
    return total;
  };

  const validateStep = () => {
    if (currentStep === 1 && (!initialDate || !initialTimeSlot)) {
      setError('Please select a date and time slot for your booking.');
      return false;
    }
    if (currentStep === 2 && !selectedEventType) {
      setError('Please select an occasion for your celebration.');
      return false;
    }
    if (currentStep === 4 && (!customerDetails.name || !customerDetails.phone)) {
      setError('Please provide your name and phone number so we can contact you.');
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
      const payload = {
        theaterId,
        date: initialDate,
        timeSlot: initialTimeSlot,
        eventTypeId: selectedEventType,
        addons: Object.entries(selectedAddons).map(([id, quantity]) => ({ id, quantity })),
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
            description: `Booking for ${theater?.name}`,
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

  if (loading) return <LoadingState />;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#FCF5EB] pb-20 pt-28 relative overflow-hidden font-sans">
      <SEO title="Complete Booking | CS Cinemas" />

      {/* Background Film Strip SVG (Top Right) */}
      <div className="absolute top-0 right-0 pointer-events-none overflow-hidden w-[600px] h-[600px] z-0 opacity-40">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
          <g transform="translate(600, 0)">
            <circle cx="0" cy="0" r="550" fill="none" stroke="#eaddd0" strokeWidth="50" />
            <circle cx="0" cy="0" r="535" fill="none" stroke="#FAF4ED" strokeWidth="12" strokeDasharray="15 15" />
            <circle cx="0" cy="0" r="565" fill="none" stroke="#FAF4ED" strokeWidth="12" strokeDasharray="15 15" />
          </g>
        </svg>
      </div>

      <div className="container relative z-10 mx-auto max-w-4xl px-4">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#8c5211] mb-4 block">Reservation</span>
          <h1 className="text-[36px] md:text-[54px] font-extrabold text-[#1a1c21] font-heading leading-[1.1]">Complete Your <span className="bg-gradient-to-r from-[#d18428] to-[#991c4d] bg-clip-text text-transparent">Experience</span></h1>
          <p className="mt-4 text-[#6b5c52] font-medium text-[14px]">You’re moments away from an unforgettable private screening.</p>
        </motion.div>

        <div className="mb-10">
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
              {currentStep === 1 && (
                <div className="space-y-8">
                  <div>
                    <h2 className="mb-2 text-[24px] font-bold text-[#1a1c21] font-heading">Select Date & Time</h2>
                    <p className="text-[14px] text-[#6b5c52]">When would you like to reserve the theater?</p>
                  </div>
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-[13px] font-bold text-[#1a1c21] uppercase tracking-wide">Date *</label>
                      <input 
                        type="date" 
                        value={initialDate} 
                        onChange={(e) => setInitialDate(e.target.value)} 
                        className="h-12 w-full rounded-xl border border-[#ecdcd1] bg-[#F9F6F0] px-4 text-[#1a1c21] font-medium outline-none transition focus:border-[#8c5211] focus:ring-1 focus:ring-[#8c5211]/20" 
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-[13px] font-bold text-[#1a1c21] uppercase tracking-wide">Time Slot *</label>
                      <select 
                        value={initialTimeSlot} 
                        onChange={(e) => setInitialTimeSlot(e.target.value)} 
                        className="h-12 w-full rounded-xl border border-[#ecdcd1] bg-[#F9F6F0] px-4 text-[#1a1c21] font-medium outline-none transition focus:border-[#8c5211] focus:ring-1 focus:ring-[#8c5211]/20 cursor-pointer"
                      >
                        <option value="">Select a slot</option>
                        <option value="10:00 AM - 01:00 PM">10:00 AM - 01:00 PM</option>
                        <option value="02:00 PM - 05:00 PM">02:00 PM - 05:00 PM</option>
                        <option value="06:00 PM - 09:00 PM">06:00 PM - 09:00 PM</option>
                        <option value="09:30 PM - 12:30 AM">09:30 PM - 12:30 AM</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-8">
                  <div>
                    <h2 className="mb-2 text-[24px] font-bold text-[#1a1c21] font-heading">Select occasion</h2>
                    <p className="text-[14px] text-[#6b5c52]">Choose what you’re celebrating.</p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    {eventTypes.map((type) => (
                      <button
                        key={type._id}
                        onClick={() => {
                          setSelectedEventType(type._id);
                          setError(null);
                        }}
                        className={`rounded-[24px] border p-5 text-left transition-all duration-300 ${
                          selectedEventType === type._id
                            ? 'border-[#8c5211] bg-[#f9f2eb] shadow-sm'
                            : 'border-[#ecdcd1] bg-white hover:border-[#8c5211]/40 hover:bg-[#F9F6F0]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className={`text-[18px] font-bold ${selectedEventType === type._id ? 'text-[#8c5211]' : 'text-[#1a1c21]'}`}>{type.name}</span>
                          {type.price > 0 && (
                            <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${selectedEventType === type._id ? 'bg-[#8c5211]/10 text-[#8c5211]' : 'bg-[#F9F6F0] text-[#6b5c52]'}`}>
                              +₹{type.price}
                            </span>
                          )}
                        </div>
                        <p className="mt-3 text-[13px] leading-relaxed text-[#6b5c52]">{type.description || 'Premium private experience tailored for your celebration.'}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-8">
                  <div>
                    <h2 className="mb-2 text-[24px] font-bold text-[#1a1c21] font-heading">Add the finishing touches</h2>
                    <p className="text-[14px] text-[#6b5c52]">Optional extras to personalize the experience.</p>
                  </div>

                  <div className="space-y-3">
                    {addons.map((addon) => {
                      const isSelected = selectedAddons[addon._id];
                      return (
                        <div key={addon._id} className={`flex items-center justify-between rounded-[22px] border p-4 md:p-5 transition-all ${isSelected ? 'border-[#8c5211] bg-[#f9f2eb]' : 'border-[#ecdcd1] bg-white'}`}>
                          <div>
                            <p className="text-[16px] font-bold text-[#1a1c21]">{addon.name}</p>
                            <p className="mt-1 text-[13px] text-[#8c5211] font-bold">₹{addon.price}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleAddonToggle(addon._id)}
                            className={`flex h-11 items-center justify-center rounded-xl px-5 text-[13px] font-bold transition-all ${isSelected ? 'bg-[#9e6223] text-white shadow-sm' : 'bg-[#F9F6F0] text-[#1a1c21] hover:bg-[#eaddd0]'}`}
                          >
                            {isSelected ? <><Check className="mr-1.5 h-4 w-4" /> Added</> : 'Add'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-8">
                  <div>
                    <h2 className="mb-2 text-[24px] font-bold text-[#1a1c21] font-heading">Guest details</h2>
                    <p className="text-[14px] text-[#6b5c52]">Tell us who the reservation is for.</p>
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

                    <div>
                      <label className="mb-2 block text-[13px] font-bold text-[#1a1c21] uppercase tracking-wide">Special Requests</label>
                      <textarea value={customerDetails.specialRequest} onChange={(e) => setCustomerDetails((prev) => ({ ...prev, specialRequest: e.target.value }))} placeholder="Any setup or décor notes for your celebration..." className="h-32 w-full resize-none rounded-xl border border-[#ecdcd1] bg-[#F9F6F0] p-4 text-[#1a1c21] font-medium outline-none transition focus:border-[#8c5211] focus:ring-1 focus:ring-[#8c5211]/20 placeholder:text-[#a6998f]" />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-8">
                  <div>
                    <h2 className="mb-2 text-[24px] font-bold text-[#1a1c21] font-heading">Review and confirm</h2>
                    <p className="text-[14px] text-[#6b5c52]">Check the final details before payment.</p>
                  </div>

                  <div className="space-y-6 rounded-[26px] border border-[#ecdcd1] bg-[#FCF5EB] p-6 shadow-sm">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                      <div>
                        <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[#8c5211]">Date & time</p>
                        <p className="text-[20px] font-bold text-[#1a1c21]">{initialDate} <span className="mx-2 text-[#8c5211]">|</span> {initialTimeSlot}</p>
                        <p className="mt-2 font-medium text-[#6b5c52]">{theater?.name}</p>
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-[#f9f2eb] px-3 py-1.5 text-[13px] font-bold text-[#8c5211] border border-[#ecdcd1]">
                        <ShieldCheck className="h-4 w-4" /> Secure booking
                      </div>
                    </div>

                    <div className="h-px bg-[#ecdcd1]" />

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[14px]">
                        <span className="text-[#6b5c52] font-medium">Theater base price</span>
                        <span className="font-bold text-[#1a1c21]">₹{theater?.pricePerHour}</span>
                      </div>

                      {selectedEventType && eventTypes.find((e) => e._id === selectedEventType)?.price > 0 && (
                        <div className="flex items-center justify-between text-[14px]">
                          <span className="text-[#6b5c52] font-medium">{eventTypes.find((e) => e._id === selectedEventType)?.name}</span>
                          <span className="font-bold text-[#1a1c21]">₹{eventTypes.find((e) => e._id === selectedEventType)?.price}</span>
                        </div>
                      )}

                      {Object.entries(selectedAddons).map(([id, qty]) => {
                        const addon = addons.find((a) => a._id === id);
                        if (!addon) return null;
                        return (
                          <div key={id} className="flex items-center justify-between text-[14px]">
                            <span className="text-[#6b5c52] font-medium">{addon.name}</span>
                            <span className="font-bold text-[#1a1c21]">₹{addon.price * qty}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="h-px bg-[#ecdcd1]" />

                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[14px] font-bold text-[#1a1c21]">Total amount</p>
                        <p className="mt-1 text-[12px] font-medium text-[#6b5c52]">Includes all applicable taxes</p>
                      </div>
                      <span className="text-[32px] font-extrabold tracking-tight text-[#9e6223] font-heading">₹{calculateTotal()}</span>
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
                {submitting ? 'Processing...' : 'Pay securely'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

