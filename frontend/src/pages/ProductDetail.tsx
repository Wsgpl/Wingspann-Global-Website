import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { fetchProductBySlug, parseJsonField, type Product } from '../lib/api';

type DetailSections = {
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
    variants?: Array<{
      id?: string;
      name: string;
      subtitle?: string;
      cameraName?: string;
      imagePath?: string;
      description?: string;
      secondaryDescription?: string;
      badges?: string[];
      specs?: Array<{ label: string; value: string; highlight?: boolean }>;
      tags?: string[];
    }>;
  };
};

type Tab = 'overview' | 'specifications' | 'safety' | 'payload';

const categoryBackLinks: Record<string, string> = {
  uas: '/technology/uas',
  space: '/technology/space',
  aerospace: '/technology/aerospace',
  optical: '/technology/optical',
};

function hasContent(details: DetailSections, tab: Tab) {
  if (tab === 'overview') {
    return Boolean(
      details.overview?.paragraphs?.length ||
      details.overview?.stats?.length ||
      details.overview?.missions?.length ||
      details.overview?.advantages?.length
    );
  }
  if (tab === 'specifications') return Boolean(details.specifications?.some(group => group.rows?.length));
  if (tab === 'safety') return Boolean(details.safety?.triggers?.length || details.safety?.features?.length);
  return Boolean(details.payload?.intro || details.payload?.variants?.length);
}

function ProductMedia({ product }: { product: Product }) {
  if (product.model_url) {
    return (
      <div className="border border-red-600/20 bg-black min-h-[360px] relative overflow-hidden">
        <div className="grid-hero-bg absolute inset-0 opacity-70" />
        <iframe src={product.model_url} title={`${product.name} model`} className="relative z-10 w-full min-h-[360px] border-0" loading="lazy" />
      </div>
    );
  }

  if (product.image_url) {
    return (
      <div className="border border-gray-800 bg-black overflow-hidden">
        <img src={product.image_url} alt={product.name} className="w-full h-full max-h-[460px] object-cover brightness-90" />
      </div>
    );
  }

  return (
    <div className="border border-gray-800 bg-gray-950 min-h-[320px] flex items-center justify-center">
      <span className="text-gray-600 font-mono tracking-widest uppercase">Product visual pending</span>
    </div>
  );
}

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { slug = '' } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    fetchProductBySlug(slug)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [slug]);

  const details = useMemo(() => parseJsonField<DetailSections>(product?.detail_sections, {}), [product]);
  const tabs = useMemo<Tab[]>(() => {
    const allTabs: Tab[] = ['overview', 'specifications', 'safety', 'payload'];
    const available = allTabs.filter(tab => hasContent(details, tab));
    return available.length > 0 ? available : ['overview'];
  }, [details]);

  useEffect(() => {
    if (!tabs.includes(activeTab)) setActiveTab(tabs[0]);
  }, [activeTab, tabs]);

  if (loading) {
    return <div className="bg-[#0a0a0a] min-h-screen text-gray-400 px-6 py-24">Loading product...</div>;
  }

  if (!product) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen text-white px-6 py-24">
        <h1 className="font-['Orbitron'] text-4xl mb-4">Product not found</h1>
        <Link to="/technology" className="text-red-500 font-bold uppercase tracking-widest">← Back to Technology</Link>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white font-['Rajdhani'] selection:bg-red-600 selection:text-white">
      <div style={{ position: 'sticky', top: '80px', zIndex: 40, background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(220,30,30,0.2)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 24px' }}>
          <button
            onClick={() => navigate(categoryBackLinks[product.category] || '/technology')}
            className="text-red-600 hover:text-red-400 font-bold uppercase tracking-[0.15em] text-sm transition"
          >
            Back to Category
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center mb-16">
          <div>
            <div className="text-red-600 font-bold tracking-[0.35em] mb-4 uppercase">
              {product.category.replace('-', ' ')}
            </div>
            <h1 className="font-['Orbitron'] text-5xl md:text-7xl font-bold leading-none uppercase mb-5">
              {product.name}
            </h1>
            {product.tagline && (
              <h2 className="text-xl md:text-2xl text-gray-400 font-bold tracking-widest uppercase mb-6">
                {product.tagline}
              </h2>
            )}
            <div className="w-24 h-1 bg-red-600 mb-8 shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
            {product.description && (
              <p className="text-xl text-gray-300 font-light leading-relaxed">
                {product.description}
              </p>
            )}
            {product.status === 'coming_soon' && (
              <div className="mt-8 inline-flex px-4 py-2 border border-red-600/40 text-red-400 text-xs font-bold tracking-widest uppercase">
                Coming Soon
              </div>
            )}
          </div>
          <ProductMedia product={product} />
        </div>

        <div className="flex flex-wrap gap-2 border-b border-gray-800 mb-12">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-bold uppercase tracking-widest transition ${activeTab === tab ? 'bg-red-600 text-white' : 'text-gray-500 hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-12">
            {details.overview?.stats && details.overview.stats.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-800">
                {details.overview.stats.map((stat, i) => (
                  <div key={i} className="bg-[#0d0d0d] p-6 text-center">
                    <div className="font-['Orbitron'] text-4xl font-bold text-red-600">
                      {stat.value}<span className="text-base ml-1">{stat.unit}</span>
                    </div>
                    <div className="text-gray-500 text-xs uppercase tracking-widest mt-2">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}

            {details.overview?.paragraphs && details.overview.paragraphs.length > 0 && (
              <div>
                <h2 className="font-['Orbitron'] text-3xl uppercase mb-6">System Overview</h2>
                <div className="space-y-4 text-lg text-gray-300 leading-relaxed font-light">
                  {details.overview.paragraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
                </div>
              </div>
            )}

            {details.overview?.missions && details.overview.missions.length > 0 && (
              <div>
                <h2 className="font-['Orbitron'] text-3xl uppercase mb-6">Mission Profiles</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {details.overview.missions.map((mission, i) => (
                    <div key={i} className="border border-gray-800 bg-gray-950/50 p-6 hover:border-red-600/40 transition">
                      <h3 className="text-xl font-bold uppercase tracking-wide mb-3">{mission.title}</h3>
                      <p className="text-gray-400 leading-relaxed">{mission.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {details.overview?.advantages && details.overview.advantages.length > 0 && (
              <div>
                <h2 className="font-['Orbitron'] text-3xl uppercase mb-6">Platform Advantages</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {details.overview.advantages.map((item, i) => (
                    <div key={i} className="border border-gray-800 bg-[#0d0d0d] p-6 hover:border-red-600/40 transition">
                      <h3 className="text-lg font-bold uppercase tracking-wide mb-3">{item.title}</h3>
                      <p className="text-gray-400 leading-relaxed mb-4">{item.description}</p>
                      {item.metric && <span className="text-red-500 text-xs font-bold tracking-widest uppercase">{item.metric}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'specifications' && (
          <div>
            <h2 className="font-['Orbitron'] text-3xl uppercase mb-8">Technical Specifications</h2>
            <div className="grid lg:grid-cols-2 gap-px bg-gray-800">
              {(details.specifications || []).map(group => (
                <div key={group.label} className="bg-[#0d0d0d]">
                  <div className="bg-[#111] border-b-2 border-red-600 p-4">
                    <span className="text-red-500 text-sm font-bold tracking-widest uppercase">{group.label}</span>
                  </div>
                  <table className="w-full">
                    <tbody>
                      {group.rows.map(row => (
                        <tr key={`${group.label}-${row.label}`} className="border-b border-gray-900 last:border-b-0">
                          <td className="text-gray-500 px-4 py-3 w-1/2">{row.label}</td>
                          <td className="text-gray-200 px-4 py-3">{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'safety' && (
          <div className="space-y-10">
            {details.safety?.triggers && details.safety.triggers.length > 0 && (
              <div>
                <h2 className="font-['Orbitron'] text-3xl uppercase mb-5">Auto-Trigger Conditions</h2>
                <div className="flex flex-wrap gap-2">
                  {details.safety.triggers.map(trigger => (
                    <span key={trigger} className="border border-red-600/40 bg-red-950/20 px-3 py-2 text-sm text-red-300 tracking-widest uppercase">{trigger}</span>
                  ))}
                </div>
              </div>
            )}
            {details.safety?.features && details.safety.features.length > 0 && (
              <div>
                <h2 className="font-['Orbitron'] text-3xl uppercase mb-6">Safety Architecture</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {details.safety.features.map(feature => (
                    <div key={feature.title} className="border border-gray-800 bg-[#0d0d0d] p-6">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h3 className="text-lg font-bold uppercase tracking-wide">{feature.title}</h3>
                        {feature.badge && <span className="text-gray-500 border border-gray-800 px-2 py-0.5 text-xs">{feature.badge}</span>}
                      </div>
                      <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'payload' && (
          <div>
            <h2 className="font-['Orbitron'] text-3xl uppercase mb-5">Modular Payload Architecture</h2>
            {details.payload?.intro && <p className="text-lg text-gray-300 leading-relaxed mb-8">{details.payload.intro}</p>}
            <div className="grid lg:grid-cols-2 gap-6">
              {(details.payload?.variants || []).map(variant => (
                <div key={variant.id || variant.name} className="border border-gray-800 bg-[#0d0d0d] p-6">
                  {variant.imagePath && <img src={variant.imagePath} alt={variant.name} className="w-full max-h-[260px] object-contain mb-5" />}
                  <h3 className="font-['Orbitron'] text-2xl uppercase mb-2">{variant.name}</h3>
                  {variant.cameraName && <p className="text-red-500 font-bold tracking-widest uppercase mb-4">{variant.cameraName}</p>}
                  {variant.description && <p className="text-gray-300 leading-relaxed mb-3">{variant.description}</p>}
                  {variant.secondaryDescription && <p className="text-gray-400 leading-relaxed mb-5">{variant.secondaryDescription}</p>}
                  {variant.badges && (
                    <div className="flex flex-wrap gap-2 mb-5">
                      {variant.badges.map(badge => <span key={badge} className="bg-red-950/30 border border-red-600/30 text-red-300 px-2 py-1 text-xs">{badge}</span>)}
                    </div>
                  )}
                  {variant.specs && variant.specs.length > 0 && (
                    <div className="space-y-2 mb-5">
                      {variant.specs.map(spec => (
                        <div key={spec.label} className="flex justify-between gap-4 border-b border-gray-900 pb-2">
                          <span className="text-gray-500">{spec.label}</span>
                          <span className={spec.highlight ? 'text-white font-bold' : 'text-gray-300'}>{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {variant.tags && (
                    <div className="flex flex-wrap gap-2">
                      {variant.tags.map(tag => (
                        <span key={tag} className="inline-flex items-center gap-1 text-xs text-gray-400">
                          <ChevronRight className="w-3 h-3 text-red-600" /> {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
