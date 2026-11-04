import { apiClient } from '../lib/apiClient';

export const settingService = {
  getPaymentSettings: async () => {
    const { data } = await apiClient.get('/settings/payment');
    return data;
  },
};

