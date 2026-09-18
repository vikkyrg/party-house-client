import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, History, ChevronDown, MapPin } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  
  // States for desktop dropdowns
  const [activeDropdown, setActiveDropdown] = useState(null);

  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > 100 && latest > previous) {
      setHidden(true);
      setActiveDropdown(null);
    } else {
      setHidden(false);
    }
    setIsScrolled(latest > 50);
  });

  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    setActiveDropdown(null);
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

  const learnLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Founders', path: '/founders' },
    { name: 'Franchise', path: '/franchise' },
    { name: 'List Your Venue', path: '/list-venue' },
    { name: 'FAQs', path: '/faq' },
    { name: 'Refund Policy', path: '/refund-policy' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'T&C', path: '/terms' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'Join Waitlist', path: '/waitlist' },
  ];

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Location', path: '#location', hasDropdown: true, dropdownId: 'location' },
    { name: 'Our Services', path: '/services' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Our stories - blogs', path: '/blogs' },
    { name: 'Learn', path: '#learn', hasDropdown: true, dropdownId: 'learn' },
    { name: 'My Bookings', path: '/account/bookings' },
  ];

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" }
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`fixed top-0 left-0 right-0 z-50 pt-[env(safe-area-inset-top,0px)] bg-white transition-colors duration-500 shadow-sm`}
    >
      <div className="h-[72px] w-full max-w-[1440px] mx-auto px-5 md:px-8 flex items-center justify-between gap-2 relative">
          
          {/* BRAND */}
          <div className="flex items-center gap-3">
            <Link to="/" onClick={handleBrandClick} className="flex items-center gap-3 shrink-0 group">
              <img src="/logo.png" alt="Logo" className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
              <div className="flex flex-col">
                <span className="text-[20px] font-heading font-black tracking-[0.12em] uppercase leading-[1.1] text-[#1a1c21] hidden sm:block">Party House</span>
              </div>
            </Link>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-7 flex-1 justify-center relative">
            {navLinks.map((link) => {
              const isActive = link.path === '/' 
                ? location.pathname === '/' 
                : location.pathname.startsWith(link.path) && link.path !== '#' && link.path !== '#location' && link.path !== '#learn';

              return (
                <div 
                  key={link.name}
                  className="relative group h-[72px] flex items-center"
                  onMouseEnter={() => link.hasDropdown && setActiveDropdown(link.dropdownId)}
                  onMouseLeave={() => link.hasDropdown && setActiveDropdown(null)}
                >
                  <Link
                    to={link.path !== '#location' && link.path !== '#learn' ? link.path : '#'}
                    onClick={(e) => {
                      if (link.path === '#location' || link.path === '#learn') {
                        e.preventDefault();
                      } else {
                        scrollToTop();
                      }
                    }}
                    className={`flex items-center gap-1.5 text-[14px] transition-all duration-300 ${
                      isActive 
                        ? 'bg-[#322a59] text-white px-5 py-2 rounded-full font-semibold shadow-md' 
                        : 'text-[#181533] font-medium hover:text-[#322a59]'
                    }`}
                  >
                    {link.name}
                    {link.hasDropdown && <ChevronDown className="h-4 w-4 opacity-80" strokeWidth={2.5} />}
                  </Link>

                  {/* Dropdowns */}
                  {link.dropdownId === 'location' && activeDropdown === 'location' && (
                    <div className="absolute top-[70px] left-1/2 -translate-x-1/2 w-80 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      <div className="p-4">
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Currently available in</h4>
                        <Link to="/cities?location=bengaluru" onClick={scrollToTop} className="group/loc flex flex-col gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="h-32 w-full rounded-md overflow-hidden bg-gray-200 relative">
                            <img src="https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&q=80" alt="Bengaluru" className="w-full h-full object-cover group-hover/loc:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white font-bold">
                              <MapPin className="w-4 h-4" /> Bengaluru
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 px-1">Explore our exclusive party venues in the IT capital.</p>
                        </Link>
                      </div>
                    </div>
                  )}

                  {link.dropdownId === 'learn' && activeDropdown === 'learn' && (
                    <div className="absolute top-[70px] left-0 w-56 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      {learnLinks.map((learnLink) => (
                        <Link
                          key={learnLink.name}
                          to={learnLink.path}
                          onClick={scrollToTop}
                          className="block px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#322a59] transition-colors"
                        >
                          {learnLink.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-3 md:gap-5 shrink-0">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="w-10 h-10 rounded-full bg-[#322a59] flex items-center justify-center shrink-0 hover:bg-[#1f1a38] transition-colors shadow-md"
                >
                  <User className="h-5 w-5 text-white" />
                </button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl p-2 shadow-xl"
                    >
                      <div className="px-4 py-3 border-b border-gray-100 mb-2">
                        <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate mt-1">{user?.email}</p>
                      </div>
                      <Link
                        to="/account/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#322a59] rounded-lg transition-colors"
                      >
                        <User className="h-4 w-4" /> Profile
                      </Link>
                      <Link
                        to="/account/bookings"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#322a59] rounded-lg transition-colors"
                      >
                        <History className="h-4 w-4" /> Bookings
                      </Link>
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button
                          onClick={() => {
                            logout();
                            setProfileDropdownOpen(false);
                          }}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-bold text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
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
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0 hover:bg-gray-200 transition-colors hidden sm:flex"
              >
                <User className="h-5 w-5 text-gray-600" />
              </Link>
            )}

            <Link
              to="/book"
              className="hidden sm:inline-flex items-center justify-center bg-[#322a59] text-white px-7 py-2.5 rounded-full text-[15px] font-semibold shadow-md hover:bg-[#1f1a38] transition-colors"
            >
              Book Now
            </Link>

            <button
              className="lg:hidden text-[#322a59]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
        
      {/* GRADIENT BOTTOM BAR */}
      <div className="h-2 w-full bg-gradient-to-r from-[#202f5a] via-[#852834] to-[#f39c28]"></div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 shadow-xl overflow-hidden h-[calc(100vh-80px)] overflow-y-auto pb-20"
          >
            <div className="px-5 py-6 flex flex-col gap-3">
              {navLinks.map((link) => (
                <div key={link.name} className="flex flex-col border-b border-gray-50">
                  <Link
                    to={link.path !== '#location' && link.path !== '#learn' ? link.path : '#'}
                    onClick={(e) => {
                      if (link.path !== '#location' && link.path !== '#learn') {
                        scrollToTop();
                      } else {
                        e.preventDefault();
                        setActiveDropdown(activeDropdown === link.dropdownId ? null : link.dropdownId);
                      }
                    }}
                    className="flex items-center justify-between text-base font-medium text-[#181533] hover:text-[#322a59] transition-colors py-3"
                  >
                    {link.name}
                    {link.hasDropdown && <ChevronDown className={`h-4 w-4 opacity-50 transition-transform ${activeDropdown === link.dropdownId ? 'rotate-180' : ''}`} />}
                  </Link>

                  {/* Mobile Dropdowns */}
                  <AnimatePresence>
                    {link.hasDropdown && activeDropdown === link.dropdownId && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pl-4 pb-3 flex flex-col gap-2 overflow-hidden"
                      >
                        {link.dropdownId === 'location' && (
                           <Link to="/cities?location=bengaluru" onClick={scrollToTop} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                             <div className="w-12 h-12 rounded-md overflow-hidden">
                               <img src="https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=200&q=80" alt="Bengaluru" className="w-full h-full object-cover" />
                             </div>
                             <div>
                               <p className="font-bold text-sm text-[#181533]">Bengaluru</p>
                               <p className="text-xs text-gray-500">Explore venues</p>
                             </div>
                           </Link>
                        )}
                        {link.dropdownId === 'learn' && learnLinks.map((learnLink) => (
                          <Link
                            key={learnLink.name}
                            to={learnLink.path}
                            onClick={scrollToTop}
                            className="block py-2 text-sm text-gray-600 hover:text-[#322a59]"
                          >
                            {learnLink.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              <div className="pt-6 flex flex-col gap-3">
                <Link
                  to="/book"
                  className="flex w-full items-center justify-center h-12 bg-[#322a59] text-white rounded-full font-semibold shadow-sm text-base"
                >
                  Book Now
                </Link>
                {!isAuthenticated && (
                   <Link
                   to="/login"
                   className="flex w-full items-center justify-center h-12 bg-gray-100 text-gray-800 rounded-full font-medium shadow-sm text-base"
                 >
                   Log In
                 </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
