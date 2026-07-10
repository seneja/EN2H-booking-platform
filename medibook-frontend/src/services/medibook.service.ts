import api from './api';
import type { Service, Booking, DashboardStats } from '../types';

/* ─── AUTH ─────────────────────────────────────────────────────────── */
export const authService = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (email: string, password: string, name?: string) =>
    api.post('/auth/register', { email, password, ...(name ? { name } : {}) }),
  getProfile: () =>
    api.get('/auth/profile'),
};

/* ─── SERVICES ──────────────────────────────────────────────────────── */
export const servicesService = {
  getAll: (params?: { search?: string; status?: string; page?: number; limit?: number }) =>
    api.get<Service[]>('/services', { params }),
  getOne: (id: string) => api.get<Service>(`/services/${id}`),
  create: (data: Partial<Service>) => api.post<Service>('/services', data),
  update: (id: string, data: Partial<Service>) => api.patch<Service>(`/services/${id}`, data),
  delete: (id: string) => api.delete(`/services/${id}`),
};

/* ─── BOOKINGS ──────────────────────────────────────────────────────── */
export const bookingsService = {
  getAll: (params?: { search?: string; status?: string; page?: number; limit?: number }) =>
    api.get<Booking[]>('/bookings', { params }),
  getOne: (id: string) => api.get<Booking>(`/bookings/${id}`),
  create: (data: Partial<Booking>) => api.post<Booking>('/bookings', data),
  updateStatus: (id: string, status: string) =>
    api.patch<Booking>(`/bookings/${id}/status`, { status }),
  cancel: (id: string) => api.patch<Booking>(`/bookings/${id}/status`, { status: 'cancelled' }),
};

/* ─── DASHBOARD ─────────────────────────────────────────────────────── */
export const dashboardService = {
  getStats: () => api.get<DashboardStats>('/dashboard/stats'),
};
