import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OpticalSystemsPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white font-['Rajdhani'] relative">
      <div style={{ position: 'sticky', top: '80px', zIndex: 40, background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(220,30,30,0.2)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
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

      <div className="max-w-7xl mx-auto px-6 pb-24 pt-20">
        <div className="min-h-[55vh] flex flex-col items-center justify-center text-center border border-gray-900 rounded-xl bg-black/30 px-6">
          <span className="text-sm font-bold tracking-[0.3em] text-red-500 uppercase mb-4 block">
            Coming Soon
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 uppercase tracking-wide">
            Optical & Laser Systems
          </h1>
          <div style={{ width: '80px', height: '4px', background: '#dc1e1e', margin: '0 auto 32px', boxShadow: '0 0 15px rgba(220,38,38,0.5)' }} />
          <p className="text-gray-400 font-light leading-relaxed max-w-2xl mx-auto text-xl">
            This category is currently unavailable.
          </p>
        </div>
      </div>
    </div>
  );
}
