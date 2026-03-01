import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AuthPro.css';

const AdminLogin = ({ setIsAuthenticated, setUserRole }) => {
  const [email, setEmail] = useState('admin@demo.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Quick bypass for demo
    if (email === 'admin@demo.com' && password === 'admin123') {
      localStorage.setItem('token', 'demo-admin-token');
      localStorage.setItem('userRole', 'admin');
      setIsAuthenticated(true);
      setUserRole('admin');
      alert('Login successful!');
      window.location.href = '/admin';
      return;
    }

    try {
      console.log('Attempting login with:', email);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        { email, password }
      );

      console.log('Login response:', response.data);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', response.data.user.role);
        setIsAuthenticated(true);
        setUserRole(response.data.user.role);
        alert('Login successful!');
        window.location.href = '/admin';
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <h1>🔐 Admin Login</h1>
            <p>Access the admin dashboard</p>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">✕</span>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={loading}
                required
              />
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
