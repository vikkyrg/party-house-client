import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useBookingModalStore = create(
  persist(
    (set, get) => ({
      activeBooking: null, // holds booking object: { _id, bookingId, date, timeSlot, holdExpiresAt, theaterName, roomName, pricing... }
      isPaymentModalOpen: false,

      setActiveBooking: (booking) => {
        set({ activeBooking: booking });
      },

      openPaymentModal: (booking) => {
        if (booking) {
          set({ activeBooking: booking, isPaymentModalOpen: true });
        } else {
          set({ isPaymentModalOpen: true });
        }
      },

      closePaymentModal: () => {
        set({ isPaymentModalOpen: false });
      },

      clearActiveBooking: () => {
        set({ activeBooking: null, isPaymentModalOpen: false });
      },

      isHoldValid: () => {
        const { activeBooking } = get();
        if (!activeBooking) return false;
        const expiresAt = activeBooking.holdExpiresAt || activeBooking.expiresAt;
        if (!expiresAt) return false;
        return new Date(expiresAt).getTime() > Date.now();
      },
    }),
    {
      name: 'rio-active-booking-hold',
      partialize: (state) => ({ activeBooking: state.activeBooking }),
    }
  )
);

