import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/useAuth';
import './auth.css';

export default function LogoutPage() {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If user lands here while not authenticated, redirect to login
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo">
          <span className="auth-logo-icon">⚡</span>
          <span className="auth-logo-text">OTP Extractor</span>
        </Link>

        <div className="logout-icon">
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </div>

        <h1 className="auth-heading">Sign out?</h1>
        <p className="auth-subheading">
          You will be signed out of your account on this device
        </p>

        <div className="logout-actions">
          <button type="button" className="btn-primary" onClick={handleLogout}>
            Yes, sign out
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
