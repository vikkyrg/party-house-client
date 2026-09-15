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
import { env } from '../config/env';
import { Check, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { SEO } from '../components/common/SEO';

const STEPS = [
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
  
  // Form State
  const initialDate = location.state?.date || '';
  const initialTimeSlot = location.state?.timeSlot || '';
  
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

    if (!initialDate || !initialTimeSlot) {
      // If landed without selection, go back to theater details
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
    if (currentStep === 1 && !selectedEventType) {
      setError('Please select an occasion for your celebration.');
      return false;
    }
    if (currentStep === 3 && (!customerDetails.name || !customerDetails.phone)) {
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
            key: key || env.VITE_RAZORPAY_KEY_ID,
            amount: amount,
            currency: currency,
            name: env.APP_NAME,
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
    <div className="min-h-screen bg-background pb-20 pt-28 relative overflow-hidden">
      <SEO title="Complete Booking | CS Cinemas" />

      <div className="absolute -left-20 top-24 h-[520px] w-[520px] rounded-full bg-primary/5 blur-[140px] pointer-events-none" />
      <div className="absolute right-0 top-1/3 h-[420px] w-[420px] rounded-full bg-primary/5 blur-[140px] pointer-events-none" />

      <div className="container relative z-10 mx-auto max-w-4xl px-4">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <span className="eyebrow mb-4">Reservation</span>
          <h1 className="text-3xl md:text-5xl font-black text-white font-heading tracking-tight">Complete Your Experience</h1>
          <p className="mt-3 text-text-muted text-lg">You’re moments away from an unforgettable private screening.</p>
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

        <div className="glass-card rounded-[30px] border border-white/10 p-6 shadow-[0_18px_44px_rgba(0,0,0,0.25)] md:p-10">
          <AnimatePresence mode="wait">
            <motion.div key={currentStep} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.2, ease: 'easeOut' }}>
              {currentStep === 1 && (
                <div className="space-y-8">
                  <div>
                    <h2 className="mb-2 text-2xl font-bold text-white font-heading">Select occasion</h2>
                    <p className="text-sm text-text-muted">Choose what you’re celebrating.</p>
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
                            ? 'border-primary/50 bg-primary/10 shadow-[0_0_0_1px_rgba(214,168,79,0.18)]'
                            : 'border-white/10 bg-white/[0.02] hover:border-primary/30 hover:bg-white/[0.04]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className={`text-lg font-semibold ${selectedEventType === type._id ? 'text-primary' : 'text-white'}`}>{type.name}</span>
                          {type.price > 0 && (
                            <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${selectedEventType === type._id ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white/70'}`}>
                              +₹{type.price}
                            </span>
                          )}
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-text-muted">{type.description || 'Premium private experience tailored for your celebration.'}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-8">
                  <div>
                    <h2 className="mb-2 text-2xl font-bold text-white font-heading">Add the finishing touches</h2>
                    <p className="text-sm text-text-muted">Optional extras to personalize the experience.</p>
                  </div>

                  <div className="space-y-3">
                    {addons.map((addon) => {
                      const isSelected = selectedAddons[addon._id];
                      return (
                        <div key={addon._id} className={`flex items-center justify-between rounded-[22px] border p-4 md:p-5 transition-all ${isSelected ? 'border-primary/40 bg-primary/8' : 'border-white/10 bg-white/[0.02]'}`}>
                          <div>
                            <p className="text-lg font-semibold text-white">{addon.name}</p>
                            <p className="mt-1 text-sm text-primary font-medium">₹{addon.price}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleAddonToggle(addon._id)}
                            className={`flex h-11 items-center justify-center rounded-xl px-5 text-sm font-bold transition-all ${isSelected ? 'bg-primary text-black shadow-[0_10px_24px_rgba(214,168,79,0.25)]' : 'bg-white/8 text-white hover:bg-white/12'}`}
                          >
                            {isSelected ? <><Check className="mr-1.5 h-4 w-4" /> Added</> : 'Add'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-8">
                  <div>
                    <h2 className="mb-2 text-2xl font-bold text-white font-heading">Guest details</h2>
                    <p className="text-sm text-text-muted">Tell us who the reservation is for.</p>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-white/90">Full Name *</label>
                      <input type="text" value={customerDetails.name} onChange={(e) => setCustomerDetails((prev) => ({ ...prev, name: e.target.value }))} placeholder="John Doe" className="h-12 w-full rounded-2xl border border-white/10 bg-[#101014] px-4 text-white outline-none transition focus:border-primary/50" />
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-white/90">Phone Number *</label>
                        <input type="tel" value={customerDetails.phone} onChange={(e) => setCustomerDetails((prev) => ({ ...prev, phone: e.target.value }))} placeholder="10-digit number" className="h-12 w-full rounded-2xl border border-white/10 bg-[#101014] px-4 text-white outline-none transition focus:border-primary/50" />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-white/90">Email Address</label>
                        <input type="email" value={customerDetails.email} onChange={(e) => setCustomerDetails((prev) => ({ ...prev, email: e.target.value }))} placeholder="For booking receipt" className="h-12 w-full rounded-2xl border border-white/10 bg-[#101014] px-4 text-white outline-none transition focus:border-primary/50" />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-white/90">Special Requests</label>
                      <textarea value={customerDetails.specialRequest} onChange={(e) => setCustomerDetails((prev) => ({ ...prev, specialRequest: e.target.value }))} placeholder="Any setup or décor notes for your celebration..." className="h-32 w-full resize-none rounded-2xl border border-white/10 bg-[#101014] p-4 text-white outline-none transition focus:border-primary/50" />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-8">
                  <div>
                    <h2 className="mb-2 text-2xl font-bold text-white font-heading">Review and confirm</h2>
                    <p className="text-sm text-text-muted">Check the final details before payment.</p>
                  </div>

                  <div className="space-y-6 rounded-[26px] border border-white/10 bg-[#0f1013] p-6">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                      <div>
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-white/50">Date & time</p>
                        <p className="text-xl font-semibold text-white">{initialDate} <span className="mx-2 text-primary">|</span> {initialTimeSlot}</p>
                        <p className="mt-2 text-text-muted">{theater?.name}</p>
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
                        <ShieldCheck className="h-4 w-4" /> Secure booking
                      </div>
                    </div>

                    <div className="h-px bg-white/10" />

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/75">Theater base price</span>
                        <span className="font-semibold text-white">₹{theater?.pricePerHour}</span>
                      </div>

                      {selectedEventType && eventTypes.find((e) => e._id === selectedEventType)?.price > 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/75">{eventTypes.find((e) => e._id === selectedEventType)?.name}</span>
                          <span className="font-semibold text-white">₹{eventTypes.find((e) => e._id === selectedEventType)?.price}</span>
                        </div>
                      )}

                      {Object.entries(selectedAddons).map(([id, qty]) => {
                        const addon = addons.find((a) => a._id === id);
                        if (!addon) return null;
                        return (
                          <div key={id} className="flex items-center justify-between text-sm">
                            <span className="text-white/75">{addon.name}</span>
                            <span className="font-semibold text-white">₹{addon.price * qty}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="h-px bg-white/10" />

                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white/80">Total amount</p>
                        <p className="mt-1 text-xs text-text-muted">Includes all applicable taxes</p>
                      </div>
                      <span className="text-4xl font-black tracking-tight text-primary font-heading">₹{calculateTotal()}</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-8">
            {currentStep > 1 ? (
              <button type="button" onClick={handleBack} disabled={submitting} className="flex items-center gap-2 px-2 text-sm font-semibold text-white/60 transition hover:text-white disabled:opacity-50">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
            ) : <div />}

            {currentStep < STEPS.length ? (
              <Button onClick={handleNext} className="h-12 rounded-xl border-0 bg-white/10 px-8 text-white hover:bg-white/15">
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleCreateBooking} disabled={submitting} className="h-12 rounded-xl bg-primary px-10 text-black hover:bg-primary-hover shadow-[0_10px_30px_rgba(214,168,79,0.25)]">
                {submitting ? 'Processing...' : 'Pay securely'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

