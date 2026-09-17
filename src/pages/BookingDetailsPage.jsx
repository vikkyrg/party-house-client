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
    <div className="min-h-screen bg-surface-container-low pt-32 pb-24">
      <SEO title={`Reservation ${booking.bookingId} | CS Cinemas`} />

      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <Link to="/account/bookings" className="inline-flex items-center gap-2 text-sm font-bold font-sans text-on-surface-variant hover:text-primary transition-colors mb-10">
          <ArrowLeft className="w-4 h-4" /> Back to My Experiences
        </Link>

        <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-8 md:p-12 mb-8 shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-8 border-b border-surface-container">
            <div>
              <span className="font-label-sm text-[11px] font-bold tracking-widest uppercase text-primary mb-2 block">
                Reservation #{booking.bookingId}
              </span>
              <h1 className="text-3xl md:text-5xl font-heading text-on-surface font-extrabold">{booking.theater?.name}</h1>
            </div>
            <div className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest border ${getStatusColor(booking.status)}`}>
              {booking.status}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-4">Schedule & Location</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Calendar className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-bold text-on-surface">{booking.date ? format(new Date(booking.date), 'MMMM d, yyyy') : 'TBD'}</p>
                      <p className="text-sm text-on-surface-variant font-medium">Date</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Clock className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-bold text-on-surface">{booking.timeSlot}</p>
                      <p className="text-sm text-on-surface-variant font-medium">Time</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-bold text-on-surface">{booking.theater?.city?.name || booking.theater?.city || 'Bengaluru'}</p>
                      <p className="text-sm text-on-surface-variant font-medium">Location</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-4">Guest Details</h3>
                <div className="space-y-2 font-medium text-on-surface">
                  <p><span className="text-on-surface-variant inline-block w-24">Name:</span> {booking.customerDetails?.name}</p>
                  <p><span className="text-on-surface-variant inline-block w-24">Phone:</span> {booking.customerDetails?.phone}</p>
                  <p><span className="text-on-surface-variant inline-block w-24">Email:</span> {booking.customerDetails?.email}</p>
                </div>
                {booking.customerDetails?.specialRequest && (
                  <div className="mt-4 p-4 bg-surface-container rounded-2xl border border-surface-variant">
                    <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Special Request</p>
                    <p className="text-sm font-medium text-on-surface italic">"{booking.customerDetails.specialRequest}"</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="bg-surface p-8 rounded-2xl border border-surface-container shadow-sm">
                <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-6">Payment Summary</h3>
                
                <div className="space-y-4 font-medium text-sm pb-6 border-b border-surface-container mb-6">
                  <div className="flex justify-between items-center text-on-surface-variant">
                    <span>Theater Reservation</span>
                    <span className="text-on-surface font-bold">₹{booking.theater?.pricePerHour || 0}</span>
                  </div>
                  
                  {booking.eventType && (
                    <div className="flex justify-between items-center text-on-surface-variant">
                      <span>Occasion: {booking.eventType.name}</span>
                      <span className="text-on-surface font-bold">₹{booking.eventType.price || 0}</span>
                    </div>
                  )}

                  {booking.addons?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-on-surface-variant">
                      <span>{item.addon?.name} {item.quantity > 1 ? `x${item.quantity}` : ''}</span>
                      <span className="text-on-surface font-bold">₹{(item.addon?.price || 0) * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-end justify-between mb-8">
                  <div>
                    <p className="text-sm font-bold text-on-surface-variant mb-1">Total Paid</p>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="text-xs text-success font-bold uppercase tracking-wider">Payment Successful</span>
                    </div>
                  </div>
                  <span className="text-3xl font-heading text-primary font-extrabold">₹{booking.totalPrice}</span>
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
