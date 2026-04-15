import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPublishedProducts, type Product } from '../lib/api';

type SpaceProduct = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  modelUrl: string;
  imageUrl: string;
  status: string;
};

const FALLBACK_PRODUCTS: SpaceProduct[] = [
  {
    id: '3u-cubesat',
    title: '3U CubeSat',
    subtitle: 'Compact Modular Satellite Platform',
    description: 'A detailed interactive showcase of our precision-machined structural components used across CubeSat and orbital platforms. Engineered from aerospace-grade aluminium alloys and composites, each element is optimised for minimum mass, maximum stiffness, and compatibility with standard deployer interfaces.',
    modelUrl: '/space-showcase.html',
    imageUrl: '',
    status: 'active',
  },
  {
    id: '6u-cubesat',
    title: '6U CubeSat',
    subtitle: 'Earth Observation & Scientific Experiments',
    description: 'The 6U CubeSat is a compact yet powerful orbital platform engineered for Earth observation, scientific payloads, and technology demonstration missions. Its modular architecture enables rapid integration of custom instruments while maintaining structural integrity in harsh space environments.',
    modelUrl: '/space-6u.html',
    imageUrl: '',
    status: 'active',
  },
  {
    id: '12u-cubesat',
    title: '12U CubeSat',
    subtitle: 'Extended Payload & Deep Space Platform',
    description: 'The 12U CubeSat delivers expanded payload capacity and power budgets for demanding mission profiles, including high-resolution imaging, synthetic aperture radar, and inter-satellite link experiments. Designed for multi-year orbital lifetimes with redundant subsystem architecture.',
    modelUrl: '/space-12u.html',
    imageUrl: '',
    status: 'active',
  },
];

const SPACE_PRODUCT_ORDER = ['3u-cubesat', '6u-cubesat', '12u-cubesat'];

function LazyModelBox({ src, title }: { src: string; title: string }) {
  const [hasStartedLoading, setHasStartedLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasStartedLoading(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
      {hasStartedLoading && (
        <iframe
          src={src}
          title={title}
          loading="lazy"
          className="w-full border-0 pointer-events-auto"
          style={{ flex: 1, opacity: 0.95, position: 'relative', zIndex: 2, background: 'transparent' }}
        />
      )}
    </div>
  );
}

function mapDbProduct(product: Product): SpaceProduct {
  return {
    id: product.slug,
    title: product.name,
    subtitle: product.tagline || '',
    description: product.description || '',
    modelUrl: product.model_url || '',
    imageUrl: product.image_url || '',
    status: product.status,
  };
}

function splitTitle(title: string) {
  const [first, ...rest] = title.split(' ');
  return { first: first || title, rest: rest.join(' ') };
}

function ModelFrame({ product }: { product: SpaceProduct }) {
  return (
    <div style={{ padding: '24px 4px 4px', width: '100%', maxWidth: '380px', height: '380px', flexShrink: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative', border: '1px solid rgba(220,30,30,0.2)' }}>
      <div className="grid-hero-bg" style={{ position: 'absolute', inset: 0, zIndex: 1, opacity: 0.8 }} />
      <span style={{ position: 'absolute', top: 0, left: 0, width: '15px', height: '15px', borderTop: '2px solid #dc1e1e', borderLeft: '2px solid #dc1e1e', zIndex: 4 }} />
      <span style={{ position: 'absolute', top: 0, right: 0, width: '15px', height: '15px', borderTop: '2px solid #dc1e1e', borderRight: '2px solid #dc1e1e', zIndex: 4 }} />
      <span style={{ position: 'absolute', bottom: 0, left: 0, width: '15px', height: '15px', borderBottom: '2px solid #dc1e1e', borderLeft: '2px solid #dc1e1e', zIndex: 4 }} />
      <span style={{ position: 'absolute', bottom: 0, right: 0, width: '15px', height: '15px', borderBottom: '2px solid #dc1e1e', borderRight: '2px solid #dc1e1e', zIndex: 4 }} />
      <div className="font-['Orbitron']" style={{ position: 'relative', zIndex: 5, fontSize: '1.5rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '12px', textTransform: 'uppercase', textAlign: 'center', width: '100%' }}>
        <span style={{ color: '#fff' }}>3D </span>
        <span style={{ color: '#dc1e1e' }}>MODEL</span>
      </div>
      {product.modelUrl ? (
        <LazyModelBox src={product.modelUrl} title={`${product.title} 3D Animation`} />
      ) : product.imageUrl ? (
        <img src={product.imageUrl} alt={product.title} className="relative z-10 w-full h-full object-contain" />
      ) : (
        <div className="relative z-10 flex-1 flex items-center justify-center text-gray-600 font-mono text-xs tracking-widest uppercase">
          Model pending
        </div>
      )}
    </div>
  );
}

export default function SpaceSystemsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<SpaceProduct[]>(FALLBACK_PRODUCTS);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    fetchPublishedProducts('space').then((data) => {
      const cubeSatsOnly = data
        .filter(product => SPACE_PRODUCT_ORDER.includes(product.slug))
        .sort((a, b) => SPACE_PRODUCT_ORDER.indexOf(a.slug) - SPACE_PRODUCT_ORDER.indexOf(b.slug));

      if (cubeSatsOnly.length > 0) setProducts(cubeSatsOnly.map(mapDbProduct));
    });
  }, []);

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white font-['Rajdhani'] relative">
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

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '56px 24px 0px' }}>
        <div className="mb-12">
          <div className="text-red-600 font-bold tracking-[0.4em] mb-4 uppercase animate-pulse">
            Deep Tech Manufacturing
          </div>
          <h1 className="font-['Orbitron']" style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', fontWeight: 700, lineHeight: 1, margin: '0 0 16px', letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
            Space <span className="text-red-600">Systems</span>
          </h1>
          <div className="w-24 h-1 bg-red-600 mb-8 shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
          <p className="text-xl text-gray-400 font-light leading-relaxed max-w-3xl">
            Next-generation orbital platforms and satellite technologies engineered for the harsh environments of outer space.
          </p>
        </div>
      </div>

      <div className="pb-24">
        <div className="flex flex-col">
          {products.map((product, idx) => {
            const titleParts = splitTitle(product.title);
            const isReversed = idx % 2 === 1;

            return (
              <section key={product.id} style={{ position: 'relative', backgroundColor: '#0a0a0a', borderBottom: '1px solid #1a1a1a', padding: '80px 0', overflow: 'hidden' }}>
                <div className="grid-hero-bg" />
                <div style={{ position: 'absolute', [isReversed ? 'right' : 'left']: 0, top: 0, bottom: 0, width: '3px', background: '#dc1e1e' }} />
                <div
                  className="hero-container"
                  style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 24px',
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '40px',
                    alignItems: 'center',
                    flexDirection: isReversed ? 'row-reverse' : 'row',
                  }}
                >
                  <div style={{ flex: '1 1 500px' }}>
                    <h1
                      className="font-['Orbitron']"
                      style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', fontWeight: 700, lineHeight: 1, margin: '0 0 16px', letterSpacing: '-0.01em', textTransform: 'uppercase', textAlign: isReversed ? 'right' : 'left' }}
                    >
                      <span style={{ color: '#fff' }}>{titleParts.first} </span>
                      <span style={{ color: '#dc1e1e' }}>{titleParts.rest || 'SYSTEM'}</span>
                    </h1>
                    <p className="font-['Rajdhani']" style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)', letterSpacing: '0.22em', color: '#666', marginBottom: '24px', textTransform: 'uppercase', fontWeight: 600, textAlign: isReversed ? 'right' : 'left' }}>
                      {product.subtitle}
                    </p>
                    <div style={isReversed ? { borderRight: '3px solid #dc1e1e', paddingRight: '20px', textAlign: 'right' } : { borderLeft: '3px solid #dc1e1e', paddingLeft: '20px' }}>
                      <p className="font-['Rajdhani']" style={{ fontSize: '1.2rem', color: '#ccc', margin: 0, fontWeight: 400, lineHeight: 1.6 }}>
                        {product.description}
                      </p>
                    </div>
                  </div>
                  <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center' }}>
                    <ModelFrame product={product} />
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
