import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { parseJsonField, type Product } from '../lib/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

type UasModel = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  link: string;
  isComingSoon: boolean;
  specs: Array<{ label: string; value: string }>;
};

const FALLBACK_MODELS: UasModel[] = [
  {
    id: 'aquila-uav',
    title: 'AQUILA UAV',
    subtitle: 'Compact VTOL Intelligence & Remote Sensing',
    description: 'The Aquila UAV is a man-portable, fixed-wing hybrid VTOL platform optimised for persistent intelligence, surveillance, and reconnaissance.',
    image: '/Aquila Alpha.jpeg',
    link: '/technology/aquila-uav',
    isComingSoon: false,
    specs: [
      { label: 'Endurance', value: '45 Min' },
      { label: 'Range', value: '10 KM' },
      { label: 'Launch', value: 'VTOL' },
    ],
  },
  {
    id: 'skylark',
    title: 'SKYLARK',
    subtitle: 'Small Tactical ISR Drone',
    description: 'A lightweight, man-portable drone designed for rapid deployment and close-range surveillance. Features high-performance gimbaled sensors for real-time tactical intelligence.',
    image: '/skylark.jpeg',
    link: '#',
    isComingSoon: true,
    specs: [],
  },
  {
    id: 'hercules',
    title: 'HERCULES',
    subtitle: 'Heavy-Lift Multirotor UAS',
    description: 'A high-performance octocopter engineered for mission-critical heavy payload delivery and industrial-grade reliability. Optimized for stability and endurance in challenging flight environments.',
    image: '/hercules.jpeg',
    link: '#',
    isComingSoon: true,
    specs: [],
  },
];

const UAS_MODEL_ORDER = ['aquila-uav', 'skylark', 'hercules'];

const DEFAULT_MODEL_IMAGES: Record<string, string> = {
  'aquila-uav': '/Aquila Alpha.jpeg',
  'skylark': '/skylark.jpeg',
  'hercules': '/hercules.jpeg',
};

function mapDbProduct(product: Product): UasModel {
  const fallbackImage = DEFAULT_MODEL_IMAGES[product.slug] || '/Aquila Alpha.jpeg';
  return {
    id: product.slug,
    title: product.name.toUpperCase(),
    subtitle: product.tagline || '',
    description: product.description || '',
    image: product.image_url || fallbackImage,
    link: product.status === 'active' ? `/technology/${product.slug}` : '#',
    isComingSoon: product.status === 'coming_soon',
    specs: parseJsonField(product.specs, []),
  };
}

export default function UasPage() {
  const navigate = useNavigate();
  const [models, setModels] = useState<UasModel[]>(FALLBACK_MODELS);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });

    fetch(`${API_URL}/api/products?category=uas`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((products: Product[]) => {
        if (!Array.isArray(products)) return;

        const coreModelsOnly = products
          .filter(product => UAS_MODEL_ORDER.includes(product.slug))
          .sort((a, b) => UAS_MODEL_ORDER.indexOf(a.slug) - UAS_MODEL_ORDER.indexOf(b.slug));

        if (coreModelsOnly.length > 0) setModels(coreModelsOnly.map(mapDbProduct));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white font-['Rajdhani'] selection:bg-red-600 selection:text-white">
      <div style={{ position: 'sticky', top: '80px', zIndex: 40, background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(220,30,30,0.2)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 24px' }}>
          <button
            onClick={() => navigate('/technology')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dc1e1e', fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.15em', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s', textTransform: 'uppercase' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#ff4444')}
            onMouseLeave={e => (e.currentTarget.style.color = '#dc1e1e')}
          >
            ← Back to Technology
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '56px 24px 120px' }}>
        <div className="mb-24">
          <div className="text-red-600 font-bold tracking-[0.4em] mb-4 uppercase animate-pulse">
            Aerial Systems Division
          </div>
          <h1 className="font-['Orbitron']" style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', fontWeight: 700, lineHeight: 1, margin: '0 0 16px', letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
            UAS <span className="text-red-600">Product Line</span>
          </h1>
          <div className="w-24 h-1 bg-red-600 mb-8 shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
          <p className="text-xl text-gray-400 font-light leading-relaxed max-w-3xl">
            Our Unmanned Aerial Systems are engineered for mission-critical reliability, combining advanced VTOL capabilities with high-fidelity sensing suites.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {models.map((model) => (
            <div key={model.id} className="group relative flex flex-col border border-gray-800 bg-[#0f0f0f] rounded-xl overflow-hidden hover:border-red-600/50 transition-all duration-500 hover:shadow-[0_0_50px_rgba(220,30,30,0.1)]">
              <div className="relative aspect-video overflow-hidden bg-black">
                <img
                  src={model.image}
                  alt={model.title}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                  onError={(event) => {
                    const fallbackImage = DEFAULT_MODEL_IMAGES[model.id] || '/Aquila Alpha.jpeg';
                    if (event.currentTarget.src.endsWith(fallbackImage)) return;
                    event.currentTarget.src = fallbackImage;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent opacity-60" />
                {model.isComingSoon && (
                  <div className="absolute top-4 right-4 px-4 py-2 bg-red-600 text-white font-bold text-xs tracking-widest uppercase">
                    Coming Soon
                  </div>
                )}
              </div>

              <div className="p-8 lg:p-10 flex-grow flex flex-col">
                <h2 className="text-3xl lg:text-4xl font-['Orbitron'] font-bold mb-2 text-white uppercase tracking-wider group-hover:text-red-600 transition-colors">
                  {model.title}
                </h2>
                {model.subtitle && (
                  <h3 className="text-lg text-gray-500 font-bold mb-6 tracking-widest uppercase">{model.subtitle}</h3>
                )}
                {model.description && (
                  <p className="text-lg text-gray-400 mb-8 font-light leading-relaxed">{model.description}</p>
                )}
                <div className="grow" />

                {model.specs.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mb-10 border-t border-b border-gray-800/50 py-6">
                    {model.specs.map((spec, i) => (
                      <div key={i} className="text-center">
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{spec.label}</div>
                        <div className="text-white font-bold text-sm">{spec.value}</div>
                      </div>
                    ))}
                  </div>
                )}

                {model.isComingSoon ? (
                  <button disabled className="w-full py-5 border border-gray-800 text-gray-500 font-bold uppercase tracking-widest cursor-not-allowed">
                    Specifications Pending
                  </button>
                ) : (
                  <Link to={model.link} className="w-full py-5 bg-red-600 text-white font-bold uppercase tracking-widest text-center hover:bg-white hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.2)]">
                    View Product Details
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
