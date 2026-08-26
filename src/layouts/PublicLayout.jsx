import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";

export default function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timeString, setTimeString] = useState("");
  const location = useLocation();

  useEffect(() => {
    // Technical touch: Keep a ticking local timezone clock
    const updateClock = () => {
      const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
      setTimeString(new Intl.DateTimeFormat('en-US', options).format(new Date()));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { label: "Work", path: "/work" },
    { label: "About", path: "/about" },
    { label: "Automation", path: "/automation" },
    { label: "Contact", path: "/contact" }
  ];

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col font-sans relative selection:bg-accent-600 selection:text-white">
      {/* Background grid lines for handcrafted look */}
      <div className="absolute inset-0 grid-lines pointer-events-none z-0 opacity-[0.4]" />

      {/* Dynamic Header / Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-neutral-200/60 bg-neutral-50/70 backdrop-blur-md">
        <div className="container mx-auto max-w-6xl h-16 flex items-center justify-between px-6">
          <Link 
            to="/" 
            className="font-display font-bold tracking-tight text-neutral-900 hover:text-accent-600 transition-colors flex items-center gap-1.5"
          >
            <span>SAAD SAEED</span>
            <span className="w-1.5 h-1.5 bg-accent-600 rounded-full inline-block animate-pulse" />
          </Link>

          {/* Desktop Nav links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link, idx) => (
              <Link
                key={idx}
                to={link.path}
                className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors relative py-1 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-neutral-900 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
            <Link 
              to="/contact" 
              className="text-xs font-semibold uppercase tracking-wider bg-neutral-900 text-white px-4 py-2 hover:bg-neutral-800 transition-colors inline-flex items-center gap-1"
            >
              Let's Talk
              <ArrowUpRight size={12} />
            </Link>
          </nav>

          {/* Hamburger */}
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-neutral-950/20 backdrop-blur-xs z-40 md:hidden"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 right-0 w-full max-w-xs bg-white border-l border-neutral-200 z-50 p-6 flex flex-col justify-between md:hidden"
            >
              <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-900">SAAD SAEED</span>
                  <button onClick={() => setMobileMenuOpen(false)} className="text-neutral-500 hover:text-neutral-900">
                    <X size={22} />
                  </button>
                </div>
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link, idx) => (
                    <Link
                      key={idx}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-lg font-medium text-neutral-800 hover:text-neutral-950"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>

              <div>
                <Link 
                  to="/contact" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center block bg-neutral-900 text-white py-3 rounded-md font-semibold text-sm hover:bg-neutral-800 transition-colors"
                >
                  Let's Talk
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Workspace with Page Transition Fade-In */}
      <main className="flex-1 relative z-10 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex-1 flex flex-col justify-center"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Public Footer */}
      <footer className="border-t border-neutral-200/80 py-8 relative z-10 bg-white">
        <div className="container mx-auto max-w-6xl px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500 font-medium">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <span className="text-neutral-900 font-bold">&copy; {new Date().getFullYear()} SAAD SAEED.</span>
            <span className="hidden md:inline text-neutral-300">|</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block animate-ping" />
              AVAILABLE FOR NEW ROLES
            </span>
          </div>

          <div className="flex items-center gap-6">
            <span>GMT/UTC: {timeString}</span>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900 transition-colors">GITHUB</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900 transition-colors">LINKEDIN</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
