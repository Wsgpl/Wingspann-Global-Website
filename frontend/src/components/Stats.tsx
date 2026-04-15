import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

// Custom hook/component to animate a number from 0 to 'end' value
function AnimatedCounter({ end, isVisible }: { end: number; isVisible: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;
    const duration = 2000; // Animation duration in milliseconds

    const updateCounter = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;

      if (progress < duration) {
        // Use an easeOutQuad easing function for a polished slowdown at the end
        const easeOut = 1 - Math.pow(1 - progress / duration, 3);
        setCount(Math.floor(easeOut * end));
        animationFrame = requestAnimationFrame(updateCounter);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(updateCounter);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, isVisible]);

  return <span>{count}</span>;
}

export default function Stats() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  const stats = [
    { value: 25, suffix: '+', label: 'R&D ENGINEERS' },
    { value: 100, suffix: '+', label: 'FLIGHT HOURS' },
    { value: 10, suffix: '+', label: 'PROTOTYPES' },
    { value: 99, suffix: '%', label: 'OPERATING EFFICIENCY' }
  ];

  return (
    <section ref={sectionRef} id="stats-section" className="py-16 sm:py-32 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      <div className="absolute inset-0 grid-background opacity-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
              className="text-center relative group"
            >
              <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/5 transition-all duration-500"></div>
              <div className="relative z-10 p-4 sm:p-8">
                <div className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-2 sm:mb-4">
                  <span className="text-red-600 counter">
                    <AnimatedCounter end={stat.value} isVisible={isVisible} />
                  </span>
                  <span className="text-white">{stat.suffix}</span>
                </div>
                <div className="text-xs sm:text-sm md:text-base text-gray-200 tracking-widest font-semibold">
                  {stat.label}
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
