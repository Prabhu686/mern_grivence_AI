import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/AuthPro.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function CitizenLogin() {
  const navigate = useNavigate();
  const [step, setStep] = useState('credentials'); // credentials, otp
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    otp: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // error, info, success
  const [rememberMe, setRememberMe] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [mockOtp, setMockOtp] = useState(''); // Store mock OTP for display

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    if (step === 'credentials') {
      if (!formData.email || !formData.password) {
        setMessage('Please fill in all fields');
        setMessageType('error');
        return;
      }

      try {
        setLoading(true);
        const response = await axios.post(`${API_URL}/auth/login`, {
          email: formData.email,
          password: formData.password
        });

        if (response.data.requiresOTP) {
          // Start OTP timer and send OTP
          setOtpTimer(600); // 10 minutes
          setStep('otp');
          
          // Now send the OTP
          try {
            const otpResponse = await axios.post(`${API_URL}/auth/send-otp`, {
              email: formData.email
            });
            
            // If in mock mode, display the OTP
            if (otpResponse.data.isMock && otpResponse.data.otp) {
              setMockOtp(otpResponse.data.otp);
              setMessage(`✨ TEST MODE: Your OTP is ${otpResponse.data.otp}`);
              setMessageType('success');
            } else {
              setMessage('OTP sent to your email. Please enter it below.');
              setMessageType('info');
            }
          } catch (otpErr) {
            setMessage('Failed to send OTP');
            setMessageType('error');
          }
        } else {
          // Direct login without OTP
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userRole', response.data.user.role || 'citizen');
          localStorage.setItem('userName', response.data.user.name);
          navigate('/');
        }
      } catch (err) {
        setMessage(err.response?.data?.error || 'Login failed. Please try again.');
        setMessageType('error');
      } finally {
        setLoading(false);
      }
    } else if (step === 'otp') {
      if (!formData.otp) {
        setMessage('Please enter OTP');
        setMessageType('error');
        return;
      }

      try {
        setLoading(true);
        const response = await axios.post(`${API_URL}/auth/verify-otp`, {
          email: formData.email,
          otp: formData.otp
        });

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', response.data.user.role || 'citizen');
        localStorage.setItem('userName', response.data.user.name);
        localStorage.setItem('userEmail', formData.email);

        if (rememberMe) {
          localStorage.setItem('rememberedEmail', formData.email);
        }

        navigate('/citizen-dashboard');
      } catch (err) {
        setMessage(err.response?.data?.error || 'OTP verification failed');
        setMessageType('error');
      } finally {
        setLoading(false);
      }
    }
  };

  const resendOTP = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/auth/send-otp`, {
        email: formData.email
      });
      setOtpTimer(600);
      
      // If in mock mode, display the OTP
      if (response.data.isMock && response.data.otp) {
        setMockOtp(response.data.otp);
        setMessage(`✨ TEST MODE: Your OTP is ${response.data.otp}`);
        setMessageType('success');
      } else {
        setMessage('OTP resent successfully');
        setMessageType('success');
      }
    } catch (err) {
      setMessage('Failed to resend OTP');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  // OTP Timer
  React.useEffect(() => {
    if (otpTimer <= 0) return;
    const timer = setInterval(() => {
      setOtpTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [otpTimer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Welcome Back</h1>
            <p>Sign in to your account</p>
          </div>

          {message && (
            <div className={`message-box ${messageType}`}>
              <span className="message-icon">
                {messageType === 'error' && '✕'}
                {messageType === 'info' && 'ℹ️'}
                {messageType === 'success' && '✓'}
              </span>
              {message}
            </div>
          )}

          {step === 'credentials' ? (
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  disabled={loading}
                  required
                />
              </div>

              <div className="remember-me">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
                <label htmlFor="rememberMe">Remember me</label>
              </div>

              <button
                type="submit"
                className="auth-button"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="otp-info">
                <p>An OTP has been sent to <strong>{formData.email}</strong></p>
              </div>

              <div className="form-group">
                <label htmlFor="otp">Enter OTP *</label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                  disabled={loading}
                  required
                  className="otp-input"
                />
              </div>

              <div className="otp-timer">
                {otpTimer > 0 ? (
                  <p>OTP expires in <strong>{formatTime(otpTimer)}</strong></p>
                ) : (
                  <p className="expired">OTP has expired</p>
                )}
              </div>

              <button
                type="submit"
                className="auth-button"
                disabled={loading || otpTimer <= 0}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <button
                type="button"
                className="auth-button secondary"
                onClick={resendOTP}
                disabled={loading || otpTimer > 300}
              >
                Resend OTP {otpTimer > 300 && <span>({Math.ceil((600 - otpTimer) / 60)}s)</span>}
              </button>

              <button
                type="button"
                className="back-button"
                onClick={() => {
                  setStep('credentials');
                  setFormData({ ...formData, otp: '' });
                  setMockOtp('');
                  setMessage('');
                  setMessageType('');
                }}
              >
                ← Back to Login
              </button>
            </form>
          )}

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/citizen-register">Create one</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CitizenLogin;
