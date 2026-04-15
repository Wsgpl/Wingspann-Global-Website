

export default function Publications() {

  return (
    <div className="min-h-screen bg-black font-sans pb-20">
      {/* 1. HEADER STYLE: High-contrast split-screen layout */}
      <section className="flex flex-col md:flex-row min-h-[60vh] md:min-h-[75vh]">
        {/* Left: High-resolution desaturated image */}
        <div className="w-full md:w-1/2 relative h-[40vh] md:h-auto overflow-hidden">
          <img
            src="/Publication.avif"
            alt="Publications"
            className="absolute inset-0 w-full h-full object-cover grayscale opacity-80"
          />
          {/* Subtle overlay to integrate the image */}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* Right: Dark matte overlay */}
        <div className="w-full md:w-1/2 bg-[#1A1A1A] flex items-center justify-center p-10 md:p-20 relative">
          <div className="w-full max-w-lg">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.1] uppercase tracking-wide">
              Research &<br />Publications
            </h1>
            <div className="h-1 w-24 bg-red-600 mt-8 shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>
          </div>
        </div>
      </section>

      {/* 4. PUBLICATION LISTING */}
      <section className="py-24 px-6 sm:px-10 lg:px-20 max-w-7xl mx-auto">
        <div className="text-center py-20 border border-gray-800 rounded-xl bg-[#0a0a0a]">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Research & Publications Coming Soon
          </h3>
          <p className="text-gray-200 max-w-2xl mx-auto font-light">
            We are actively working on pushing the boundaries of autonomous systems and aerospace technology. Our research papers and publications will be updated here in the near future.
          </p>
        </div>
      </section>

      {/* 3. UNIVERSITY PARTNERSHIP SECTION */}
      <section className="pb-24 px-6 sm:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <h2 className="text-3xl font-bold text-white uppercase tracking-wider mb-4">
              Academic Partnerships
            </h2>
            <p className="text-gray-200 max-w-2xl text-lg font-light">
              Collaborating with leading global institutions to advance the next generation of aerospace and autonomous systems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Birla Institute of Technology, Mesra",
                location: "Ranchi, India",
                image: "/BIT-Mesra.png",
              },
              {
                name: "University of Southampton",
                location: "Southampton, UK",
                image: "/Sampetheton.png",
              },
              {
                name: "Massachusetts Institute of Technology",
                location: "Cambridge, USA",
                image: "/MIT.jpg",
              },
            ].map((uni, idx) => (
              <div
                key={idx}
                className="relative overflow-hidden rounded-xl border border-white/10 p-6 sm:p-8 flex flex-col justify-end min-h-[400px] transition-transform duration-500 hover:-translate-y-2 group"
                // Glassmorphism background
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                }}
              >
                {/* Background Image Blend (Grayscale for visual consistency) */}
                <div
                  className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500 bg-cover bg-center pointer-events-none grayscale"
                  style={{ backgroundImage: `url('${uni.image}')` }}
                ></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full justify-end">
                  <h3 className="text-2xl font-bold text-white mb-2 tracking-wide leading-snug">
                    {uni.name}
                  </h3>
                  <p className="text-gray-200 text-sm tracking-widest uppercase mb-8">
                    {uni.location}
                  </p>

                  <div>
                    {/* Primary red action button matching global theme */}
                    <a
                      href="#"
                      className="inline-block text-center text-sm font-bold tracking-widest text-[#0a0a0a] bg-red-600 hover:bg-white px-8 py-3 transition-colors uppercase shadow-[0_0_20px_rgba(220,38,38,0.5)]"
                    >
                      VIEW PROJECT
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}