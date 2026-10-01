import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? `${window.location.origin}/api` : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization Bearer token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for clear error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.message ||
      error.message ||
      'An unexpected network error occurred.';
    return Promise.reject(new Error(message));
  }
);

// Auth Endpoints
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateMe: (data) => api.put('/auth/me', data),
};

// Cars Endpoints
export const carsApi = {
  getAll: (params) => api.get('/cars', { params }),
  getById: (id) => api.get(`/cars/${id}`),
  create: (formData) =>
    api.post('/cars', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id, formData) =>
    api.put(`/cars/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id) => api.delete(`/cars/${id}`),
  toggleAvailability: (id, isAvailable) =>
    api.patch(`/cars/${id}/availability`, { isAvailable }),
};

// Bookings Endpoints
export const bookingsApi = {
  create: (bookingData) => api.post('/bookings', bookingData),
  getMyBookings: () => api.get('/bookings/my'),
  getAllBookings: (params) => api.get('/bookings', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  verify: (identifier) => api.get(`/bookings/verify/${identifier}`),
  cancel: (id, reason) => api.patch(`/bookings/${id}/cancel`, { reason }),
};

// Payments Endpoints
export const paymentsApi = {
  create: (paymentData) => api.post('/payments', paymentData),
  getByBooking: (bookingId) => api.get(`/payments/booking/${bookingId}`),
  getAll: () => api.get('/payments'),
};

// Tracking Endpoints
export const trackingApi = {
  getByBooking: (bookingId) => api.get(`/tracking/${bookingId}`),
  simulate: (bookingId) => api.put(`/tracking/${bookingId}/simulate`),
};

// Recommendations Endpoints
export const recommendationsApi = {
  get: (criteria) => api.get('/recommendations', { params: criteria }),
};

// Reviews Endpoints
export const reviewsApi = {
  getByCar: (carId) => api.get(`/reviews/${carId}`),
  create: (reviewData) => api.post('/reviews', reviewData),
};

// Admin Endpoints
export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getCustomers: () => api.get('/admin/customers'),
};

export default api;
