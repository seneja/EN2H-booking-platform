import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Stethoscope,
  CalendarCheck,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  Heart,
  UserCheck,
  ShieldCheck,
  Loader,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/medibook.service';

const navItems = [
  { to: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { to: '/admin/services', icon: <Stethoscope size={20} />, label: 'Services' },
  { to: '/admin/bookings', icon: <CalendarCheck size={20} />, label: 'Bookings' },
];

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <>
      <div className="sidebar__logo">
        <div className="sidebar__logo-icon">
          <Heart size={20} fill="white" />
        </div>
        {!collapsed && <span className="sidebar__logo-text">MediBook</span>}
      </div>

      <nav className="sidebar__nav">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`sidebar__link ${location.pathname.startsWith(item.to) ? 'sidebar__link--active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <span className="sidebar__link-icon">{item.icon}</span>
            {!collapsed && <span className="sidebar__link-label">{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="sidebar__footer">
        <button className="sidebar__logout" onClick={handleLogout}>
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
        <button
          className="sidebar__toggle"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle sidebar"
        >
          <Menu size={18} />
        </button>
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <aside className={`sidebar sidebar--mobile ${mobileOpen ? 'sidebar--mobile-open' : ''}`}>
        <button
          className="sidebar__close"
          onClick={() => setMobileOpen(false)}
        >
          <X size={20} />
        </button>
        <SidebarContent />
      </aside>

      {/* Mobile trigger (in TopNav) */}
      <button
        className="sidebar-mobile-trigger"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={22} />
      </button>
    </>
  );
};

export const TopNav = () => {
  const { user } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch profile when dropdown opens
  useEffect(() => {
    if (!showProfile) return;
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await authService.getProfile();
        // Backend returns: { userId: "...", email: "...", name?: "...", role?: "..." }
        setProfileData(res.data);
      } catch (err: any) {
        setError('Failed to fetch profile details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [showProfile]);

  return (
    <header className="topnav" style={{ position: 'relative' }}>
      <div className="topnav__left">
        <div className="sidebar-mobile-trigger-slot" />
      </div>
      <div className="topnav__right">
        <button className="topnav__icon-btn" aria-label="Notifications">
          <Bell size={20} />
          <span className="topnav__notification-dot" />
        </button>

        {/* Profile trigger */}
        <div 
          ref={dropdownRef}
          style={{ position: 'relative' }}
        >
          <div 
            className="topnav__profile" 
            onClick={() => setShowProfile(!showProfile)}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <div className="topnav__avatar">
              {user?.email?.charAt(0).toUpperCase() ?? 'A'}
            </div>
            <div className="topnav__user-info">
              <span className="topnav__user-name">{user?.email?.split('@')[0] ?? 'Admin'}</span>
              <span className="topnav__user-role">{user?.role ?? 'Administrator'}</span>
            </div>
            <ChevronDown size={16} className="topnav__chevron" />
          </div>

          {/* Profile Dropdown Card */}
          {showProfile && (
            <div 
              style={{
                position: 'absolute',
                top: '110%',
                right: 0,
                width: '320px',
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                padding: '20px',
                zIndex: 999,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px', marginBottom: '4px' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>Profile Details</span>
                <span style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '4px', 
                  fontSize: '11px', 
                  fontWeight: 600, 
                  color: '#16a34a',
                  backgroundColor: '#dcfce7',
                  padding: '2px 8px',
                  borderRadius: '12px'
                }}>
                  <ShieldCheck size={12} />
                  JWT Verified
                </span>
              </div>

              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '16px 0' }}>
                  <Loader size={20} className="loading-spinner" />
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Fetching backend data...</span>
                </div>
              ) : error ? (
                <div style={{ color: '#dc2626', fontSize: '13px', textAlign: 'center', padding: '10px 0' }}>
                  {error}
                </div>
              ) : profileData ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>User ID</span>
                    <span style={{ fontSize: '12px', color: '#334155', fontFamily: 'monospace', wordBreak: 'break-all', backgroundColor: '#f8fafc', padding: '4px 8px', borderRadius: '4px' }}>
                      {profileData.userId || profileData.id}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Email Address</span>
                    <span style={{ fontSize: '13px', color: '#334155', fontWeight: 500 }}>
                      {profileData.email}
                    </span>
                  </div>

                  {profileData.name && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Full Name</span>
                      <span style={{ fontSize: '13px', color: '#334155', fontWeight: 500 }}>
                        {profileData.name}
                      </span>
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Role Privilege</span>
                    <span style={{ fontSize: '13px', color: '#2563eb', fontWeight: 600, textTransform: 'capitalize' }}>
                      {profileData.role || 'Admin'}
                    </span>
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '13px', color: '#64748b', textAlign: 'center' }}>
                  No profile data available.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
