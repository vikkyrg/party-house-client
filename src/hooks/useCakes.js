import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';

export const useCakes = (params = {}) => {
  return useQuery({
    queryKey: ['cakes', params],
    queryFn: async () => {
      const response = await apiClient.get('/cakes', { params });
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
