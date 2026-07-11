import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/common/Button';
import { Input, Textarea, Select } from '../../components/common/FormFields';
import { useToast } from '../../context/ToastContext';
import { servicesService } from '../../services/medibook.service';
import { MOCK_SERVICES } from '../../services/mockData';
import type { Service } from '../../types';

interface ServiceFormData {
  title: string;
  description: string;
  duration: string;
  price: string;
  status: 'active' | 'inactive';
}

const DURATION_OPTIONS = [
  { value: '15 minutes', label: '15 minutes' },
  { value: '30 minutes', label: '30 minutes' },
  { value: '45 minutes', label: '45 minutes' },
  { value: '60 minutes', label: '60 minutes (1 hour)' },
  { value: '90 minutes', label: '90 minutes (1.5 hours)' },
  { value: '120 minutes', label: '120 minutes (2 hours)' },
];

export const ServiceFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToast } = useToast();
  const isEdit = !!id && id !== 'new';

  const [form, setForm] = useState<ServiceFormData>({
    title: '',
    description: '',
    duration: '30 minutes',
    price: '',
    status: 'active',
  });
  const [errors, setErrors] = useState<Partial<ServiceFormData>>({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    const fetch = async () => {
      setFetchLoading(true);
      try {
        const res = await servicesService.getOne(id!);
        const s = res.data as any; // Cast to bypass type checking for mapping
        setForm({
          title: s.title,
          description: s.description,
          duration: s.duration ? `${s.duration} minutes` : '30 minutes',
          price: String(s.price),
          status: s.isActive === false ? 'inactive' : 'active',
        });
      } catch {
        const mock = MOCK_SERVICES.find((s) => s.id === id);
        if (mock) {
          setForm({
            title: mock.title,
            description: mock.description,
            duration: mock.duration,
            price: String(mock.price),
            status: mock.status,
          });
        }
      } finally {
        setFetchLoading(false);
      }
    };
    fetch();
  }, [id, isEdit]);

  const validate = (): boolean => {
    const e: Partial<ServiceFormData> = {};
    if (!form.title.trim()) e.title = 'Service title is required';
    else if (form.title.length < 3) e.title = 'Title must be at least 3 characters';
    if (!form.description.trim()) e.description = 'Description is required';
    else if (form.description.length < 10) e.description = 'Description must be at least 10 characters';
    if (!form.duration) e.duration = 'Duration is required';
    if (!form.price) e.price = 'Price is required';
    else if (isNaN(Number(form.price)) || Number(form.price) <= 0)
      e.price = 'Enter a valid price greater than 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      // Transform form to backend format:
      // duration: "30 minutes" -> 30
      // status: "active" -> isActive: true
      const durationNumber = parseInt(form.duration, 10) || 30;
      const payload = {
        title: form.title,
        description: form.description,
        duration: durationNumber,
        price: Number(form.price),
        isActive: form.status === 'active',
      };

      if (isEdit) {
        await servicesService.update(id!, payload as any);
        addToast('success', 'Service updated successfully!');
      } else {
        await servicesService.create(payload as any);
        addToast('success', 'Service created successfully!');
      }
      navigate('/admin/services');
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      const errDetail = Array.isArray(msg) ? msg.join(', ') : msg || '';
      addToast('error', `Failed to save service: ${errDetail}`);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <DashboardLayout>
        <div className="loading-full">Loading service...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <Link to="/admin/services" className="back-link">
            <ArrowLeft size={18} /> Back to Services
          </Link>
          <h1 className="page-title">{isEdit ? 'Edit Service' : 'Create New Service'}</h1>
          <p className="page-subtitle">
            {isEdit ? 'Update the healthcare service details.' : 'Add a new healthcare service to your platform.'}
          </p>
        </div>
      </div>

      <div className="form-page-layout">
        <div className="card form-card">
          <div className="card__header">
            <h2 className="card__title">Service Information</h2>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              <div className="form-grid__full">
                <Input
                  label="Service Title"
                  placeholder="e.g. Dental Consultation"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  error={errors.title}
                  required
                />
              </div>

              <div className="form-grid__full">
                <Textarea
                  label="Description"
                  placeholder="e.g. Complete dental examination and consultation with expert dentists."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  error={errors.description}
                  required
                  rows={4}
                />
              </div>

              <Select
                label="Duration"
                options={DURATION_OPTIONS}
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                error={errors.duration}
                required
              />

              <Input
                label="Price ($)"
                type="number"
                placeholder="e.g. 50"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                error={errors.price}
                required
              />

              <div className="form-grid__full">
                <div className="form-field">
                  <label className="form-label">Status</label>
                  <div className="toggle-field">
                    <div
                      className={`toggle ${form.status === 'active' ? 'toggle--on' : ''}`}
                      onClick={() =>
                        setForm({ ...form, status: form.status === 'active' ? 'inactive' : 'active' })
                      }
                    >
                      <div className="toggle__thumb" />
                    </div>
                    <div>
                      <span className={`toggle-label ${form.status === 'active' ? 'text-success' : 'text-muted'}`}>
                        {form.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                      <p className="form-hint">
                        {form.status === 'active'
                          ? 'This service is visible to customers.'
                          : 'This service is hidden from customers.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <Link to="/admin/services" className="btn btn--ghost btn--md">
                Cancel
              </Link>
              <Button type="submit" variant="primary" size="md" loading={loading} icon={<Save size={16} />}>
                {loading ? 'Saving...' : isEdit ? 'Update Service' : 'Save Service'}
              </Button>
            </div>
          </form>
        </div>

        {/* Preview sidebar */}
        <div className="form-sidebar">
          <div className="card">
            <div className="card__header">
              <h3 className="card__title">Preview</h3>
            </div>
            <div className="service-preview">
              <div className="service-preview__icon">
                {form.title.charAt(0) || 'S'}
              </div>
              <h4 className="service-preview__title">{form.title || 'Service Title'}</h4>
              <p className="service-preview__desc">
                {form.description || 'Service description will appear here.'}
              </p>
              <div className="service-preview__meta">
                <span>⏱ {form.duration}</span>
                <span>💵 ${form.price || '0'}</span>
              </div>
              <span className={`badge ${form.status === 'active' ? 'badge--success' : 'badge--neutral'}`}>
                {form.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
