import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Hero() {
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 1000], [0, 300]);
  const yParticles = useTransform(scrollY, [0, 1000], [0, 150]);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background Image with Dark Overlay */}
      <motion.div className="absolute inset-0 z-0" style={{ y: yBg }}>
        <img
          src="/vision%20bg.JPG"
          alt="Drone background"
          className="w-full h-full object-cover object-bottom opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black"></div>
      </motion.div>

      <div className="absolute inset-0 grid-background opacity-5 z-0"></div>
      <div className="absolute inset-0 circuit-pattern opacity-5 z-0"></div>

      <motion.div className="absolute inset-0" style={{ y: yParticles }}>
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </motion.div>

      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl w-full mt-12 sm:mt-24">
        <div className="mb-6 sm:mb-8 logo-container">
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-6 glitch-text"
          data-text="REDEFINING AEROSPACE"
        >
          <span className="text-red-600">REDEFINING</span>
          <br />
          <span className="text-white">AEROSPACE</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="text-sm sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed tracking-wide font-light px-2"
        >
          Next-generation autonomous aerial systems. From UAVs to space exploration.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex gap-3 sm:gap-6 justify-center flex-wrap px-2"
        >
          <Link to="/technology" className="cyber-button px-4 sm:px-8 py-3 sm:py-4 bg-red-600 text-white text-xs sm:text-sm font-semibold rounded-none relative overflow-hidden group">
            <span className="relative z-10">EXPLORE TECHNOLOGY</span>
            <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
            <span className="absolute inset-0 z-20 flex items-center justify-center text-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs sm:text-sm">
              EXPLORE TECHNOLOGY
            </span>
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
      >
        <ChevronDown className="w-8 h-8 text-red-600" />
      </motion.div>

      <div className="scan-line"></div>
    </section>
  );
}
