import { create } from 'zustand';

export const useBookingModalStore = create((set, get) => ({
  activeBooking: null,
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
}));
