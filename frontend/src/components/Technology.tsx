import { Plane, Satellite, Cog, Radar } from "lucide-react";
import { motion } from "framer-motion";
import { MouseEvent } from "react";

export default function Technology() {
  const technologies = [
    {
      icon: Plane,
      title: "Unmanned Aerial Systems",
      description:
        "Adaptive aerial systems built for endurance and precision.",
      metrics: ["Multicopter", "Fixed-Wing", "Hybrid VTOL"],
    },
    {
      icon: Cog,
      title: "Aerospace Components",
      description:
        "Precision-engineered components powering critical flight systems.",
      metrics: ["Dual-Use Electronics", "Aircraft Components", "Assembly Manufacturing"],
    },
    {
      icon: Satellite,
      title: "Space Systems",
      description:
        "Integrated spacecraft architectures for multi-domain operations.",
      metrics: ["Satellites", "Subsystems", "Mission Design"],
    },
    {
      icon: Radar,
      title: "Optical & Laser Systems",
      description:
        "Optical intelligence for detection, defense, and disruption.",
      metrics: ["Quantum Sensing", "Radar & Ground Stations", "Counter-Drone Solutions"],
    },
  ];

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    for (const card of document.getElementsByClassName("tech-card")) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      (card as HTMLElement).style.setProperty("--mouse-x", `${x}px`);
      (card as HTMLElement).style.setProperty("--mouse-y", `${y}px`);
    }
  };

  return (
    <section className="py-16 sm:py-32 bg-black relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="hex-pattern opacity-5"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          className="text-center mb-12 sm:mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6">
            <span className="text-white">WHAT WE </span>
            <span className="text-red-600">BUILD</span>
          </h2>
          <div className="w-24 sm:w-32 h-1 bg-red-600 mx-auto mb-6 sm:mb-8"></div>
          <p className="text-sm sm:text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light tracking-wide px-2">
            We build aerospace systems that push boundaries—from UAS and
            satellite technologies to precision components and optical
            innovations.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8" onMouseMove={handleMouseMove}>
          {technologies.map((tech, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ scale: 1.02 }}
              className="tech-card group relative bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 sm:p-8 lg:p-10 hover:border-gray-600 transition-all duration-300 overflow-hidden"
            >
              {/* Spotlight Glow Effect */}
              <div
                className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: 'radial-gradient(800px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(220, 38, 38, 0.15), transparent 40%)'
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-br from-red-600/0 to-red-600/0 group-hover:from-red-600/0 group-hover:to-red-600/20 transition-all duration-500 z-0"></div>

              <div className="relative z-10 pointer-events-none">
                <div className="flex items-start justify-between mb-4 sm:mb-6">
                  <div className="p-2 sm:p-4 bg-red-600/10 border border-red-600/30">
                    <tech.icon className="w-6 sm:w-8 lg:w-10 h-6 sm:h-8 lg:h-10 text-red-600" />
                  </div>
                  <div className="text-right">
                    <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-red-600/50 group-hover:text-red-600/70 transition-colors">
                      0{index + 1}
                    </div>
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4 tracking-wider">
                  {tech.title}
                </h3>
                <p className="text-base sm:text-lg text-gray-200 mb-4 sm:mb-6 leading-relaxed font-light">
                  {tech.description}
                </p>

                <div className="flex gap-2 sm:gap-3 flex-wrap">
                  {tech.metrics.map((metric, i) => (
                    <span
                      key={i}
                      className="px-2 sm:px-4 py-1 sm:py-2 bg-black border border-red-600/50 text-red-500 text-xs sm:text-sm font-semibold tracking-wider"
                    >
                      {metric}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
