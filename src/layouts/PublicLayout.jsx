import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

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
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans relative selection:bg-accent-600 selection:text-white transition-colors duration-200">
      {/* Centered Content Frame with border-x */}
      <div className="container mx-auto max-w-5xl flex-1 flex flex-col border-x border-neutral-900/10 dark:border-neutral-800 px-0">
        
        {/* Header / Navbar */}
        <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md border-b border-neutral-900/5 dark:border-neutral-800 transition-colors duration-200">
          <div className="h-20 flex items-center justify-between px-4 sm:px-12">
            <Link 
              to="/" 
              className="text-lg font-bold tracking-tight text-neutral-950 dark:text-white hover:opacity-80 transition-opacity uppercase"
            >
              SAAD SAEED
            </Link>

            {/* Desktop Nav links */}
            <nav className="hidden md:flex items-center gap-7">
              {navLinks.map((link, idx) => (
                <Link
                  key={idx}
                  to={link.path}
                  className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors relative py-1"
                >
                  {link.label}
                </Link>
              ))}

              {/* Theme Toggle Button */}
              <ThemeToggle />
              
              {/* Premium Gradient sliding button */}
              <Link 
                to="/contact" 
                className="relative p-[1px] overflow-hidden rounded-full group inline-block focus:outline-none"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-violet-500 via-amber-400 to-violet-500 rounded-full" />
                <span className="relative block px-5 py-2 bg-neutral-950 dark:bg-neutral-900 text-white hover:bg-neutral-900 dark:hover:bg-neutral-800 text-xs font-semibold rounded-full uppercase tracking-wider transition-colors">
                  Get in touch
                </span>
              </Link>
            </nav>

            {/* Mobile Controls (Theme Toggle + Hamburger) */}
            <div className="flex md:hidden items-center gap-2">
              <ThemeToggle />
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors"
                aria-label="Open menu"
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </header>

        {/* Blueprint Divider Spacer */}
        <div className="divider-block" />

        {/* Main Workspace with Page Transition */}
        <main className="flex-1 bg-white dark:bg-neutral-950 flex flex-col transition-colors duration-200">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full flex-1 flex flex-col"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Blueprint Divider Spacer */}
        <div className="divider-block" />

        {/* Public Footer */}
        <footer className="py-12 bg-white dark:bg-neutral-950 px-4 sm:px-12 text-xs text-neutral-600 dark:text-neutral-400 font-medium transition-colors duration-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-center md:text-left">
              <span className="text-neutral-950 dark:text-white font-bold uppercase">&copy; {new Date().getFullYear()} SAAD SAEED.</span>
              <span className="hidden md:inline text-neutral-200 dark:text-neutral-800">|</span>
              <span className="flex items-center gap-1.5 font-semibold">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-pulse" />
                AVAILABLE FOR NEW ROLES
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6">
              <span>LOCAL TIME: {timeString}</span>
              <span className="text-neutral-200 dark:text-neutral-800">|</span>
              <a href="https://github.com/saadsaed" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-950 dark:hover:text-white uppercase transition-colors">GITHUB</a>
              <a href="https://linkedin.com/in/saadsaeed7" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-950 dark:hover:text-white uppercase transition-colors">LINKEDIN</a>
            </div>
          </div>
        </footer>

      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-neutral-950/40 backdrop-blur-xs z-40 md:hidden"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 right-0 w-full max-w-xs bg-white dark:bg-neutral-950 border-l border-neutral-200 dark:border-neutral-800 z-50 p-6 flex flex-col justify-between md:hidden"
            >
              <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-950 dark:text-white uppercase tracking-tight">SAAD SAEED</span>
                  <button onClick={() => setMobileMenuOpen(false)} className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white">
                    <X size={22} />
                  </button>
                </div>
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link, idx) => (
                    <Link
                      key={idx}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-sm font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white"
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
                  className="w-full text-center block bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 py-3 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-neutral-900 dark:hover:bg-neutral-200 transition-colors"
                >
                  Let's Talk
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
