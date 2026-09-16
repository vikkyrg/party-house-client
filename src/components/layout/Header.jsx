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
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 border-b ${
        isScrolled 
          ? 'bg-background/90 backdrop-blur-md border-white/5 shadow-lg py-4' 
          : 'bg-transparent border-transparent py-6'
      }`}
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between">
          
          {/* BRAND */}
          <Link to="/" onClick={handleBrandClick} className="flex items-center gap-3 shrink-0">
            <img src="/logo.png" alt="CS Cinemas" className="h-10 w-auto" />
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-heading text-white tracking-widest uppercase leading-none whitespace-nowrap">Party House</span>
              <span className="text-[8px] md:text-[10px] font-sans text-primary tracking-[0.3em] uppercase mt-1 whitespace-nowrap">CS Cinemas</span>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive =
                location.pathname === link.path ||
                (!link.path.includes('#') && link.path !== '/' && location.pathname.startsWith(link.path));

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={scrollToTop}
                  className={`text-sm font-sans tracking-wide transition-colors duration-300 ${
                    isActive ? 'text-white' : 'text-text-muted hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-4 md:gap-6 shrink-0">
            <Link
              to="/cities"
              className="hidden lg:flex items-center gap-1.5 text-xs font-sans tracking-widest uppercase text-text-muted hover:text-white transition-colors"
            >
              <MapPin className="h-3.5 w-3.5" />
              <span>Bengaluru</span>
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 text-sm font-sans text-white hover:text-text-muted transition-colors"
                >
                  <span className="hidden sm:block">{user?.name?.split(' ')[0] || 'Account'}</span>
                  <div className="h-8 w-8 rounded-full bg-surface-strong border border-white/10 flex items-center justify-center text-xs">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                </button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-4 w-56 bg-[#151515] border border-white/10 p-2 shadow-2xl"
                    >
                      <div className="px-4 py-3 border-b border-white/5 mb-2">
                        <p className="text-sm text-white truncate">{user?.name}</p>
                        <p className="text-xs text-text-muted truncate mt-1">{user?.email}</p>
                      </div>
                      <Link
                        to="/account/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-muted hover:bg-white/5 hover:text-white transition-colors"
                      >
                        <User className="h-4 w-4" /> Profile
                      </Link>
                      <Link
                        to="/account/bookings"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-muted hover:bg-white/5 hover:text-white transition-colors"
                      >
                        <History className="h-4 w-4" /> Bookings
                      </Link>
                      <div className="border-t border-white/5 mt-2 pt-2">
                        <button
                          onClick={() => {
                            logout();
                            setProfileDropdownOpen(false);
                          }}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-error hover:bg-error/10 transition-colors"
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
                className="hidden md:inline-flex items-center justify-center px-6 h-10 bg-primary text-background text-sm font-sans font-medium hover:bg-primary-hover transition-colors"
              >
                Plan a Screening
              </Link>
            )}

            <button
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#080808] border-t border-white/5 mt-4"
          >
            <div className="px-6 py-6 space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={scrollToTop}
                  className="block text-lg font-sans text-text-muted hover:text-white"
                >
                  {link.name}
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="pt-4 border-t border-white/5">
                  <Link
                    to="/login"
                    className="flex w-full items-center justify-center h-12 bg-primary text-background text-sm font-medium"
                  >
                    Plan a Screening
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
