import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarCheck,
  Shield,
  Clock,
  Star,
  ArrowRight,
  Heart,
  Activity,
  Eye,
  Bone,
  Brain,
  Smile,
  CheckCircle,
  ChevronRight,
} from 'lucide-react';
import { PublicLayout } from '../components/layout/PublicLayout';
import { servicesService } from '../services/medibook.service';
import { MOCK_SERVICES } from '../services/mockData';
import type { Service } from '../types';

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  dental: <Smile size={28} />,
  eye: <Eye size={28} />,
  cardio: <Heart size={28} />,
  physio: <Bone size={28} />,
  general: <Activity size={28} />,
  neuro: <Brain size={28} />,
};

const getIcon = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes('dental')) return SERVICE_ICONS.dental;
  if (t.includes('eye')) return SERVICE_ICONS.eye;
  if (t.includes('cardio')) return SERVICE_ICONS.cardio;
  if (t.includes('physio')) return SERVICE_ICONS.physio;
  if (t.includes('neuro')) return SERVICE_ICONS.neuro;
  return SERVICE_ICONS.general;
};

const BENEFITS = [
  {
    icon: <CalendarCheck size={28} />,
    title: 'Easy Online Booking',
    description: 'Schedule your appointment in minutes from any device, anywhere.',
  },
  {
    icon: <Shield size={28} />,
    title: 'Professional Healthcare',
    description: 'Access certified healthcare professionals across multiple specialties.',
  },
  {
    icon: <Clock size={28} />,
    title: 'Quick Confirmation',
    description: 'Receive instant appointment confirmations and reminders.',
  },
  {
    icon: <Star size={28} />,
    title: 'Quality Care',
    description: 'Top-rated healthcare providers committed to your well-being.',
  },
];

const STATS = [
  { value: '10,000+', label: 'Appointments Booked' },
  { value: '500+', label: 'Healthcare Providers' },
  { value: '98%', label: 'Patient Satisfaction' },
  { value: '24/7', label: 'Support Available' },
];

export const LandingPage = () => {
  const [services, setServices] = useState<Service[]>(MOCK_SERVICES.filter(s => s.status === 'active').slice(0, 3));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await servicesService.getAll({ status: 'active' });
        const data = Array.isArray(res.data) ? res.data : [];
        if (data.length > 0) {
          const mapped = data.map((s: any) => ({
            ...s,
            duration: typeof s.duration === 'number' ? `${s.duration} minutes` : s.duration,
            status: s.isActive === false ? 'inactive' : 'active'
          }));
          setServices(mapped.slice(0, 3));
        }
      } catch {
        // Use mock data silently
      }
    };
    fetchServices();
  }, []);

  return (
    <PublicLayout>
      {/* HERO */}
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__content animate-fade-up">
            <div className="hero__badge">
              <CheckCircle size={14} />
              <span>Trusted by 10,000+ patients</span>
            </div>
            <h1 className="hero__heading">
              Book Your Healthcare<br />
              <span className="hero__heading-accent">Appointment Easily</span>
            </h1>
            <p className="hero__subtitle">
              Connect with trusted healthcare services and schedule your appointment
              quickly and conveniently — all in one place.
            </p>
            <div className="hero__actions">
              <Link to="/book" className="btn btn--primary btn--lg">
                <CalendarCheck size={20} />
                Book Appointment
              </Link>
              <Link to="/services" className="btn btn--outline btn--lg">
                Explore Services
                <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn btn--outline btn--lg" style={{ backgroundColor: '#f1f5f9', color: '#1e293b' }}>
                Admin Login
              </Link>
            </div>
            <div className="hero__social-proof">
              <div className="hero__avatars">
                {['J', 'S', 'M', 'E', 'R'].map((l, i) => (
                  <div key={i} className="hero__avatar">{l}</div>
                ))}
              </div>
              <p><strong>2,000+</strong> happy patients this month</p>
            </div>
          </div>
          <div className="hero__visual animate-fade-in">
            <div className="hero__card-float hero__card-float--1">
              <CheckCircle size={18} className="text-success" />
              <div>
                <p className="text-sm font-semibold">Appointment Confirmed</p>
                <p className="text-xs text-muted">Dental Consultation • 9:00 AM</p>
              </div>
            </div>
            <div className="hero__illustration">
              <div className="hero__illustration-bg">
                <Heart size={80} className="hero__illustration-icon" />
              </div>
              <div className="hero__stats-ring">
                <Activity size={40} />
              </div>
            </div>
            <div className="hero__card-float hero__card-float--2">
              <Star size={18} className="text-warning" fill="currentColor" />
              <div>
                <p className="text-sm font-semibold">4.9 / 5 Rating</p>
                <p className="text-xs text-muted">Based on 2,400 reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="stats-strip">
        <div className="container stats-strip__inner">
          {STATS.map((stat, i) => (
            <div key={i} className="stats-strip__item">
              <span className="stats-strip__value">{stat.value}</span>
              <span className="stats-strip__label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="section" id="services">
        <div className="container">
          <div className="section__header">
            <span className="section__eyebrow">Our Services</span>
            <h2 className="section__title">Healthcare Services We Offer</h2>
            <p className="section__subtitle">
              Choose from a wide range of professional healthcare services tailored to your needs.
            </p>
          </div>
          <div className="services-grid">
            {services.map((service) => (
              <div key={service.id} className="service-card">
                <div className="service-card__icon">{getIcon(service.title)}</div>
                <h3 className="service-card__title">{service.title}</h3>
                <p className="service-card__desc">{service.description}</p>
                <div className="service-card__meta">
                  <span className="service-card__meta-item">
                    <Clock size={14} />
                    {service.duration}
                  </span>
                  <span className="service-card__price">${service.price}</span>
                </div>
                <Link to="/book" className="service-card__cta">
                  Book Now <ChevronRight size={16} />
                </Link>
              </div>
            ))}
          </div>
          <div className="section__footer">
            <Link to="/services" className="btn btn--outline btn--md">
              View All Services <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="section section--gray" id="benefits">
        <div className="container">
          <div className="section__header">
            <span className="section__eyebrow">Why MediBook</span>
            <h2 className="section__title">Everything You Need for Healthcare</h2>
            <p className="section__subtitle">
              We make managing your healthcare appointments simple, fast, and reliable.
            </p>
          </div>
          <div className="benefits-grid">
            {BENEFITS.map((benefit, i) => (
              <div key={i} className="benefit-card">
                <div className="benefit-card__icon">{benefit.icon}</div>
                <h3 className="benefit-card__title">{benefit.title}</h3>
                <p className="benefit-card__desc">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        <div className="container cta-section__inner">
          <div className="cta-section__content">
            <h2 className="cta-section__title">Ready to Take Control of Your Health?</h2>
            <p className="cta-section__subtitle">
              Join thousands of patients who trust MediBook for their healthcare appointments.
            </p>
            <Link to="/book" className="btn btn--white btn--lg">
              Book Your First Appointment <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};
