import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, History, MapPin } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > 100 && latest > previous) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setIsScrolled(latest > 50);
  });

  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  const handleBrandClick = (event) => {
    if (location.pathname === '/') {
      event.preventDefault();
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  };

  const navLinks = [
    { name: 'Theaters', path: '/theaters' },
    { name: 'Cities', path: '/cities' },
    { name: 'Events', path: '/events' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" }
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`fixed top-0 left-0 right-0 z-50 pt-[env(safe-area-inset-top,0px)] transition-colors duration-500 ${
        isScrolled 
          ? 'bg-surface/85 backdrop-blur-xl shadow-[0_1px_12px_rgba(217,119,6,0.06)]' 
          : 'bg-surface/50 backdrop-blur-sm'
      }`}
    >
      <div className="h-16 w-full max-w-[1440px] mx-auto px-5 md:px-8 flex items-center justify-between gap-2">
          
          {/* BRAND */}
          <div className="flex items-center gap-2">
            <Link to="/" onClick={handleBrandClick} className="flex items-center gap-2 shrink-0">
              <img src="/logo.png" alt="CS Cinemas" className="h-8 w-auto object-contain" />
              <div className="flex flex-col">
                <span className="text-[16px] font-heading font-black tracking-[0.1em] uppercase leading-[1.2] text-[#1a1c21]">Party House</span>
                <span className="text-[9px] font-sans text-[#a86523] tracking-[0.35em] uppercase mt-0.5 font-bold">CS Cinemas</span>
              </div>
            </Link>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive =
                location.pathname === link.path ||
                (!link.path.includes('#') && link.path !== '/' && location.pathname.startsWith(link.path));

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={scrollToTop}
                  className={`text-sm font-bold tracking-[0.02em] transition-colors duration-300 ${
                    isActive ? 'text-primary' : 'text-on-surface hover:text-primary'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <Link
              to="/theaters"
              className="hidden sm:inline-flex items-center gap-1.5 bg-primary text-on-primary px-4 py-1.5 rounded-full text-[11px] leading-[14px] font-bold tracking-[0.06em] shadow-[0_4px_14px_rgba(217,119,6,0.25)] hover:bg-primary-container transition-colors uppercase"
            >
              Book Mini
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 hover:bg-primary-container transition-colors"
                >
                  <User className="h-4 w-4 text-on-primary" />
                </button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-surface-container-lowest border border-surface-variant rounded-xl p-2 shadow-[0_12px_36px_rgba(38,28,20,0.06),0_4px_12px_rgba(217,119,6,0.08)]"
                    >
                      <div className="px-4 py-3 border-b border-surface-variant mb-2">
                        <p className="text-sm font-bold text-on-surface truncate">{user?.name}</p>
                        <p className="text-xs text-on-surface-variant truncate mt-1">{user?.email}</p>
                      </div>
                      <Link
                        to="/account/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-on-surface-variant hover:bg-surface-container hover:text-primary rounded-lg transition-colors"
                      >
                        <User className="h-4 w-4" /> Profile
                      </Link>
                      <Link
                        to="/account/bookings"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-on-surface-variant hover:bg-surface-container hover:text-primary rounded-lg transition-colors"
                      >
                        <History className="h-4 w-4" /> Bookings
                      </Link>
                      <div className="border-t border-surface-variant mt-2 pt-2">
                        <button
                          onClick={() => {
                            logout();
                            setProfileDropdownOpen(false);
                          }}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-bold text-error hover:bg-error-container hover:text-on-error-container rounded-lg transition-colors"
                        >
                          <LogOut className="h-4 w-4" /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 hover:bg-primary-container transition-colors"
              >
                <User className="h-4 w-4 text-on-primary" />
              </Link>
            )}

            <button
              className="md:hidden text-primary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-surface-container-lowest border-t border-surface-variant shadow-lg"
          >
            <div className="px-5 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={scrollToTop}
                  className="block text-lg font-bold text-on-surface-variant hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-surface-variant flex flex-col gap-3">
                <Link
                  to="/theaters"
                  className="flex w-full items-center justify-center h-12 bg-primary text-on-primary rounded-xl font-bold uppercase tracking-[0.06em] text-[11px] shadow-sm"
                >
                  Book Mini
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
