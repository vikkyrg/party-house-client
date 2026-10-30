import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Clock, Ticket, AlertCircle } from 'lucide-react';
import { useActiveBookingHold } from '../../hooks/useActiveBookingHold';
import { PaymentModal } from '../booking/PaymentModal';

/**
 * CurrentBookingNavbarButton
 *
 * Appears dynamically in the Rio Party House navbar when:
 * 1. User has initiated advance payment
 * 2. Slot is held under 10-minute hold window
 * 3. Payment has not been completed
 * 4. Hold has not expired
 */
export function CurrentBookingNavbarButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    activeBooking,
    hasValidHold,
    formattedTime,
    isPaymentModalOpen,
    openPaymentModal,
    closePaymentModal,
    clearActiveBooking,
  } = useActiveBookingHold();

  if (!hasValidHold || !activeBooking) {
    return null;
  }

  const handleOpenCurrentBooking = () => {
    openPaymentModal();
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpenCurrentBooking}
        className="inline-flex items-center gap-2 rounded-full border border-[#B87525]/70 bg-gradient-to-r from-[#2F2859] to-[#201a40] px-3.5 sm:px-4 py-2 text-white shadow-sm hover:shadow-md hover:border-[#DDAA4B] active:scale-[0.98] transition-all cursor-pointer group"
        title="View active reservation & complete payment"
      >
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#B87525]/30 text-[#F5E2B3] group-hover:scale-105 transition-transform">
          <Ticket className="h-3.5 w-3.5" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[12px] font-bold tracking-tight text-white leading-none">
            Current Booking
          </span>
          <span className="text-[10px] font-semibold text-[#E4C389] leading-none mt-0.5 flex items-center gap-1 font-mono">
            <Clock className="w-2.5 h-2.5" /> {formattedTime}
          </span>
        </div>
      </button>

      {/* Global Payment Modal instance so user can reopen from any page */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={closePaymentModal}
        booking={activeBooking}
        theaterName={activeBooking?.theaterName}
        roomName={activeBooking?.roomName}
        bookingDate={activeBooking?.bookingDate || activeBooking?.date}
        timeSlot={activeBooking?.timeSlot}
        advanceAmount={activeBooking?.pricing?.advanceAmount || 750}
        onPaymentSuccess={(id) => {
          closePaymentModal();
          clearActiveBooking();
          navigate(`/booking/success/${id || activeBooking?._id}`);
        }}
      />
    </>
  );
}

export default CurrentBookingNavbarButton;

