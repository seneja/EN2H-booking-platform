import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Stethoscope,
  CalendarCheck,
  Clock,
  CheckCircle,
  Plus,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner, ErrorState } from '../../components/common/StateComponents';
import { dashboardService } from '../../services/medibook.service';
import { bookingsService } from '../../services/medibook.service';
import { MOCK_STATS, MOCK_BOOKINGS } from '../../services/mockData';
import type { DashboardStats, Booking } from '../../types';

const StatCard = ({
  icon,
  label,
  value,
  color,
  trend,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
  trend?: string;
}) => (
  <div className="stat-card">
    <div className={`stat-card__icon-wrapper stat-card__icon-wrapper--${color}`}>{icon}</div>
    <div className="stat-card__body">
      <p className="stat-card__label">{label}</p>
      <p className="stat-card__value">{value}</p>
      {trend && <p className="stat-card__trend">{trend}</p>}
    </div>
  </div>
);

export const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats>(MOCK_STATS);
  const [recentBookings, setRecentBookings] = useState<Booking[]>(MOCK_BOOKINGS.slice(0, 5));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [statsRes, bookingsRes] = await Promise.all([
          dashboardService.getStats(),
          bookingsService.getAll({ limit: 5 }),
        ]);
        setStats(statsRes.data);
        let bData: Booking[] = [];
        if (bookingsRes.data) {
          if (Array.isArray(bookingsRes.data)) {
            bData = bookingsRes.data;
          } else if (bookingsRes.data.data && Array.isArray(bookingsRes.data.data)) {
            bData = bookingsRes.data.data;
          }
        }
        if (bData.length > 0) setRecentBookings(bData);
      } catch {
        // Keep mock data
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="page-header__actions">
          <Link to="/admin/services/new" className="btn btn--primary btn--md">
            <Plus size={18} /> Add Service
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard
          icon={<Stethoscope size={22} />}
          label="Total Services"
          value={stats.totalServices}
          color="blue"
          trend="↑ 2 this month"
        />
        <StatCard
          icon={<CalendarCheck size={22} />}
          label="Total Bookings"
          value={stats.totalBookings}
          color="purple"
          trend="↑ 12% from last month"
        />
        <StatCard
          icon={<Clock size={22} />}
          label="Pending Appointments"
          value={stats.pendingAppointments}
          color="yellow"
          trend="Needs attention"
        />
        <StatCard
          icon={<CheckCircle size={22} />}
          label="Completed"
          value={stats.completedAppointments}
          color="green"
          trend="↑ 8% from last month"
        />
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2 className="quick-actions__title">Quick Actions</h2>
        <div className="quick-actions__grid">
          <Link to="/admin/services/new" className="quick-action-card">
            <Plus size={24} />
            <span>Add Service</span>
          </Link>
          <Link to="/admin/bookings" className="quick-action-card">
            <CalendarCheck size={24} />
            <span>View Bookings</span>
          </Link>
          <Link to="/admin/services" className="quick-action-card">
            <Stethoscope size={24} />
            <span>Manage Services</span>
          </Link>
          <Link to="/book" target="_blank" className="quick-action-card">
            <TrendingUp size={24} />
            <span>Public Booking</span>
          </Link>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="card">
        <div className="card__header">
          <h2 className="card__title">Recent Bookings</h2>
          <Link to="/admin/bookings" className="card__action">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        {loading ? (
          <LoadingSpinner text="Loading bookings..." />
        ) : error ? (
          <ErrorState message={error} />
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <div className="table__user">
                        <div className="table__avatar">
                          {booking.customerName.charAt(0)}
                        </div>
                        <div>
                          <p className="table__user-name">{booking.customerName}</p>
                          <p className="table__user-email">{booking.customerEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td>{booking.service?.title ?? '—'}</td>
                    <td>{new Date(booking.bookingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td>{booking.bookingTime}</td>
                    <td><StatusBadge status={booking.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
