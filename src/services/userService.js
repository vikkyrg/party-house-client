import { apiClient } from '../lib/apiClient';

export const userService = {
  updateProfile: async (data) => {
    return await apiClient.put('/users/profile', data);
  }
};
