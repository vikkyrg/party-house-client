import { useState, useEffect } from 'react';
import { useBookingModalStore } from '../store/bookingModalStore';
import { paymentService } from '../services/paymentService';

/**
 * Hook to manage active booking hold state, remaining time, and modal controls
 */
export function useActiveBookingHold() {
  const {
    activeBooking,
    isPaymentModalOpen,
    setActiveBooking,
    openPaymentModal,
    closePaymentModal,
    clearActiveBooking,
    isHoldValid,
  } = useBookingModalStore();

  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [hasValidHold, setHasValidHold] = useState(false);

  // Compute countdown timer accurately against the real expiration timestamp
  useEffect(() => {
    if (!activeBooking) {
      setHasValidHold(false);
      setRemainingSeconds(0);
      return;
    }

    const expiresAt = activeBooking.holdExpiresAt || activeBooking.expiresAt;
    if (!expiresAt) {
      setHasValidHold(false);
      setRemainingSeconds(0);
      return;
    }

    const targetTime = new Date(expiresAt).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.floor((targetTime - now) / 1000);
      if (diff <= 0) {
        setRemainingSeconds(0);
        setHasValidHold(false);
        clearActiveBooking();
      } else {
        setRemainingSeconds(diff);
        setHasValidHold(true);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeBooking, clearActiveBooking]);

  // Periodic status re-validation with backend
  useEffect(() => {
    if (!activeBooking?._id || !hasValidHold) return;

    let isMounted = true;
    const verifyStatus = async () => {
      try {
        const res = await paymentService.checkStatus(activeBooking._id);
        if (!isMounted) return;
        if (res.success && res.data) {
          if (res.data.status === 'confirmed' || res.data.paymentStatus === 'paid' || res.data.isExpired || res.data.status === 'cancelled') {
            clearActiveBooking();
          } else if (res.data.holdExpiresAt || res.data.expiresAt) {
            setActiveBooking({
              ...activeBooking,
              ...res.data,
            });
          }
        }
      } catch (e) {
        // keep local state if network temporarily drops
      }
    };

    const interval = setInterval(verifyStatus, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [activeBooking?._id, hasValidHold, clearActiveBooking, setActiveBooking]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return {
    activeBooking,
    hasValidHold,
    remainingSeconds,
    formattedTime,
    isPaymentModalOpen,
    openPaymentModal,
    closePaymentModal,
    clearActiveBooking,
    setActiveBooking,
  };
}
