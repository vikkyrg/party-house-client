import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, History } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 18);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  const handleBrandClick = (event) => {
    if (location.pathname === '/') {
      event.preventDefault();
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  };

  const navLinks = [
    { name: 'Theaters', path: '/theaters' },
    { name: 'Cities', path: '/cities' },
    { name: 'Events', path: '/events' },
    { name: 'How it works', path: '/#how-it-works' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'border-b border-white/5 bg-background/80 py-3 shadow-lg shadow-black/20 backdrop-blur-xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" onClick={handleBrandClick} className="flex items-center gap-3.5 group">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-md transition-all duration-300 group-hover:bg-primary/30 group-hover:blur-lg" />
              <img
                src="/logo.png"
                alt="CS Cinemas logo"
                className="relative z-10 h-11 w-11 rounded-full border border-primary/20 object-cover shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:border-primary/40"
              />
            </div>
            <div className="hidden sm:block">
              <div className="bg-gradient-to-br from-white to-white/70 bg-clip-text text-xl font-bold tracking-[0.15em] text-transparent">CS</div>
              <div className="-mt-0.5 text-[10px] font-semibold uppercase tracking-[0.35em] text-primary/90">Cinemas</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.path.includes('#') ? false : location.pathname.startsWith(link.path));
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={scrollToTop}
                  className={`relative text-sm font-medium transition-colors ${
                    isActive ? 'text-primary' : 'text-text-muted hover:text-white'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div layoutId="activeNav" className="absolute -bottom-2 left-0 right-0 h-[2px] rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/cities" className="hidden rounded-full border border-white/10 bg-white/[0.02] px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-text-muted transition-colors hover:border-primary/40 hover:text-white lg:inline-flex">
              City: Bengaluru
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-1.5 transition-colors hover:border-primary/40 hover:bg-primary/5"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                    {user?.name?.[0] || 'U'}
                  </div>
                  <span className="hidden text-sm font-medium text-white sm:block">{user?.name?.split(' ')[0] || 'Account'}</span>
                </button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#151518]/95 p-1 shadow-2xl"
                    >
                      <div className="border-b border-white/10 px-4 py-3">
                        <p className="truncate text-sm font-semibold text-white">{user?.name}</p>
                        <p className="truncate text-xs text-text-muted">{user?.email}</p>
                      </div>
                      <Link to="/account/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-muted transition-colors hover:bg-white/5 hover:text-white">
                        <User className="h-4 w-4" /> Profile
                      </Link>
                      <Link to="/account/bookings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-muted transition-colors hover:bg-white/5 hover:text-white">
                        <History className="h-4 w-4" /> My bookings
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                        }}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-error transition-colors hover:bg-error/10"
                      >
                        <LogOut className="h-4 w-4" /> Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="hidden rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-[#111111] shadow-[0_12px_24px_rgba(214,168,79,0.22)] transition-colors hover:bg-primary-hover md:inline-flex">
                Sign in
              </Link>
            )}

            <button
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] text-white md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/10 bg-background/90 md:hidden backdrop-blur-xl"
          >
            <div className="container space-y-4 px-4 py-5">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.path} onClick={scrollToTop} className="block text-base font-medium text-text-muted hover:text-white">
                  {link.name}
                </Link>
              ))}
              {!isAuthenticated && (
                <Link to="/login" className="mt-2 flex h-12 w-full items-center justify-center rounded-xl bg-primary font-semibold text-[#111111]">
                  Sign in
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
