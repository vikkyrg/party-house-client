import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      setGuestDetails: (details) => set({ user: details }),
      clearGuestDetails: () => set({ user: null }),
    }),
    {
      name: 'guest-storage',
      partialize: (state) => ({ user: state.user }),
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
