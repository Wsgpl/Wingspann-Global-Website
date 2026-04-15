import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


// ─── Tab types ─────────────────────────────────────────────────────────────
type Tab = 'overview' | 'specifications' | 'safety' | 'payload';

// ─── TiltCard: mouse-follow 3D perspective tilt ─────────────────────────────
function TiltCard({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -8;   // max ±8deg
    const rotateY = ((x - cx) / cx) * 8;
    el.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
    el.style.boxShadow = `0 12px 32px rgba(220,30,30,0.18), ${-rotateY * 1.5}px ${rotateX * 1.5}px 20px rgba(220,30,30,0.08)`;
  }, []);

  const handleLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)';
    el.style.boxShadow = '';
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        willChange: 'transform',
      }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </div>
  );
}

// ─── Icon Components (inline SVG) ──────────────────────────────────────────
const icons: Record<string, JSX.Element> = {
  endurance: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
  range: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
      <path d="M2 12h20M12 2l10 10-10 10" />
    </svg>
  ),
  resolution: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
      <rect x="2" y="2" width="20" height="20" rx="0" />
      <path d="M7 7h10v10H7z" />
      <path d="M12 7v10M7 12h10" />
    </svg>
  ),
  altitude: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
      <path d="M12 2l3 9H9l3-9zM12 11v11" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  map: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  ),
  scan: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
      <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" />
      <rect x="7" y="7" width="10" height="10" />
    </svg>
  ),
  leaf: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
      <path d="M11 20A7 7 0 014 13C4 9 7 5 11 5c4 0 9 5 9 9a7 7 0 01-9 6z" />
      <path d="M11 20l-3-3" />
    </svg>
  ),
  battery: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
      <rect x="1" y="6" width="18" height="12" rx="0" />
      <line x1="23" y1="11" x2="23" y2="13" strokeWidth="3" />
      <line x1="5" y1="10" x2="5" y2="14" />
      <line x1="9" y1="10" x2="9" y2="14" />
      <line x1="13" y1="10" x2="13" y2="14" />
    </svg>
  ),
  backpack: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
      <path d="M9 2h6a2 2 0 012 2v1H7V4a2 2 0 012-2z" />
      <path d="M7 5H5a2 2 0 00-2 2v11a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
      <line x1="12" y1="12" x2="12" y2="16" />
      <line x1="10" y1="14" x2="14" y2="14" />
    </svg>
  ),
  vtol: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
      <path d="M12 2v4M8 4h8M12 22v-4M8 20h8" />
      <circle cx="12" cy="12" r="3" />
      <path d="M2 12h4M20 12h-4" />
    </svg>
  ),
  lock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
      <rect x="3" y="11" width="18" height="11" rx="0" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  ),
  cloud: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
      <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
    </svg>
  ),
  mountain: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
      <path d="M3 20l6-12 4 8 3-5 5 9H3z" />
    </svg>
  ),
};

// ─── Data ───────────────────────────────────────────────────────────────────
const stats = [
  { value: '45', unit: 'MIN', label: 'Endurance', icon: 'endurance' },
  { value: '10', unit: 'KM', label: 'Range', icon: 'range' },
  { value: '2cm', unit: '/px', label: 'Resolution', icon: 'resolution' },
  { value: '4500', unit: 'M', label: 'Launch Altitude', icon: 'altitude' },
];

const missionCards = [
  {
    title: 'Security & Recon',
    desc: 'Persistent aerial surveillance with real-time encrypted video streaming for perimeter security and intelligence gathering.',
    icon: 'shield',
  },
  {
    title: 'Geospatial Mapping',
    desc: 'High-resolution orthomosaic mapping and 3D terrain modelling for GIS, urban planning, and precision agriculture.',
    icon: 'map',
  },
  {
    title: 'Infrastructure Inspection',
    desc: 'Autonomous inspection of pipelines, power lines, towers, and bridges with AI-powered defect detection.',
    icon: 'scan',
  },
  {
    title: 'Environmental Monitoring',
    desc: 'Multispectral and thermal data collection for forest fire detection, flood mapping, and wildlife surveys.',
    icon: 'leaf',
  },
];

const advantages = [
  { icon: 'battery', title: 'Long Endurance', desc: 'Industry-leading 45-minute flight time on a single charge, mission-ready in any terrain.', metric: '45 MIN FLIGHT' },
  { icon: 'backpack', title: 'Backpack Portable', desc: 'Complete system including GCS packs into a standard 30L tactical backpack for rapid field deployment.', metric: 'SUB-5 KG SYSTEM' },
  { icon: 'vtol', title: 'Autonomous VTOL', desc: 'Fully autonomous vertical take-off and landing with no runway required. One-button launch and recovery.', metric: '0m² FOOTPRINT' },
  { icon: 'lock', title: 'Secure Comms', desc: 'AES-256 encrypted video and telemetry links with frequency-hopping FHSS anti-jamming capability.', metric: 'AES-256' },
  { icon: 'cloud', title: 'All-Weather Design', desc: 'IP54-rated airframe engineered for operations in rain, dust, and gusting winds up to 45 km/h.', metric: 'IP54 RATED' },
  { icon: 'mountain', title: 'High-Altitude Ops', desc: 'Optimised propulsion system certified for operational launch altitudes up to 4,500m AMSL.', metric: '4500 M AMSL' },
];

const specGroups = [
  {
    label: 'Platform',
    rows: [
      ['Configuration', 'Quad-rotor VTOL Fixed-Wing Hybrid'],
      ['Wingspan', '1,100 mm'],
      ['MTOW', '5kg'],
      ['Airframe Material', 'Carbon Fibre Composite'],
      ['IP Rating', 'IP54'],
      ['Wind Resistance', '45 m/s'],
    ],
  },
  {
    label: 'Performance',
    rows: [
      ['Endurance', '45 min'],
      ['Max Speed', '72 km/h'],
      ['Cruise Speed', '54 km/h'],
      ['Range (datalink)', '10 km'],
      ['Max Launch Altitude', '4,500 m AMSL'],
      ['Hover Accuracy (GPS)', '±0.5 m'],
    ],
  },
  {
    label: 'Sensors & Navigation',
    rows: [
      ['Imaging Resolution', '2 cm/px @ 120 m AGL'],
      ['Camera', '48 MP + 8 MP IR Thermal'],
      ['GNSS', 'GPS / GLONASS / BeiDou L1+L2'],
      ['IMU', 'Redundant 6-axis IMU'],
      ['Obstacle Avoidance', 'Forward + Backward LiDAR'],
      ['GSD', '1.8 cm @ 100 m AGL'],
    ],
  },
  {
    label: 'Payload & Comms',
    rows: [
      ['Payload Capacity', '400 g modular bay'],
      ['Video Link', 'AES-256 encrypted 1080p @ 60fps'],
      ['Telemetry Encryption', 'AES-256 / FHSS Anti-Jam'],
      ['Frequency Bands', '2.4 GHz / 5.8 GHz dual-band'],
      ['GCS Interface', 'Mission Planner + Wingspann GCS App'],
      ['Data Storage', '256 GB onboard SSD'],
    ],
  },
];

const rthTriggers = [
  'Low Battery (<10%)',
  'Signal Loss >3s',
  'Geofence Breach',
  'IMU Fault Detected',
  'Motor Overheat',
  'Manual Override',
];

const safetyFeatures = [
  {
    title: 'Redundant Systems',
    desc: 'Dual IMU, dual GNSS receivers, and independent power rails ensure continued operation through single-point hardware failures.',
    badge: 'HARDWARE',
  },
  {
    title: 'Autonomous Failsafe',
    desc: 'On-board decision engine activates RTH or controlled descent autonomously within 300ms of any critical fault state.',
    badge: 'SOFTWARE',
  },
  {
    title: 'Environmental Guards',
    desc: 'Real-time wind estimation and thermal monitoring prevent operations outside envelope, with dynamic altitude ceiling enforcement.',
    badge: 'ENVIRONMENTAL',
  },
  {
    title: 'Comms Integrity',
    desc: 'FHSS frequency-hopping with 64 channels ensures resistance to RF jamming. AES-256 prevents data interception.',
    badge: 'COMMS',
  },
];

const variantsData = {
  s: {
    id: 's', name: 'AQUILA S', titleSpan: 'S', sub: 'ENTRY SURVEILLANCE',
    cameraName: 'INTEGRATED 3-IN-1 OPTICAL PAYLOAD', modelLabel: 'INTEGRATED 3-IN-1\nOPTICAL PAYLOAD',
    badges: ['3-IN-1 SENSOR', 'FIXED MOUNT', 'LIGHTWEIGHT'],
    imagePath: '/Aquila S.jpg',
    desc1: <>The entry-level Aquila variant configured for standard surveillance and area monitoring missions. The <strong>integrated 3-in-1 camera</strong> delivers combined RGB, thermal, and wide-angle sensing in a single compact housing — minimizing payload weight while maximizing situational awareness.</>,
    desc2: <>Ideal for rapid deployment scenarios where <strong>low payload weight and system simplicity</strong> are the primary mission drivers.</>,
    specs: [
      { k: 'Camera', v: 'Integrated 3-in-1 Sensor', hi: true },
      { k: 'Compatibility', v: 'Universal Telemetry' },
      { k: 'Dimensions', v: '105 × 43 × 35 mm', hi: true },
      { k: 'Weight', v: '90 g', hi: true },
      { k: 'Mount Type', v: 'Fixed / Integrated' },
      { k: 'Sensor Type', v: '3-in-1 Combined' }
    ],
    tags: ['AREA SURVEILLANCE', 'RAPID DEPLOY', 'BORDER MONITORING', 'LOW WEIGHT'],
    ccCamera: 'INTEGRATED 3-IN-1',
    ccStats: [
      { k: 'WEIGHT', v: '90 g' },
      { k: 'DIMS', v: '105×43×35mm' },
      { k: 'GIMBAL', v: 'Fixed' }
    ]
  },
  sp: {
    id: 'sp', name: 'AQUILA S+', titleSpan: 'S+', sub: 'ENHANCED GIMBAL',
    cameraName: 'PRO 3-AXIS STABILIZED GIMBAL CAMERA', modelLabel: 'PRO SERIES\n3-AXIS GIMBAL CAMERA',
    badges: ['3-AXIS GIMBAL', 'STABILIZED', 'PRO IMAGING'],
    imagePath: '/Aquila S+.png',
    desc1: <>The S+ variant upgrades the imaging system with a <strong>professional three-axis stabilized gimbal</strong> — delivering smooth, vibration-free footage even in turbulent wind conditions. Suited for persistent surveillance and intelligence-gathering missions that demand consistent image quality.</>,
    desc2: <>The three-axis mechanical stabilization compensates for pitch, roll, and yaw independently, enabling <strong>broadcast-grade aerial imaging</strong> from an operationally compact platform.</>,
    specs: [
      { k: 'Camera', v: 'Pro 3-Axis Gimbal', hi: true },
      { k: 'Stabilization', v: '3-Axis Gimbal', hi: true },
      { k: 'Dimensions', v: '12 × 10 × 10 cm', hi: true },
      { k: 'Weight', v: '61 g', hi: true },
      { k: 'Mount Type', v: 'Active 3-Axis Gimbal' },
      { k: 'Use Class', v: 'Surveillance / ISR' }
    ],
    tags: ['STABILIZED VIDEO', 'ISR MISSIONS', 'PERIMETER SECURITY', 'PERSISTENT WATCH'],
    ccCamera: 'PRO 3-AXIS GIMBAL',
    ccStats: [
      { k: 'WEIGHT', v: '61 g' },
      { k: 'DIMS', v: '12×10×10cm' },
      { k: 'GIMBAL', v: '3-Axis' }
    ]
  },
  t: {
    id: 't', name: 'AQUILA T', titleSpan: 'T', sub: 'TACTICAL IMAGING',
    cameraName: 'TACTICAL 3-AXIS STABILIZED GIMBAL CAMERA', modelLabel: 'TACTICAL SERIES\n3-AXIS STABILIZED GIMBAL',
    badges: ['3-AXIS GIMBAL', 'HIGH RESOLUTION', 'TACTICAL'],
    imagePath: '/Aquila M.png',
    desc1: <>The Aquila T is the tactical imaging variant, equipped with a <strong>tactical three-axis stabilized gimbal</strong> — a step up in imaging capability over the Pro, with a larger sensor footprint suited for target identification and detailed reconnaissance at extended standoff ranges.</>,
    desc2: <>Designed for <strong>defense and law enforcement applications</strong> where high-fidelity imagery under dynamic flight conditions is non-negotiable.</>,
    specs: [
      { k: 'Camera', v: 'Tactical 3-Axis Gimbal', hi: true },
      { k: 'Stabilization', v: '3-Axis Gimbal', hi: true },
      { k: 'Dimensions', v: '13 × 11 × 10 cm', hi: true },
      { k: 'Weight', v: '204 g', hi: true },
      { k: 'Mount Type', v: 'Active 3-Axis Gimbal' },
      { k: 'Use Class', v: 'Tactical / Defense' }
    ],
    tags: ['TARGET IDENTIFICATION', 'RECONNAISSANCE', 'LAW ENFORCEMENT', 'DEFENSE OPS'],
    ccCamera: 'TACTICAL 3-AXIS GIMBAL',
    ccStats: [
      { k: 'WEIGHT', v: '204 g' },
      { k: 'DIMS', v: '13×11×10cm' },
      { k: 'GIMBAL', v: '3-Axis' }
    ]
  },
  m: {
    id: 'm', name: 'AQUILA M', titleSpan: 'M', sub: 'MULTISPECTRAL',
    cameraName: 'ADVANCED MULTISPECTRAL IMAGING SENSOR', modelLabel: 'ADVANCED SERIES\nMULTISPECTRAL SENSOR',
    badges: ['MULTISPECTRAL', '4-BAND', 'PRECISION AG'],
    imagePath: '/Aquila T.jpg',
    desc1: <>The Aquila M is purpose-built for <strong>precision agriculture, environmental monitoring, and scientific remote sensing</strong>. The multi-band sensor captures four spectral bands — Green, Red, Red-Edge, and Near-Infrared — enabling NDVI mapping and advanced crop health analytics.</>,
    desc2: <>A sunshine sensor logs <strong>ambient light conditions</strong> in real time, enabling radiometric calibration of every image frame for scientifically accurate datasets regardless of cloud cover or time of day.</>,
    specs: [
      { k: 'Camera', v: 'Advanced Multispectral', hi: true },
      { k: 'Sensor Type', v: 'Multispectral (4-band)', hi: true },
      { k: 'Spectral Bands', v: 'Green · Red · Red-Edge · NIR' },
      { k: 'Dimensions', v: '59 × 41 × 28 mm', hi: true },
      { k: 'Weight', v: '72 g', hi: true },
      { k: 'Use Class', v: 'Agriculture / Science' }
    ],
    tags: ['NDVI MAPPING', 'CROP HEALTH', 'ENVIRONMENTAL SURVEY', 'SCIENTIFIC SENSING'],
    ccCamera: 'MULTISPECTRAL SENSOR',
    ccStats: [
      { k: 'WEIGHT', v: '72 g' },
      { k: 'DIMS', v: '59×41×28mm' },
      { k: 'TYPE', v: 'Multispectral' }
    ]
  }
};

// ─── Component ──────────────────────────────────────────────────────────────
export default function AquilaUAVPage() {
  const navigate = useNavigate();

  // Always open from the top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [activeVariant, setActiveVariant] = useState<'s' | 'sp' | 't' | 'm'>('s');

  return (
    <div
      className="aquila-page-wrapper"
      style={{
        backgroundColor: '#0a0a0a',
        color: '#fff',
        fontFamily: "'Rajdhani', sans-serif",
        minHeight: '100vh',
      }}
    >
      {/* Scoped styles — fonts come from global index.css (Orbitron + Rajdhani) */}
      <style>{`
        .aquila-page-wrapper *, .aquila-page-wrapper *::before, .aquila-page-wrapper *::after { box-sizing: border-box; border-radius: 0 !important; }

        /* Orbitron = headings (matches h1-h6 in global CSS) */
        .aquila-heading { font-family: 'Orbitron', sans-serif; }
        /* Rajdhani = body, labels, buttons, mono data */
        .aquila-body { font-family: 'Rajdhani', sans-serif; }
        .aquila-mono  { font-family: 'Rajdhani', sans-serif; letter-spacing: 0.1em; }

        @keyframes pulse-dot {
          0%,100% { opacity: 1; }
          50% { opacity: 0.15; }
        }
        .pulse-dot {
          width: 10px; height: 10px;
          background: #dc1e1e;
          display: inline-block;
          animation: pulse-dot 1.5s ease-in-out infinite;
        }

        .aquila-btn {
          display: inline-block;
          background: #dc1e1e;
          color: #fff;
          font-family: 'Rajdhani', sans-serif;
          font-weight: 700;
          font-size: 1rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 14px 32px;
          border: none;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.1s ease;
          text-decoration: none;
        }
        .aquila-btn:hover { background: #b01818; }
        .aquila-btn:active { transform: scale(0.98); }

        .tab-btn {
          font-family: 'Rajdhani', sans-serif;
          font-weight: 700;
          font-size: 1rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 14px 32px;
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          color: #666;
          cursor: pointer;
          transition: color 0.2s, border-color 0.2s;
        }
        .tab-btn.active {
          color: #dc1e1e;
          border-bottom-color: #dc1e1e;
        }
        .tab-btn:hover:not(.active) { color: #ccc; }

        .stat-cell {
          position: relative;
          padding: 36px 24px 28px;
          background: linear-gradient(135deg, #111827 0%, #0f172a 100%);
          border: 1px solid #1f2937;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 8px;
          overflow: hidden;
        }
        .stat-cell::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(220,38,38,0.13);
          pointer-events: none;
        }
        .stat-cell:hover::before { background: rgba(220,38,38,0.2); transition: background 0.4s ease; }
        /* corner brackets */
        .stat-cell .corner {
          position: absolute;
          width: 16px;
          height: 16px;
          border-color: #dc1e1e;
          border-style: solid;
          z-index: 1;
        }
        .stat-cell .corner-tl { top: 8px; left: 8px;  border-width: 2px 0 0 2px; }
        .stat-cell .corner-tr { top: 8px; right: 8px; border-width: 2px 2px 0 0; }
        .stat-cell .corner-bl { bottom: 8px; left: 8px;  border-width: 0 0 2px 2px; }
        .stat-cell .corner-br { bottom: 8px; right: 8px; border-width: 0 2px 2px 0; }
        .stat-cell:hover .corner { border-color: #ff3333; width: 22px; height: 22px; transition: all 0.25s ease; }

        .mission-card {
          border: 1px solid #1f2937;
          padding: 24px;
          background: linear-gradient(135deg, #111827 0%, #0f172a 100%);
          position: relative;
          overflow: hidden;
          transition: border-color 0.3s;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .mission-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(220,38,38,0.12);
          pointer-events: none;
          transition: background 0.4s ease;
        }
        .mission-card:hover::before { background: rgba(220,38,38,0.22); }
        .mission-card:hover { border-color: #dc1e1e; }

        .advantage-card {
          border: 1px solid #1f2937;
          padding: 28px 24px;
          background: linear-gradient(135deg, #111827 0%, #0f172a 100%);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .advantage-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(220,38,38,0.12);
          pointer-events: none;
          transition: background 0.4s ease;
        }
        .advantage-card:hover::before { background: rgba(220,38,38,0.22); }
        .advantage-card:hover { border-color: #dc1e1e; transition: border-color 0.3s; }

        .spec-table {
          width: 100%;
          border-collapse: collapse;
        }
        .spec-table td {
          padding: 10px 14px;
          border-bottom: 1px solid #1a1a1a;
          font-size: 1.05rem;
          vertical-align: top;
          font-family: 'Rajdhani', sans-serif;
        }
        .spec-table tr:last-child td { border-bottom: none; }
        .spec-table td:first-child { color: #888; width: 50%; }
        .spec-table td:last-child { color: #e5e5e5; }

        .highlight-val {
          color: #fff;
          font-family: 'Rajdhani', sans-serif;
          font-weight: 600;
          background: #181818;
          padding: 1px 6px;
          border: 1px solid #2a2a2a;
        }

        .safety-card {
          border: 1px solid #1f2937;
          padding: 28px 24px;
          background: linear-gradient(135deg, #111827 0%, #0f172a 100%);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .safety-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(220,38,38,0.12);
          pointer-events: none;
          transition: background 0.4s ease;
        }
        .safety-card:hover::before { background: rgba(220,38,38,0.22); }
        .safety-card:hover { border-color: #dc1e1e; transition: border-color 0.3s; }

          .rth-chip {
          display: inline-block;
          border: 1px solid #1a3d1a;
          background: #0a1f0a;
          color: #4caf50;
          font-family: 'Rajdhani', sans-serif;
          font-weight: 600;
          font-size: 0.9rem;
          padding: 6px 14px;
          letter-spacing: 0.08em;
        }

        .grid-hero-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        /* ── PAYLOAD VARIANT CSS ── */
        .variant-nav { display:flex; gap:1px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.05); margin-bottom:40px; overflow-x:auto; }
        .variant-btn { flex:1; min-width:120px; padding:16px 12px; background:#0f0f0f; border:none; cursor:pointer; text-align:center; position:relative; transition:background 0.2s; }
        .variant-btn:hover { background:#141414; }
        .variant-btn.active { background:#141414; }
        .variant-btn.active::after { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:#dc1e1e; }
        .variant-tag { font-family:'Rajdhani', sans-serif; font-size:12px; color:#555; letter-spacing:0.2em; margin-bottom:6px; }
        .variant-name { font-family:'Orbitron', sans-serif; font-size:22px; font-weight:700; color:#fff; letter-spacing:0.08em; }
        .variant-btn.active .variant-name { color:#dc1e1e; }
        .variant-sub { font-size:13px; color:#555; margin-top:4px; font-family:'Rajdhani', sans-serif; }
        
        .payload-layout { display:grid; grid-template-columns:1fr 1fr; gap:40px; align-items:start; }
        @media(max-width:700px) { .payload-layout { grid-template-columns:1fr; } }
        
        .camera-visual { background:#0d0d0d; border:1px solid rgba(255,255,255,0.06); aspect-ratio:4/3; display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; overflow:hidden; gap:12px; }
        .camera-visual::before { content:''; position:absolute; inset:0; background-image:repeating-linear-gradient(0deg,transparent,transparent 19px,rgba(255,255,255,0.02) 20px),repeating-linear-gradient(90deg,transparent,transparent 19px,rgba(255,255,255,0.02) 20px); }
        .camera-icon-wrap { position:relative; z-index:1; width:80px; height:80px; background:rgba(220,30,30,0.08); border:1px solid rgba(220,30,30,0.2); display:flex; align-items:center; justify-content:center; font-size:48px; }
        .camera-model-label { position:relative; z-index:1; font-family:'Rajdhani', sans-serif; font-size:14px; color:#dc1e1e; letter-spacing:0.2em; text-align:center; padding:0 20px; line-height:1.6; white-space:pre-wrap; }
        .camera-badge-row { position:relative; z-index:1; display:flex; gap:8px; flex-wrap:wrap; justify-content:center; padding:0 16px; }
        .cam-badge { font-family:'Rajdhani', sans-serif; font-size:12px; border:1px solid rgba(220,30,30,0.25); background:rgba(220,30,30,0.06); color:rgba(220,30,30,0.8); padding:4px 10px; letter-spacing:0.1em; }
        
        .payload-variant-title { font-family:'Orbitron', sans-serif; font-size:38px; font-weight:700; color:#fff; letter-spacing:0.06em; margin-bottom:4px; }
        .payload-variant-title span { color:#dc1e1e; }
        .payload-camera-name { font-family:'Rajdhani', sans-serif; font-size:14px; color:#888; letter-spacing:0.15em; margin-bottom:20px; line-height:1.6; text-transform:uppercase; }
        .payload-desc { font-size:17px; color:#ccc; line-height:1.8; font-weight:300; margin-bottom:28px; font-family:'Rajdhani', sans-serif; }
        .payload-desc strong { color:#eee; font-weight:600; }
        
        .payload-specs { border:1px solid rgba(255,255,255,0.06); background:#0d0d0d; margin-bottom:24px; }
        .payload-spec-header { padding:10px 16px; background:rgba(220,30,30,0.08); border-bottom:1px solid rgba(220,30,30,0.2); font-family:'Orbitron', sans-serif; font-size:14px; font-weight:600; letter-spacing:0.2em; color:#dc1e1e; }
        .payload-spec-row { display:flex; justify-content:space-between; align-items:center; padding:12px 16px; border-bottom:1px solid rgba(255,255,255,0.03); }
        .payload-spec-row:last-child { border-bottom:none; }
        .ps-key { font-size:14px; color:#777; font-family:'Rajdhani', sans-serif; letter-spacing:0.05em; }
        .ps-val { font-size:15px; color:#ccc; font-weight:500; text-align:right; font-family:'Rajdhani', sans-serif; }
        .ps-val.hi { color:#fff; }
        
        .payload-tags { display:flex; flex-wrap:wrap; gap:8px; }
        .ptag { display:inline-block; font-family:'Rajdhani', sans-serif; font-size:0.9rem; font-weight:600; letter-spacing:0.08em; padding:6px 14px; border:1px solid #1a3d1a; background:#0a1f0a; color:#4caf50; }
        
        .compare-strip { margin-top:48px; border-top:1px solid rgba(255,255,255,0.05); padding-top:40px; }
        .compare-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.05); }
        @media(max-width:640px) { .compare-grid { grid-template-columns:repeat(2,1fr); } }
        .compare-cell { background:#0f0f0f; padding:20px 16px; position:relative; cursor:pointer; transition:background 0.2s; }
        .compare-cell:hover { background:#141414; }
        .compare-cell.active-compare { background:#141414; }
        .compare-cell.active-compare::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:#dc1e1e; }
        .cc-model { font-family:'Orbitron', sans-serif; font-size:24px; font-weight:700; color:#fff; letter-spacing:0.06em; margin-bottom:2px; }
        .cc-model span { color:#dc1e1e; }
        .cc-camera { font-family:'Rajdhani', sans-serif; font-size:12px; color:#aaa; letter-spacing:0.08em; margin-bottom:12px; line-height:1.5; text-transform:uppercase; }
        .cc-stat { margin-bottom:6px; display:flex; justify-content:space-between; align-items:center; }
        .cc-stat-key { font-size:12px; color:#999; background:none; font-family:'Rajdhani', sans-serif; letter-spacing:0.08em; text-transform:uppercase; margin:0; }
        .cc-stat-val { font-size:15px; color:#eee; font-family:'Rajdhani', sans-serif; font-weight: 500; }

        @media (max-width: 768px) {
          .spec-grid { grid-template-columns: 1fr !important; }
          .stat-grid { grid-template-columns: 1fr 1fr !important; }
          .advantage-grid { grid-template-columns: 1fr !important; }
          .overview-split { flex-direction: column !important; }
          .mission-grid { grid-template-columns: 1fr !important; }
          .safety-grid { grid-template-columns: 1fr !important; }
          .tab-nav-container { overflow-x: auto; white-space: nowrap; padding: 0 16px !important; scrollbar-width: none; }
          .tab-nav-container::-webkit-scrollbar { display: none; }
          .tab-btn { padding: 12px 16px; font-size: 0.9rem; }
          .content-container { padding: 32px 16px 64px !important; }
          .hero-container { padding: 0 16px !important; }
          h1.aquila-heading { font-size: clamp(2.5rem, 10vw, 4rem) !important; }
          .payload-layout { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .stat-grid { grid-template-columns: 1fr !important; }
          .tab-btn { padding: 10px 12px; font-size: 0.8rem; }
          .compare-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── BACK BUTTON ─────────────────────────────────────────────────── */}
      <div style={{ position: 'sticky', top: '80px', zIndex: 40, background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(220,30,30,0.2)' }}>
        <div className="hero-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 24px' }}>
          <button
            onClick={() => navigate(-1)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dc1e1e', fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.15em', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#ff4444')}
            onMouseLeave={e => (e.currentTarget.style.color = '#dc1e1e')}
          >
            ← Back to Technology
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '56px 24px 0px' }}>
        {/* ── Page Header ── */}
        <div className="mb-12">
          <div className="text-red-600 font-bold tracking-[0.4em] mb-4 uppercase animate-pulse">
            Deep Tech Manufacturing
          </div>
          <h1 
            className="font-['Orbitron']"
            style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', fontWeight: 700, lineHeight: 1, margin: '0 0 16px', letterSpacing: '-0.01em', textTransform: 'uppercase' }}
          >
            AERIAL <span className="text-red-600">SYSTEMS</span>
          </h1>
          <div className="w-24 h-1 bg-red-600 mb-8 shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>
          <p className="text-xl text-gray-400 font-light leading-relaxed max-w-3xl">
            Autonomous unmanned aerial vehicles engineered for persistent intelligence, surveillance, and precision geospatial data collection.
          </p>
        </div>
      </div>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          backgroundColor: '#0a0a0a',
          borderBottom: '1px solid #1a1a1a',
          padding: '16px 0 56px',
          overflow: 'hidden',
        }}
      >
        <div className="grid-hero-bg" />

        {/* Red left-edge accent strip */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: '#dc1e1e' }} />

        <div className="hero-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1, display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'center' }}>

          {/* Left Text Side */}
          <div style={{ flex: '1 1 500px' }}>
            {/* TRL badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <span className="pulse-dot" />
              <span className="aquila-mono" style={{ fontSize: '0.85rem', letterSpacing: '0.2em', color: '#dc1e1e' }}>
                TRL 7+ OPERATIONAL
              </span>
            </div>

            {/* Title */}
            <h1
              className="aquila-heading"
              style={{ fontSize: 'clamp(3rem, 8vw, 6.5rem)', fontWeight: 700, lineHeight: 1, margin: '0 0 16px', letterSpacing: '-0.01em' }}
            >
              <span style={{ color: '#fff' }}>AQUILA </span>
              <span style={{ color: '#dc1e1e' }}>UAV</span>
            </h1>

            {/* Subtitle */}
            <p
              className="aquila-mono"
              style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)', letterSpacing: '0.22em', color: '#666', marginBottom: '24px' }}
            >
              COMPACT VTOL INTELLIGENCE &amp; REMOTE SENSING PLATFORM
            </p>

            {/* Description Text */}
            <div style={{ borderLeft: '3px solid #dc1e1e', paddingLeft: '20px' }}>
              <p className="aquila-body" style={{ fontSize: '1.2rem', color: '#ccc', margin: 0, fontWeight: 400, lineHeight: 1.6 }}>
                The Aquila UAV is a man-portable, fixed-wing hybrid VTOL platform optimised for persistent intelligence, surveillance, reconnaissance, and precision geospatial data collection across defence, civil, and industrial sectors.
              </p>
            </div>
          </div>

          {/* Right Image Side */}
          <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center' }}>
            <div className="stat-cell" style={{ padding: '24px 4px 4px', width: '100%', maxWidth: '380px', overflow: 'hidden' }}>
              {/* Force the grid pattern and gradient to be part of the box background */}
              <div className="grid-hero-bg" style={{ position: 'absolute', inset: 0, zIndex: 1, opacity: 0.8 }} />
              <span className="corner corner-tl" style={{ zIndex: 4 }} />
              <span className="corner corner-tr" style={{ zIndex: 4 }} />
              <span className="corner corner-bl" style={{ zIndex: 4 }} />
              <span className="corner corner-br" style={{ zIndex: 4 }} />

              <div className="aquila-heading" style={{ position: 'relative', zIndex: 5, fontSize: '1.5rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '12px', textTransform: 'uppercase', textAlign: 'center', width: '100%' }}>
                <span style={{ color: '#fff' }}>TRL </span>
                <span style={{ color: '#dc1e1e' }}>LEVEL</span>
              </div>

              <video
                src="/TRL LEVEL.mp4"
                autoPlay
                loop
                muted
                playsInline
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '380px',
                  borderRadius: '4px',
                  objectFit: 'contain',
                  position: 'relative',
                  zIndex: 2,
                  mixBlendMode: 'screen',
                  filter: 'contrast(1.4) brightness(0.85)'
                }}
              />
            </div>
          </div>

        </div>
      </section>

      {/* ── TAB NAV ──────────────────────────────────────────────────────── */}
      <nav style={{ borderBottom: '1px solid #1a1a1a', background: '#0a0a0a', position: 'sticky', top: '136px', zIndex: 30 }}>
        <div className="tab-nav-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px', display: 'flex' }}>
          {(['overview', 'specifications', 'safety', 'payload'] as Tab[]).map((t) => (
            <button
              key={t}
              className={`tab-btn${activeTab === t ? ' active' : ''}`}
              onClick={() => setActiveTab(t)}
            >
              {t === 'safety' ? 'Safety & Failsafe' : t === 'payload' ? 'Payload Customization' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </nav>

      {/* ── TAB CONTENT ──────────────────────────────────────────────────── */}
      <div className="content-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '56px 32px 80px' }}>

        {/* ===== OVERVIEW TAB ===== */}
        {activeTab === 'overview' && (
          <div>
            {/* Stat callout grid */}
            <div
              className="stat-grid"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', background: 'transparent', marginBottom: '64px' }}
            >
              {stats.map((s) => (
                <div key={s.label} className="stat-cell">
                  {/* Corner brackets */}
                  <span className="corner corner-tl" />
                  <span className="corner corner-tr" />
                  <span className="corner corner-bl" />
                  <span className="corner corner-br" />
                  <div style={{ color: '#dc1e1e', marginBottom: '4px' }}>{icons[s.icon]}</div>
                  <div className="aquila-heading" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 700, color: '#dc1e1e', lineHeight: 1 }}>
                    {s.value}<span style={{ fontSize: '1.1rem', color: '#dc1e1e', marginLeft: '2px' }}>{s.unit}</span>
                  </div>
                  <div className="aquila-mono" style={{ fontSize: '0.9rem', letterSpacing: '0.2em', color: '#666', textTransform: 'uppercase' }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Two-column: overview + mission cards */}
            <div
              className="overview-split"
              style={{ display: 'flex', gap: '48px', marginBottom: '64px', alignItems: 'flex-start' }}
            >
              {/* Left: system overview */}
              <div style={{ flex: '1 1 50%' }}>
                <h2 className="aquila-heading" style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '0.1em', color: '#fff', textTransform: 'uppercase', marginBottom: '24px' }}>
                  System Overview
                </h2>
                <p className="aquila-body" style={{ color: '#999', lineHeight: 1.8, marginBottom: '16px', fontWeight: 300 }}>
                  The Aquila UAV delivers best-in-class imagery and sensor intelligence in a field-portable package. The hybrid quad-rotor VTOL architecture eliminates the need for launch infrastructure while maintaining the endurance and efficiency of a fixed-wing design during cruise.
                </p>
                <p className="aquila-body" style={{ color: '#999', lineHeight: 1.8, marginBottom: '16px', fontWeight: 300 }}>
                  Engineered for mission-first reliability, the platform incorporates dual-redundant IMU, triple-constellation GNSS, and onboard obstacle sensing. The encrypted datalink ensures all video and telemetry remain secure even in contested RF environments.
                </p>
                <p className="aquila-body" style={{ color: '#999', lineHeight: 1.8, fontWeight: 300 }}>
                  With a 400 g modular payload bay, operators can hot-swap between electro-optical, thermal, multispectral, and LiDAR sensor heads, making the Aquila platform adaptable to a wide range of mission requirements without airframe changes.
                </p>
              </div>

              {/* Right: mission use-case cards */}
              <div style={{ flex: '1 1 40%' }}>
                <h2 className="aquila-heading" style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '0.1em', color: '#fff', textTransform: 'uppercase', marginBottom: '24px' }}>
                  Mission Profiles
                </h2>
                <div
                  className="mission-grid"
                  style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#1a1a1a' }}
                >
                  {missionCards.map((m) => (
                    <div key={m.title} className="mission-card">
                      <div style={{ color: '#dc1e1e' }}>{icons[m.icon]}</div>
                      <div className="aquila-heading" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        {m.title}
                      </div>
                      <p className="aquila-body" style={{ fontSize: '1rem', color: '#ccc', lineHeight: 1.6, margin: 0, fontWeight: 400 }}>
                        {m.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 6-card advantages */}
            <h2 className="aquila-heading" style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '0.1em', color: '#fff', textTransform: 'uppercase', marginBottom: '28px' }}>
              Platform Advantages
            </h2>
            <div
              className="advantage-grid"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: '#1a1a1a' }}
            >
              {advantages.map((a) => (
                <TiltCard key={a.title} className="advantage-card">
                  <div style={{ color: '#dc1e1e' }}>{icons[a.icon]}</div>
                  <div className="aquila-heading" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    {a.title}
                  </div>
                  <p className="aquila-body" style={{ fontSize: '1rem', color: '#ccc', lineHeight: 1.65, margin: 0, fontWeight: 400 }}>
                    {a.desc}
                  </p>
                  <span className="aquila-mono" style={{ fontSize: '0.85rem', letterSpacing: '0.2em', color: '#dc1e1e', marginTop: '4px' }}>
                    {a.metric}
                  </span>
                </TiltCard>
              ))}
            </div>
          </div>
        )}

        {/* ===== SPECIFICATIONS TAB ===== */}
        {activeTab === 'specifications' && (
          <div>
            <h2 className="aquila-heading" style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '0.1em', color: '#fff', textTransform: 'uppercase', marginBottom: '36px' }}>
              Technical Specifications
            </h2>
            <div
              className="spec-grid"
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#1a1a1a' }}
            >
              {specGroups.map((group) => (
                <div key={group.label} style={{ background: '#0d0d0d', padding: '0 0 1px' }}>
                  {/* Section header */}
                  <div style={{ background: '#111', borderBottom: '2px solid #dc1e1e', padding: '14px 16px' }}>
                    <span className="aquila-mono" style={{ fontSize: '0.9rem', letterSpacing: '0.25em', color: '#dc1e1e', textTransform: 'uppercase' }}>
                      {group.label}
                    </span>
                  </div>
                  <table className="spec-table">
                    <tbody>
                      {group.rows.map(([key, val]) => {
                        const isHighlight = ['45 min', 'AES-256', '2 cm/px'].some(h => val.includes(h.replace(' ', '').replace('/', '')) || val.includes(h));
                        return (
                          <tr key={key}>
                            <td>{key}</td>
                            <td>
                              {isHighlight ? <span className="highlight-val">{val}</span> : val}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== SAFETY & FAILSAFE TAB ===== */}
        {activeTab === 'safety' && (
          <div>
            {/* RTH triggers */}
            <h2 className="aquila-heading" style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '0.1em', color: '#fff', textTransform: 'uppercase', marginBottom: '20px' }}>
              RTH Auto-Trigger Conditions
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '56px' }}>
              {rthTriggers.map((t) => (
                <span key={t} className="rth-chip">{t}</span>
              ))}
            </div>

            {/* Safety feature cards */}
            <h2 className="aquila-heading" style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '0.1em', color: '#fff', textTransform: 'uppercase', marginBottom: '24px' }}>
              Safety Architecture
            </h2>
            <div
              className="safety-grid"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1px', background: '#1a1a1a' }}
            >
              {safetyFeatures.map((sf) => (
                <TiltCard key={sf.title} className="safety-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="aquila-heading" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      {sf.title}
                    </span>
                    <span className="aquila-mono" style={{ fontSize: '0.8rem', letterSpacing: '0.15em', color: '#666', border: '1px solid #222', padding: '2px 8px' }}>
                      {sf.badge}
                    </span>
                  </div>
                  <p className="aquila-body" style={{ fontSize: '1rem', color: '#ccc', lineHeight: 1.7, margin: 0, fontWeight: 400 }}>
                    {sf.desc}
                  </p>
                </TiltCard>
              ))}
            </div>
          </div>
        )}

        {/* ===== PAYLOAD TAB ===== */}
        {activeTab === 'payload' && (
          <div>
            <h2 className="aquila-heading" style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '0.1em', color: '#fff', textTransform: 'uppercase', marginBottom: '20px' }}>
              Modular Payload Architecture
            </h2>
            <p className="aquila-body" style={{ fontSize: '1.1rem', color: '#ccc', lineHeight: 1.8, marginBottom: '36px', fontWeight: 300 }}>
              Aquila's camera payload is fully swappable at the field level. Four mission-optimized variants are available — each paired with a purpose-selected imaging system for specific operational requirements.
            </p>

            {/* Variant Navigation */}
            <div className="variant-nav">
              {Object.values(variantsData).map((v) => (
                <button
                  key={v.id}
                  className={`variant-btn ${activeVariant === v.id ? 'active' : ''}`}
                  onClick={() => setActiveVariant(v.id as 's' | 'sp' | 't' | 'm')}
                >
                  <div className="variant-tag">MODEL</div>
                  <div className="variant-name">{v.name}</div>
                  <div className="variant-sub">{v.sub}</div>
                </button>
              ))}
            </div>

            {/* Active Variant Panel */}
            <div className="payload-layout">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', padding: '20px 0' }}>
                  <img 
                    src={variantsData[activeVariant].imagePath} 
                    alt={variantsData[activeVariant].name} 
                    style={{ width: '100%', maxWidth: '450px', height: 'auto', objectFit: 'contain', position: 'relative', zIndex: 2 }} 
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                  <div className="camera-model-label" style={{ padding: 0 }}>{variantsData[activeVariant].modelLabel}</div>
                  <div className="camera-badge-row" style={{ padding: 0 }}>
                    {variantsData[activeVariant].badges.map((b, i) => (
                      <span key={i} className="cam-badge">{b}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="payload-info">
                <div className="payload-variant-title">AQUILA <span>{variantsData[activeVariant].titleSpan}</span></div>
                <div className="payload-camera-name">{variantsData[activeVariant].cameraName}</div>
                <p className="payload-desc">{variantsData[activeVariant].desc1}</p>
                <p className="payload-desc">{variantsData[activeVariant].desc2}</p>

                <div className="payload-specs">
                  <div className="payload-spec-header">◈ CAMERA SPECIFICATIONS</div>
                  {variantsData[activeVariant].specs.map((s, i) => (
                    <div key={i} className="payload-spec-row">
                      <span className="ps-key">{s.k}</span>
                      <span className={`ps-val ${s.hi ? 'hi' : ''}`}>{s.v}</span>
                    </div>
                  ))}
                </div>

                <div className="payload-tags">
                  {variantsData[activeVariant].tags.map((t, i) => (
                    <span key={i} className="ptag">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Compare Grid */}
            <div className="compare-strip">
              <div className="aquila-mono" style={{ fontSize: '0.9rem', color: '#dc1e1e', letterSpacing: '0.25em', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                ALL VARIANTS — QUICK COMPARE
                <div style={{ flex: 1, maxWidth: '80px', height: '1px', background: 'rgba(220,30,30,0.4)' }} />
              </div>
              <div className="compare-grid">
                {Object.values(variantsData).map((v) => (
                  <div
                    key={v.id}
                    className={`compare-cell ${activeVariant === v.id ? 'active-compare' : ''}`}
                    onClick={() => setActiveVariant(v.id as 's' | 'sp' | 't' | 'm')}
                  >
                    <div className="cc-model">AQUILA <span>{v.titleSpan}</span></div>
                    <div className="cc-camera">{v.ccCamera}</div>
                    {v.ccStats.map((cs, i) => (
                      <div key={i} className="cc-stat">
                        <div className="cc-stat-key">{cs.k}</div>
                        <div className="cc-stat-val">{cs.v}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* ── BOTTOM CTA BAR ───────────────────────────────────────────────── */}
      <section
        style={{
          borderTop: '1px solid #dc1e1e',
          borderBottom: '1px solid #dc1e1e',
          background: '#0c0c0c',
          padding: '48px 32px',
        }}
      >
        <div
          className="hero-container"
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
          }}
        >
          <div>
            <h2
              className="aquila-heading"
              style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 700, letterSpacing: '0.15em', color: '#fff', textTransform: 'uppercase', margin: '0 0 8px' }}
            >
              REQUEST MISSION BRIEFING
            </h2>
            <p className="aquila-body" style={{ fontSize: '1.1rem', color: '#ccc', margin: 0, fontWeight: 400 }}>
              Speak with our engineering team to discuss your operational requirements and receive a tailored capability assessment.
            </p>
          </div>
          <a href="/contact" className="aquila-btn">
            Contact Our Team
          </a>
        </div>
      </section>
    </div>
  );
}
