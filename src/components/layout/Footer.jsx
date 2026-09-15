import { Link } from 'react-router-dom';
import { Camera, Send, Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  };

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#09090b] pt-20 pb-10">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute -top-24 left-1/2 h-52 w-[520px] -translate-x-1/2 rounded-full bg-primary/10 blur-[110px]" />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="mb-16 grid gap-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link to="/" onClick={scrollToTop} className="mb-6 inline-flex items-center gap-3 group">
              <img
                src="/logo.png"
                alt="CS Cinemas logo"
                className="h-12 w-12 rounded-xl object-cover shadow-[0_10px_24px_rgba(214,168,79,0.22)]"
              />
              <div>
                <div className="text-xl font-semibold tracking-[0.18em] text-white">CS</div>
                <div className="-mt-1 text-[10px] uppercase tracking-[0.32em] text-text-muted">Cinemas</div>
              </div>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-text-muted">
              Private theater celebrations designed for birthdays, anniversaries, date nights, and surprise moments that deserve a little more ceremony.
            </p>
            <div className="mt-7 flex items-center gap-3">
              {[Camera, Send, Mail].map((Icon, index) => (
                <a key={index} href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-text-muted transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="mb-6 text-xs font-semibold uppercase tracking-[0.28em] text-white/70">Explore</h4>
            <ul className="space-y-4 text-sm text-text-muted">
              <li><Link to="/theaters" onClick={scrollToTop} className="hover:text-white">Private theaters</Link></li>
              <li><Link to="/cities" onClick={scrollToTop} className="hover:text-white">Cities</Link></li>
              <li><Link to="/events" onClick={scrollToTop} className="hover:text-white">Celebrations</Link></li>
              <li><Link to="/offers" onClick={scrollToTop} className="hover:text-white">Offers</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="mb-6 text-xs font-semibold uppercase tracking-[0.28em] text-white/70">Support</h4>
            <ul className="space-y-4 text-sm text-text-muted">
              <li><Link to="/faq" onClick={scrollToTop} className="hover:text-white">FAQ</Link></li>
              <li><Link to="/contact" onClick={scrollToTop} className="hover:text-white">Contact</Link></li>
              <li><Link to="/account/bookings" onClick={scrollToTop} className="hover:text-white">Manage booking</Link></li>
              <li><Link to="/terms" onClick={scrollToTop} className="hover:text-white">Terms</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="mb-6 text-xs font-semibold uppercase tracking-[0.28em] text-white/70">Contact</h4>
            <ul className="space-y-4 text-sm text-text-muted">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <a href="mailto:riopartyhouse@gmail.com" className="hover:text-white">riopartyhouse@gmail.com</a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <a href="tel:+918147897771" className="hover:text-white">+91 8147 897771</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>3rd Floor, Prestige Towers,<br />Bengaluru, Karnataka</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-text-muted md:flex-row">
          <p>© {new Date().getFullYear()} CS Cinemas. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" onClick={scrollToTop} className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms" onClick={scrollToTop} className="hover:text-white">Terms</Link>
            <Link to="/faq" onClick={scrollToTop} className="hover:text-white">Help</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
