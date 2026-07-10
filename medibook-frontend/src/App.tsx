import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ToastContainer } from './components/common/ToastContainer';
import { ProtectedRoute, PublicOnlyRoute } from './components/common/ProtectedRoute';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { BookingPage } from './pages/BookingPage';
import { ServicesPublicPage } from './pages/ServicesPublicPage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { ServicesPage } from './pages/admin/ServicesPage';
import { ServiceFormPage } from './pages/admin/ServiceFormPage';
import { BookingsPage } from './pages/admin/BookingsPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/services" element={<ServicesPublicPage />} />
            <Route path="/book" element={<BookingPage />} />

            {/* Auth */}
            <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
            <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />

            {/* Admin */}
            <Route
              path="/admin/dashboard"
              element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
            />
            <Route
              path="/admin/services"
              element={<ProtectedRoute><ServicesPage /></ProtectedRoute>}
            />
            <Route
              path="/admin/services/new"
              element={<ProtectedRoute><ServiceFormPage /></ProtectedRoute>}
            />
            <Route
              path="/admin/services/:id/edit"
              element={<ProtectedRoute><ServiceFormPage /></ProtectedRoute>}
            />
            <Route
              path="/admin/services/:id"
              element={<ProtectedRoute><ServiceFormPage /></ProtectedRoute>}
            />
            <Route
              path="/admin/bookings"
              element={<ProtectedRoute><BookingsPage /></ProtectedRoute>}
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <ToastContainer />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
