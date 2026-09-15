import { apiClient } from '../lib/apiClient';

export const cityService = {
  getCities: async () => {
    const { data } = await apiClient.get('/cities');
    return data;
  }
};
