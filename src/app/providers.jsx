import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './queryClient';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { setupInterceptors } from '../lib/apiClient';
import { useAuthStore } from '../store/authStore';

export function Providers({ children }) {
  useEffect(() => {
    setupInterceptors(useAuthStore);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#131316', color: '#fff', border: '1px solid #1f1f23' } }} />
    </QueryClientProvider>
  );
}
