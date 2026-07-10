import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logoImg from '../../assets/logo.png';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/book', label: 'Book Appointment' },
  { to: '/login', label: 'Login' },
];

export const PublicNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="public-nav">
      <div className="public-nav__inner container">
        <Link to="/" className="public-nav__logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={logoImg} alt="MediBook Logo" style={{ height: '40px', width: 'auto', borderRadius: '4px' }} />
          <span>MediBook</span>
        </Link>

        <div className={`public-nav__links ${mobileOpen ? 'public-nav__links--open' : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`public-nav__link ${location.pathname === link.to ? 'public-nav__link--active' : ''} ${link.label === 'Login' ? 'public-nav__link--cta' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <button
          className="public-nav__hamburger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
};

export const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="public-layout">
      <PublicNavbar />
      <main className="public-main">{children}</main>
      <footer className="footer">
        <div className="container footer__inner">
          <div className="footer__brand">
            <div className="footer__logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img src={logoImg} alt="MediBook Logo" style={{ height: '32px', width: 'auto', borderRadius: '4px' }} />
              <span>MediBook</span>
            </div>
            <p className="footer__tagline">
              Your trusted healthcare appointment management platform.
            </p>
          </div>
          <div className="footer__links">
            <div className="footer__col">
              <h4>Platform</h4>
              <Link to="/">Home</Link>
              <Link to="/services">Services</Link>
              <Link to="/book">Book Appointment</Link>
            </div>
            <div className="footer__col">
              <h4>Support</h4>
              <a href="#">Help Center</a>
              <a href="#">Contact Us</a>
              <a href="#">Privacy Policy</a>
            </div>
            <div className="footer__col">
              <h4>Contact</h4>
              <p>contact@medibook.com</p>
              <p>+1 (800) MEDIBOOK</p>
              <p>Mon–Fri, 9am–6pm</p>
            </div>
          </div>
        </div>
        <div className="footer__bottom container">
          <p>© 2024 MediBook. All rights reserved.</p>
          <div className="footer__social">
            <a href="#" aria-label="Twitter">𝕏</a>
            <a href="#" aria-label="LinkedIn">in</a>
            <a href="#" aria-label="Facebook">f</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
