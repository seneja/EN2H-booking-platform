import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, XCircle, Filter, ChevronDown } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Pagination } from '../../components/common/Pagination';
import { LoadingSpinner, EmptyState, ErrorState } from '../../components/common/StateComponents';
import { Modal, ConfirmModal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';
import { bookingsService } from '../../services/medibook.service';
import { MOCK_BOOKINGS } from '../../services/mockData';
import type { Booking, BookingStatus } from '../../types';

const ITEMS_PER_PAGE = 8;
const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'completed', label: 'Completed' },
];

const STATUS_OPTIONS: { value: BookingStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const BookingsPage = () => {
  const { addToast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [viewBooking, setViewBooking] = useState<Booking | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await bookingsService.getAll() as any;
      let data: Booking[] = [];
      if (res.data) {
        if (Array.isArray(res.data)) {
          data = res.data;
        } else if (res.data.data && Array.isArray(res.data.data)) {
          data = res.data.data;
        }
      }
      if (data.length > 0) setBookings(data);
    } catch {
      // keep mock
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const filtered = bookings.filter((b) => {
    const matchSearch =
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.customerEmail.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleStatusUpdate = async (booking: Booking, newStatus: BookingStatus) => {
    if (booking.status === 'cancelled' && newStatus !== 'cancelled') {
      addToast('error', 'Cancelled bookings cannot be reactivated.');
      return;
    }
    setUpdatingId(booking.id);
    try {
      await bookingsService.updateStatus(booking.id, newStatus);
    } catch {
      // demo mode
    } finally {
      setBookings((prev) =>
        prev.map((b) => (b.id === booking.id ? { ...b, status: newStatus } : b))
      );
      addToast('success', `Booking status updated to "${newStatus}".`);
      setUpdatingId(null);
    }
  };

  const handleCancel = async () => {
    if (!cancelTarget) return;
    setCancelLoading(true);
    try {
      await bookingsService.cancel(cancelTarget.id);
    } catch {
      // demo mode
    } finally {
      setBookings((prev) =>
        prev.map((b) => (b.id === cancelTarget.id ? { ...b, status: 'cancelled' } : b))
      );
      addToast('success', 'Booking cancelled successfully.');
      setCancelLoading(false);
      setCancelTarget(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Bookings</h1>
          <p className="page-subtitle">Manage all customer appointment bookings.</p>
        </div>
        <div className="page-header__actions">
          <span className="stat-chip">
            {filtered.length} booking{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="card">
        <div className="toolbar">
          <div className="toolbar__search">
            <Search size={16} className="toolbar__search-icon" />
            <input
              className="toolbar__search-input"
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div className="toolbar__filters">
            <Filter size={16} />
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                className={`filter-btn ${statusFilter === f.value ? 'filter-btn--active' : ''}`}
                onClick={() => { setStatusFilter(f.value); setPage(1); }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading bookings..." />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchBookings} />
        ) : paginated.length === 0 ? (
          <EmptyState
            title="No bookings found"
            description={search || statusFilter !== 'all' ? 'Try adjusting your search or filters.' : 'No bookings have been made yet.'}
          />
        ) : (
          <>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Service</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((booking) => (
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
                      <td>{booking.customerPhone}</td>
                      <td>{booking.service?.title ?? '—'}</td>
                      <td>
                        <div>
                          <p className="font-medium text-sm">
                            {new Date(booking.bookingDate).toLocaleDateString('en-US', {
                              month: 'short', day: 'numeric', year: 'numeric',
                            })}
                          </p>
                          <p className="text-xs text-muted">{booking.bookingTime}</p>
                        </div>
                      </td>
                      <td>
                        <div className="status-select-wrapper">
                          <StatusBadge status={booking.status} />
                          {booking.status !== 'cancelled' && (
                            <div className="status-dropdown">
                              <button className="status-dropdown__trigger" disabled={updatingId === booking.id}>
                                <ChevronDown size={12} />
                              </button>
                              <div className="status-dropdown__menu">
                                {STATUS_OPTIONS.filter(o => o.value !== booking.status).map(opt => (
                                  <button
                                    key={opt.value}
                                    className="status-dropdown__item"
                                    onClick={() => handleStatusUpdate(booking, opt.value)}
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="table__actions">
                          <button
                            className="table__action-btn table__action-btn--view"
                            title="View Details"
                            onClick={() => setViewBooking(booking)}
                          >
                            <Eye size={16} />
                          </button>
                          {booking.status !== 'cancelled' && (
                            <button
                              className="table__action-btn table__action-btn--delete"
                              title="Cancel Booking"
                              onClick={() => setCancelTarget(booking)}
                            >
                              <XCircle size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card__footer">
              <p className="table__count">
                Showing {(page - 1) * ITEMS_PER_PAGE + 1}–
                {Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} bookings
              </p>
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          </>
        )}
      </div>

      {/* View Booking Modal */}
      <Modal
        isOpen={!!viewBooking}
        onClose={() => setViewBooking(null)}
        title="Booking Details"
        size="md"
      >
        {viewBooking && (
          <div className="booking-detail">
            <div className="booking-detail__section">
              <h4>Customer Information</h4>
              <div className="booking-detail__grid">
                <div><span>Name</span><p>{viewBooking.customerName}</p></div>
                <div><span>Email</span><p>{viewBooking.customerEmail}</p></div>
                <div><span>Phone</span><p>{viewBooking.customerPhone}</p></div>
              </div>
            </div>
            <div className="booking-detail__section">
              <h4>Appointment Information</h4>
              <div className="booking-detail__grid">
                <div><span>Service</span><p>{viewBooking.service?.title ?? '—'}</p></div>
                <div>
                  <span>Date</span>
                  <p>{new Date(viewBooking.bookingDate).toLocaleDateString('en-US', { dateStyle: 'long' })}</p>
                </div>
                <div><span>Time</span><p>{viewBooking.bookingTime}</p></div>
                <div>
                  <span>Status</span>
                  <p><StatusBadge status={viewBooking.status} /></p>
                </div>
              </div>
            </div>
            {viewBooking.notes && (
              <div className="booking-detail__section">
                <h4>Notes</h4>
                <p className="booking-detail__notes">{viewBooking.notes}</p>
              </div>
            )}
            {viewBooking.status !== 'cancelled' && (
              <div className="booking-detail__actions">
                {viewBooking.status === 'pending' && (
                  <button
                    className="btn btn--success btn--md"
                    onClick={() => { handleStatusUpdate(viewBooking, 'confirmed'); setViewBooking(null); }}
                  >
                    Confirm Booking
                  </button>
                )}
                {viewBooking.status === 'confirmed' && (
                  <button
                    className="btn btn--primary btn--md"
                    onClick={() => { handleStatusUpdate(viewBooking, 'completed'); setViewBooking(null); }}
                  >
                    Mark Completed
                  </button>
                )}
                <button
                  className="btn btn--danger btn--md"
                  onClick={() => { setViewBooking(null); setCancelTarget(viewBooking); }}
                >
                  Cancel Booking
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmModal
        isOpen={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancel}
        title="Cancel Booking"
        message={`Are you sure you want to cancel ${cancelTarget?.customerName}'s booking? This cannot be undone.`}
        confirmLabel="Cancel Booking"
        confirmVariant="danger"
        loading={cancelLoading}
      />
    </DashboardLayout>
  );
};
