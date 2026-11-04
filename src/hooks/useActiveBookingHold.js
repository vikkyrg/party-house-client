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
  const bookingRemainingBalance = Number(
    activeBooking?.paymentSummary?.remainingBalance ??
    Math.max(
      0,
      Number(activeBooking?.pricing?.total || 0) -
        Number(activeBooking?.payment?.amountPaid || 0)
    )
  );
  const hasPaymentBalance = activeBooking?.status === 'confirmed' && bookingRemainingBalance > 0;

  // Compute countdown timer accurately against the real expiration timestamp
  useEffect(() => {
    if (!activeBooking) {
      setHasValidHold(false);
      setRemainingSeconds(0);
      return;
    }

    if (activeBooking.status === 'confirmed') {
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
    if (!activeBooking?._id || (!hasValidHold && !hasPaymentBalance)) return;

    let isMounted = true;
    const verifyStatus = async () => {
      try {
        const res = await paymentService.checkStatus(activeBooking._id);
        if (!isMounted) return;
        if (res.success && res.data) {
          if (
            res.data.isExpired ||
            res.data.status === 'cancelled' ||
            (res.data.status === 'confirmed' && Number(res.data.paymentSummary?.remainingBalance) <= 0)
          ) {
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
  }, [activeBooking?._id, hasValidHold, hasPaymentBalance, clearActiveBooking, setActiveBooking]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return {
    activeBooking,
    hasValidHold,
    hasPaymentBalance,
    bookingRemainingBalance,
    remainingSeconds,
    formattedTime,
    isPaymentModalOpen,
    openPaymentModal,
    closePaymentModal,
    clearActiveBooking,
    setActiveBooking,
  };
}
