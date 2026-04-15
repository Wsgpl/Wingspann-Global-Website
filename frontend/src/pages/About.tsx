import { useLocation } from 'react-router-dom';
import { ChevronRight, Component, Rocket, Brain, Target, Lightbulb, ShieldCheck, Globe, Leaf, Users, Scale, ClipboardCheck, Zap, Award } from 'lucide-react';
import { motion } from 'framer-motion';


export default function About() {
  const location = useLocation();
  const isMission = location.pathname === '/about/mission';

  const coreValues = [
    { icon: Target, title: "Precision", desc: "Every Micron matters" },
    { icon: Lightbulb, title: "Innovation", desc: "Pushing boundaries, redefining flights" },
    { icon: ShieldCheck, title: "Safety", desc: "Protecting lives, missions and trust" },
    { icon: Globe, title: "Global Vision", desc: "Connecting skies, Visiting World" },
    { icon: Leaf, title: "Sustainability", desc: "Engineers with Earth in mind" },
    { icon: Users, title: "Collaboration", desc: "Greatness is a team Sport" },
    { icon: Scale, title: "Integrity", desc: "Doing what is right every time" },
    { icon: ClipboardCheck, title: "Accountability", desc: "Owning outcomes, delivering results" },
    { icon: Zap, title: "Resilience", desc: "Failure is not an option" },
    { icon: Award, title: "Excellence", desc: "Above Expectations, beyond limits" }
  ];
  return (
    <div className="bg-black -mt-20 selection:bg-red-600 selection:text-white">
      {/* Hero Video Section - WHO WE ARE */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Abstract/AI generated Video Placeholder */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        >
          <source src="/4211319-hd_1920_1080_24fps.mp4" type="video/mp4" />
        </video>

        {/* Gradient overlays for readability and fading into next section */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black z-10" />

        <div className="relative z-20 text-center px-6 mt-20 animate-fade-in">
          <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-black text-white uppercase tracking-widest mb-6 font-['Orbitron']">
            <span className="text-red-600">WHO</span> WE ARE
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-light tracking-wide uppercase font-['Rajdhani']">
            Pioneering the Future of Autonomous Systems
          </p>

          {/* Scroll prompt */}
          <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
            <div className="w-8 h-12 rounded-full border-2 border-gray-400 flex justify-center p-2">
              <div className="w-1 h-3 bg-red-600 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="min-h-screen pt-20 pb-20 relative z-20 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          {isMission ? (
            <div className="animate-fade-in flex flex-col gap-24 font-['Rajdhani']">
              {/* Mission Text and Image Layout */}
              <div className="grid lg:grid-cols-[1.5fr_1fr] gap-12 lg:gap-20 items-center">

                {/* Image on Left (Flat, un-carded design like Saab) */}
                <div className="w-full">
                  <img
                    src="/our%20mission.png"
                    alt="Our Mission"
                    className="w-full h-auto object-cover"
                  />
                </div>

                {/* Text on Right */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="flex flex-col items-start pr-0 lg:pr-10"
                >
                  <div className="w-8 h-[2px] bg-gray-500 mb-6"></div>

                  <h2 className="text-4xl md:text-5xl font-['Orbitron'] font-bold mb-10 text-white tracking-wide uppercase">
                    OUR <span className="text-red-700">MISSION</span>
                  </h2>

                  <div className="mb-8">
                    <p className="text-xl md:text-2xl text-white font-bold mb-8 uppercase tracking-widest border-l-4 border-red-600 pl-6">
                      We are committed:-
                    </p>
                    <ul className="space-y-5 text-gray-300">
                      {[
                        "Advancing next-gen aerospace & autonomous systems",
                        "Developing UAVs, space tech & precision components",
                        "Leveraging AI-driven autonomy & advanced avionics",
                        "Delivering cost-efficient, high-performance solutions",
                        "Enhancing mission readiness across industries"
                      ].map((item, index) => (
                        <li key={index} className="flex items-start gap-4 group/item">
                          <span className="text-red-600 font-black mt-1 transition-transform duration-300 group-hover/item:scale-125">•</span>
                          <span className="text-base md:text-lg font-light leading-relaxed group-hover/item:text-white transition-colors duration-300">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </div>

              {/* Core Values Section */}
              <div className="w-full mt-24 pb-20 border-t border-gray-900 pt-16">
                <div className="flex flex-col items-center mb-16 text-center">
                  <h2 className="text-4xl md:text-5xl font-['Orbitron'] font-black text-white tracking-widest uppercase">
                    CORE <span className="text-red-700">VALUES</span>
                  </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {coreValues.map((value, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                      className="group relative bg-[#0a0a0a] border border-gray-800 p-6 rounded-xl transition-all duration-300 hover:border-red-600 hover:-translate-y-2 flex flex-col items-center text-center justify-center min-h-[200px] shadow-lg"
                    >
                      <div className="mb-4 text-red-600 group-hover:scale-110 transition-transform duration-300">
                        <value.icon size={32} strokeWidth={1.5} />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-wider group-hover:text-red-600 transition-colors">
                        {value.title}
                      </h3>
                      <p className="text-gray-400 text-xs font-light leading-relaxed uppercase tracking-widest">
                        {value.desc}
                      </p>
                      
                      {/* Animated Side Accent */}
                      <div className="absolute top-0 right-0 w-1 h-12 bg-gradient-to-b from-red-600 to-transparent group-hover:h-full transition-all duration-500 rounded-tr-xl"></div>
                      
                      {/* Bottom Glow */}
                      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-600/0 to-transparent group-hover:via-red-600/30 transition-all duration-500"></div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Why Choose Section */}
              <div className="w-full mt-12 mb-6 text-center">
                <h2 className="text-3xl md:text-5xl font-black mb-6 text-white tracking-wide uppercase">
                  WHY CHOOSE WINGSPANN?
                </h2>
                <p className="text-base md:text-lg text-gray-300 max-w-5xl mx-auto font-light leading-relaxed">
                  At wingsapnn global, we're not just drone manufacturers — we're partners in innovation and success. Here's why Wingspann stands out in the drone industry.
                </p>
              </div>

              {/* Key Focus Areas Card Grid */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ margin: "-50px" }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="max-w-6xl mx-auto w-full mt-0 mb-20"
              >
                <div className="flex flex-col items-center mb-10">
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-wide text-white uppercase text-center">
                      KEY <span className="text-red-700">FOCUS AREAS</span>
                    </h2>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Card 1 */}
                  <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl border border-gray-800 hover:border-red-600/50 hover:-translate-y-2 transition-all duration-300 shadow-lg group">
                    <div className="bg-red-600/10 w-16 h-16 rounded-full flex items-center justify-center mb-6 border border-red-600/20 group-hover:bg-red-600 transition-colors duration-300">
                      <Brain className="w-8 h-8 text-red-500 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-3 tracking-wide">Unmanned Aerial Systems</h3>
                    <p className="text-gray-200 text-sm font-light leading-relaxed group-hover:text-gray-300">
                      We are devloping a new generation of unmanned aerial system that are more efficient, reliable, and capable than ever before. our drones are designed to meet the needs of various purpose, including surveillance, reconnaissance, and cargo delivery.
                    </p>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl border border-gray-800 hover:border-red-600/50 hover:-translate-y-2 transition-all duration-300 shadow-lg group">
                    <div className="bg-red-600/10 w-16 h-16 rounded-full flex items-center justify-center mb-6 border border-red-600/20 group-hover:bg-red-600 transition-colors duration-300">
                      <Component className="w-8 h-8 text-red-500 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-3 tracking-wide">Aerospace Components</h3>
                    <p className="text-gray-200 text-sm font-light leading-relaxed group-hover:text-gray-300">
                      Engineering lightweight, highly durable structural components designed for extreme environments and rigorous continuous payload demands.
                    </p>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl border border-gray-800 hover:border-red-600/50 hover:-translate-y-2 transition-all duration-300 shadow-lg group">
                    <div className="bg-red-600/10 w-16 h-16 rounded-full flex items-center justify-center mb-6 border border-red-600/20 group-hover:bg-red-600 transition-colors duration-300">
                      <Rocket className="w-8 h-8 text-red-500 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-3 tracking-wide">Space Systems</h3>
                    <p className="text-gray-200 text-sm font-light leading-relaxed group-hover:text-gray-300">
                      Pioneering specialized platforms tailored for robust orbital deployment and comprehensive deep-space operations.
                    </p>
                  </div>

                  {/* Card 4 */}
                  <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl border border-gray-800 hover:border-red-600/50 hover:-translate-y-2 transition-all duration-300 shadow-lg group">
                    <div className="bg-red-600/10 w-16 h-16 rounded-full flex items-center justify-center mb-6 border border-red-600/20 group-hover:bg-red-600 transition-colors duration-300">
                      <Target className="w-8 h-8 text-red-500 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-3 tracking-wide">Optical & Laser Systems</h3>
                    <p className="text-gray-200 text-sm font-light leading-relaxed group-hover:text-gray-300">
                      Developing precise, high-fidelity electro-optical sensors and targeting systems for mission-critical environmental sensing applications.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="animate-fade-in flex flex-col gap-24">
              {/* Vision Text and Image Layout */}
              <div className="grid lg:grid-cols-[1.5fr_1fr] gap-12 lg:gap-20 items-center">

                {/* Image Placeholder on Left */}
                <div className="w-full bg-[#111] min-h-[300px] lg:min-h-[400px] flex items-center justify-center border border-gray-800">
                  <span className="text-gray-500 uppercase tracking-widest text-xs md:text-sm">Vision Imagery Coming Soon</span>
                </div>

                {/* Text on Right */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="flex flex-col items-start pr-0 lg:pr-10"
                >
                  <div className="w-8 h-[2px] bg-gray-500 mb-6"></div>

                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white tracking-wide uppercase">
                    OUR <span className="text-red-700">VISION</span>
                  </h2>

                  <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-4 font-light">
                    To be the global leader in autonomous aerospace systems, transforming how nations and enterprises think about unmanned operations, space exploration, and advanced technology integration.
                  </p>

                  <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-8 font-light">
                    We envision a future where autonomous systems are seamlessly integrated into critical operations, delivering unprecedented levels of efficiency, safety, and capability while maintaining the highest standards of innovation and reliability.
                  </p>
                </motion.div>
              </div>

              {/* Strategic Pillars pushed to next scroll section */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ margin: "-50px" }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="max-w-5xl mx-auto w-full group cursor-default transition-all duration-300 mt-12"
              >
                <div className="flex flex-col items-center md:items-start mb-10">
                  <div className="w-8 h-[2px] bg-gray-500 mb-6"></div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-wide text-white uppercase">
                      STRATEGIC <span className="text-red-700">PILLARS</span>
                    </h2>
                    <ChevronRight className="w-8 h-8 md:w-10 md:h-10 text-red-700" strokeWidth={3} />
                  </div>
                </div>
                <ul className="grid sm:grid-cols-2 gap-6 text-gray-300">
                  <li className="flex items-start gap-3 opacity-0 translate-y-4 transition-all duration-500 delay-[100ms] group-hover:opacity-100 group-hover:translate-y-0">
                    <span className="text-red-600 font-bold mt-1">•</span>
                    <span className="font-light">Industry leadership through innovation</span>
                  </li>
                  <li className="flex items-start gap-3 opacity-0 translate-y-4 transition-all duration-500 delay-[200ms] group-hover:opacity-100 group-hover:translate-y-0">
                    <span className="text-red-600 font-bold mt-1">•</span>
                    <span className="font-light">Partnerships with government and enterprise</span>
                  </li>
                  <li className="flex items-start gap-3 opacity-0 translate-y-4 transition-all duration-500 delay-[300ms] group-hover:opacity-100 group-hover:translate-y-0">
                    <span className="text-red-600 font-bold mt-1">•</span>
                    <span className="font-light">Sustainable and responsible technology</span>
                  </li>
                  <li className="flex items-start gap-3 opacity-0 translate-y-4 transition-all duration-500 delay-[400ms] group-hover:opacity-100 group-hover:translate-y-0">
                    <span className="text-red-600 font-bold mt-1">•</span>
                    <span className="font-light">Talent development and retention</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
