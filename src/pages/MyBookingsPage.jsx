import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { Button } from '../components/common/Button';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { SEO } from '../components/common/SEO';

export function MyBookingsPage() {
  const { data: response, isLoading, error, refetch } = useQuery({
    queryKey: ['myBookings'],
    queryFn: () => bookingService.getMyBookings(),
  });

  const bookings = response?.data || [];

  if (isLoading) return <LoadingState message="Retrieving your experiences..." />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'text-success bg-success/10 border-success/20';
      case 'PENDING': return 'text-pending bg-pending/10 border-pending/20';
      case 'CANCELLED': return 'text-cancelled bg-cancelled/10 border-cancelled/20';
      case 'COMPLETED': return 'text-primary bg-primary/10 border-primary/20';
      default: return 'text-text-muted bg-white/5 border-white/10';
    }
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <SEO title="My Cinema Experiences | CS Cinemas" />

      <div className="container mx-auto px-6 md:px-12 max-w-5xl">
        <div className="mb-12 md:flex justify-between items-end border-b border-white/10 pb-8">
          <div>
            <span className="text-[10px] font-sans font-semibold tracking-[0.3em] uppercase text-primary mb-4 block">Reservations</span>
            <h1 className="text-4xl md:text-5xl font-heading text-white">My Experiences</h1>
          </div>
          <Button asChild variant="outline" className="mt-6 md:mt-0 border-white/10 hover:border-primary/50 text-white hover:text-primary">
            <Link to="/theaters">Book Another Screening</Link>
          </Button>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-surface border border-white/5 p-16 text-center">
            <h3 className="text-2xl font-heading text-white mb-4">No reservations yet.</h3>
            <p className="text-text-muted font-sans mb-8">Your private cinematic experiences will appear here.</p>
            <Button asChild className="bg-primary text-background hover:bg-primary-hover">
              <Link to="/theaters">Explore Theaters</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <Link 
                key={booking._id} 
                to={`/account/bookings/${booking._id}`}
                className="group block bg-surface border border-white/5 hover:border-primary/30 transition-colors p-6 md:p-8"
              >
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`px-3 py-1 text-[10px] font-sans font-bold uppercase tracking-widest border ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                      <span className="text-xs font-sans text-text-muted">ID: {booking.bookingId}</span>
                    </div>

                    <h2 className="text-2xl font-heading text-white mb-4 group-hover:text-primary transition-colors">
                      {booking.theater?.name || 'Private Theater'}
                    </h2>
                    
                    <div className="flex flex-wrap items-center gap-6 text-sm font-sans text-text-muted">
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {booking.date ? format(new Date(booking.date), 'MMMM d, yyyy') : 'TBD'}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {booking.timeSlot}
                      </span>
                      <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {booking.theater?.city?.name || booking.theater?.city || 'Bengaluru'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:flex-col md:items-end md:justify-center border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-8">
                    <div className="text-left md:text-right">
                      <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-text-muted mb-1">Total</p>
                      <p className="text-2xl font-heading text-white">₹{booking.totalPrice}</p>
                    </div>
                    <div className="hidden md:flex items-center gap-2 mt-4 text-xs font-sans text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      View Details <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
