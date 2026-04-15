import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function getBrochureUrl() {
  if (typeof window === 'undefined') return '/uploads/brochure.pdf';
  const origin = window.location.origin;
  if (!API_URL || API_URL === origin) return '/uploads/brochure.pdf';
  return `${API_URL}/uploads/brochure.pdf`;
}
import { VModelFlowchart } from '../components/VModelFlowchart';

// Card wrapper that handles hover-expand for subservice cards
function HoverCard({ children, className, onMouseEnter, onMouseLeave }: {
  children: React.ReactNode;
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  return (
    <div
      className={className}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
}

export default function EnhancedSolutionsWithPages() {
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<string>('main'); // 'main', 'mission-analysis', 'gcs'

  // Scroll to top whenever the active page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activePage]);

  const consultancyServices: Record<string, {
    title: string;
    subtitle: string;
    shortDesc: string;
    fullDesc: string;
    heroImage: string;
    features: string[];
    capabilities: { title: string; desc: string }[];
    specifications: { label: string; value: string }[];
    benefits: string[];
    pageImage1?: string;
    pageImage2?: string;
  }> = {
    'mission-analysis': {
      title: 'Mission Analysis',
      subtitle: 'Advanced Mission Planning & Optimization',
      shortDesc: 'Advanced mission planning and optimization platform',
      fullDesc: 'Our Mission Analysis Software is an advanced platform engineered for autonomous system operators, aerospace professionals, and mission planners. It provides comprehensive mission planning, real-time analytics, predictive modeling, and performance optimization for complex aerial operations.',
      heroImage: '/mission analysis.png',
      features: [
        'Real-time mission tracking and live telemetry monitoring',
        'Advanced route optimization using AI algorithms',
        'Weather and wind prediction integration',
        'Flight path simulation and 3D visualization',
        'Performance metrics and comprehensive reporting',
        'Multi-mission coordination and scheduling'
      ],
      capabilities: [
        {
          title: 'Smart Route Planning',
          desc: 'AI-powered algorithms optimize flight paths for fuel efficiency, time, and safety constraints'
        },
        {
          title: 'Environmental Analysis',
          desc: 'Real-time weather integration and wind field analysis for precise flight predictions'
        },
        {
          title: 'Risk Assessment',
          desc: 'Automated hazard detection and collision avoidance trajectory planning'
        },
        {
          title: 'Performance Analytics',
          desc: 'Detailed mission metrics, battery consumption, and efficiency reports'
        }
      ],
      specifications: [
        { label: 'Processing Power', value: 'Real-time 4K processing' },
        { label: 'Integration', value: 'API & REST endpoints' },
        { label: 'Data Handling', value: '100+ TB annual capacity' },
        { label: 'Uptime', value: '99.9% SLA guaranteed' }
      ],
      benefits: [
        'Reduce mission planning time',
        'Improve operational accuracy to sub-meter precision',
        'Lower operational costs',
        'Enhanced safety protocols and compliance'
      ],
      pageImage1: '/mission%20p.png',
      pageImage2: '/Service%203.png'
    },
    'gcs': {
      title: 'Ground Control Station (GCS)',
      subtitle: 'Complete Autonomous Systems Control Platform',
      shortDesc: 'Complete autonomous system management platform',
      fullDesc: 'The Ground Control Station (GCS) is a comprehensive enterprise-grade system for managing, monitoring, and controlling autonomous aerial vehicles and systems. Featuring an intuitive operator interface with real-time telemetry, advanced control capabilities, and fail-safe protocols.',
      heroImage: '/GCS.png',
      features: [
        'Multi-vehicle simultaneous control and coordination',
        'Real-time telemetry dashboard with live status',
        'Autonomous waypoint navigation and path following',
        'Live video and sensor data streaming',
        'Emergency auto-return and failsafe protocols',
        'Advanced data logging, playback, and analysis'
      ],
      capabilities: [
        {
          title: 'Unified Fleet Management',
          desc: 'Monitor and control multiple UAVs simultaneously from a single operator interface'
        },
        {
          title: 'Real-Time Telemetry',
          desc: '50+ concurrent data streams with <50ms latency for responsive control'
        },
        {
          title: 'Autonomous Operations',
          desc: 'Pre-programmed missions with intelligent failsafe and return-to-home systems'
        },
        {
          title: 'Multi-Platform Support',
          desc: 'Deploy on Windows, macOS, Linux, iOS, and Android with synchronized data'
        }
      ],
      specifications: [
        { label: 'Supported Platforms', value: 'Windows, macOS, Linux, iOS, Android' },
        { label: 'Vehicle Control', value: 'Unlimited concurrent UAVs' },
        { label: 'Latency', value: '< 50ms command response' },
        { label: 'Data Streams', value: '50+ simultaneous feeds' }
      ],
      benefits: [
        'Intuitive operator interface reduces training time',
        'Fail-safe autonomous operations with redundancy',
        'Scalable for fleet management',
        'Enterprise-grade security and encryption'
      ]
    },
    'softwares': {
      title: 'Softwares',
      subtitle: 'Advanced Software Solutions',
      shortDesc: 'Cutting-edge software solutions for aerospace operations',
      fullDesc: 'Our Softwares suite provides a comprehensive collection of advanced tools and platforms tailored for aerospace and autonomous system operations. Designed to enhance productivity, streamline workflows, and deliver powerful analytics for mission-critical environments.',
      heroImage: '/softwares.jpg',
      features: [
        'End-to-end mission lifecycle management',
        'Integrated data analytics and visualization',
        'Secure cloud-based collaboration tools',
        'Real-time alert and notification systems',
        'Role-based access control and permissions',
        'Automated reporting and compliance tools'
      ],
      capabilities: [
        { title: 'Data Integration', desc: 'Seamlessly connect and synchronize data across multiple platforms and systems' },
        { title: 'Workflow Automation', desc: 'Automate repetitive tasks and streamline complex operational workflows' },
        { title: 'Analytics Engine', desc: 'Advanced analytics with AI-powered insights and predictive modeling' },
        { title: 'Security & Compliance', desc: 'Enterprise-grade security with built-in compliance and audit trails' }
      ],
      specifications: [
        { label: 'Deployment', value: 'Cloud, On-Premise & Hybrid' },
        { label: 'Security', value: 'AES-256 Encryption' },
        { label: 'Integrations', value: '100+ third-party APIs' },
        { label: 'Uptime', value: '99.95% SLA guaranteed' }
      ],
      benefits: [
        'Accelerate decision-making with real-time dashboards',
        'Reduce manual effort through intelligent automation',
        'Scale seamlessly from small teams to enterprise fleets',
        'Ensure compliance with industry standards'
      ]
    },
    'maas': {
      title: 'Mission-as-a-Service (MaaS)',
      subtitle: 'Complete Mission Flow Architecture',
      shortDesc: 'End-to-end framework for mission planning, execution, and delivery.',
      fullDesc: 'Our Mission-as-a-Service (MaaS) framework provides a complete, high-fidelity architecture for mission planning, execution, and delivery across all sectors. We handle the technical complexities of mission life-cycles, from initial discovery and feasibility to deployment and ongoing operations.',
      heroImage: '/mp.jpeg',
      features: [
        'Comprehensive mission planning and simulation',
        'Advanced feasibility analysis across 4 key dimensions',
        'Proprietary Mission Reliability Index (MRI)',
        'Unified cross-stakeholder mission operations',
        'Post-mission data analysis and processing',
        'Kaizen continuous improvement loop'
      ],
      capabilities: [
        { title: 'Operational Excellence', desc: 'Consistent, repeatable mission success powered by standardized workflows.' },
        { title: 'Reliability metrics', desc: 'Predictable outcomes using our unique Mission Reliability Index.' },
        { title: 'Multi-Domain Support', desc: 'Expertise across aerospace, maritime, and terrestrial operations.' },
        { title: 'Strategic Partnerships', desc: 'Seamless integration with both B2B and B2G stakeholders.' }
      ],
      specifications: [
        { label: 'Platform', value: 'Multi-domain (UAV, Satellite, Ground)' },
        { label: 'Reliability', value: 'MRI-compliant architecture' },
        { label: 'Compliance', value: 'Full B2G/Regulatory alignment' },
        { label: 'Cycle Time', value: 'Optimized mission development' }
      ],
      benefits: [
        'Reduced mission risk and uncertainty',
        'Faster time-to-deployment',
        'Lower overall operational overhead',
        'Continuous performance optimization through Kaizen loop'
      ]
    }
  };

  const solutions = [
    {
      id: "services",
      title: "Our Services",
      description: "Strategic guidance and fully-managed operational models designed to accelerate and optimize your aerospace and autonomous system initiatives.",
      sectors: [
        { name: "MAAS (Mission as a Service)", subservices: ['maas'] },
        { name: "Consultancy Services", subservices: ['mission-analysis', 'gcs', 'softwares'] }
      ]
    },
    {
      id: "industry",
      title: "Industry Solutions",
      description: "Tailored aerospace and autonomous systems solutions for private sector enterprises, logistics, environmental monitoring, and commercial operations.",
      sectors: [
        { name: "Logistics & Delivery" },
        { name: "Environmental Monitoring" },
        { name: "Telecommunication" },
        { name: "Commercial Surveying" },
        { name: "Infrastructure Inspection" },
        { name: "Search & Rescue Operations" }
      ]
    },
    {
      id: "government",
      title: "Government Solutions",
      description: "Advanced systems designed for government agencies, defense operations, border security, and critical infrastructure protection.",
      sectors: [
        { name: "Defense Operations" },
        { name: "Border Security" },
        { name: "Intelligence & Surveillance" },
        { name: "Emergency Response" },
        { name: "National Security" },
        { name: "Space Programs" }
      ]
    },
    {
      id: "research",
      title: "Research Solutions",
      description: "Cutting-edge platforms and systems for academic institutions, research organizations, and scientific exploration initiatives.",
      sectors: [
        { name: "Scientific Research" },
        { name: "Climate Studies" },
        { name: "Atmospheric Research" },
        { name: "Academic Partnerships" },
        { name: "Technology Development" },
        { name: "Innovation Programs" }
      ]
    }
  ];

  // Maas Page Component
  const MaasPage = () => (
    <section className="bg-black min-h-screen">
      {/* Back Button */}
      <div className="sticky top-20 z-40 bg-black/80 backdrop-blur-md border-b border-red-600/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => setActivePage('main')}
            className="flex items-center gap-2 text-red-600 font-semibold hover:text-red-500 transition-colors"
          >
            ← Back to Services
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative w-full bg-black overflow-hidden flex flex-col justify-end min-h-[50vh] md:min-h-[70vh]">
        <img
          src={consultancyServices['maas'].heroImage}
          alt="Mission-as-a-Service"
          className="absolute inset-0 w-full h-full object-contain md:object-cover sm:object-contain object-center opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

        <div className="relative z-10 p-8 md:p-12 w-full max-w-7xl mx-auto">
          <div>
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-4">
              <span className="text-red-600">Mission-as-a-</span>
              <br />
              <span>Service (MaaS)</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl">
              Complete mission planning, execution, and delivery architecture for complex aerospace operations
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Flowchart Section */}
          <VModelFlowchart />

        {/* Detailed Insights */}
        <div className="grid md:grid-cols-2 gap-12 mb-20 mt-32 items-center">
            <div className="pr-8">
              <h2 className="text-5xl md:text-6xl font-bold mb-8 font-orbitron leading-tight">
                <span className="text-red-600 block mb-2">Premium</span> Mission Infrastructure
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed font-rajdhani font-medium">
                Beyond planning, MaaS integrates professional-grade hardware, intelligent software, and strategic operational management. We bridge the gap between initial client requests and successful data delivery.
              </p>
              <ul className="space-y-5">
                {consultancyServices['maas'].features.slice(0, 3).map((f, i) => (
                  <li key={i} className="flex items-center gap-4 group">
                    <span className="w-2.5 h-2.5 bg-red-600 rounded-full shadow-[0_0_8px_rgba(220,38,38,0.6)] group-hover:scale-125 transition-transform" />
                    <span className="text-gray-200 text-lg font-rajdhani font-semibold tracking-wide">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {consultancyServices['maas'].capabilities.map((cap, idx) => (
                <div key={idx} className="p-10 bg-gray-900/50 border-2 border-gray-800 rounded-2xl hover:border-red-600 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(220,38,38,0.15)] group">
                  <h4 className="text-red-500 font-bold text-base mb-3 uppercase tracking-widest font-orbitron group-hover:text-red-600 transition-colors">{cap.title}</h4>
                  <p className="text-sm text-gray-300 leading-relaxed font-rajdhani font-medium">{cap.desc}</p>
                </div>
              ))}
            </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Start Your Mission Today</h2>
          <p className="text-red-100 text-lg mb-8 max-w-2xl mx-auto">
            Leverage our unified MaaS framework to accelerate your aerospace and autonomous system initiatives with guaranteed reliability.
          </p>
          <div className="flex justify-center">
            <Link 
              to="/contact"
              className="px-10 py-5 bg-white text-red-600 font-bold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
            >
              Consult with Experts
            </Link>
          </div>
        </div>
      </div>
    </section>
  );

  // Mission Analysis Dedicated Page Component
  const MissionAnalysisPage = () => (
    <section className="bg-black min-h-screen">
      {/* Back Button */}
      <div className="sticky top-20 z-40 bg-black/80 backdrop-blur-md border-b border-red-600/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => setActivePage('main')}
            className="flex items-center gap-2 text-red-600 font-semibold hover:text-red-500 transition-colors"
          >
            ← Back to Services
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={consultancyServices['mission-analysis'].heroImage}
          alt="Mission Analysis"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black"></div>

        <div className="absolute bottom-0 left-0 right-0 p-12 max-w-7xl mx-auto">
          <div>
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-4">
              <span className="text-red-600">Mission</span>
              <br />
              <span>Analysis</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl">
              Advanced mission planning and optimization platform for aerospace and autonomous systems
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-20">

        {/* Overview Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-20 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">
              <span className="text-red-600">Comprehensive</span> Mission Planning
            </h2>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              Our Mission Analysis platform is engineered for autonomous system operators, aerospace professionals, and mission planners. It provides real-time analytics, predictive modeling, and performance optimization for complex aerial operations.
            </p>

          </div>
          <div>
            <div className="relative h-96 rounded-lg overflow-hidden group">
              <img
                src={consultancyServices['mission-analysis'].pageImage1}
                alt="Feature"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Key Capabilities */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold mb-4 text-center">
            <span className="text-red-600">Key</span> Capabilities
          </h2>
          <div className="w-24 h-1 bg-red-600 mx-auto mb-12"></div>

          <div className="grid md:grid-cols-2 gap-8">
            {consultancyServices['mission-analysis'].capabilities.map((cap, idx) => (
              <div
                key={idx}
                className="group relative bg-[#0a0a0a] border border-gray-800 p-8 rounded-xl transition-all duration-300 hover:border-red-600 hover:-translate-y-1"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">{cap.title}</h3>
                <p className="text-gray-200 font-light leading-relaxed">{cap.desc}</p>
                <div className="absolute top-0 right-0 w-1 h-12 bg-gradient-to-b from-red-600 to-transparent group-hover:h-full transition-all duration-500 rounded-tr-xl"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold mb-4 text-center">
            <span className="text-red-600">Core</span> Features
          </h2>
          <div className="w-24 h-1 bg-red-600 mx-auto mb-12"></div>

          <div className="grid md:grid-cols-3 gap-6">
            {consultancyServices['mission-analysis'].features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-gray-900/50 to-black border border-red-600/20 p-6 rounded-lg hover:border-red-600/60 transition-all"
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                  <p className="text-gray-300 leading-relaxed">{feature}</p>
                </div>
              </div>
            ))}
          </div>
        </div>



        {/* Benefits Section */}
        <div className="mb-20 bg-gradient-to-r from-red-600/10 to-black border border-red-600/20 rounded-xl p-12">
          <h2 className="text-4xl font-bold mb-12 text-center">
            <span className="text-red-600">Business</span> Benefits
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {consultancyServices['mission-analysis'].benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="text-3xl text-red-600 font-bold">→</div>
                <div>
                  <p className="text-lg text-gray-300">{benefit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-12 text-center mb-20">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Operations?</h2>
          <p className="text-red-100 text-lg mb-8 max-w-2xl mx-auto">
            Schedule a personalized demo to see how Mission Analysis Software can optimize your aerospace and autonomous systems.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link 
              to="/contact"
              className="px-8 py-4 bg-white text-red-600 font-bold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105"
            >
              Consult with Experts
            </Link>
            <a
              href={getBrochureUrl()}
              download="Wingspann-Brochure.pdf"
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-all inline-block text-center"
            >
              Download Brochure
            </a>
          </div>
        </div>
      </div>
    </section>
  );

  // GCS Dedicated Page Component
  const GCSPage = () => (
    <section className="bg-black min-h-screen">
      {/* Back Button */}
      <div className="sticky top-20 z-40 bg-black/80 backdrop-blur-md border-b border-red-600/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => setActivePage('main')}
            className="flex items-center gap-2 text-red-600 font-semibold hover:text-red-500 transition-colors"
          >
            ← Back to Services
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={consultancyServices['gcs'].heroImage}
          alt="Ground Control Station"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black"></div>

        <div className="absolute bottom-0 left-0 right-0 p-12 max-w-7xl mx-auto">
          <div>
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-4">
              <span className="text-red-600">Ground Control</span>
              <br />
              <span>Station (GCS)</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl">
              Complete autonomous system management platform for enterprise-grade UAV operations
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-20">

        {/* Overview */}
        <div className="grid md:grid-cols-2 gap-12 mb-20 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">
              <span className="text-red-600">Enterprise-Grade</span> UAV Control
            </h2>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              {consultancyServices['gcs'].fullDesc}
            </p>

          </div>
          <div>
            <div className="relative h-96 rounded-lg overflow-hidden group">
              <img
                src="/GCS 2.png"
                alt="Enterprise-Grade UAV Control"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Key Capabilities */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold mb-4 text-center">
            <span className="text-red-600">Key</span> Capabilities
          </h2>
          <div className="w-24 h-1 bg-red-600 mx-auto mb-12"></div>
          <div className="grid md:grid-cols-2 gap-8">
            {consultancyServices['gcs'].capabilities.map((cap, idx) => (
              <div
                key={idx}
                className="group relative bg-[#0a0a0a] border border-gray-800 p-8 rounded-xl transition-all duration-300 hover:border-red-600 hover:-translate-y-1"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">{cap.title}</h3>
                <p className="text-gray-200 font-light leading-relaxed">{cap.desc}</p>
                <div className="absolute top-0 right-0 w-1 h-12 bg-gradient-to-b from-red-600 to-transparent group-hover:h-full transition-all duration-500 rounded-tr-xl"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold mb-4 text-center">
            <span className="text-red-600">Core</span> Features
          </h2>
          <div className="w-24 h-1 bg-red-600 mx-auto mb-12"></div>
          <div className="grid md:grid-cols-3 gap-6">
            {consultancyServices['gcs'].features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-gray-900/50 to-black border border-red-600/20 p-6 rounded-lg hover:border-red-600/60 transition-all"
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2 shrink-0"></div>
                  <p className="text-gray-300 leading-relaxed">{feature}</p>
                </div>
              </div>
            ))}
          </div>
        </div>



        {/* Benefits */}
        <div className="mb-20 bg-gradient-to-r from-red-600/10 to-black border border-red-600/20 rounded-xl p-12">
          <h2 className="text-4xl font-bold mb-12 text-center">
            <span className="text-red-600">Business</span> Benefits
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {consultancyServices['gcs'].benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="text-3xl text-red-600 font-bold">→</div>
                <p className="text-lg text-gray-300">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-12 text-center mb-20">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Take Control?</h2>
          <p className="text-red-100 text-lg mb-8 max-w-2xl mx-auto">
            Schedule a personalized demo to see how GCS can streamline your UAV fleet operations.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link 
              to="/contact"
              className="px-8 py-4 bg-white text-red-600 font-bold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105"
            >
              Consult with Experts
            </Link>
            <a
              href={getBrochureUrl()}
              download="Wingspann-Brochure.pdf"
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-all inline-block text-center"
            >
              Download Brochure
            </a>
          </div>
        </div>
      </div>
    </section>
  );

  // Softwares Dedicated Page Component
  const SoftwaresPage = () => (
    <section className="bg-black min-h-screen">
      {/* Back Button */}
      <div className="sticky top-20 z-40 bg-black/80 backdrop-blur-md border-b border-red-600/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => setActivePage('main')}
            className="flex items-center gap-2 text-red-600 font-semibold hover:text-red-500 transition-colors"
          >
            ← Back to Services
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={consultancyServices['softwares'].heroImage}
          alt="Softwares"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black"></div>

        <div className="absolute bottom-0 left-0 right-0 p-12 max-w-7xl mx-auto">
          <div>
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-4">
              <span className="text-red-600">Software</span>
              <br />
              <span>Solutions</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl">
              Cutting-edge software tools and platforms for aerospace and autonomous system operations
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-20">

        {/* Overview Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-20 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">
              <span className="text-red-600">Comprehensive</span> Software Suite
            </h2>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              {consultancyServices['softwares'].fullDesc}
            </p>
          </div>
          <div>
            <div className="relative h-96 rounded-lg overflow-hidden group">
              <img
                src="/Software 2.png"
                alt="Comprehensive Software Suite"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Key Capabilities */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold mb-4 text-center">
            <span className="text-red-600">Key</span> Capabilities
          </h2>
          <div className="w-24 h-1 bg-red-600 mx-auto mb-12"></div>
          <div className="grid md:grid-cols-2 gap-8">
            {consultancyServices['softwares'].capabilities.map((cap, idx) => (
              <div
                key={idx}
                className="group relative bg-[#0a0a0a] border border-gray-800 p-8 rounded-xl transition-all duration-300 hover:border-red-600 hover:-translate-y-1"
              >
                <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">{cap.title}</h3>
                <p className="text-gray-200 font-light leading-relaxed">{cap.desc}</p>
                <div className="absolute top-0 right-0 w-1 h-12 bg-gradient-to-b from-red-600 to-transparent group-hover:h-full transition-all duration-500 rounded-tr-xl"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold mb-4 text-center">
            <span className="text-red-600">Core</span> Features
          </h2>
          <div className="w-24 h-1 bg-red-600 mx-auto mb-12"></div>
          <div className="grid md:grid-cols-3 gap-6">
            {consultancyServices['softwares'].features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-gray-900/50 to-black border border-red-600/20 p-6 rounded-lg hover:border-red-600/60 transition-all"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                  <p className="text-gray-300 leading-relaxed">{feature}</p>
                </div>
              </div>
            ))}
          </div>
        </div>



        {/* Benefits Section */}
        <div className="mb-20 bg-gradient-to-r from-red-600/10 to-black border border-red-600/20 rounded-xl p-12">
          <h2 className="text-4xl font-bold mb-12 text-center">
            <span className="text-red-600">Business</span> Benefits
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {consultancyServices['softwares'].benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="text-3xl text-red-600 font-bold">→</div>
                <p className="text-lg text-gray-300">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-12 text-center mb-20">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Elevate Your Operations?</h2>
          <p className="text-red-100 text-lg mb-8 max-w-2xl mx-auto">
            Get in touch to discover how our software suite can transform your aerospace workflows.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link 
              to="/contact"
              className="px-8 py-4 bg-white text-red-600 font-bold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105"
            >
              Consult with Experts
            </Link>
            <a
              href={getBrochureUrl()}
              download="Wingspann-Brochure.pdf"
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-all inline-block text-center"
            >
              Download Brochure
            </a>
          </div>
        </div>
      </div>
    </section>
  );

  // Main Services Page Component
  const MainServicesPage = () => (
    <section className="bg-black pb-20 min-h-screen">
      {/* Main Header — Full background image */}
      <div className="relative w-full h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        <img
          src="/S&S Page.png"
          alt="Services and Solutions"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Dark overlay — heavier on the left so text is readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/30" />

        {/* Text on the left */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-20">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-wide">
            <span className="text-white">OUR SERVICES & </span>
            <span className="text-red-600">SOLUTIONS</span>
          </h1>
          <div className="w-48 h-1 bg-red-600 mb-6 shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>
          <p className="text-xl text-gray-200 max-w-xl leading-relaxed">
            Comprehensive aerospace consultancy and autonomous systems solutions designed to meet the unique challenges of industry, government, and research sectors.
          </p>
          <button
            onClick={() => {
              const el = document.getElementById('Our Services');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="mt-10 px-10 py-4 bg-red-600 text-white font-bold rounded-lg hover:bg-white hover:text-red-600 transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)]"
          >
            Learn More
          </button>
        </div>
      </div>
      <div className="space-y-16 pt-12">
        {solutions.map((content, idx) => (
          <div key={content.id} id={content.title} className="relative py-16">
            {content.id === 'services' && (
              <div className="absolute inset-0 z-0">
                <img 
                  src="/mas.jpg" 
                  alt="Background" 
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black" />
              </div>
            )}

            {/* Solution Header Divider */}
            {content.id === 'industry' && (
              <div className="relative pt-8 pb-12 mb-8 z-10">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-600/50 to-transparent"></div>
                <div className="max-w-7xl mx-auto px-6 text-center">
                  <h2 className="text-4xl md:text-6xl font-bold tracking-wide mb-6">
                    <span className="text-white">OUR </span>
                    <span className="text-red-600">SOLUTIONS</span>
                  </h2>
                  <div className="w-24 sm:w-32 h-1 bg-red-600 mx-auto shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>
                </div>
              </div>
            )}

            {/* Divider Line */}
            {idx !== 0 && content.id !== 'industry' && (
              <div className="absolute -top-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-900/50 to-transparent z-10"></div>
            )}

            <div className="max-w-6xl mx-auto px-6 relative z-10">
              <div>
                <h2 className="text-5xl md:text-7xl font-bold mb-6">
                  <span className="text-red-600">{content.title.split(' ')[0]}</span>
                  <br />
                  <span className="text-white">{content.title.split(' ').slice(1).join(' ')}</span>
                </h2>

                <p className="text-xl text-gray-300 mb-12 max-w-3xl leading-relaxed">
                  {content.description}
                </p>

                <div className="grid md:grid-cols-2 gap-8 mb-4 items-start">
                  {content.sectors.map((sector, sIdx) => {
                    const key = `${content.id}-${sIdx}`;
                    const isExpanded = expandedService === key;
                    const hasSubservices = 'subservices' in sector && sector.subservices;
                    return (
                      <HoverCard
                        key={sIdx}
                        className={`group bg-gradient-to-br from-gray-900 to-black border p-6 rounded-lg cursor-pointer hover:shadow-xl hover:shadow-red-600/20 transition-all duration-300 ${isExpanded ? 'border-red-600 shadow-xl shadow-red-600/20' : 'border-gray-700 hover:border-red-600'
                          }`}
                        onMouseEnter={undefined}
                        onMouseLeave={undefined}
                      >
                        <div
                          className="flex items-start justify-between w-full"
                          onClick={() => {
                            if (hasSubservices) setExpandedService(isExpanded ? null : key);
                          }}
                        >
                          <div className="flex items-start gap-4">
                            <div>
                              <h3 className="text-lg font-bold text-white group-hover:text-red-600 transition-colors mb-2">
                                {sector.name}
                              </h3>
                              <p className="text-sm text-gray-300">
                                Specialized solutions for optimal performance
                              </p>
                            </div>
                          </div>

                          {hasSubservices && (
                            <div className="shrink-0 ml-4 self-center">
                              <span
                                className="relative text-xs font-bold tracking-widest uppercase px-4 py-2 rounded border bg-red-600 text-white border-red-600 flex items-center gap-2 transition-all duration-300"
                                style={{ animation: 'buttonGlow 1.5s ease-in-out infinite' }}
                              >
                                See What We Do
                                <span className="animate-fast-blink text-white text-base leading-none">▼</span>
                              </span>
                            </div>
                          )}
                        </div>
                      </HoverCard>
                    );
                  })}
                </div>

                {/* Expanded Sub-service Cards — below the full grid, 3-col layout */}
                {content.sectors.map((sector, sIdx) => {
                  const key = `${content.id}-${sIdx}`;
                  if (!('subservices' in sector) || !sector.subservices || expandedService !== key) return null;
                  return (
                    <div key={`expanded-${sIdx}`} className="grid md:grid-cols-3 gap-6 mt-6">
                      {sector.subservices.map((subserviceId, subIdx) => {
                        const subService = consultancyServices[subserviceId];
                        return (
                          <div
                            key={subIdx}
                            className="relative rounded-xl overflow-hidden border border-red-600/30 hover:border-red-600 hover:shadow-xl hover:shadow-red-600/30 transition-all duration-300 cursor-pointer group"
                            style={{
                              minHeight: '260px',
                              animation: `slideDownFade 0.4s ease forwards`,
                              animationDelay: `${subIdx * 0.1}s`,
                              opacity: 0
                            }}
                            onClick={() => setActivePage(subserviceId)}
                          >
                            <img
                              src={subService.heroImage}
                              alt={subService.title}
                              className="absolute inset-0 w-full h-full object-cover grayscale opacity-60 group-hover:opacity-80 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30 group-hover:from-black group-hover:via-black/60 transition-all duration-300" />
                            <div className="relative z-10 flex flex-col justify-end p-6" style={{ minHeight: '260px' }}>
                              <p className="font-bold text-white text-xl mb-1 tracking-wide">{subService.title}</p>
                              <p className="text-xs text-gray-300 leading-relaxed mb-4">{subService.shortDesc}</p>
                              <button
                                onClick={(e) => { e.stopPropagation(); setActivePage(subserviceId); }}
                                className="w-full px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-white hover:text-red-600 transition-all duration-300"
                              >
                                Read More →
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}

        {/* Why Choose Us Section */}
        <div className="max-w-6xl mx-auto px-6 pt-12">
          <div className="bg-gradient-to-r from-red-600/10 to-black border border-red-600/30 p-8 rounded-lg">
            <h2 className="text-3xl font-bold text-white mb-8">
              <span className="text-red-600">Why Choose</span> Us
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                "Industry-leading technology and expertise",
                "Proven track record of successful deployments",
                "24/7 support and continuous optimization",
                "Customizable solutions for unique requirements"
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <span className="text-red-600 font-bold text-2xl flex-shrink-0">✓</span>
                  <span className="text-gray-300 text-lg">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');
      `}</style>

      {activePage === 'main' && <MainServicesPage />}
      {activePage === 'mission-analysis' && <MissionAnalysisPage />}
      {activePage === 'gcs' && <GCSPage />}
      {activePage === 'softwares' && <SoftwaresPage />}
      {activePage === 'maas' && <MaasPage />}
    </>
  );
}
