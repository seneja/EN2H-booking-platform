import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, Search, Edit2, Trash2, Eye, Filter, Clock, DollarSign,
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Pagination } from '../../components/common/Pagination';
import { LoadingSpinner, EmptyState, ErrorState } from '../../components/common/StateComponents';
import { ConfirmModal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';
import { servicesService } from '../../services/medibook.service';
import { MOCK_SERVICES } from '../../services/mockData';
import type { Service } from '../../types';

const ITEMS_PER_PAGE = 6;

export const ServicesPage = () => {
  const { addToast } = useToast();
  const [services, setServices] = useState<Service[]>(MOCK_SERVICES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params: any = {};
      if (search) params.search = search;
      if (statusFilter !== 'all') params.status = statusFilter;
      const res = await servicesService.getAll(params);
      const data = Array.isArray(res.data) ? res.data : [];
      if (data.length > 0) {
        const mapped = data.map((s: any) => ({
          ...s,
          duration: typeof s.duration === 'number' ? `${s.duration} minutes` : s.duration,
          status: s.isActive === false ? 'inactive' : 'active'
        }));
        setServices(mapped);
      } else {
        setServices(MOCK_SERVICES);
      }
    } catch {
      // keep mock
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const filtered = services.filter((s) => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchSearch && matchStatus;
  });
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await servicesService.delete(deleteTarget.id);
      setServices((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      addToast('success', `"${deleteTarget.title}" deleted successfully.`);
    } catch {
      setServices((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      addToast('success', `"${deleteTarget.title}" removed.`);
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Services</h1>
          <p className="page-subtitle">Manage your healthcare service offerings.</p>
        </div>
        <Link to="/admin/services/new" className="btn btn--primary btn--md">
          <Plus size={18} /> Add Service
        </Link>
      </div>

      {/* Toolbar */}
      <div className="card">
        <div className="toolbar">
          <div className="toolbar__search">
            <Search size={16} className="toolbar__search-icon" />
            <input
              className="toolbar__search-input"
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div className="toolbar__filters">
            <Filter size={16} />
            {(['all', 'active', 'inactive'] as const).map((f) => (
              <button
                key={f}
                className={`filter-btn ${statusFilter === f ? 'filter-btn--active' : ''}`}
                onClick={() => { setStatusFilter(f); setPage(1); }}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading services..." />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchServices} />
        ) : paginated.length === 0 ? (
          <EmptyState
            icon={<Stethoscope size={40} />}
            title="No services found"
            description="Try adjusting your search or filters."
            action={<Link to="/admin/services/new" className="btn btn--primary btn--sm"><Plus size={16} /> Add Service</Link>}
          />
        ) : (
          <>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Service Name</th>
                    <th>Description</th>
                    <th>Duration</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((service) => (
                    <tr key={service.id}>
                      <td>
                        <div className="table__service-name">
                          <div className="table__service-icon">
                            {service.title.charAt(0)}
                          </div>
                          <span className="font-medium">{service.title}</span>
                        </div>
                      </td>
                      <td className="table__description">
                        {service.description.length > 60
                          ? service.description.slice(0, 60) + '…'
                          : service.description}
                      </td>
                      <td>
                        <span className="table__meta-chip">
                          <Clock size={13} /> {service.duration}
                        </span>
                      </td>
                      <td>
                        <span className="table__price">
                          <DollarSign size={13} />{service.price}
                        </span>
                      </td>
                      <td><StatusBadge status={service.status} /></td>
                      <td>
                        <div className="table__actions">
                          <Link
                            to={`/admin/services/${service.id}`}
                            className="table__action-btn table__action-btn--view"
                            title="View"
                          >
                            <Eye size={16} />
                          </Link>
                          <Link
                            to={`/admin/services/${service.id}/edit`}
                            className="table__action-btn table__action-btn--edit"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </Link>
                          <button
                            className="table__action-btn table__action-btn--delete"
                            title="Delete"
                            onClick={() => setDeleteTarget(service)}
                          >
                            <Trash2 size={16} />
                          </button>
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
                {Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} services
              </p>
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          </>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Service"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete Service"
        confirmVariant="danger"
        loading={deleteLoading}
      />
    </DashboardLayout>
  );
};

// Need this for the EmptyState icon
const Stethoscope = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/>
    <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/>
    <circle cx="20" cy="10" r="2"/>
  </svg>
);
