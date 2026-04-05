import { useState, type ReactNode } from 'react';

import { AuthContext, type User } from './AuthContext';

const BASE_URL = 'http://localhost:8080';

function parseJwt(token: string): Record<string, unknown> {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return {};
  }
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('accessToken');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) ?? {}),
  };
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? body.error ?? 'Request failed');
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const register = async (
    firstname: string,
    lastname: string,
    email: string,
    password: string,
  ) => {
    await apiFetch('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ firstname, lastname, email, password }),
    });
  };

  const login = async (email: string, password: string) => {
    const data: { accessToken: string } = await apiFetch('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('accessToken', data.accessToken);

    const claims = parseJwt(data.accessToken);
    const currentUser: User = {
      id: String(claims.sub ?? claims.id ?? ''),
      email: String(claims.email ?? claims.sub ?? email),
      name:
        [claims.firstname, claims.lastname].filter(Boolean).join(' ') ||
        String(claims.name ?? email.split('@')[0]),
    };

    localStorage.setItem('user', JSON.stringify(currentUser));
    setUser(currentUser);
  };

  const logout = async () => {
    try {
      await apiFetch('/api/v1/auth/logout', { method: 'POST' });
    } catch {
      // ignore remote errors and still clear local auth state
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const forgotPassword = async (email: string) => {
    await apiFetch('/api/v1/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  };

  const resetPassword = async (token: string, password: string) => {
    await apiFetch(
      `/api/v1/auth/reset-password?token=${encodeURIComponent(token)}`,
      {
        method: 'POST',
        body: JSON.stringify({ newPassword: password }),
      },
    );
  };

  const deleteAccount = async () => {
    await apiFetch('/api/v1/auth/delete-account/me', { method: 'DELETE' });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
