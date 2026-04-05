import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../context/useAuth';
import './auth.css';

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo">
          <span className="auth-logo-icon">⚡</span>
          <span className="auth-logo-text">OTP Extractor</span>
        </Link>

        {sent ? (
          <div className="reset-success">
            <div className="reset-success-icon">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <h1 className="auth-heading">Check your email</h1>
            <p className="auth-subheading" style={{ marginBottom: 0 }}>
              We have sent a password reset link to <strong>{email}</strong>.
              Check your inbox and follow the instructions.
            </p>
            <p
              className="form-hint"
              style={{ textAlign: 'center', marginTop: 8 }}
            >
              Did not receive it? Check your spam folder or{' '}
              <button
                type="button"
                className="auth-link"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  font: 'inherit',
                }}
                onClick={() => {
                  setSent(false);
                }}
              >
                try again
              </button>
              .
            </p>
            <Link
              to="/login"
              className="btn-primary"
              style={{
                textDecoration: 'none',
                textAlign: 'center',
                marginTop: 8,
              }}
            >
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <h1 className="auth-heading">Forgot password?</h1>
            <p className="auth-subheading">
              Enter your email and we will send you a reset link
            </p>

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

              <button
                type="submit"
                className="btn-primary"
                disabled={loading || !email}
              >
                {loading && <span className="spinner" />}
                {loading ? 'Sending…' : 'Send reset link'}
              </button>
            </form>

            <div className="auth-footer">
              <Link to="/login" className="auth-link">
                ← Back to sign in
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
