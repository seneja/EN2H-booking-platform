import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { authService } from '../services/medibook.service';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/FormFields';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password || !form.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await authService.register(form.email, form.password);
      addToast('success', 'Account created successfully! Please sign in.');
      navigate('/login');
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(
        Array.isArray(msg)
          ? msg.join(', ')
          : msg || 'Registration failed.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#1E293B' }}>Create Account</h2>
      {error && <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center', fontSize: '14px' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="your-email@example.com"
            required
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="At least 6 characters"
            required
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <Input
            label="Confirm Password"
            type="password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            placeholder="Confirm password"
            required
          />
        </div>
        <Button type="submit" variant="primary" style={{ width: '100%' }} loading={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>
      <div style={{ marginTop: '15px', textAlign: 'center' }}>
        Already have an account? <Link to="/login" style={{ color: '#2563EB', textDecoration: 'none' }}>Sign in</Link>
      </div>
    </div>
  );
};

