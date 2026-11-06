import { create } from 'zustand';
import { useBookingModalStore } from './bookingModalStore';

const clearBookingSessionStorage = () => {
  const currentDraftId = window.sessionStorage.getItem('rio-current-draft-id');
  if (currentDraftId) window.sessionStorage.removeItem(`booking-hold:${currentDraftId}`);
  window.sessionStorage.removeItem('rio-current-draft-id');
  window.sessionStorage.removeItem('rio-active-booking-id');
};

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null,
  setAuth: (user, accessToken = null) => {
    if (get().user?.id && get().user.id !== user?.id) {
      useBookingModalStore.getState().clearActiveBooking();
      clearBookingSessionStorage();
    }
    set({ user: user || null, accessToken: accessToken || null });
  },
  logout: () => {
    useBookingModalStore.getState().clearActiveBooking();
    clearBookingSessionStorage();
    set({ user: null, accessToken: null });
  },
}));
