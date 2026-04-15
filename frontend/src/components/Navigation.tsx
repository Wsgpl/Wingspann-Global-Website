import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  label: string;
  href?: string;
  submenu?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Technology', href: '/technology' },
  { label: 'Services & Solutions', href: '/solutions' },
  { label: 'Careers', href: '/careers' },
  { label: 'About', href: '/about/mission' },
  { label: 'Contact', href: '/contact' }
];

const additionalLinks: { label: string; href: string }[] = [
  { label: 'Newsroom', href: '/press' },
  { label: 'Publications', href: '/publications' },
  { label: 'Apps', href: '/apps' }
];

interface NavLinkProps {
  item: NavItem;
}

function NavLink({ item }: NavLinkProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasSubmenu = !!item.submenu;

  return (
    <div
      className="relative group"
      onMouseEnter={() => hasSubmenu && setIsOpen(true)}
      onMouseLeave={() => hasSubmenu && setIsOpen(false)}
    >
      {hasSubmenu ? (
        <button className="flex items-center gap-2 py-4 px-3 sm:px-6 text-xs font-bold tracking-widest hover:opacity-70 transition-opacity group relative text-black">
          {item.label.toUpperCase()}
          <span className="text-sm font-bold">
            {isOpen ? '-' : '+'}
          </span>
          <div
            className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
          ></div>
        </button>
      ) : (
        <a href={item.href} className="flex items-center gap-2 py-4 px-3 sm:px-6 text-xs font-bold tracking-widest hover:opacity-70 transition-opacity group relative text-black">
          {item.label.toUpperCase()}
          <div
            className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
          ></div>
        </a>
      )}

      {hasSubmenu && isOpen && (
        <div
          className="absolute top-full left-0 w-48 sm:w-56 bg-gradient-to-br from-gray-400 to-gray-500 border border-gray-300 shadow-2xl z-50 animate-fade-in"
        >
          {item.submenu?.map((subitem, idx) => (
            <a
              key={idx}
              href={subitem.href}
              className="block px-4 sm:px-6 py-3 text-xs font-bold tracking-widest text-black hover:bg-gray-300 transition-colors border-b border-gray-300 last:border-b-0"
            >
              {subitem.label.toUpperCase()}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

/* ──────────────────────── Saab-Inspired Header Shutter Reveal ──────────────────────── */
function HeaderShutterReveal({ onComplete }: { onComplete: () => void }) {
  const SHUTTER_COUNT = 20;
  const shutters = Array.from({ length: SHUTTER_COUNT }, (_, i) => i);

  useEffect(() => {
    // Remove the shutter overlay after animation completes
    const timer = setTimeout(() => onComplete(), 1800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className="fixed top-0 left-0 right-0 h-20 pointer-events-none overflow-hidden"
      style={{ zIndex: 60 }}
    >
      {shutters.map((index) => {
        // Top half shutters slide up, bottom half slide down (like opening blinds)
        const isTopHalf = index < SHUTTER_COUNT / 2;
        const distanceFromCenter = Math.abs(index - SHUTTER_COUNT / 2);
        // Items closer to center open first, edges open last
        const staggerDelay = 0.3 + distanceFromCenter * 0.04;

        return (
          <motion.div
            key={index}
            initial={{ scaleX: 1, opacity: 1 }}
            animate={{
              scaleX: 0,
              opacity: 0,
            }}
            transition={{
              duration: 0.7,
              delay: staggerDelay,
              ease: [0.76, 0, 0.24, 1], // Smooth expo ease
            }}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: `${index * (80 / SHUTTER_COUNT)}px`,
              height: `${80 / SHUTTER_COUNT + 1}px`,
              transformOrigin: isTopHalf ? 'left center' : 'right center',
              background: `linear-gradient(180deg, 
                rgba(${30 + index * 3}, ${30 + index * 3}, ${30 + index * 3}, 1) 0%, 
                rgba(${20 + index * 2}, ${20 + index * 2}, ${20 + index * 2}, 1) 100%)`,
            }}
          />
        );
      })}

      {/* Red accent line that sweeps across during reveal */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: [0, 1, 1, 0] }}
        transition={{
          duration: 1.2,
          delay: 0.2,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #cc2222, #cc2222, transparent)',
          transformOrigin: 'left center',
        }}
      />
    </div>
  );
}

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);
  const [shutterComplete, setShutterComplete] = useState(false);

  return (
    <>
      {/* Saab-Inspired Shutter Reveal Animation */}
      <AnimatePresence>
        {!shutterComplete && (
          <HeaderShutterReveal onComplete={() => setShutterComplete(true)} />
        )}
      </AnimatePresence>

      <header className="fixed top-0 left-0 right-0 z-50 h-20 header-gradient border-b border-gray-600 flex md:flex-row flex-col">
        {/* Desktop Navigation */}
        <div className="hidden md:flex w-full h-20 items-center">
          {/* Left half — slides in from left */}
          <motion.div
            initial={{ x: -120, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-1/2 flex items-center justify-start px-4"
          >
            <nav className="flex items-center gap-1">
              {navItems.slice(0, 3).map((item, idx) => (
                <NavLink key={idx} item={item} />
              ))}
            </nav>
          </motion.div>

          {/* Center - Interactive Split Logo Animation */}
          <div
            className="fixed top-0 h-20 flex items-center justify-center z-[51] pointer-events-none"
            style={{ left: '47%', transform: 'translateX(-50%)' }}
          >
            {/* The 'W' moving left */}
            <motion.img
              src="/Wingspann_W.png"
              alt="W"
              className="absolute h-12 object-contain"
              initial={{ x: 0, opacity: 0, scale: 0.8 }}
              animate={{
                x: [0, -90, -90],
                opacity: [0, 1, 0],
                scale: [0.8, 1, 1]
              }}
              transition={{ duration: 2.5, times: [0, 0.4, 1], delay: 0.8, ease: "easeInOut" }}
            />

            {/* The 'Block' (S) moving right */}
            <motion.img
              src="/Wingspann_S.png"
              alt="Block"
              className="absolute h-12 object-contain"
              initial={{ x: 0, opacity: 0, scale: 0.8 }}
              animate={{
                x: [0, 90, 90],
                opacity: [0, 1, 0],
                scale: [0.8, 1, 1]
              }}
              transition={{ duration: 2.5, times: [0, 0.4, 1], delay: 0.8, ease: "easeInOut" }}
            />

            {/* The Full Logo appearing after the split */}
            <motion.img
              src="/Wingspann Logo.png"
              alt="Wingspann Global"
              className="h-12 pointer-events-auto"
              initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
              animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
              transition={{ duration: 1.2, delay: 2.6, ease: "easeOut" }}
            />
          </div>

          {/* Right half — slides in from right */}
          <motion.div
            initial={{ x: 120, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-1/2 flex items-center justify-end px-4 gap-1"
          >
            <nav className="flex items-center gap-1">
              {navItems.slice(3).map((item, idx) => (
                <NavLink key={idx} item={item} />
              ))}
            </nav>

            {/* Menu Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center gap-2 ml-4 px-4 py-2 hover:opacity-70 transition-opacity"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </motion.div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden w-full h-20 flex items-center justify-between px-4">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="flex-1"
          ></motion.div>
          <motion.img
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
            src="/Wingspann Logo.png"
            alt="Wingspann Global"
            className="h-10"
          />
          <motion.button
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex-1 flex justify-end"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-black" /> : <Menu className="w-6 h-6 text-black" />}
          </motion.button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-gradient-to-br from-gray-400 to-gray-500 border-b border-gray-300 shadow-lg z-40">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item, idx) => (
                <div key={idx}>
                  {item.submenu ? (
                    <>
                      <button
                        onClick={() => setExpandedMobileMenu(expandedMobileMenu === item.label ? null : item.label)}
                        className="w-full text-left py-2 px-3 text-sm font-bold tracking-wider text-black hover:bg-gray-300 transition-colors rounded flex items-center justify-between"
                      >
                        {item.label.toUpperCase()}
                        <span className="text-sm">
                          {expandedMobileMenu === item.label ? '-' : '+'}
                        </span>
                      </button>
                      {expandedMobileMenu === item.label && (
                        <div className="pl-4 space-y-1 mt-2">
                          {item.submenu.map((subitem, subIdx) => (
                            <a
                              key={subIdx}
                              href={subitem.href}
                              className="block py-2 px-3 text-xs font-bold tracking-wider text-black hover:bg-gray-300 transition-colors rounded"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {subitem.label.toUpperCase()}
                            </a>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <a
                      href={item.href}
                      className="block py-2 px-3 text-sm font-bold tracking-wider text-black hover:bg-gray-300 transition-colors rounded"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label.toUpperCase()}
                    </a>
                  )}
                </div>
              ))}

              <hr className="border-gray-300 my-3" />

              {/* Additional Links */}
              {additionalLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  className="block py-2 px-3 text-sm font-bold tracking-wider text-black hover:bg-gray-300 transition-colors rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label.toUpperCase()}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Desktop Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="hidden md:block absolute top-20 right-0 w-56 bg-gradient-to-br from-gray-400 to-gray-500 border border-gray-300 shadow-2xl z-40">
            <div className="p-4 space-y-2">
              {additionalLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  className="block py-2 px-4 text-sm font-bold tracking-wider text-black hover:bg-gray-300 transition-colors rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label.toUpperCase()}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
