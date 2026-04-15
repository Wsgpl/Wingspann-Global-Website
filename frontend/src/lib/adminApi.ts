import {
  createDefaultSocialLinksSettings,
  normalizeSocialLinksSettings,
  type CareerPosition,
  type SocialLinksSettings,
} from './api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ── FIX 2: Token is now stored in HttpOnly cookie set by the server ───────────
// We no longer store anything in localStorage. The browser automatically sends
// the HttpOnly cookie on every request to the same origin — JavaScript cannot
// read or steal it even if XSS is present.
//
// The only thing we store in localStorage is the username for display purposes.
// This is NOT sensitive — the actual auth token is in the cookie.

export const getStoredUsername = () => localStorage.getItem('wingspann_admin_user');
export const setStoredUsername = (u: string) => localStorage.setItem('wingspann_admin_user', u);
export const clearStoredUsername = () => localStorage.removeItem('wingspann_admin_user');

// Auth headers no longer include Authorization token —
// the HttpOnly cookie is sent automatically by the browser.
function authHeaders() {
  return { 'Content-Type': 'application/json' };
}

async function parseApiResponse(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || 'Request failed.');
  }
  return data;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export async function adminLogin(username: string, password: string) {
  const res = await fetch(`${API_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // send/receive cookies cross-origin
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export async function adminLogout() {
  await fetch(`${API_URL}/api/admin/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  clearStoredUsername();
}

// ── Media upload ──────────────────────────────────────────────────────────────
export async function uploadMedia(file: File): Promise<{ url?: string; error?: string }> {
  const form = new FormData();
  form.append('file', file);

  const res = await fetch(`${API_URL}/api/admin/upload`, {
    method: 'POST',
    credentials: 'include', // sends HttpOnly cookie
    body: form,
  });
  return res.json();
}

// ── Social links ──────────────────────────────────────────────────────────────
export async function fetchSocialLinksSettings(): Promise<SocialLinksSettings> {
  const res = await fetch(`${API_URL}/api/admin/social-links`, {
    headers: authHeaders(), credentials: 'include',
  });
  if (!res.ok) return createDefaultSocialLinksSettings();
  const data = await res.json();
  return normalizeSocialLinksSettings(data);
}

export async function updateSocialLinksSettings(data: SocialLinksSettings) {
  const res = await fetch(`${API_URL}/api/admin/social-links`, {
    method: 'PUT', headers: authHeaders(), credentials: 'include',
    body: JSON.stringify(data),
  });
  return res.json();
}

// ── Careers ───────────────────────────────────────────────────────────────────
export async function fetchAllCareerPositions(): Promise<CareerPosition[]> {
  const res = await fetch(`${API_URL}/api/admin/careers`, {
    headers: authHeaders(), credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch career positions.');
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error('Invalid career positions response.');
  return data;
}

export async function createCareerPosition(data: object) {
  const res = await fetch(`${API_URL}/api/admin/careers`, {
    method: 'POST', headers: authHeaders(), credentials: 'include',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateCareerPosition(id: number, data: object) {
  const res = await fetch(`${API_URL}/api/admin/careers/${id}`, {
    method: 'PUT', headers: authHeaders(), credentials: 'include',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteCareerPosition(id: number) {
  const res = await fetch(`${API_URL}/api/admin/careers/${id}`, {
    method: 'DELETE', headers: authHeaders(), credentials: 'include',
  });
  return res.json();
}

// ── News ──────────────────────────────────────────────────────────────────────
export async function fetchAllNews() {
  const res = await fetch(`${API_URL}/api/news/all`, {
    headers: authHeaders(), credentials: 'include',
  });
  return res.json();
}

export async function createNews(data: object) {
  const res = await fetch(`${API_URL}/api/news`, {
    method: 'POST', headers: authHeaders(), credentials: 'include',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateNews(id: number, data: object) {
  const res = await fetch(`${API_URL}/api/news/${id}`, {
    method: 'PUT', headers: authHeaders(), credentials: 'include',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteNews(id: number) {
  const res = await fetch(`${API_URL}/api/news/${id}`, {
    method: 'DELETE', headers: authHeaders(), credentials: 'include',
  });
  return res.json();
}

// ── Technology ────────────────────────────────────────────────────────────────
export async function fetchAllTechnology() {
  const res = await fetch(`${API_URL}/api/technology`, {
    headers: authHeaders(), credentials: 'include',
  });
  return res.json();
}

export async function createTechnologyItem(data: object) {
  const res = await fetch(`${API_URL}/api/technology`, {
    method: 'POST', headers: authHeaders(), credentials: 'include',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateTechnologyItem(id: number, data: object) {
  const res = await fetch(`${API_URL}/api/technology/${id}`, {
    method: 'PUT', headers: authHeaders(), credentials: 'include',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteTechnologyItem(id: number) {
  const res = await fetch(`${API_URL}/api/technology/${id}`, {
    method: 'DELETE', headers: authHeaders(), credentials: 'include',
  });
  return res.json();
}

// ── Products ──────────────────────────────────────────────────────────────────
export async function fetchAllProducts() {
  const res = await fetch(`${API_URL}/api/products/admin/all`, {
    headers: { ...authHeaders(), 'Cache-Control': 'no-store' },
    credentials: 'include',
    cache: 'no-store',
  });
  return parseApiResponse(res);
}

export async function createProduct(data: object) {
  const res = await fetch(`${API_URL}/api/products`, {
    method: 'POST', headers: authHeaders(), credentials: 'include',
    body: JSON.stringify(data),
  });
  return parseApiResponse(res);
}

export async function updateProduct(id: number, data: object) {
  const res = await fetch(`${API_URL}/api/products/${id}`, {
    method: 'PUT', headers: authHeaders(), credentials: 'include',
    body: JSON.stringify(data),
  });
  return parseApiResponse(res);
}

export async function deleteProduct(id: number) {
  const res = await fetch(`${API_URL}/api/products/${id}`, {
    method: 'DELETE', headers: authHeaders(), credentials: 'include',
  });
  return res.json();
}
