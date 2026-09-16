import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Calendar, Clock, MapPin, CheckCircle, Receipt } from 'lucide-react';
import { bookingService } from '../services/bookingService';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { Button } from '../components/common/Button';
import { format } from 'date-fns';
import { SEO } from '../components/common/SEO';

export function BookingDetailsPage() {
  const { id } = useParams();

  const { data: response, isLoading, error, refetch } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingService.getBookingById(id),
    enabled: !!id,
  });

  const booking = response?.data;

  if (isLoading) return <LoadingState message="Loading your reservation details..." />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;
  if (!booking) return <div className="text-center py-20 text-white font-heading">Reservation not found.</div>;

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'text-success border-success bg-success/10';
      case 'PENDING': return 'text-pending border-pending bg-pending/10';
      case 'CANCELLED': return 'text-cancelled border-cancelled bg-cancelled/10';
      case 'COMPLETED': return 'text-primary border-primary bg-primary/10';
      default: return 'text-text-muted border-white/20 bg-white/5';
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] pt-32 pb-24">
      <SEO title={`Reservation ${booking.bookingId} | CS Cinemas`} />

      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <Link to="/account/bookings" className="inline-flex items-center gap-2 text-sm font-sans text-text-muted hover:text-white transition-colors mb-10">
          <ArrowLeft className="w-4 h-4" /> Back to My Experiences
        </Link>

        <div className="bg-[#151515] border border-white/5 p-8 md:p-12 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-8 border-b border-white/5">
            <div>
              <span className="text-[10px] font-sans font-semibold tracking-[0.3em] uppercase text-text-muted mb-4 block">
                Reservation #{booking.bookingId}
              </span>
              <h1 className="text-3xl md:text-5xl font-heading text-white">{booking.theater?.name}</h1>
            </div>
            <div className={`px-4 py-1.5 text-xs font-sans font-bold uppercase tracking-widest border ${getStatusColor(booking.status)}`}>
              {booking.status}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-sans font-semibold text-text-muted uppercase tracking-widest mb-4">Schedule & Location</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Calendar className="w-5 h-5 text-white/50 mt-1" />
                    <div>
                      <p className="font-sans text-white">{booking.date ? format(new Date(booking.date), 'MMMM d, yyyy') : 'TBD'}</p>
                      <p className="text-sm text-text-muted">Date</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Clock className="w-5 h-5 text-white/50 mt-1" />
                    <div>
                      <p className="font-sans text-white">{booking.timeSlot}</p>
                      <p className="text-sm text-text-muted">Time</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-white/50 mt-1" />
                    <div>
                      <p className="font-sans text-white">{booking.theater?.city?.name || booking.theater?.city || 'Bengaluru'}</p>
                      <p className="text-sm text-text-muted">Location</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-sans font-semibold text-text-muted uppercase tracking-widest mb-4">Guest Details</h3>
                <div className="space-y-2 font-sans text-white">
                  <p><span className="text-text-muted inline-block w-24">Name:</span> {booking.customerDetails?.name}</p>
                  <p><span className="text-text-muted inline-block w-24">Phone:</span> {booking.customerDetails?.phone}</p>
                  <p><span className="text-text-muted inline-block w-24">Email:</span> {booking.customerDetails?.email}</p>
                </div>
                {booking.customerDetails?.specialRequest && (
                  <div className="mt-4 p-4 bg-[#1B1B1B] border border-white/5">
                    <p className="text-xs font-sans text-text-muted uppercase tracking-wider mb-2">Special Request</p>
                    <p className="text-sm font-sans text-white italic">"{booking.customerDetails.specialRequest}"</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="bg-[#1B1B1B] p-8 border border-white/5">
                <h3 className="text-sm font-sans font-semibold text-text-muted uppercase tracking-widest mb-6">Payment Summary</h3>
                
                <div className="space-y-4 font-sans text-sm pb-6 border-b border-white/5 mb-6">
                  <div className="flex justify-between items-center text-text-muted">
                    <span>Theater Reservation</span>
                    <span className="text-white">₹{booking.theater?.pricePerHour || 0}</span>
                  </div>
                  
                  {booking.eventType && (
                    <div className="flex justify-between items-center text-text-muted">
                      <span>Occasion: {booking.eventType.name}</span>
                      <span className="text-white">₹{booking.eventType.price || 0}</span>
                    </div>
                  )}

                  {booking.addons?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-text-muted">
                      <span>{item.addon?.name} {item.quantity > 1 ? `x${item.quantity}` : ''}</span>
                      <span className="text-white">₹{(item.addon?.price || 0) * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-end justify-between mb-8">
                  <div>
                    <p className="text-sm font-sans text-text-muted mb-1">Total Paid</p>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="text-xs text-success font-sans">Payment Successful</span>
                    </div>
                  </div>
                  <span className="text-3xl font-heading text-white">₹{booking.totalPrice}</span>
                </div>

                <Button asChild className="w-full">
                  <Link to={`/booking/invoice/${booking.bookingId}`}>
                    <Receipt className="w-4 h-4 mr-2" /> Download Invoice
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
