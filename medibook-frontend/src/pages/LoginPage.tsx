import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authService } from '../services/medibook.service';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/FormFields';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { addToast } = useToast();
  const from = (location.state as any)?.from?.pathname || '/admin/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await authService.login(form.email, form.password);
      const token = res.data.access_token || res.data.accessToken;
      const userData = res.data.user;
      login(token, { ...userData, role: userData.role || 'admin' });
      addToast('success', 'Welcome back! Logged in successfully.');
      navigate(from, { replace: true });
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(
        Array.isArray(msg)
          ? msg.join(', ')
          : msg || 'Invalid email or password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#1E293B' }}>Sign In</h2>
      {error && <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center', fontSize: '14px' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="admin@medibook.com"
            required
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Enter your password"
            required
          />
        </div>
        <Button type="submit" variant="primary" style={{ width: '100%' }} loading={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
      <div style={{ marginTop: '15px', textAlign: 'center' }}>
        Don't have an account? <Link to="/register" style={{ color: '#2563EB', textDecoration: 'none' }}>Create one</Link>
      </div>
    </div>
  );
};


