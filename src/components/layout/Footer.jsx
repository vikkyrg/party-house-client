import { Link } from 'react-router-dom';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-surface-strong pt-24 pb-12 border-t border-white/5">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-12 mb-20">
          
          <div className="lg:col-span-4">
            <Link to="/" onClick={scrollToTop} className="inline-flex items-center gap-4 mb-8">
              <img src="/logo.png" alt="CS Cinemas" className="h-12 w-auto" />
              <div className="flex flex-col">
                <span className="text-2xl font-heading text-white tracking-widest uppercase leading-none">Party House</span>
                <span className="text-[10px] font-sans text-primary tracking-[0.3em] uppercase mt-2">CS Cinemas</span>
              </div>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed max-w-sm">
              Handcrafted private cinema rooms for birthdays, anniversaries, date nights, and surprise celebrations that deserve an unforgettable screen moment.
            </p>
          </div>

          <div className="lg:col-span-2 lg:col-start-7">
            <h4 className="text-xs font-sans tracking-[0.2em] uppercase text-white mb-6">Explore</h4>
            <ul className="space-y-4 text-sm font-sans text-text-muted">
              <li><Link to="/theaters" onClick={scrollToTop} className="hover:text-white transition-colors">Theaters</Link></li>
              <li><Link to="/cities" onClick={scrollToTop} className="hover:text-white transition-colors">Locations</Link></li>
              <li><Link to="/events" onClick={scrollToTop} className="hover:text-white transition-colors">Occasions</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-xs font-sans tracking-[0.2em] uppercase text-white mb-6">Support</h4>
            <ul className="space-y-4 text-sm font-sans text-text-muted">
              <li><Link to="/faq" onClick={scrollToTop} className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/contact" onClick={scrollToTop} className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/account/bookings" onClick={scrollToTop} className="hover:text-white transition-colors">Bookings</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-xs font-sans tracking-[0.2em] uppercase text-white mb-6">Connect</h4>
            <ul className="space-y-4 text-sm font-sans text-text-muted">
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Telegram</a></li>
              <li><a href="mailto:riopartyhouse@gmail.com" className="hover:text-white transition-colors">Email</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-sans text-text-muted">
          <p>© {new Date().getFullYear()} CS Cinemas. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <Link to="/privacy" onClick={scrollToTop} className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" onClick={scrollToTop} className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
