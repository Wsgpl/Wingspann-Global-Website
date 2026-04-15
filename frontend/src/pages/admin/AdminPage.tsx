import { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import { adminLogout, clearStoredUsername } from '../../lib/adminApi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ── FIX 2: Auth check now pings the server instead of reading localStorage ────
// Previously we decoded the JWT from localStorage to check expiry.
// Since the token is now in an HttpOnly cookie that JS cannot read,
// we verify auth by making a lightweight API call. If the cookie is
// valid the server returns 200; if expired/missing it returns 401.
async function checkAuthStatus(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/api/admin/me`, {
      method: 'GET',
      credentials: 'include',
    });
    return res.ok;
  } catch {
    return false;
  }
}

export default function AdminPage() {
  const [authed, setAuthed]   = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkAuthStatus().then(valid => {
      setAuthed(valid);
      setChecking(false);
    });
  }, []);

  function handleLogin() {
    setAuthed(true);
  }

  async function handleLogout() {
    await adminLogout(); // clears the HttpOnly cookie server-side
    clearStoredUsername();
    setAuthed(false);
  }

  // Show nothing while checking — prevents flash of login screen
  if (checking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-zinc-600 text-sm animate-pulse">Checking session...</div>
      </div>
    );
  }

  if (!authed) return <AdminLogin onLogin={handleLogin} />;
  return <AdminDashboard onLogout={handleLogout} />;
}
