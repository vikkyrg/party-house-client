import { useEffect, useState } from 'react';
import { bookingService } from '../services/bookingService';
import { useAuthStore } from '../store/authStore';
import { LoadingState } from '../components/common/LoadingState';
import { handleApiError } from '../lib/apiClient';
import { Button } from '../components/common/Button';
import { Calendar, Clock, MapPin, IndianRupee, FileText, Ticket } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SEO } from '../components/common/SEO';

export function MyBookingsPage() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchBookings = async () => {
      try {
        const response = await bookingService.getMyBookings();
        if (response.success) {
          setBookings(response.data);
        }
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [isAuthenticated, navigate]);

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-primary/20 text-primary border-primary/30',
      confirmed: 'bg-green-500/20 text-green-400 border-green-500/30',
      completed: 'bg-white/10 text-white/70 border-white/20',
      cancelled: 'bg-error/20 text-error border-error/30'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest border ${styles[status] || styles.pending}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-24 pt-28 relative overflow-hidden">
      <SEO title="My Bookings | CS Cinemas" />

      <div className="absolute -left-24 top-1/4 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[150px] pointer-events-none" />

      <div className="container relative z-10 mx-auto max-w-5xl px-4">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <span className="eyebrow mb-4">Bookings</span>
          <h1 className="text-3xl md:text-5xl font-black text-white font-heading tracking-tight">My Reservations</h1>
          <p className="mt-3 text-lg text-text-muted">Track every celebration and upcoming private theater booking.</p>
        </motion.div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 animate-pulse rounded-[28px] border border-white/10 bg-white/[0.03]" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-[28px] border border-error/20 bg-error/10 p-8 text-error glass-card">{error}</div>
        ) : bookings.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto max-w-2xl rounded-[30px] border border-white/10 bg-[#141519] p-12 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/12 text-primary">
              <Ticket className="h-8 w-8" />
            </div>
            <h3 className="mb-3 text-3xl font-bold text-white font-heading">No bookings yet</h3>
            <p className="mb-8 text-lg text-text-muted">You haven’t planned a premium celebration with us yet.</p>
            <Button asChild size="lg" className="px-10 font-bold shadow-[0_14px_36px_rgba(214,168,79,0.2)]">
              <Link to="/theaters">Book a theater</Link>
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {bookings.map((booking, i) => (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-[30px] border border-white/10 bg-[#141519] p-6 transition-colors hover:border-primary/30 md:p-7"
                >
                  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="mb-3 flex items-center gap-3">
                        <h3 className="text-2xl font-bold text-white font-heading">{booking.theater?.name || 'Unknown Theater'}</h3>
                        {getStatusBadge(booking.status)}
                      </div>
                      <p className="font-mono text-xs text-text-muted">ID: {booking._id}</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Link to={`/account/bookings/${booking._id}`} className="flex h-12 items-center justify-center rounded-xl bg-primary px-5 text-sm font-bold text-black shadow-[0_12px_30px_rgba(214,168,79,0.2)] transition hover:-translate-y-0.5">
                        View details
                      </Link>
                      {booking.status === 'confirmed' && (
                        <a href={`/api/v1/bookings/${booking._id}/invoice`} target="_blank" rel="noreferrer" className="flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-5 text-sm font-semibold text-white transition hover:bg-white/[0.08]">
                          <FileText className="mr-2 h-4 w-4 text-primary" /> Invoice
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 border-t border-white/10 pt-5 md:grid-cols-4">
                    <div>
                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">Date</p>
                      <p className="flex items-center gap-2 text-white"><Calendar className="h-4 w-4 text-primary" /> {new Date(booking.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">Time</p>
                      <p className="flex items-center gap-2 text-white"><Clock className="h-4 w-4 text-primary" /> {booking.timeSlot}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">Location</p>
                      <p className="flex items-center gap-2 text-white"><MapPin className="h-4 w-4 text-primary" /> {booking.theater?.city?.name || booking.theater?.city || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">Amount</p>
                      <p className="flex items-center gap-2 text-white"><IndianRupee className="h-4 w-4 text-primary" /> {booking.totalAmount}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

