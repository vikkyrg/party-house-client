export const env = {
  APP_NAME: import.meta.env.VITE_APP_NAME || 'CS Cinemas',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  WEBSITE_URL: import.meta.env.VITE_WEBSITE_URL || 'http://localhost:5173',
  RAZORPAY_KEY_ID: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_MOCK_DATA: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
};
