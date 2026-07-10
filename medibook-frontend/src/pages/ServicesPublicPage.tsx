import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, DollarSign, Search, ChevronRight, Filter } from 'lucide-react';
import { PublicLayout } from '../components/layout/PublicLayout';
import { LoadingSpinner, EmptyState } from '../components/common/StateComponents';
import { servicesService } from '../services/medibook.service';
import { MOCK_SERVICES } from '../services/mockData';
import type { Service } from '../types';

const getEmoji = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes('dental')) return '🦷';
  if (t.includes('eye')) return '👁️';
  if (t.includes('cardio')) return '❤️';
  if (t.includes('physio')) return '🦴';
  if (t.includes('neuro')) return '🧠';
  if (t.includes('derma')) return '🩺';
  return '⚕️';
};

export const ServicesPublicPage = () => {
  const [services, setServices] = useState<Service[]>(MOCK_SERVICES.filter(s => s.status === 'active'));
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await servicesService.getAll({ status: 'active' });
        const data = Array.isArray(res.data) ? res.data : [];
        if (data.length > 0) {
          const mapped = data.map((s: any) => ({
            ...s,
            duration: typeof s.duration === 'number' ? `${s.duration} minutes` : s.duration,
            status: s.isActive === false ? 'inactive' : 'active'
          }));
          setServices(mapped);
        }
      } catch { /* use mock */ }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const filtered = services.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="services-hero">
        <div className="container services-hero__inner">
          <span className="section__eyebrow">Our Services</span>
          <h1 className="services-hero__title">Healthcare Services</h1>
          <p className="services-hero__subtitle">
            Browse our comprehensive range of healthcare services and book an appointment today.
          </p>
          <div className="services-search">
            <Search size={18} className="services-search__icon" />
            <input
              className="services-search__input"
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section">
        <div className="container">
          {loading ? (
            <LoadingSpinner text="Loading services..." />
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No services found"
              description="Try a different search term."
            />
          ) : (
            <div className="services-full-grid">
              {filtered.map((service) => (
                <div key={service.id} className="service-card-full">
                  <div className="service-card-full__icon">{getEmoji(service.title)}</div>
                  <div className="service-card-full__body">
                    <h3 className="service-card-full__title">{service.title}</h3>
                    <p className="service-card-full__desc">{service.description}</p>
                    <div className="service-card-full__meta">
                      <span><Clock size={14} /> {service.duration}</span>
                      <span><DollarSign size={14} /> {service.price}</span>
                    </div>
                  </div>
                  <Link to={`/book?service=${service.id}`} className="service-card-full__cta">
                    Book Now <ChevronRight size={16} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
};
