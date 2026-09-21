import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { Button } from '../components/common/Button';
import {
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  Users,
  Film,
  CheckCircle2,
  XCircle,
  CircleAlert,
} from 'lucide-react';
import { format } from 'date-fns';
import { SEO } from '../components/common/SEO';

export function MyBookingsPage() {
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['myBookings'],
    queryFn: () => bookingService.getMyBookings(),
  });

  const bookings = response?.data || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fbf3e9] pt-28 pb-20">
        <LoadingState message="Retrieving your reservations..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#fbf3e9] pt-28 pb-20">
        <ErrorState error={error} onRetry={refetch} />
      </div>
    );
  }

  const getStatusConfig = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return {
          label: 'Confirmed',
          className:
            'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: CheckCircle2,
        };

      case 'PENDING':
        return {
          label: 'Pending',
          className:
            'bg-amber-50 text-amber-700 border-amber-200',
          icon: CircleAlert,
        };

      case 'CANCELLED':
        return {
          label: 'Cancelled',
          className:
            'bg-red-50 text-red-700 border-red-200',
          icon: XCircle,
        };

      case 'COMPLETED':
        return {
          label: 'Completed',
          className:
            'bg-[#f5eadc] text-[#9a5b12] border-[#e5d0b8]',
          icon: CheckCircle2,
        };

      default:
        return {
          label: status || 'Unknown',
          className:
            'bg-gray-50 text-gray-600 border-gray-200',
          icon: CircleAlert,
        };
    }
  };

  const getTheaterName = (booking) => {
    return (
      booking.theater?.name ||
      booking.theaterName ||
      'Private Theater'
    );
  };

  const getRoomName = (booking) => {
    return (
      booking.room?.name ||
      booking.roomName ||
      booking.theaterRoom?.name ||
      'Room'
    );
  };

  const getLocation = (booking) => {
    return (
      booking.theater?.location?.name ||
      booking.theater?.location?.locationName ||
      booking.location?.name ||
      booking.locationName ||
      booking.theater?.city?.name ||
      booking.theater?.city ||
      'Bengaluru'
    );
  };

  const getGuestCount = (booking) => {
    return (
      booking.numberOfMembers ||
      booking.guests ||
      booking.guestCount ||
      booking.members ||
      0
    );
  };

  const getBookingDate = (booking) => {
    if (!booking.date) return 'Date not available';

    try {
      return format(
        new Date(booking.date),
        'EEE, MMM d, yyyy'
      );
    } catch {
      return booking.date;
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf3e9] pt-28 pb-24">
      <SEO title="My Reservations | Rio Party House" />

      <main className="mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-10">

        {/* PAGE HEADER */}
        <section className="mb-10 border-b border-[#ead9c8] pb-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

            <div>
              <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.3em] text-[#b56a18]">
                Reservations
              </span>

              <h1 className="font-heading text-4xl font-bold leading-tight text-[#101828] sm:text-5xl">
                My Experiences
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-[#6f6257]">
                Manage your private cinema reservations and upcoming
                celebrations.
              </p>
            </div>

            <Button
              asChild
              className="
                w-fit
                border
                border-[#d8b48b]
                bg-white
                text-[#8f510f]
                shadow-sm
                hover:bg-[#fff8ef]
                hover:text-[#7c450c]
              "
            >
              <Link to="/theaters">
                Book Another Screening
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

          </div>
        </section>

        {/* EMPTY STATE */}
        {bookings.length === 0 ? (
          <section className="rounded-3xl border border-[#ead9c8] bg-white px-6 py-20 text-center shadow-[0_8px_30px_rgba(100,60,20,0.06)] sm:px-10">

            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#fff3e4] text-[#b56a18]">
              <Film className="h-7 w-7" />
            </div>

            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#b56a18]">
              Reservations
            </p>

            <h2 className="font-heading text-2xl font-bold text-[#172033] sm:text-3xl">
              No reservations yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#75685d]">
              Your private cinema experiences will appear here once
              you complete a booking.
            </p>

            <Button
              asChild
              className="
                mt-8
                rounded-full
                bg-[#a96112]
                px-7
                text-white
                shadow-[0_8px_20px_rgba(169,97,18,0.2)]
                hover:bg-[#8e500c]
              "
            >
              <Link to="/theaters">
                Explore Theaters
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

          </section>
        ) : (

          /* BOOKINGS */
          <section className="space-y-5">

            {bookings.map((booking) => {
              const status = getStatusConfig(booking.status);
              const StatusIcon = status.icon;

              const theaterName = getTheaterName(booking);
              const roomName = getRoomName(booking);
              const location = getLocation(booking);
              const guestCount = getGuestCount(booking);

              return (
                <Link
                  key={booking._id}
                  to={`/account/bookings/${booking._id}`}
                  className="
                    group
                    block
                    overflow-hidden
                    rounded-3xl
                    border
                    border-[#ead9c8]
                    bg-white
                    shadow-[0_8px_30px_rgba(100,60,20,0.06)]
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:border-[#d5ae82]
                    hover:shadow-[0_14px_40px_rgba(100,60,20,0.10)]
                  "
                >

                  <div className="p-6 sm:p-7">

                    {/* TOP ROW */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                      <div>
                        <div className="mb-3 flex flex-wrap items-center gap-3">

                          <span
                            className={`
                              inline-flex
                              items-center
                              gap-1.5
                              rounded-full
                              border
                              px-3
                              py-1.5
                              text-[10px]
                              font-bold
                              uppercase
                              tracking-[0.12em]
                              ${status.className}
                            `}
                          >
                            <StatusIcon className="h-3.5 w-3.5" />
                            {status.label}
                          </span>

                          <span className="text-xs text-[#8a7a6d]">
                            Booking ID: {booking.bookingId || booking._id}
                          </span>

                        </div>

                        <h2 className="font-heading text-2xl font-bold text-[#172033] transition-colors group-hover:text-[#a96112]">
                          {theaterName}
                        </h2>

                        {/* ROOM */}
                        <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-[#a96112]">
                          <Film className="h-4 w-4" />
                          {roomName}
                        </div>
                      </div>

                      {/* PRICE */}
                      <div className="text-left sm:text-right">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#927f70]">
                          Total
                        </p>

                        <p className="mt-1 text-2xl font-bold text-[#172033]">
                          ₹{Number(booking.totalPrice || 0).toLocaleString('en-IN')}
                        </p>
                      </div>

                    </div>

                    {/* DIVIDER */}
                    <div className="my-6 h-px bg-[#eee1d3]" />

                    {/* BOOKING DETAILS */}
                    <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">

                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff5e9] text-[#a96112]">
                          <Calendar className="h-4 w-4" />
                        </div>

                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9a8878]">
                            Date
                          </p>
                          <p className="mt-1 font-medium text-[#303746]">
                            {getBookingDate(booking)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff5e9] text-[#a96112]">
                          <Clock className="h-4 w-4" />
                        </div>

                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9a8878]">
                            Time Slot
                          </p>
                          <p className="mt-1 font-medium text-[#303746]">
                            {booking.timeSlot || 'Time not available'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff5e9] text-[#a96112]">
                          <MapPin className="h-4 w-4" />
                        </div>

                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9a8878]">
                            Location
                          </p>
                          <p className="mt-1 font-medium text-[#303746]">
                            {location}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff5e9] text-[#a96112]">
                          <Users className="h-4 w-4" />
                        </div>

                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9a8878]">
                            Guests
                          </p>
                          <p className="mt-1 font-medium text-[#303746]">
                            {guestCount || 'Not specified'}
                          </p>
                        </div>
                      </div>

                    </div>

                    {/* FOOTER */}
                    <div className="mt-6 flex items-center justify-between border-t border-[#eee1d3] pt-5">

                      <span className="text-xs text-[#8a7a6d]">
                        Click to view booking details
                      </span>

                      <span className="flex items-center gap-2 text-sm font-semibold text-[#a96112] transition-transform group-hover:translate-x-1">
                        View Details
                        <ArrowRight className="h-4 w-4" />
                      </span>

                    </div>

                  </div>
                </Link>
              );
            })}

          </section>
        )}

      </main>
    </div>
  );
}