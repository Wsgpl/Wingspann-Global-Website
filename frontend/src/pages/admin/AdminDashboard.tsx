import { useState, useEffect, useRef } from 'react';
import { fetchAllNews, createNews, updateNews, deleteNews,
         fetchAllTechnology, createTechnologyItem, updateTechnologyItem, deleteTechnologyItem,
         fetchAllProducts, createProduct, updateProduct, deleteProduct,
         fetchAllCareerPositions, updateCareerPosition,
         uploadMedia, fetchSocialLinksSettings, updateSocialLinksSettings } from '../../lib/adminApi';
import { createDefaultSocialLinksSettings, parseJsonField, type CareerPosition, type Product, type SocialLinksSettings } from '../../lib/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ── Types ─────────────────────────────────────────────────────────────────────
interface NewsItem {
  id: number; title: string; summary: string; content: string;
  source: string; source_url: string; image_url: string;
  video_url: string; extra_videos: any; published_at: string; is_published: number;
}
interface TechItem {
  id: number; category: string; title: string; subtitle: string;
  description: string; specs: any; sort_order: number; is_published: number; image_url: string;
}
type ProductItem = Product;

type Tab = 'news' | 'careers' | 'social' | 'settings';

function Badge({ published }: { published: number }) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${published ? 'bg-green-900 text-green-300' : 'bg-zinc-700 text-zinc-400'}`}>
      {published ? 'Published' : 'Draft'}
    </span>
  );
}

function resolveAdminMediaUrl(url: string): string {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/uploads/')) return `${API_URL}${url}`;
  return url;
}

function specsToText(specs: any): string {
  if (!specs) return '';
  try {
    const arr = typeof specs === 'string' ? JSON.parse(specs) : specs;
    if (!Array.isArray(arr)) return '';
    return arr.map((s: any) => (typeof s === 'string' ? s : `${s.label}: ${s.value}`)).join('\n');
  } catch { return ''; }
}

function textToSpecs(text: string) {
  return text.split('\n').map(l => l.trim()).filter(Boolean).map(line => {
    const colon = line.indexOf(':');
    if (colon === -1) return { label: line, value: '' };
    return { label: line.slice(0, colon).trim(), value: line.slice(colon + 1).trim() };
  });
}

function featuresToText(features: any): string {
  if (!features) return '';
  try {
    const arr = typeof features === 'string' ? JSON.parse(features) : features;
    return Array.isArray(arr) ? arr.join('\n') : '';
  } catch { return ''; }
}

function textToFeatures(text: string): string[] {
  return text.split('\n').map(l => l.trim()).filter(Boolean);
}

type ProductDetailSections = {
  overview?: {
    paragraphs?: string[];
    stats?: Array<{ value: string; unit?: string; label: string; icon?: string }>;
    missions?: Array<{ title: string; description: string; icon?: string }>;
    advantages?: Array<{ title: string; description: string; metric?: string; icon?: string }>;
  };
  specifications?: Array<{ label: string; rows: Array<{ label: string; value: string }> }>;
  safety?: {
    triggers?: string[];
    features?: Array<{ title: string; badge?: string; description: string }>;
  };
  payload?: {
    intro?: string;
    variants?: unknown[];
  };
};

const emptyDetailSections: ProductDetailSections = {
  overview: { paragraphs: [], stats: [], missions: [], advantages: [] },
  specifications: [],
  safety: { triggers: [], features: [] },
  payload: { intro: '', variants: [] },
};

function parseDetailSections(value: unknown): ProductDetailSections {
  return {
    ...emptyDetailSections,
    ...parseJsonField<ProductDetailSections>(value, emptyDetailSections),
  };
}

function linesToText(lines?: string[]) {
  return Array.isArray(lines) ? lines.join('\n') : '';
}

function textToLines(text: string) {
  return text.split('\n').map(line => line.trim()).filter(Boolean);
}

function detailStatsToText(details: ProductDetailSections) {
  return (details.overview?.stats || [])
    .map(stat => [stat.value, stat.unit || '', stat.label, stat.icon || ''].join(' | '))
    .join('\n');
}

function textToDetailStats(text: string) {
  return textToLines(text).map(line => {
    const [value = '', unit = '', label = '', icon = ''] = line.split('|').map(part => part.trim());
    return { value, unit, label, icon };
  }).filter(stat => stat.value && stat.label);
}

function detailCardsToText(cards?: Array<{ title: string; description: string; icon?: string }>) {
  return (cards || []).map(card => [card.title, card.description, card.icon || ''].join(' | ')).join('\n');
}

function textToDetailCards(text: string) {
  return textToLines(text).map(line => {
    const [title = '', description = '', icon = ''] = line.split('|').map(part => part.trim());
    return { title, description, icon };
  }).filter(card => card.title && card.description);
}

function advantagesToText(details: ProductDetailSections) {
  return (details.overview?.advantages || [])
    .map(item => [item.title, item.description, item.metric || '', item.icon || ''].join(' | '))
    .join('\n');
}

function textToAdvantages(text: string) {
  return textToLines(text).map(line => {
    const [title = '', description = '', metric = '', icon = ''] = line.split('|').map(part => part.trim());
    return { title, description, metric, icon };
  }).filter(item => item.title && item.description);
}

function specGroupsToText(details: ProductDetailSections) {
  return (details.specifications || [])
    .flatMap(group => (group.rows || []).map(row => `${group.label} | ${row.label} | ${row.value}`))
    .join('\n');
}

function textToSpecGroups(text: string) {
  const groups: Array<{ label: string; rows: Array<{ label: string; value: string }> }> = [];

  textToLines(text).forEach(line => {
    const [groupLabel = 'General', rowLabel = '', ...valueParts] = line.split('|').map(part => part.trim());
    const value = valueParts.join(' | ');
    if (!rowLabel || !value) return;

    let group = groups.find(item => item.label === groupLabel);
    if (!group) {
      group = { label: groupLabel, rows: [] };
      groups.push(group);
    }
    group.rows.push({ label: rowLabel, value });
  });

  return groups;
}

function safetyFeaturesToText(details: ProductDetailSections) {
  return (details.safety?.features || [])
    .map(item => [item.title, item.badge || '', item.description].join(' | '))
    .join('\n');
}

function textToSafetyFeatures(text: string) {
  return textToLines(text).map(line => {
    const [title = '', badge = '', description = ''] = line.split('|').map(part => part.trim());
    return { title, badge, description };
  }).filter(item => item.title && item.description);
}

// ── Reusable media uploader component ────────────────────────────────────────
function MediaUploader({
  label, accept, currentUrl, onUploaded, onUrlChange
}: {
  label: string;
  accept: string;
  currentUrl: string;
  onUploaded: (url: string) => void;
  onUrlChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const res = await uploadMedia(file);
      if (res.url) {
        onUploaded(res.url);
      } else {
        setError(res.error || 'Upload failed.');
      }
    } catch {
      setError('Upload failed. Check server is running.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-zinc-500 text-xs block">{label}</label>

      {/* URL input */}
      <input
        placeholder="Paste URL or upload a file below"
        value={currentUrl || ''}
        onChange={e => onUrlChange(e.target.value)}
        className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm"
      />

      {/* File upload */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="text-xs px-3 py-1.5 rounded-lg border border-zinc-600 text-zinc-400 hover:text-white hover:border-zinc-400 transition disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : '⬆ Upload file'}
        </button>
        {currentUrl && (
          <span className="text-zinc-500 text-xs truncate max-w-[200px]">{currentUrl}</span>
        )}
        {error && <span className="text-red-400 text-xs">{error}</span>}
      </div>

      <input ref={inputRef} type="file" accept={accept} onChange={handleFile} className="hidden" />

      {/* Preview */}
      {currentUrl && accept.includes('image') && (
        <img src={resolveAdminMediaUrl(currentUrl)}
          alt="preview" className="h-20 rounded-lg object-cover border border-zinc-700 mt-1"
          onError={e => (e.currentTarget.style.display = 'none')} />
      )}
      {currentUrl && accept.includes('video') && (
        <video src={resolveAdminMediaUrl(currentUrl)}
          className="h-20 rounded-lg border border-zinc-700 mt-1" muted
          onError={e => (e.currentTarget.style.display = 'none')} />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// NEWS SECTION
// ═══════════════════════════════════════════════════════════════════════════════
function NewsSection() {
  const [items, setItems]     = useState<NewsItem[]>([]);
  const [editing, setEditing] = useState<Partial<NewsItem> | null>(null);
  const [saving, setSaving]   = useState(false);

  useEffect(() => { fetchAllNews().then(setItems); }, []);

  async function handleDelete(id: number, title: string) {
    if (!window.confirm(`Delete "${title}"?`)) return;
    await deleteNews(id);
    setItems(prev => prev.filter(n => n.id !== id));
  }

  async function handleSave() {
    if (!editing || !editing.title) return;
    setSaving(true);
    try {
      if (editing.id) {
        await updateNews(editing.id, editing);
        setItems(prev => prev.map(n => n.id === editing.id ? { ...n, ...editing } as NewsItem : n));
      } else {
        const res = await createNews(editing);
        setItems(prev => [{ ...editing, id: res.id, is_published: editing.is_published ?? 1 } as NewsItem, ...prev]);
      }
      setEditing(null);
    } finally { setSaving(false); }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-white font-semibold text-lg">News articles</h2>
        <button onClick={() => setEditing({ is_published: 1 })}
          className="bg-white text-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-zinc-200 transition">
          + Add article
        </button>
      </div>
      <p className="text-zinc-500 text-xs mb-4">You can upload images/videos directly or paste a URL. Both work.</p>

      {editing && (
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 mb-6 space-y-4">
          <h3 className="text-white font-medium">{editing.id ? 'Edit article' : 'New article'}</h3>

          <div>
            <label className="text-zinc-500 text-xs block mb-1">Title *</label>
            <input value={editing.title || ''} onChange={e => setEditing(p => ({ ...p, title: e.target.value }))}
              placeholder="Article title"
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm" />
          </div>

          <div>
            <label className="text-zinc-500 text-xs block mb-1">Summary (shown on news card)</label>
            <textarea value={editing.summary || ''} onChange={e => setEditing(p => ({ ...p, summary: e.target.value }))}
              rows={2} placeholder="Short summary visible on the card"
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm resize-none" />
          </div>

          <div>
            <label className="text-zinc-500 text-xs block mb-1">Full article text (shown in modal when clicked)</label>
            <textarea value={(editing as any).content || ''} onChange={e => setEditing(p => ({ ...p, content: e.target.value }))}
              rows={4} placeholder="Full article content"
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm resize-none" />
          </div>

          {/* Image upload */}
          <MediaUploader
            label="Image (JPG, PNG, WEBP)"
            accept="image/*"
            currentUrl={(editing as any).image_url || ''}
            onUploaded={url => setEditing(p => ({ ...p, image_url: url }))}
            onUrlChange={url => setEditing(p => ({ ...p, image_url: url }))}
          />

          {/* Primary video upload */}
          <MediaUploader
            label="Video (MP4, MOV, WEBM)"
            accept="video/*"
            currentUrl={(editing as any).video_url || ''}
            onUploaded={url => setEditing(p => ({ ...p, video_url: url }))}
            onUrlChange={url => setEditing(p => ({ ...p, video_url: url }))}
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-zinc-500 text-xs block mb-1">Source name</label>
              <input value={editing.source || ''} onChange={e => setEditing(p => ({ ...p, source: e.target.value }))}
                placeholder="e.g. Times of India"
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-zinc-500 text-xs block mb-1">Source URL</label>
              <input value={editing.source_url || ''} onChange={e => setEditing(p => ({ ...p, source_url: e.target.value }))}
                placeholder="https://..."
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>

          <div>
            <label className="text-zinc-500 text-xs block mb-1">Published date</label>
            <input type="date" value={editing.published_at || ''} onChange={e => setEditing(p => ({ ...p, published_at: e.target.value }))}
              className="bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm" />
          </div>

          <label className="flex items-center gap-2 text-zinc-400 text-sm cursor-pointer">
            <input type="checkbox" checked={!!editing.is_published}
              onChange={e => setEditing(p => ({ ...p, is_published: e.target.checked ? 1 : 0 }))} />
            Published (visible on website)
          </label>

          <div className="flex gap-3 pt-1">
            <button onClick={handleSave} disabled={saving}
              className="bg-white text-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-zinc-200 transition disabled:opacity-50">
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => setEditing(null)} className="text-zinc-400 text-sm hover:text-white transition">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {Array.isArray(items) && items.map(item => (
          <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-white text-sm font-medium truncate">{item.title}</span>
                <Badge published={item.is_published} />
                {item.image_url && <span className="text-zinc-500 text-xs">📷</span>}
                {item.video_url && <span className="text-zinc-500 text-xs">🎥</span>}
              </div>
              <span className="text-zinc-500 text-xs">{item.source || '—'} · {item.published_at || 'No date'}</span>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => setEditing(item)}
                className="text-zinc-400 hover:text-white text-xs px-3 py-1.5 rounded-lg border border-zinc-700 hover:border-zinc-500 transition">Edit</button>
              <button onClick={() => handleDelete(item.id, item.title)}
                className="text-red-400 hover:text-red-300 text-xs px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-red-800 transition">Delete</button>
            </div>
          </div>
        ))}
        {Array.isArray(items) && items.length === 0 && <p className="text-zinc-600 text-sm text-center py-8">No articles yet.</p>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TECHNOLOGY SECTION
// ═══════════════════════════════════════════════════════════════════════════════
function TechnologySection() {
  const [items, setItems]         = useState<TechItem[]>([]);
  const [editing, setEditing]     = useState<Partial<TechItem> | null>(null);
  const [specsText, setSpecsText] = useState('');
  const [saving, setSaving]       = useState(false);

  useEffect(() => { fetchAllTechnology().then(setItems); }, []);

  function openEdit(item?: Partial<TechItem>) {
    const base = item || { is_published: 1, category: 'space', sort_order: 0 };
    setEditing(base);
    setSpecsText(specsToText(base.specs));
  }

  async function handleDelete(id: number, title: string) {
    if (!window.confirm(`Delete "${title}"?`)) return;
    await deleteTechnologyItem(id);
    setItems(prev => prev.filter(n => n.id !== id));
  }

  async function handleSave() {
    if (!editing || !editing.title || !editing.category) return;
    setSaving(true);
    const payload = { ...editing, specs: textToSpecs(specsText) };
    try {
      if (editing.id) {
        await updateTechnologyItem(editing.id, payload);
        setItems(prev => prev.map(n => n.id === editing.id ? { ...n, ...payload } as TechItem : n));
      } else {
        const res = await createTechnologyItem(payload);
        setItems(prev => [...prev, { ...payload, id: res.id } as TechItem]);
      }
      setEditing(null);
    } finally { setSaving(false); }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-white font-semibold text-lg">Technology items</h2>
        <button onClick={() => openEdit()}
          className="bg-white text-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-zinc-200 transition">
          + Add item
        </button>
      </div>
      <p className="text-zinc-500 text-xs mb-4">These populate the Technology page cards (Space, Aerospace, Optical sections).</p>

      {editing && (
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 mb-6 space-y-3">
          <h3 className="text-white font-medium">{editing.id ? 'Edit item' : 'New item'}</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-zinc-500 text-xs block mb-1">Category *</label>
              <select value={editing.category || 'space'} onChange={e => setEditing(p => ({ ...p, category: e.target.value }))}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm">
                {['space', 'aerospace', 'optical', 'uas'].map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
              </select>
            </div>
            <div>
              <label className="text-zinc-500 text-xs block mb-1">Sort order (0 = first)</label>
              <input type="number" value={editing.sort_order ?? 0} onChange={e => setEditing(p => ({ ...p, sort_order: Number(e.target.value) }))}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <input placeholder="Title *" value={editing.title || ''} onChange={e => setEditing(p => ({ ...p, title: e.target.value }))}
            className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Subtitle" value={editing.subtitle || ''} onChange={e => setEditing(p => ({ ...p, subtitle: e.target.value }))}
            className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm" />
          <textarea placeholder="Description" value={editing.description || ''} onChange={e => setEditing(p => ({ ...p, description: e.target.value }))}
            rows={3} className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm resize-none" />

          <MediaUploader
            label="Background image (JPG, PNG, WEBP)"
            accept="image/*"
            currentUrl={editing.image_url || ''}
            onUploaded={url => setEditing(p => ({ ...p, image_url: url }))}
            onUrlChange={url => setEditing(p => ({ ...p, image_url: url }))}
          />

          <div>
            <label className="text-zinc-500 text-xs block mb-1">Features — one per line</label>
            <textarea placeholder={"Satellite components\nOrbital platforms\nSpace propulsion"} value={specsText} onChange={e => setSpecsText(e.target.value)}
              rows={4} className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm resize-none font-mono" />
          </div>
          <label className="flex items-center gap-2 text-zinc-400 text-sm cursor-pointer">
            <input type="checkbox" checked={!!editing.is_published} onChange={e => setEditing(p => ({ ...p, is_published: e.target.checked ? 1 : 0 }))} />
            Published (unchecked = Coming Soon)
          </label>
          <div className="flex gap-3 pt-1">
            <button onClick={handleSave} disabled={saving}
              className="bg-white text-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-zinc-200 transition disabled:opacity-50">
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => setEditing(null)} className="text-zinc-400 text-sm hover:text-white transition">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {Array.isArray(items) && items.map(item => (
          <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-zinc-500 text-xs uppercase font-medium bg-zinc-800 px-2 py-0.5 rounded">{item.category}</span>
                <span className="text-white text-sm font-medium truncate">{item.title}</span>
                <Badge published={item.is_published} />
              </div>
              <span className="text-zinc-500 text-xs">{item.subtitle || '—'}</span>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => openEdit(item)} className="text-zinc-400 hover:text-white text-xs px-3 py-1.5 rounded-lg border border-zinc-700 hover:border-zinc-500 transition">Edit</button>
              <button onClick={() => handleDelete(item.id, item.title)} className="text-red-400 hover:text-red-300 text-xs px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-red-800 transition">Delete</button>
            </div>
          </div>
        ))}
        {Array.isArray(items) && items.length === 0 && <p className="text-zinc-600 text-sm text-center py-8">No items yet.</p>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PRODUCTS SECTION
// ═══════════════════════════════════════════════════════════════════════════════
function ProductsSection() {
  const [items, setItems]               = useState<ProductItem[]>([]);
  const [editing, setEditing]           = useState<Partial<ProductItem> | null>(null);
  const [specsText, setSpecsText]       = useState('');
  const [featuresText, setFeaturesText] = useState('');
  const [overviewText, setOverviewText] = useState('');
  const [detailStatsText, setDetailStatsText] = useState('');
  const [missionsText, setMissionsText] = useState('');
  const [advantagesText, setAdvantagesText] = useState('');
  const [detailSpecsText, setDetailSpecsText] = useState('');
  const [safetyTriggersText, setSafetyTriggersText] = useState('');
  const [safetyFeaturesText, setSafetyFeaturesText] = useState('');
  const [payloadIntro, setPayloadIntro] = useState('');
  const [payloadVariantsText, setPayloadVariantsText] = useState('[]');
  const [saving, setSaving]             = useState(false);

  async function loadProducts() {
    const products = await fetchAllProducts();
    setItems(Array.isArray(products) ? products : []);
  }

  useEffect(() => {
    loadProducts().catch(() => {
      setItems([]);
    });
  }, []);

  function openEdit(item?: Partial<ProductItem>) {
    const base = item || { is_published: 1, status: 'active', category: 'uas', sort_order: 0 };
    const details = parseDetailSections(base.detail_sections);
    setEditing(base);
    setSpecsText(specsToText(base.specs));
    setFeaturesText(featuresToText(base.features));
    setOverviewText(linesToText(details.overview?.paragraphs));
    setDetailStatsText(detailStatsToText(details));
    setMissionsText(detailCardsToText(details.overview?.missions));
    setAdvantagesText(advantagesToText(details));
    setDetailSpecsText(specGroupsToText(details));
    setSafetyTriggersText(linesToText(details.safety?.triggers));
    setSafetyFeaturesText(safetyFeaturesToText(details));
    setPayloadIntro(details.payload?.intro || '');
    setPayloadVariantsText(JSON.stringify(details.payload?.variants || [], null, 2));
  }

  async function handleDelete(id: number, name: string) {
    if (!window.confirm(`Delete "${name}"?`)) return;
    await deleteProduct(id);
    setItems(prev => prev.filter(n => n.id !== id));
  }

  async function handleSave() {
    if (!editing || !editing.name || !editing.slug) return;
    setSaving(true);
    let payloadVariants: unknown[] = [];
    try {
      const parsedVariants = JSON.parse(payloadVariantsText || '[]');
      payloadVariants = Array.isArray(parsedVariants) ? parsedVariants : [];
    } catch {
      alert('Payload variants must be valid JSON.');
      setSaving(false);
      return;
    }

    const detail_sections: ProductDetailSections = {
      overview: {
        paragraphs: textToLines(overviewText),
        stats: textToDetailStats(detailStatsText),
        missions: textToDetailCards(missionsText),
        advantages: textToAdvantages(advantagesText),
      },
      specifications: textToSpecGroups(detailSpecsText),
      safety: {
        triggers: textToLines(safetyTriggersText),
        features: textToSafetyFeatures(safetyFeaturesText),
      },
      payload: {
        intro: payloadIntro.trim(),
        variants: payloadVariants,
      },
    };
    const payload = { ...editing, specs: textToSpecs(specsText), features: textToFeatures(featuresText), detail_sections };
    try {
      if (editing.id) {
        await updateProduct(editing.id, payload);
      } else {
        await createProduct(payload);
      }
      const refreshed = await fetchAllProducts();
      if (Array.isArray(refreshed)) setItems(refreshed);
      setEditing(null);
    } catch (err: any) {
      alert(err?.message || 'Failed to save product.');
    } finally { setSaving(false); }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-white font-semibold text-lg">Products</h2>
        <button onClick={() => openEdit()}
          className="bg-white text-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-zinc-200 transition">
          + Add product
        </button>
      </div>
      <p className="text-zinc-500 text-xs mb-4">Manage UAS, Space Systems, Aerospace Components, and Optical & Laser products from here.</p>

      {editing && (
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 mb-6 space-y-3">
          <h3 className="text-white font-medium">{editing.id ? 'Edit product' : 'New product'}</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-zinc-500 text-xs block mb-1">Product name *</label>
              <input placeholder="e.g. Aquila UAV" value={editing.name || ''} onChange={e => setEditing(p => ({ ...p, name: e.target.value }))}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-zinc-500 text-xs block mb-1">Slug * (URL identifier)</label>
              <input placeholder="e.g. aquila-uav" value={editing.slug || ''} onChange={e => setEditing(p => ({ ...p, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm font-mono" />
            </div>
            <div>
              <label className="text-zinc-500 text-xs block mb-1">Category</label>
              <select value={editing.category || 'uas'} onChange={e => setEditing(p => ({ ...p, category: e.target.value as ProductItem['category'] }))}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm">
                <option value="uas">UAS</option>
                <option value="space">Space Systems</option>
                <option value="aerospace">Aerospace Components</option>
                <option value="optical">Optical & Laser Systems</option>
              </select>
            </div>
            <div>
              <label className="text-zinc-500 text-xs block mb-1">Sort order</label>
              <input type="number" value={editing.sort_order ?? 0} onChange={e => setEditing(p => ({ ...p, sort_order: Number(e.target.value) }))}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <input placeholder="Tagline / subtitle" value={editing.tagline || ''} onChange={e => setEditing(p => ({ ...p, tagline: e.target.value }))}
            className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm" />
          <textarea placeholder="Description" value={editing.description || ''} onChange={e => setEditing(p => ({ ...p, description: e.target.value }))}
            rows={3} className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm resize-none" />

          <MediaUploader
            label="Product image (JPG, PNG, WEBP)"
            accept="image/*"
            currentUrl={editing.image_url || ''}
            onUploaded={url => setEditing(p => ({ ...p, image_url: url }))}
            onUrlChange={url => setEditing(p => ({ ...p, image_url: url }))}
          />

          <div>
            <label className="text-zinc-500 text-xs block mb-1">3D model / iframe URL (optional)</label>
            <input placeholder="/space-showcase.html or external embed URL" value={editing.model_url || ''} onChange={e => setEditing(p => ({ ...p, model_url: e.target.value }))}
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm" />
          </div>

          <div>
            <label className="text-zinc-500 text-xs block mb-1">Specs — "Label: Value" one per line</label>
            <textarea placeholder={"Endurance: 45 Min\nRange: 10 KM\nLaunch: VTOL"} value={specsText} onChange={e => setSpecsText(e.target.value)}
              rows={4} className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm resize-none font-mono" />
          </div>
          <div>
            <label className="text-zinc-500 text-xs block mb-1">Features — one per line</label>
            <textarea placeholder={"VTOL capability\nAutonomous navigation"} value={featuresText} onChange={e => setFeaturesText(e.target.value)}
              rows={3} className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm resize-none font-mono" />
          </div>
          <div className="border border-zinc-800 rounded-xl p-4 space-y-3">
            <h4 className="text-white text-sm font-semibold">Detailed product page sections</h4>
            <div>
              <label className="text-zinc-500 text-xs block mb-1">Overview paragraphs - one per line</label>
              <textarea value={overviewText} onChange={e => setOverviewText(e.target.value)}
                rows={4} className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm resize-none" />
            </div>
            <div>
              <label className="text-zinc-500 text-xs block mb-1">Stats - Value | Unit | Label | Icon</label>
              <textarea placeholder={"45 | MIN | Endurance | endurance\n10 | KM | Range | range"} value={detailStatsText} onChange={e => setDetailStatsText(e.target.value)}
                rows={3} className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm resize-none font-mono" />
            </div>
            <div>
              <label className="text-zinc-500 text-xs block mb-1">Mission / use cards - Title | Description | Icon</label>
              <textarea value={missionsText} onChange={e => setMissionsText(e.target.value)}
                rows={3} className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm resize-none font-mono" />
            </div>
            <div>
              <label className="text-zinc-500 text-xs block mb-1">Advantages - Title | Description | Metric | Icon</label>
              <textarea value={advantagesText} onChange={e => setAdvantagesText(e.target.value)}
                rows={3} className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm resize-none font-mono" />
            </div>
            <div>
              <label className="text-zinc-500 text-xs block mb-1">Full specifications - Group | Label | Value</label>
              <textarea placeholder={"Platform | Configuration | Quad-rotor VTOL Fixed-Wing Hybrid\nPerformance | Endurance | 45 min"} value={detailSpecsText} onChange={e => setDetailSpecsText(e.target.value)}
                rows={5} className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm resize-none font-mono" />
            </div>
            <div>
              <label className="text-zinc-500 text-xs block mb-1">Safety triggers - one per line</label>
              <textarea value={safetyTriggersText} onChange={e => setSafetyTriggersText(e.target.value)}
                rows={3} className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm resize-none font-mono" />
            </div>
            <div>
              <label className="text-zinc-500 text-xs block mb-1">Safety features - Title | Badge | Description</label>
              <textarea value={safetyFeaturesText} onChange={e => setSafetyFeaturesText(e.target.value)}
                rows={3} className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm resize-none font-mono" />
            </div>
            <div>
              <label className="text-zinc-500 text-xs block mb-1">Payload intro</label>
              <textarea value={payloadIntro} onChange={e => setPayloadIntro(e.target.value)}
                rows={2} className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm resize-none" />
            </div>
            <div>
              <label className="text-zinc-500 text-xs block mb-1">Payload variants JSON</label>
              <textarea value={payloadVariantsText} onChange={e => setPayloadVariantsText(e.target.value)}
                rows={8} className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-xs resize-y font-mono" />
            </div>
          </div>

          <div>
            <label className="text-zinc-500 text-xs block mb-1">Status</label>
            <select value={editing.status || 'active'} onChange={e => setEditing(p => ({ ...p, status: e.target.value as ProductItem['status'] }))}
              className="bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm">
              <option value="active">Active</option>
              <option value="coming_soon">Coming Soon</option>
              <option value="retired">Retired</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-zinc-400 text-sm cursor-pointer">
            <input type="checkbox" checked={!!editing.is_published} onChange={e => setEditing(p => ({ ...p, is_published: e.target.checked ? 1 : 0 }))} />
            Published
          </label>
          <div className="flex gap-3 pt-1">
            <button onClick={handleSave} disabled={saving}
              className="bg-white text-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-zinc-200 transition disabled:opacity-50">
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => setEditing(null)} className="text-zinc-400 text-sm hover:text-white transition">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {Array.isArray(items) && items.map(item => (
          <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-zinc-500 text-xs uppercase font-medium bg-zinc-800 px-2 py-0.5 rounded">{item.category || 'uas'}</span>
                <span className="text-white text-sm font-medium">{item.name}</span>
                <span className="text-zinc-500 text-xs font-mono">/{item.slug}</span>
                <Badge published={item.is_published} />
                <span className={`text-xs px-2 py-0.5 rounded-full ${item.status === 'active' ? 'bg-blue-900 text-blue-300' : 'bg-zinc-700 text-zinc-400'}`}>{item.status}</span>
              </div>
              <span className="text-zinc-500 text-xs">{item.tagline || '—'}</span>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => openEdit(item)} className="text-zinc-400 hover:text-white text-xs px-3 py-1.5 rounded-lg border border-zinc-700 hover:border-zinc-500 transition">Edit</button>
              <button onClick={() => handleDelete(item.id, item.name)} className="text-red-400 hover:text-red-300 text-xs px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-red-800 transition">Delete</button>
            </div>
          </div>
        ))}
        {Array.isArray(items) && items.length === 0 && <p className="text-zinc-600 text-sm text-center py-8">No products yet.</p>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
function CareersSection() {
  const [items, setItems] = useState<CareerPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState<number | null>(null);
  const [editingDescriptionId, setEditingDescriptionId] = useState<number | null>(null);
  const [descriptionDraft, setDescriptionDraft] = useState('');
  const [descriptionSavingId, setDescriptionSavingId] = useState<number | null>(null);
  const [descriptionError, setDescriptionError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadPositions() {
      setLoading(true);
      setError('');
      try {
        const positions = await fetchAllCareerPositions();
        if (isMounted) setItems(sortCareerPositions(positions));
      } catch {
        if (isMounted) setError('Could not load career positions.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadPositions();

    return () => {
      isMounted = false;
    };
  }, []);

  function sortCareerPositions(list: CareerPosition[]) {
    return [...list].sort((a, b) => {
      if (a.category !== b.category) return a.category === 'technical' ? -1 : 1;
      return (a.sort_order || 0) - (b.sort_order || 0);
    });
  }

  async function handleToggleApply(item: CareerPosition) {
    setSavingId(item.id);
    try {
      const payload = {
        ...item,
        is_published: 1,
        apply_enabled: item.apply_enabled ? 0 : 1,
      };
      const res = await updateCareerPosition(item.id, payload);
      const updated = (res.position || payload) as CareerPosition;
      setItems(prev => sortCareerPositions(prev.map(position => position.id === item.id ? updated : position)));
    } finally {
      setSavingId(null);
    }
  }

  function openDescriptionEditor(item: CareerPosition) {
    setEditingDescriptionId(item.id);
    setDescriptionDraft(item.description || '');
    setDescriptionError('');
  }

  function closeDescriptionEditor() {
    setEditingDescriptionId(null);
    setDescriptionDraft('');
    setDescriptionError('');
  }

  async function handleSaveDescription(item: CareerPosition) {
    setDescriptionSavingId(item.id);
    setDescriptionError('');
    try {
      const payload = {
        ...item,
        is_published: 1,
        description: descriptionDraft.trim(),
      };
      const res = await updateCareerPosition(item.id, payload);
      const updated = (res.position || payload) as CareerPosition;
      setItems(prev => sortCareerPositions(prev.map(position => position.id === item.id ? updated : position)));
      closeDescriptionEditor();
    } catch {
      setDescriptionError('Could not save description. Please try again.');
    } finally {
      setDescriptionSavingId(null);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-white font-semibold text-lg">Career positions</h2>
      </div>
      <p className="text-zinc-500 text-xs mb-4">
        Enable a profile to show it on the Careers page. Disable it to hide it and show the "currently no positions are open" message when no profiles are enabled.
      </p>

      <div className="space-y-2">
        {loading && <p className="text-zinc-500 text-sm text-center py-8">Loading career positions...</p>}
        {error && <p className="text-red-400 text-sm text-center py-8">{error}</p>}
        {items.map(item => (
          <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <span className="text-zinc-500 text-xs uppercase font-medium bg-zinc-800 px-2 py-0.5 rounded">{item.category}</span>
                  <span className="text-white text-sm font-medium truncate">{item.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${item.apply_enabled ? 'bg-green-900 text-green-300' : 'bg-zinc-700 text-zinc-400'}`}>
                    {item.apply_enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <span className="text-zinc-500 text-xs">{item.department || 'No department'} - order {item.sort_order || 0}</span>
                {editingDescriptionId !== item.id && (
                  <p className="text-zinc-400 text-xs leading-relaxed mt-3 whitespace-pre-line">
                    {item.description || 'No description added yet.'}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2 flex-shrink-0">
                <button
                  onClick={() => openDescriptionEditor(item)}
                  disabled={descriptionSavingId === item.id}
                  className="text-xs px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 transition disabled:opacity-50"
                >
                  {item.description ? 'Edit Description' : 'Add Description'}
                </button>
                <button
                  onClick={() => handleToggleApply(item)}
                  disabled={savingId === item.id}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition disabled:opacity-50 ${
                    item.apply_enabled
                      ? 'text-red-300 border-red-900 hover:border-red-700'
                      : 'text-green-300 border-green-900 hover:border-green-700'
                  }`}
                >
                  {savingId === item.id ? 'Saving...' : item.apply_enabled ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>

            {editingDescriptionId === item.id && (
              <div className="mt-4 space-y-3">
                <textarea
                  value={descriptionDraft}
                  onChange={e => setDescriptionDraft(e.target.value)}
                  rows={4}
                  placeholder="Add the job description shown on the Careers page"
                  className="w-full bg-zinc-950 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm resize-y focus:outline-none focus:border-red-700"
                />
                {descriptionError && <p className="text-red-400 text-xs">{descriptionError}</p>}
                <div className="flex flex-wrap justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeDescriptionEditor}
                    disabled={descriptionSavingId === item.id}
                    className="text-xs px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveDescription(item)}
                    disabled={descriptionSavingId === item.id}
                    className="text-xs px-3 py-1.5 rounded-lg border border-red-900 text-red-300 hover:border-red-700 transition disabled:opacity-50"
                  >
                    {descriptionSavingId === item.id ? 'Saving...' : 'Save Description'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {!loading && !error && items.length === 0 && (
          <p className="text-zinc-600 text-sm text-center py-8">
            No career positions found. Restart the backend once so the default profiles can be seeded.
          </p>
        )}
      </div>
    </div>
  );
}

function SocialLinksSection() {
  const [settings, setSettings] = useState<SocialLinksSettings>(createDefaultSocialLinksSettings());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveState, setSaveState] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetchSocialLinksSettings()
      .then(setSettings)
      .finally(() => setLoading(false));
  }, []);

  function updatePlatformEnabled(platform: keyof SocialLinksSettings, enabled: boolean) {
    setSettings((prev) => ({
      ...prev,
      [platform]: {
        ...(prev?.[platform] || { enabled: false, url: '' }),
        enabled,
      },
    }));
  }

  function updatePlatformUrl(platform: keyof SocialLinksSettings, url: string) {
    setSettings((prev) => ({
      ...prev,
      [platform]: {
        ...(prev?.[platform] || { enabled: false, url: '' }),
        url,
      },
    }));
  }

  async function handleSave() {
    setSaving(true);
    setSaveState('idle');

    try {
      const res = await updateSocialLinksSettings(settings);
      if (res.settings) setSettings(res.settings);
      setSaveState('success');
    } catch {
      setSaveState('error');
    } finally {
      setSaving(false);
    }
  }

  const platforms = [
    { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/your-page' },
    { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@your-channel' },
    { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/your-company' },
    { key: 'twitter', label: 'Twitter / X', placeholder: 'https://x.com/your-handle' },
  ] as const;

  if (loading) {
    return <p className="text-zinc-500 text-sm py-4">Loading social media settings...</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-white font-semibold text-lg">Social media buttons</h2>
      </div>
      <p className="text-zinc-500 text-xs mb-4">
        Buttons stay hidden in the footer until you enable them here and add a destination link.
      </p>

      <div className="space-y-3 mb-6">
        {Array.isArray(platforms) && platforms.map(({ key, label, placeholder }) => (
          <div key={key} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
              <div>
                <div className="text-white text-sm font-medium">{label}</div>
                <div className="text-zinc-500 text-xs">Footer social button</div>
              </div>
              <label className="flex items-center gap-2 text-zinc-400 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!settings?.[key]?.enabled}
                  onChange={(e) => updatePlatformEnabled(key, e.target.checked)}
                />
                Enabled
              </label>
            </div>

            <input
              value={settings?.[key]?.url || ''}
              onChange={(e) => updatePlatformUrl(key, e.target.value)}
              placeholder={placeholder}
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm"
            />

            <p className="text-zinc-600 text-xs mt-2">
              Use the full URL. Disabled buttons or empty links will not appear on the website.
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-white text-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-zinc-200 transition disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>

        {saveState === 'success' && <span className="text-green-400 text-sm">Saved successfully.</span>}
        {saveState === 'error' && <span className="text-red-400 text-sm">Failed to save settings.</span>}
      </div>
    </div>
  );
}

void TechnologySection;
void ProductsSection;

function SettingsSection() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleSave() {
    if (newPassword && newPassword !== confirmPassword) {
      setStatus('error');
      setMessage('New passwords do not match.');
      return;
    }
    if (!currentPassword) {
      setStatus('error');
      setMessage('Current password is required.');
      return;
    }

    setStatus('saving');

    try {
      const res = await fetch(`${API_URL}/api/admin/settings/credentials`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword,
          newUsername: newUsername || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed.');

      setStatus('success');
      setMessage(data.message || 'Credentials updated successfully.');
      setCurrentPassword('');
      setNewUsername('');
      setNewPassword('');
      setConfirmPassword('');
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message);
    }
  }

  function passwordField(
    label: string,
    value: string,
    onChange: (v: string) => void,
    placeholder: string,
    show: boolean,
    onToggle: () => void,
  ) {
    return (
      <div>
        <label className="block text-xs text-zinc-400 mb-1">{label}</label>
        <div className="relative">
          <input
            type={show ? 'text' : 'password'}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 pr-14 text-sm text-white focus:outline-none focus:border-white"
          />
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition text-xs select-none"
            tabIndex={-1}
          >
            {show ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>
    );
  }

  function textField(
    label: string,
    value: string,
    onChange: (v: string) => void,
    placeholder: string,
  ) {
    return (
      <div>
        <label className="block text-xs text-zinc-400 mb-1">{label}</label>
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white"
        />
      </div>
    );
  }

  return (
    <div className="max-w-md space-y-6">
      <div>
        <h2 className="text-lg font-bold mb-1">Account Settings</h2>
        <p className="text-zinc-400 text-sm">
          Change your admin username or password. Current password is always required.
        </p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Verify Identity</p>
        {passwordField(
          'Current Password *',
          currentPassword,
          setCurrentPassword,
          '********',
          showCurrent,
          () => setShowCurrent(value => !value),
        )}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">New Credentials (leave blank to keep current)</p>
        {textField('New Username', newUsername, setNewUsername, 'Leave blank to keep current')}
        {passwordField(
          'New Password',
          newPassword,
          setNewPassword,
          'Min 8 characters',
          showNew,
          () => setShowNew(value => !value),
        )}
        {passwordField(
          'Confirm New Password',
          confirmPassword,
          setConfirmPassword,
          'Repeat new password',
          showConfirm,
          () => setShowConfirm(value => !value),
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={status === 'saving'}
          className="px-6 py-2 bg-white text-black text-sm font-semibold rounded-lg hover:bg-zinc-200 transition disabled:opacity-50"
        >
          {status === 'saving' ? 'Saving...' : 'Save Changes'}
        </button>
        {status === 'success' && <span className="text-green-400 text-sm">{message}</span>}
        {status === 'error' && <span className="text-red-400 text-sm">{message}</span>}
      </div>
    </div>
  );
}

interface Props { onLogout: () => void; }

export default function AdminDashboard({ onLogout }: Props) {
  const [tab, setTab] = useState<Tab>('news');

  const tabs: { key: Tab; label: string }[] = [
    { key: 'news', label: 'Newsroom' },
    { key: 'careers', label: 'Careers' },
    { key: 'social', label: 'Social Media' },
    { key: 'settings', label: '⚙ Settings' },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <span className="font-bold font-['Orbitron'] text-sm tracking-widest">WINGSPANN ADMIN</span>
        <button onClick={onLogout} className="text-zinc-500 hover:text-white text-sm transition">Sign out</button>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-1 bg-zinc-900 rounded-xl p-1 mb-8 w-full md:w-fit">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition ${tab === t.key ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'news'     && <NewsSection />}
        {tab === 'careers'  && <CareersSection />}
        {tab === 'social'   && <SocialLinksSection />}
        {tab === 'settings' && <SettingsSection />}
      </div>
    </div>
  );
}
