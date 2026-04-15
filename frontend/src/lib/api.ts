const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ContactPayload {
  name: string;
  email: string;
  org?: string;
  subject?: string;
  inquiryType?: string;
  message: string;
}

export interface ApplyPayload {
  name: string;
  email: string;
  phone?: string;
  position: string;
  department?: string;
  coverLetter?: string;
  resume?: File | null;
}

interface ApiResponse {
  success?: boolean;
  message?: string;
  error?: string;
}

export interface SocialLinkSetting {
  enabled: boolean;
  url: string;
}

export interface SocialLinksSettings {
  instagram: SocialLinkSetting;
  youtube: SocialLinkSetting;
  linkedin: SocialLinkSetting;
  twitter: SocialLinkSetting;
}

export type CareerCategory = 'technical' | 'business';

export interface CareerPosition {
  id: number;
  title: string;
  department: string;
  description: string;
  category: CareerCategory;
  sort_order: number;
  is_published: number;
  apply_enabled: number;
}

export type ProductCategory = 'uas' | 'space' | 'aerospace' | 'optical';

export interface Product {
  id: number;
  name: string;
  slug: string;
  category: ProductCategory;
  tagline: string;
  description: string;
  specs: unknown;
  features: unknown;
  detail_sections: unknown;
  status: 'active' | 'coming_soon' | 'retired';
  image_url: string;
  model_url: string;
  sort_order: number;
  is_published: number;
}

export function createDefaultSocialLinksSettings(): SocialLinksSettings {
  return {
    instagram: { enabled: false, url: '' },
    youtube: { enabled: false, url: '' },
    linkedin: { enabled: false, url: '' },
    twitter: { enabled: false, url: '' },
  };
}

export function normalizeSocialLinksSettings(data?: Partial<SocialLinksSettings>): SocialLinksSettings {
  const defaults = createDefaultSocialLinksSettings();

  return {
    instagram: { ...defaults.instagram, ...(data?.instagram || {}) },
    youtube: { ...defaults.youtube, ...(data?.youtube || {}) },
    linkedin: { ...defaults.linkedin, ...(data?.linkedin || {}) },
    twitter: { ...defaults.twitter, ...(data?.twitter || {}) },
  };
}

// ── Contact form ──────────────────────────────────────────────────────────────

export async function submitContact(data: ContactPayload): Promise<ApiResponse> {
  const res = await fetch(`${API_URL}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

// ── Career application ────────────────────────────────────────────────────────

export async function submitApplication(data: ApplyPayload): Promise<ApiResponse> {
  const form = new FormData();
  form.append('name', data.name);
  form.append('email', data.email);
  if (data.phone)       form.append('phone', data.phone);
  form.append('position', data.position);
  if (data.department)  form.append('department', data.department);
  if (data.coverLetter) form.append('coverLetter', data.coverLetter);
  if (data.resume)      form.append('resume', data.resume);

  const res = await fetch(`${API_URL}/api/apply`, {
    method: 'POST',
    body: form,
  });
  return res.json();
}

// ── Public: News ──────────────────────────────────────────────────────────────

export async function fetchCareerPositions(): Promise<CareerPosition[]> {
  try {
    const res = await fetch(`${API_URL}/api/careers/positions`);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function fetchPublishedNews() {
  try {
    const res = await fetch(`${API_URL}/api/news`);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

// ── Public: Products ─────────────────────────────────────────────────────────

export function parseJsonField<T>(value: unknown, fallback: T): T {
  if (!value) return fallback;
  if (typeof value !== 'string') return value as T;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function resolveMediaUrl(url?: string | null): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith('/uploads/')) return `${API_URL}${trimmed}`;
  return trimmed;
}

function normalizeProduct(product: Product): Product {
  return {
    ...product,
    image_url: resolveMediaUrl(product.image_url),
    model_url: resolveMediaUrl(product.model_url),
  };
}

export async function fetchPublishedProducts(category?: ProductCategory): Promise<Product[]> {
  try {
    const params = category ? `?category=${encodeURIComponent(category)}` : '';
    const res = await fetch(`${API_URL}/api/products${params}`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.map(normalizeProduct) : [];
  } catch {
    return [];
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_URL}/api/products/${slug}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data && typeof data === 'object' ? normalizeProduct(data as Product) : null;
  } catch {
    return null;
  }
}

// ── Public: Technology ────────────────────────────────────────────────────────

export async function fetchTechnologyByCategory(category: string) {
  try {
    const res = await fetch(`${API_URL}/api/technology/${category}`);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function fetchSocialLinks(): Promise<SocialLinksSettings> {
  try {
    const res = await fetch(`${API_URL}/api/social-links`);
    if (!res.ok) return createDefaultSocialLinksSettings();
    const data = await res.json();
    return normalizeSocialLinksSettings(data);
  } catch {
    return createDefaultSocialLinksSettings();
  }
}
