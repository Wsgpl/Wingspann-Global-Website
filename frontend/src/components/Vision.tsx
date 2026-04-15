import { Rocket, Cpu, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Vision() {
  return (
    <section className="py-16 sm:py-32 relative overflow-hidden bg-black">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/Earth%20Photo.avif"
          alt="Earth background"
          className="w-full h-full object-cover opacity-100 animate-fade-in"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-80"></div>
      </div>

      <div className="absolute inset-0 tech-lines opacity-10 z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div 
          className="text-center mb-12 sm:mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6">
            <span className="text-red-600">OUR</span>
            <span className="text-white"> VISION</span>
          </h2>
          <div className="w-24 sm:w-32 h-1 bg-red-600 mx-auto mb-6 sm:mb-8"></div>
          <p className="text-sm sm:text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light tracking-wide px-2">
            To build <span className="text-red-500 font-semibold">India's Skunk Works for UAVs</span>—then lead the next frontier:
            <span className="text-white font-semibold"> space and nuclear autonomy</span>
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 mt-12 sm:mt-20">
          {[
            {
              icon: Rocket,
              title: "INNOVATION",
              description: "Pushing boundaries in autonomous systems, materials science, and propulsion technology"
            },
            {
              icon: Cpu,
              title: "PRECISION",
              description: "Advanced manufacturing with digital twins and AI-driven control architectures"
            },
            {
              icon: Shield,
              title: "EXCELLENCE",
              description: "Unprecedented performance, safety, and sustainability in every platform we create"
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="vision-card group relative bg-gray-900 border border-gray-800 p-6 sm:p-8 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-red-600/15 group-hover:bg-gray-400/20 transition-all duration-500"></div>
              <div className="relative z-10">
                <div className="mb-4 sm:mb-6 inline-block p-3 sm:p-4 bg-red-600/10 border border-red-600/30">
                  <item.icon className="w-8 sm:w-12 h-8 sm:h-12 text-red-600" />
                </div>
                <h3 className="text-lg sm:text-2xl font-bold text-white mb-2 sm:mb-4 tracking-wider">{item.title}</h3>
                <p className="text-gray-200 leading-relaxed font-light">{item.description}</p>
              </div>
              <div className="corner-accent top-0 left-0"></div>
              <div className="corner-accent top-0 right-0"></div>
              <div className="corner-accent bottom-0 left-0"></div>
              <div className="corner-accent bottom-0 right-0"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
