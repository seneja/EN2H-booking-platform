import React, { useEffect, useState } from 'react';
import { CheckCircle, Clock, CalendarCheck } from 'lucide-react';
import { PublicLayout } from '../components/layout/PublicLayout';
import { Button } from '../components/common/Button';
import { Input, Textarea, Select } from '../components/common/FormFields';
import { useToast } from '../context/ToastContext';
import { bookingsService, servicesService } from '../services/medibook.service';
import { MOCK_SERVICES } from '../services/mockData';
import type { Service } from '../types';

const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '13:00', '13:30', '14:00',
  '14:30', '15:00', '15:30', '16:00', '16:30', '17:00',
];

interface BookingForm {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  bookingDate: string;
  bookingTime: string;
  notes: string;
}

const today = new Date().toISOString().split('T')[0];

export const BookingPage = () => {
  const { addToast } = useToast();
  const [services, setServices] = useState<Service[]>(MOCK_SERVICES.filter(s => s.status === 'active'));
  const [form, setForm] = useState<BookingForm>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    serviceId: '',
    bookingDate: '',
    bookingTime: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Partial<BookingForm>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await servicesService.getAll({ status: 'active' });
        const data = Array.isArray(res.data) ? res.data : [];
        if (data.length > 0) setServices(data);
      } catch {
        // use mock
      }
    };
    fetchServices();
  }, []);

  const validate = (): boolean => {
    const e: Partial<BookingForm> = {};
    if (!form.customerName.trim()) e.customerName = 'Full name is required';
    if (!form.customerEmail.trim()) e.customerEmail = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.customerEmail)) e.customerEmail = 'Enter a valid email';
    if (!form.customerPhone.trim()) e.customerPhone = 'Phone number is required';
    if (!form.serviceId) e.serviceId = 'Please select a service';
    if (!form.bookingDate) e.bookingDate = 'Please select a date';
    else if (form.bookingDate < today) e.bookingDate = 'Booking date cannot be in the past';
    if (!form.bookingTime) e.bookingTime = 'Please select a time slot';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await bookingsService.create(form);
      setBookingRef((res.data as any).id || `MB-${Date.now().toString().slice(-6)}`);
    } catch {
      setBookingRef(`MB-${Date.now().toString().slice(-6)}`);
    } finally {
      setLoading(false);
      setSuccess(true);
    }
  };

  const selectedService = services.find((s) => s.id === form.serviceId);

  if (success) {
    return (
      <PublicLayout>
        <div className="booking-success">
          <div className="booking-success__card">
            <div className="booking-success__icon">
              <CheckCircle size={56} />
            </div>
            <h1 className="booking-success__title">Appointment Confirmed!</h1>
            <p className="booking-success__subtitle">
              Your appointment has been successfully booked. You will receive a confirmation shortly.
            </p>
            <div className="booking-success__ref">
              <span>Booking Reference</span>
              <strong>#{bookingRef.toUpperCase()}</strong>
            </div>
            <div className="booking-success__details">
              <div><span>Patient</span><p>{form.customerName}</p></div>
              <div><span>Service</span><p>{selectedService?.title}</p></div>
              <div>
                <span>Date & Time</span>
                <p>
                  {new Date(form.bookingDate).toLocaleDateString('en-US', { dateStyle: 'long' })}
                  {' at '}{form.bookingTime}
                </p>
              </div>
            </div>
            <div className="booking-success__actions">
              <button
                className="btn btn--primary btn--lg"
                onClick={() => { setSuccess(false); setForm({ customerName: '', customerEmail: '', customerPhone: '', serviceId: '', bookingDate: '', bookingTime: '', notes: '' }); }}
              >
                Book Another Appointment
              </button>
              <a href="/" className="btn btn--outline btn--lg">Go to Home</a>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="booking-page">
        <div className="container">
          <div className="booking-page__header">
            <span className="section__eyebrow">Book Now</span>
            <h1 className="booking-page__title">Schedule Your Appointment</h1>
            <p className="booking-page__subtitle">
              Fill in your details and select your preferred service and time slot.
            </p>
          </div>

          <div className="booking-layout">
            {/* Form */}
            <div className="card booking-form-card">
              <form onSubmit={handleSubmit} noValidate>
                <div className="booking-section">
                  <h3 className="booking-section__title">
                    <span className="booking-section__num">1</span>
                    Patient Information
                  </h3>
                  <div className="form-grid">
                    <Input
                      label="Full Name"
                      placeholder="John Smith"
                      value={form.customerName}
                      onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                      error={errors.customerName}
                      required
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="john@example.com"
                      value={form.customerEmail}
                      onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                      error={errors.customerEmail}
                      required
                    />
                    <div className="form-grid__full">
                      <Input
                        label="Phone Number"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={form.customerPhone}
                        onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                        error={errors.customerPhone}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="booking-section">
                  <h3 className="booking-section__title">
                    <span className="booking-section__num">2</span>
                    Select Service
                  </h3>
                  <div className="services-selector">
                    {services.map((service) => (
                      <label
                        key={service.id}
                        className={`service-option ${form.serviceId === service.id ? 'service-option--selected' : ''}`}
                      >
                        <input
                          type="radio"
                          name="service"
                          value={service.id}
                          checked={form.serviceId === service.id}
                          onChange={() => setForm({ ...form, serviceId: service.id })}
                        />
                        <div className="service-option__content">
                          <p className="service-option__title">{service.title}</p>
                          <p className="service-option__meta">
                            <Clock size={12} /> {service.duration} · ${service.price}
                          </p>
                        </div>
                        <div className="service-option__check">
                          {form.serviceId === service.id && <CheckCircle size={18} />}
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.serviceId && <p className="form-error">{errors.serviceId}</p>}
                </div>

                <div className="booking-section">
                  <h3 className="booking-section__title">
                    <span className="booking-section__num">3</span>
                    Date & Time
                  </h3>
                  <div className="form-grid">
                    <Input
                      label="Booking Date"
                      type="date"
                      min={today}
                      value={form.bookingDate}
                      onChange={(e) => setForm({ ...form, bookingDate: e.target.value })}
                      error={errors.bookingDate}
                      required
                    />
                    <div className="form-field">
                      <label className="form-label">
                        Time Slot <span className="form-required">*</span>
                      </label>
                      <div className="time-grid">
                        {TIME_SLOTS.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            className={`time-slot ${form.bookingTime === slot ? 'time-slot--selected' : ''}`}
                            onClick={() => setForm({ ...form, bookingTime: slot })}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                      {errors.bookingTime && <p className="form-error">{errors.bookingTime}</p>}
                    </div>
                  </div>
                </div>

                <div className="booking-section">
                  <h3 className="booking-section__title">
                    <span className="booking-section__num">4</span>
                    Additional Notes
                  </h3>
                  <Textarea
                    placeholder="Any special requests, symptoms, or information for the healthcare provider..."
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={3}
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  className="booking-submit"
                  icon={<CalendarCheck size={20} />}
                >
                  {loading ? 'Confirming Appointment...' : 'Confirm Appointment'}
                </Button>
              </form>
            </div>

            {/* Summary sidebar */}
            <div className="booking-sidebar">
              <div className="card booking-summary">
                <h3 className="booking-summary__title">Booking Summary</h3>
                {selectedService ? (
                  <>
                    <div className="booking-summary__service">
                      <div className="booking-summary__service-icon">
                        {selectedService.title.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold">{selectedService.title}</p>
                        <p className="text-xs text-muted">{selectedService.duration}</p>
                      </div>
                    </div>
                    <div className="booking-summary__details">
                      <div><span>Date</span><p>{form.bookingDate ? new Date(form.bookingDate).toLocaleDateString('en-US', { dateStyle: 'medium' }) : '—'}</p></div>
                      <div><span>Time</span><p>{form.bookingTime || '—'}</p></div>
                      <div><span>Patient</span><p>{form.customerName || '—'}</p></div>
                    </div>
                    <div className="booking-summary__price">
                      <span>Consultation Fee</span>
                      <strong>${selectedService.price}</strong>
                    </div>
                  </>
                ) : (
                  <div className="booking-summary__empty">
                    <CalendarCheck size={36} />
                    <p>Select a service to see your booking summary.</p>
                  </div>
                )}
              </div>

              <div className="card booking-info">
                <h4>ℹ️ Important Information</h4>
                <ul>
                  <li>Please arrive 10 minutes early.</li>
                  <li>Bring any relevant medical records.</li>
                  <li>Cancellations must be made 24 hours in advance.</li>
                  <li>Contact us for rescheduling requests.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};
