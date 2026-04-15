import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { fetchPublishedProducts, parseJsonField, type Product } from '../lib/api';

type ComponentSection = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  specs: Array<{ label: string; value: string }>;
  features: string[];
  status: string;
};

const FALLBACK_SECTIONS: ComponentSection[] = [
  {
    id: 'tactical-avionics-bay',
    title: 'Tactical Avionics Bay',
    subtitle: 'Integrated Mission Systems',
    description: 'Our tactical avionics bays provide a consolidated, radiation-hardened environment for mission-critical flight computers, communication relay systems, and high-frequency sensor processing units.',
    image: '/avionics-bay.png',
    specs: [
      { label: 'Architecture', value: 'Multi-Layer HDI Stackup' },
      { label: 'Rating', value: 'Radiation-Hardened' },
      { label: 'Processing', value: 'Real-time FPGA / SoC' },
      { label: 'Cooling', value: 'Active Phase-Change Thermal' },
    ],
    features: [
      'Modular line-replaceable unit (LRU) design',
      'EMI/EMC shielded aerospace-grade housing',
      'Redundant power distribution bus',
      'High-bandwidth internal data link',
    ],
    status: 'active',
  },
];

const AEROSPACE_COMPONENT_ORDER = ['tactical-avionics-bay'];

function mapDbProduct(product: Product): ComponentSection {
  return {
    id: product.slug,
    title: product.name,
    subtitle: product.tagline || '',
    description: product.description || '',
    image: product.image_url || '/avionics-bay.png',
    specs: parseJsonField(product.specs, []),
    features: parseJsonField(product.features, []),
    status: product.status,
  };
}

export default function AerospaceComponentsPage() {
  const navigate = useNavigate();
  const [sections, setSections] = useState<ComponentSection[]>(FALLBACK_SECTIONS);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    fetchPublishedProducts('aerospace').then((products) => {
      const avionicsOnly = products
        .filter(product => AEROSPACE_COMPONENT_ORDER.includes(product.slug))
        .sort((a, b) => AEROSPACE_COMPONENT_ORDER.indexOf(a.slug) - AEROSPACE_COMPONENT_ORDER.indexOf(b.slug));

      if (avionicsOnly.length > 0) setSections(avionicsOnly.map(mapDbProduct));
    });
  }, []);

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white font-['Rajdhani'] relative selection:bg-red-600 selection:text-white">
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
            Deep Tech Manufacturing
          </div>
          <h1 className="font-['Orbitron']" style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', fontWeight: 700, lineHeight: 1, margin: '0 0 16px', letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
            Aerospace <span className="text-red-600">Components</span>
          </h1>
          <div className="w-24 h-1 bg-red-600 mb-8 shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
          <p className="text-xl text-gray-400 font-light leading-relaxed max-w-3xl">
            Standardizing excellence through precision engineering and advanced structural design for next-generation aerospace platforms.
          </p>
        </div>

        <div className="space-y-40">
          {sections.map((section, idx) => (
            <div key={section.id} className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
              <div className="w-full lg:w-1/2 group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600/20 to-transparent blur opacity-25 group-hover:opacity-50 transition duration-1000" />
                <div className="relative border border-gray-800 rounded-lg overflow-hidden bg-black aspect-video">
                  <img
                    src={section.image}
                    alt={section.title}
                    className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700"
                  />
                  <div className="absolute top-4 left-4 p-2 border-l border-t border-red-600 w-12 h-12" />
                  <div className="absolute bottom-4 right-4 p-2 border-r border-b border-red-600 w-12 h-12" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                    <div className="font-['Rajdhani'] text-xs tracking-widest text-red-500 uppercase font-bold">
                      Component ID: {section.id.toUpperCase()}-0{idx + 1}
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono">
                      SYSTEM_SCAN_ACTIVE...100%
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-1/2">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h2 className="text-3xl lg:text-5xl font-['Orbitron'] font-bold uppercase tracking-wide text-white">
                    {section.title}
                  </h2>
                  {section.status === 'coming_soon' && (
                    <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold tracking-widest uppercase">
                      Coming Soon
                    </span>
                  )}
                </div>
                <h3 className="text-xl text-red-600 font-bold mb-8 tracking-widest uppercase">
                  {section.subtitle}
                </h3>
                <p className="text-lg text-gray-300 font-light leading-relaxed mb-10">
                  {section.description}
                </p>

                {section.specs.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                    {section.specs.map((spec, i) => (
                      <div key={i} className="border border-gray-800 p-4 bg-gray-900/40 rounded hover:border-red-600/30 transition-colors">
                        <div className="text-gray-500 text-xs uppercase tracking-widest mb-1">{spec.label}</div>
                        <div className="text-white font-bold text-sm lg:text-base">{spec.value}</div>
                      </div>
                    ))}
                  </div>
                )}

                {section.features.length > 0 && (
                  <ul className="space-y-4">
                    {section.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-4 text-gray-400 group/item hover:text-gray-200 transition-colors">
                        <ChevronRight className="w-5 h-5 text-red-600 shrink-0 mt-0.5 group-hover/item:translate-x-1 transition-transform" />
                        <span className="text-lg leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
