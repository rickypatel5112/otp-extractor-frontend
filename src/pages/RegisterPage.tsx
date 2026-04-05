import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/useAuth';
import './auth.css';

function getPasswordStrength(password: string): 0 | 1 | 2 | 3 | 4 {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score as 0 | 1 | 2 | 3 | 4;
}

const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthClasses = [
  '',
  'active-weak',
  'active-fair',
  'active-good',
  'active-strong',
];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const strength = getPasswordStrength(password);
  const passwordMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (strength < 2) {
      setError('Please choose a stronger password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register(firstname, lastname, email, password);
      navigate('/login');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Registration failed. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const isValid =
    firstname &&
    lastname &&
    email &&
    password &&
    confirmPassword &&
    !passwordMismatch &&
    strength >= 2;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo">
          <span className="auth-logo-icon">⚡</span>
          <span className="auth-logo-text">OTP Extractor</span>
        </Link>

        <h1 className="auth-heading">Create an account</h1>
        <p className="auth-subheading">Start extracting OTPs in seconds</p>

        {error && (
          <div className="auth-alert auth-alert-error" role="alert">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              style={{ flexShrink: 0, marginTop: 1 }}
            >
              <circle
                cx="8"
                cy="8"
                r="7"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M8 5v3.5M8 11h.01"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
            }}
          >
            <div className="form-field">
              <label className="form-label" htmlFor="firstname">
                First name
              </label>
              <input
                id="firstname"
                type="text"
                className="form-input"
                placeholder="John"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                autoComplete="given-name"
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="lastname">
                Last name
              </label>
              <input
                id="lastname"
                type="text"
                className="form-input"
                placeholder="Doe"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                autoComplete="family-name"
                required
              />
            </div>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div className="form-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="input-toggle-btn"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {password.length > 0 && (
              <>
                <div className="password-strength">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`strength-bar ${strength >= level ? strengthClasses[strength] : ''}`}
                    />
                  ))}
                </div>
                <span className="strength-label">
                  {strengthLabels[strength]}
                </span>
              </>
            )}
            <span className="form-hint">
              Min 8 chars, include uppercase, number, and symbol
            </span>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="confirm-password">
              Confirm password
            </label>
            <input
              id="confirm-password"
              type={showPassword ? 'text' : 'password'}
              className="form-input"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
            {passwordMismatch && (
              <span className="form-error">Passwords do not match</span>
            )}
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading || !isValid}
          >
            {loading && <span className="spinner" />}
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
