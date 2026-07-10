export type UserRole = 'admin' | 'staff';

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: UserRole;
}


export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export type ServiceStatus = 'active' | 'inactive';

export interface Service {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  status: ServiceStatus;
  createdAt: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  service?: Service;
  bookingDate: string;
  bookingTime: string;
  notes?: string;
  status: BookingStatus;
  createdAt: string;
}

export interface DashboardStats {
  totalServices: number;
  totalBookings: number;
  pendingAppointments: number;
  completedAppointments: number;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
