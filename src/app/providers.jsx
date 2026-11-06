import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './queryClient';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { setupInterceptors } from '../lib/apiClient';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';
import { bookingService } from '../services/bookingService';
import { useBookingModalStore } from '../store/bookingModalStore';

export function Providers({ children }) {
  useEffect(() => {
    setupInterceptors(useAuthStore);
    authService.getMe()
      .then((response) => {
        useAuthStore.getState().setAuth(response.data?.user || null);
        if (!window.sessionStorage.getItem('rio-active-booking-id')) return null;
        return bookingService.getCurrentSessionBooking()
          .then((bookingResponse) => {
            if (bookingResponse.data) {
              useBookingModalStore.getState().setActiveBooking(bookingResponse.data);
            }
          })
          .catch((error) => {
            if (error?.response?.status !== 401) {
              console.error('Unable to restore the current booking session.', error);
            }
          });
      })
      .catch((error) => {
        if (error?.response?.status === 401) useAuthStore.getState().logout();
        else console.error('Unable to restore the customer session.', error);
      });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#131316', color: '#fff', border: '1px solid #1f1f23' } }} />
    </QueryClientProvider>
  );
}
