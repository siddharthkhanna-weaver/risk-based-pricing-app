import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_CREDENTIALS } from '../data/pricingRules';
import '../styles/Login.css';

export default function Login({ onLogin }) {
  const [step, setStep] = useState('email'); // email | otp
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (email.trim().toLowerCase() !== DEFAULT_CREDENTIALS.email) {
      setError('Your email is not authorized to access this system. Please contact your administrator.');
      return;
    }
    setStep('otp');
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (otp !== DEFAULT_CREDENTIALS.otp) {
      setError('Invalid OTP. Please try again.');
      return;
    }
    onLogin({ name: DEFAULT_CREDENTIALS.name, role: DEFAULT_CREDENTIALS.role, email });
    navigate('/dashboard');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <img src="/logo.png" alt="PeopleHome" className="login-logo-img" />
          <h1>Enterprise Portal</h1>
          <p className="login-subtitle">Risk Based Pricing Calculator</p>
        </div>

        {step === 'email' ? (
          <form onSubmit={handleEmailSubmit}>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
            <div className="hint">Demo: {DEFAULT_CREDENTIALS.email}</div>
            {error && <div className="error-msg">{error}</div>}
            <button type="submit" className="btn-primary">Send OTP</button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit}>
            <label htmlFor="otp">Enter OTP sent to {email}</label>
            <input
              id="otp"
              type="text"
              placeholder="4-digit OTP"
              maxLength={4}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              autoFocus
            />
            <div className="hint">Demo OTP: {DEFAULT_CREDENTIALS.otp}</div>
            {error && <div className="error-msg">{error}</div>}
            <button type="submit" className="btn-primary">Verify & Login</button>
            <button type="button" className="btn-link" onClick={() => { setStep('email'); setOtp(''); setError(''); }}>
              ← Change email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
