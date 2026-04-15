import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { fetchPublishedProducts, type ProductCategory } from '../lib/api';

// ── Hardcoded fallback for tech pillars ───────────────────────────────────────
const FALLBACK_PILLARS = [
  {
    id: "space",
    title: "Space Systems",
    subtitle: "Orbital & Space Technologies",
    description: "Advanced space systems designed for orbital operations, satellite integration, and deep space exploration missions.",
    features: ["Satellite components", "Orbital platforms", "Space propulsion", "Communication systems"],
    bgImage: "/space system.jpg",
    link: "/technology/space",
    isComingSoon: false,
  },
  {
    id: "aerospace",
    title: "Aerospace Components",
    subtitle: "Integrated Avionics Systems",
    description: "Mission-critical avionics bays and high-frequency sensor processing units engineered for extreme radiation-hardened environments.",
    features: ["Radiation-Hardened Design", "Multi-Layer HDI Stackup", "Real-time Signal Processing", "Phase-Change Thermal Management"],
    bgImage: "/Aerospace comp.jpg",
    link: "/technology/aerospace",
    isComingSoon: false,
  },
  {
    id: "optical",
    title: "Optical & Laser Systems",
    subtitle: "Electro-Optical Solutions",
    description: "Cutting-edge optical and laser systems for sensing, targeting, and communication in critical applications.",
    features: ["Advanced sensors", "Laser targeting", "Electro-optical suites", "Real-time processing"],
    bgImage: "/optical&L.jpg",
    link: "/technology/optical",
    isComingSoon: true,
  },
];

// ── Map DB technology item to pillar shape ────────────────────────────────────
// ── Static sections (never dynamic) ──────────────────────────────────────────
const technologies = [
  { name: "Autonomous Navigation", description: "AI-powered systems that enable independent operation and mission execution without constant human intervention.", icon: "🧭" },
  { name: "Real-time Processing", description: "Edge computing capabilities for instant data analysis and decision-making in mission-critical scenarios.", icon: "⚡" },
  { name: "Advanced Materials", description: "Lightweight, durable composites and alloys engineered for extreme performance in challenging environments.", icon: "🔬" },
  { name: "Sensor Fusion", description: "Multi-sensor fusion technology combining LiDAR, cameras, and thermal imaging for comprehensive situational awareness.", icon: "📡" },
  { name: "Secure Communications", description: "Encrypted, redundant communication systems ensuring mission continuity and data security.", icon: "🔐" },
  { name: "AI & Machine Learning", description: "Advanced algorithms for pattern recognition, anomaly detection, and autonomous decision-making.", icon: "🤖" },
];

export default function TechnologyPage() {
  const [techPillars, setTechPillars] = useState(FALLBACK_PILLARS);

  useEffect(() => {
    const categories: ProductCategory[] = ['space', 'aerospace'];

    Promise.all(categories.map(category => fetchPublishedProducts(category))).then((groups) => {
      setTechPillars(prev => prev.map((pillar) => {
        if (pillar.id === 'optical') return { ...pillar, isComingSoon: true };

        const index = categories.indexOf(pillar.id as ProductCategory);
        if (index === -1 || groups[index].length === 0) return pillar;

        return {
          ...pillar,
          isComingSoon: groups[index].every(product => product.status === 'coming_soon'),
        };
      }));
    });
  }, []);

  return (
    <div className="bg-black min-h-screen">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="relative pt-40 pb-20 mb-1 overflow-hidden bg-black flex flex-col items-center justify-center text-center">
        <div
          className="absolute inset-0"
          style={{ backgroundImage: `url("/technologya.jpg")`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.3)', zIndex: 0 }}
        />
        <div className="max-w-7xl mx-auto px-6 relative z-10 pt-4 pb-12">
          <div className="text-red-600 font-['Rajdhani'] font-bold tracking-[0.5em] text-lg mb-12 uppercase animate-pulse">
            Advancing the Frontier
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="text-white">OUR </span>
            <span className="text-red-600">TECHNOLOGIES</span>
          </h1>
          <div className="w-24 sm:w-32 h-1 bg-red-600 mx-auto mb-6 shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto font-['Rajdhani'] tracking-widest uppercase">
            Comprehensive details on our 4 foundational pillars redefining aerospace.
          </p>
        </div>
      </div>

      {/* ── Products heading ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 mt-24 mb-16">
        <div className="text-center">
          <h2 className="text-white font-['Rajdhani'] font-black tracking-[0.5em] text-4xl uppercase mb-4">
            OUR <span className="text-red-600">PRODUCTS</span>
          </h2>
          <div className="w-px h-12 bg-gray-800 mx-auto"></div>
        </div>
      </div>

      {/* ── Product categories grid ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-7xl mx-auto px-6 mb-32 pt-16">

        {/* UAS card — always hardcoded, has its own dedicated page */}
        <div className="min-h-[480px] h-full border border-gray-800 rounded-xl p-8 lg:p-12 flex flex-col justify-between transition-all duration-500 hover:border-red-600 hover:shadow-[0_0_40px_rgba(220,38,38,0.15)] group relative overflow-hidden bg-black">
          <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url("/UAS .png")`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.4)', zIndex: 0 }} />
          <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"></div>
          <div className="relative z-10 flex-grow">
            <h2 className="text-3xl lg:text-5xl font-black uppercase mb-2 tracking-wide text-red-600">UAS</h2>
            <h3 className="text-xl lg:text-2xl text-white font-bold mb-6 tracking-wider">Unmanned Aerial Systems</h3>
            <div className="w-12 h-1 bg-gray-800 mb-6 group-hover:bg-red-600 group-hover:w-24 transition-all duration-500"></div>
            <p className="text-lg text-gray-300 font-light leading-relaxed group-hover:text-gray-100 transition-colors duration-300 mb-8">
              Next-generation unmanned aerial vehicles with advanced autonomous capabilities, real-time processing, and mission-critical reliability.
            </p>
            <ul className="space-y-4 mb-8">
              {["Autonomous flight control", "AI-powered navigation", "Real-time data processing", "Extended range and endurance"].map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-400 group-hover:text-gray-200 transition-colors duration-300">
                  <ChevronRight className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <span className="text-[17px] leading-snug">{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <Link to="/technology/uas" className="mt-4 text-sm font-bold tracking-widest text-white border border-red-600/30 bg-black hover:bg-red-600 px-8 py-4 transition-all duration-300 uppercase inline-flex items-center justify-center gap-3 self-start relative z-10 overflow-hidden">
            VIEW PRODUCTS <span className="text-lg group-hover:translate-x-2 transition-transform duration-300">→</span>
          </Link>
        </div>

        {/* Dynamic tech pillar cards */}
        {techPillars.map((product) => (
          <div key={product.id} className="min-h-[480px] h-full border border-gray-800 rounded-xl p-8 lg:p-12 flex flex-col justify-between transition-all duration-500 hover:border-red-600 hover:shadow-[0_0_40px_rgba(220,38,38,0.15)] group relative overflow-hidden bg-black">
            {product.bgImage && (
              <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url("${product.bgImage}")`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.35)', zIndex: 0 }} />
            )}
            <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"></div>
            <div className="relative z-10 flex-grow">
              <h2 className="text-3xl lg:text-5xl font-black uppercase mb-2 tracking-wide text-red-600">{product.title}</h2>
              <h3 className="text-xl lg:text-2xl text-white font-bold mb-6 tracking-wider">{product.subtitle}</h3>
              <div className="w-12 h-1 bg-gray-800 mb-6 group-hover:bg-red-600 group-hover:w-24 transition-all duration-500"></div>
              <p className="text-lg text-gray-300 font-light leading-relaxed group-hover:text-gray-100 transition-colors duration-300 mb-8">{product.description}</p>
              <ul className="space-y-4 mb-8">
                {product.features.map((feature: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-gray-400 group-hover:text-gray-200 transition-colors duration-300">
                    <ChevronRight className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <span className="text-[17px] leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            {product.isComingSoon ? (
              <div className="mt-4 text-sm font-bold tracking-widest text-gray-500 border border-gray-800 bg-black/40 px-8 py-4 uppercase inline-flex items-center justify-center gap-3 self-start relative z-10">
                COMING SOON
              </div>
            ) : (
              <Link to={product.link} className="mt-4 text-sm font-bold tracking-widest text-white border border-red-600/30 bg-black hover:bg-red-600 px-8 py-4 transition-all duration-300 uppercase inline-flex items-center justify-center gap-3 self-start relative z-10 overflow-hidden">
                VIEW CATEGORY <span className="text-lg group-hover:translate-x-2 transition-transform duration-300">→</span>
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* ── Core Integrations (static) ───────────────────────────────────────── */}
      <div className="space-y-32 max-w-7xl mx-auto px-6">
        <div className="pt-16 border-t border-gray-800">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-12 text-center uppercase tracking-wide">
            <span className="text-red-600">CORE</span> INTEGRATIONS
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {technologies.map((tech, idx) => (
              <div key={idx} className="group relative bg-[#0a0a0a] border border-gray-800 p-8 rounded-xl transition-all duration-300 hover:border-red-600 hover:-translate-y-1">
                <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">{tech.name}</h3>
                <p className="text-gray-200 font-light leading-relaxed">{tech.description}</p>
                <div className="absolute top-0 right-0 w-1 h-12 bg-gradient-to-b from-red-600 to-transparent group-hover:h-full transition-all duration-500 rounded-tr-xl"></div>
              </div>
            ))}
          </div>
        </div>

        {/* ── R&D (static) ─────────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-red-900/10 to-black border border-red-600/20 p-12 rounded-xl">
          <h2 className="text-3xl font-bold text-white mb-10 tracking-widest uppercase">Research & Development</h2>
          <div className="grid md:grid-cols-3 gap-10 border-l-4 border-red-600 pl-8">
            <div>
              <h4 className="text-red-600 font-bold text-xl mb-3 tracking-wide">Next-Gen UAVs</h4>
              <p className="text-gray-300 font-light">Developing autonomous aerial platforms with extended flight times, improved payload capacity, and enhanced maneuverability.</p>
            </div>
            <div>
              <h4 className="text-red-600 font-bold text-xl mb-3 tracking-wide">Space Technology</h4>
              <p className="text-gray-300 font-light">Pioneering satellites and orbital systems for communication, observation, and scientific research applications.</p>
            </div>
            <div>
              <h4 className="text-red-600 font-bold text-xl mb-3 tracking-wide">Quantum Systems</h4>
              <p className="text-gray-300 font-light">Exploring quantum computing applications for complex optimization and cryptography challenges.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="h-32 w-full"></div>
    </div>
  );
}
