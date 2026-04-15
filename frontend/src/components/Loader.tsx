import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Loader = ({ onComplete }: { onComplete: () => void }) => {
  const [icon, setIcon] = useState("/Wingspann_Aircraft.png");

  // Added: State and list for random tagline
  const [tagline, setTagline] = useState("Global Vision. Infinite Horizons.");
  const taglines = [
    "Global Vision. Infinite Horizons.",
    "Every Micron Matters.",
    "Pushing Boundaries.",
    "Protecting Lives, Missions, and Trust.",
    "Connecting Frontiers. Uniting Worlds.",
    "Engineering with Earth in Mind.",
    "Greatness is a Team Sport.",
    "Doing what's right, every time.",
    "Owning outcomes, delivering results.",
    "Failure is not an option.",
    "Above expectations. Beyond Limits.",
  ];

  useEffect(() => {
    const iconSet = [
      "/Wingspann_Aircraft_Small.png",
      "/Wingspann_Drone_Small.png",
      "/Wingspann_S_Small.png",
    ];
    setIcon(iconSet[Math.floor(Math.random() * iconSet.length)]);

    // Added: Random tagline selection
    setTagline(taglines[Math.floor(Math.random() * taglines.length)]);

    const timer = setTimeout(() => onComplete(), 6500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gray-400 overflow-hidden">
      <div className="relative z-[10000] flex flex-col items-center">
        {/* Logos */}
        <div className="flex items-center space-x-1">
          <motion.img
            src="/Wingspann_W.png"
            alt="Static Logo"
            className="w-auto h-20 object-contain"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
          <motion.img
            src="/Wingspann_S.png"
            alt="Animated Logo"
            className="w-auto h-20 object-contain"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, rotate: [0, 360] }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
          />
        </div>

        {/* Tagline */}
        {/* Modified only the inner text to use the random tagline variable */}
        <motion.h2
          className="text-red-900 mt-6 text-lg tracking-widest font-light uppercase text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 1.2 }}
        >
          {tagline}
        </motion.h2>

        {/* Progress Bar */}
        <div className="relative w-72 h-2 bg-gray-300 mt-10 rounded-full overflow-visible">
          {/* Red Fill */}
          <motion.div
            className="absolute top-0 left-0 h-full bg-red-600 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ delay: 2.5, duration: 3, ease: "easeInOut" }}
          />

          {/* Moving Icon */}
          <motion.div
            className="absolute -top-3 left-0 w-full"
            initial={{ x: 0 }}
            animate={{ x: "100%" }}
            transition={{ delay: 2.5, duration: 3, ease: "easeInOut" }}
          >
            <img
              src={icon}
              alt="Progress Icon"
              className="w-8 h-8 object-contain drop-shadow-[0_0_6px_rgba(255,0,0,0.6)]"
            />
          </motion.div>
        </div>
      </div>

      {/* Shutters */}
      <motion.div
        className="absolute top-0 left-0 w-full h-1/2 bg-gray-400 z-[9999]"
        initial={{ y: 0 }}
        animate={{ y: "-100%" }}
        transition={{ delay: 6.2, duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-full h-1/2 bg-gray-400 z-[9999]"
        initial={{ y: 0 }}
        animate={{ y: "100%" }}
        transition={{ delay: 6.2, duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
      />
    </div>
  );
};

export default Loader;
