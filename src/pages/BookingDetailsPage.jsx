import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { handleApiError } from '../lib/apiClient';
import { Calendar, Clock, MapPin, IndianRupee, FileText, ArrowLeft, Users, Gift, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { SEO } from '../components/common/SEO';

export function BookingDetailsPage() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await bookingService.getMyBookings();
        if (response.success) {
          const found = response.data.find(b => b._id === bookingId);
          if (found) {
            setBooking(found);
          } else {
            setError("Booking not found");
          }
        }
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-20 container mx-auto px-4 max-w-4xl">
        <div className="h-8 bg-white/5 w-1/4 rounded mb-10 animate-pulse" />
        <div className="h-32 bg-white/5 rounded-3xl animate-pulse mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div className="h-64 bg-white/5 rounded-3xl animate-pulse" />
            <div className="h-48 bg-white/5 rounded-3xl animate-pulse" />
          </div>
          <div className="md:col-span-1 h-96 bg-white/5 rounded-3xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 text-center">
        <div className="p-8 bg-error/10 text-error rounded-2xl max-w-md mx-auto mb-6 border border-error/20 glass-card">
          {error || "Booking not found"}
        </div>
        <Link to="/account/bookings" className="inline-flex items-center justify-center h-12 px-6 rounded-xl bg-white/5 text-white font-semibold border border-white/10 hover:bg-white/10 transition-all">
          <ArrowLeft className="w-4 h-4 mr-2"/> Back to My Bookings
        </Link>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-primary/20 text-primary border-primary/30',
      confirmed: 'bg-green-500/20 text-green-400 border-green-500/30',
      completed: 'bg-white/10 text-white/70 border-white/20',
      cancelled: 'bg-error/20 text-error border-error/30'
    };
    return (
      <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${styles[status] || styles.pending}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-24 pt-28 relative overflow-hidden">
      <SEO title={`Booking #${booking._id.substring(0, 8)} | CS Cinemas`} />

      <div className="absolute -right-20 top-1/4 h-[420px] w-[420px] rounded-full bg-primary/5 blur-[150px] pointer-events-none" />

      <div className="container relative z-10 mx-auto max-w-5xl px-4">
        <motion.div initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <Link to="/account/bookings" className="inline-flex items-center text-text-muted transition hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to bookings
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col gap-6 rounded-[30px] border border-white/10 bg-[#141519] p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 font-mono text-sm text-primary">ID: {booking._id}</p>
            <h1 className="text-3xl md:text-4xl font-black text-white font-heading tracking-tight">Booking summary</h1>
            <p className="mt-2 text-text-muted">Placed on {new Date(booking.createdAt || booking.date).toLocaleDateString()}</p>
          </div>
          <div className="flex flex-col items-start md:items-end">
            <span className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/50">Current status</span>
            {getStatusBadge(booking.status)}
          </div>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="space-y-8 md:col-span-2">
            <section className="rounded-[28px] border border-white/10 bg-[#141519] p-8">
              <h2 className="mb-6 flex items-center gap-2 border-b border-white/10 pb-4 text-xl font-bold text-white font-heading">
                <Calendar className="h-5 w-5 text-primary" /> Event details
              </h2>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/50">Theater</p>
                  <p className="flex items-start gap-2 text-lg font-bold text-white"><MapPin className="mt-0.5 h-5 w-5 text-primary" /> {booking.theater?.name || 'Standard Theater'}</p>
                </div>
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/50">Occasion</p>
                  <p className="flex items-start gap-2 text-lg font-bold text-white"><Gift className="mt-0.5 h-5 w-5 text-primary" /> {booking.eventType?.name || 'Special Celebration'}</p>
                </div>
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/50">Date</p>
                  <p className="text-lg font-bold text-white">{new Date(booking.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/50">Time slot</p>
                  <p className="flex items-center gap-2 text-lg font-bold text-white"><Clock className="h-5 w-5 text-primary" /> {booking.timeSlot}</p>
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-white/10 bg-[#141519] p-8">
              <h2 className="mb-6 flex items-center gap-2 border-b border-white/10 pb-4 text-xl font-bold text-white font-heading">
                <Users className="h-5 w-5 text-primary" /> Guest information
              </h2>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/50">Name</p>
                  <p className="text-lg font-bold text-white">{booking.customerDetails?.name || 'Guest'}</p>
                </div>
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/50">Phone</p>
                  <p className="text-lg font-bold text-white">{booking.customerDetails?.phone || 'Not provided'}</p>
                </div>
              </div>

              {booking.customerDetails?.specialRequest && (
                <div className="mt-8 border-t border-white/10 pt-6">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/50">Special requests</p>
                  <div className="rounded-[22px] border border-white/10 bg-white/[0.02] p-5">
                    <p className="text-white/90 italic leading-relaxed">{booking.customerDetails.specialRequest}</p>
                  </div>
                </div>
              )}
            </section>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="md:col-span-1">
            <div className="sticky top-28 rounded-[30px] border border-white/10 bg-[#141519] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
              <h2 className="mb-6 text-xl font-bold text-white font-heading">Payment details</h2>

              <div className="space-y-4 border-b border-white/10 pb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">Subtotal</span>
                  <span className="font-semibold text-white">₹{booking.totalAmount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">Taxes & fees</span>
                  <span className="font-semibold text-white">₹0</span>
                </div>
              </div>

              <div className="mt-6 rounded-[22px] border border-white/10 bg-black/30 p-5">
                <div className="flex items-end justify-between">
                  <span className="text-sm font-semibold text-white/75">Total paid</span>
                  <span className="text-3xl font-black tracking-tight text-primary font-heading">₹{booking.totalAmount}</span>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-primary/75">
                  <ShieldCheck className="h-3.5 w-3.5" /> Securely paid
                </div>
              </div>

              {booking.status === 'confirmed' && (
                <a href={`/api/v1/bookings/${booking._id}/invoice`} target="_blank" rel="noreferrer" className="mt-8 flex h-12 w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-sm font-bold text-white transition hover:bg-white/[0.08]">
                  <FileText className="mr-2 h-4 w-4 text-primary" /> Download invoice
                </a>
              )}

              {booking.status === 'pending' && (
                <button type="button" className="mt-8 flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-bold text-black shadow-[0_12px_30px_rgba(214,168,79,0.2)] transition hover:-translate-y-0.5">
                  Complete payment
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

