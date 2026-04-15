export default function Apps() {
  const apps = [
    {
      name: 'Orion Sky',
      description: 'Flight radar and weather intelligence application.',
      platforms: ['Web'],
      features: [
        'Real-time aircraft tracking',
        'Integrated weather overlays',
        'Smart filtering & search',
        'Severe weather alerts & airspace notifications',
      ],
    },
    {
      name: 'GCS – Ground Control System',
      description: 'Real-time command, monitoring, and mission management platform for unmanned aerial systems (UAS).',
      platforms: ['Web', 'Desktop', 'Mobile'],
      features: [
        'Live telemetry monitoring',
        'Mission planning & waypoint control',
        'Fleet tracking & management',
        'Real-time video streaming',
        'Geo-fencing & safety controls',
        'Data logging & performance analytics',
      ],
    },
  ];

  return (
    <section className="min-h-screen bg-black pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-white">SOFTWARE</span>
            <br />
            <span className="text-red-600">APPLICATIONS</span>
          </h1>
          <p className="text-xl text-gray-200">
            Powerful software solutions designed to maximize the capabilities of our autonomous systems.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {apps.map((app, idx) => (
            <div
              key={idx}
              className="group bg-gradient-to-br from-gray-900 to-black border border-gray-700 hover:border-red-600 p-8 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-600/20 flex flex-col"
            >
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-red-600 transition-colors">
                {app.name}
              </h3>

              <p className="text-gray-300 mb-6">{app.description}</p>

              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-200 mb-2 uppercase tracking-widest">Available On</p>
                <div className="flex flex-wrap gap-2">
                  {app.platforms.map((platform, pIdx) => (
                    <span
                      key={pIdx}
                      className="px-3 py-1 bg-red-600/20 border border-red-600/50 text-red-400 text-xs font-semibold rounded"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <p className="text-sm font-semibold text-gray-200 mb-2 uppercase tracking-widest">Key Features</p>
                <ul className="space-y-2">
                  {app.features.map((feature, fIdx) => (
                    <li key={fIdx} className="text-gray-200 text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full flex-shrink-0"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Spacer to push button to bottom */}
              <div className="mt-auto">
                {/* Coming Soon tag */}
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-red-600/40"></div>
                  <span className="text-red-500 text-xs font-bold tracking-[0.25em] uppercase">Coming Soon</span>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-red-600/40"></div>
                </div>

                {/* Disabled Download Button */}
                <button
                  disabled
                  className="w-full px-4 py-3.5 border border-gray-600 text-gray-500 font-semibold rounded cursor-not-allowed relative overflow-hidden group/btn"
                  style={{ background: 'linear-gradient(135deg, rgba(40,40,40,0.8) 0%, rgba(20,20,20,0.9) 100%)' }}
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
