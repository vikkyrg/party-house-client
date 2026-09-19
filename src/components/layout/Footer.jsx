import { Link } from 'react-router-dom';
import { 
  MapPin, Calendar, Heart, Shield, HelpCircle, 
  Headphones, MessageSquare, Ticket, Mail, Lock, 
  Film, Users, Send, ArrowUp,
  Monitor
} from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-b from-[#FAF4ED] to-[#FCF5EB] pt-20 pb-8 relative overflow-hidden text-[#6b5c52]">
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute w-full h-full opacity-[0.35]" xmlns="http://www.w3.org/2000/svg">
          {/* Top Right Film Strip */}
          <g>
            <circle cx="100%" cy="0" r="550" fill="none" stroke="#eaddd0" strokeWidth="50" />
            <circle cx="100%" cy="0" r="535" fill="none" stroke="#FAF4ED" strokeWidth="12" strokeDasharray="15 15" />
            <circle cx="100%" cy="0" r="565" fill="none" stroke="#FAF4ED" strokeWidth="12" strokeDasharray="15 15" />
          </g>
          {/* Top Left Film Strip */}
          <g>
            <circle cx="0" cy="0" r="400" fill="none" stroke="#eaddd0" strokeWidth="60" />
            <circle cx="0" cy="0" r="380" fill="none" stroke="#FAF4ED" strokeWidth="12" strokeDasharray="15 15" />
            <circle cx="0" cy="0" r="420" fill="none" stroke="#FAF4ED" strokeWidth="12" strokeDasharray="15 15" />
          </g>
        </svg>
      </div>

      <div className="w-full mx-auto px-6 md:px-10 lg:px-16 xl:px-20 relative z-10 max-w-[1920px]">
        <div className="flex flex-col xl:flex-row justify-between gap-12 xl:gap-8 mb-12">
          
          {/* Left Column - Branding */}
          <div className="xl:w-[33%] flex flex-col relative pr-4">
            <Link to="/" onClick={scrollToTop} className="inline-flex items-center gap-0 mb-8">
              <img src="/logo.png" alt="Rio Party House" className="h-[74px] w-[87px] object-contain" />
              <div className="-ml-4 flex w-[140px] flex-col items-center justify-center leading-none">
                <span className="block text-center text-[28px] font-heading font-black tracking-[0.18em] leading-none text-[#ad641b]">RIO</span>
                <span className="mt-2.5 block whitespace-nowrap text-center text-[12px] font-heading font-extrabold tracking-[0.16em] leading-none text-[#17243d]">PARTY HOUSE</span>
              </div>
            </Link>
            
            <h3 className="text-[32px] font-heading font-extrabold leading-[1.2] mb-5 text-[#1a1c21]">
              More Than Movies, <br/>
              <span className="bg-gradient-to-r from-[#d18428] to-[#991c4d] bg-clip-text text-transparent">Memories Together.</span>
            </h3>
            
            <p className="text-[#6b5c52] font-medium text-[13px] leading-[1.8] max-w-[380px] mb-8">
              Handcrafted private cinema rooms for birthdays, anniversaries, date nights, and surprise celebrations that deserve an unforgettable screen moment.
            </p>
            
            {/* Badges */}
            <div className="flex items-center gap-8 mb-4">
              <div className="flex items-center gap-2">
                <div className="grid grid-cols-3 gap-[2px] w-5 h-5 text-[#8c5211] p-0.5 opacity-90">
                   {[...Array(9)].map((_, i) => <div key={i} className="bg-current rounded-[1px]"></div>)}
                </div>
                <span className="text-[10px] font-bold text-[#6b5c52] uppercase leading-[1.2]">PRIVATE<br/>THEATERS</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#8c5211] opacity-90" />
                <span className="text-[10px] font-bold text-[#6b5c52] uppercase leading-[1.2]">SPECIAL<br/>OCCASIONS</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#8c5211] opacity-90" />
                <span className="text-[10px] font-bold text-[#6b5c52] uppercase leading-[1.2]">UNFORGETTABLE<br/>EXPERIENCES</span>
              </div>
            </div>

            {/* Graphics & Cursive Text */}
            <div className="relative h-10 w-full mt-2">
              <img 
                src="/popcorn.png" 
                alt="" 
                className="absolute -bottom-24 -left-8 w-56 h-auto object-contain z-20 pointer-events-none"
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
          </div>

          {/* Middle Columns - Links */}
          <div className="xl:w-[42%] flex justify-center gap-10 sm:gap-16 xl:gap-14 pt-2">
            {/* Explore */}
            <div className="flex-1 max-w-[140px]">
              <h4 className="text-[11px] font-sans font-bold tracking-[0.15em] uppercase text-[#8c5211] mb-6 flex flex-col gap-3">
                EXPLORE
                <span className="w-6 h-[2px] bg-[#b88c60] rounded-full"></span>
              </h4>
              <ul className="space-y-4 text-[13px] font-sans font-medium text-[#6b5c52]">
                <li><Link to="/theaters" onClick={scrollToTop} className="hover:text-primary transition-colors flex items-center gap-3"><Monitor className="w-[18px] h-[18px] text-[#8c5211] opacity-70 stroke-[1.5]" /> Theaters</Link></li>
                <li><Link to="/cities" onClick={scrollToTop} className="hover:text-primary transition-colors flex items-center gap-3"><MapPin className="w-[18px] h-[18px] text-[#8c5211] opacity-70 stroke-[1.5]" /> Locations</Link></li>
                <li><Link to="/events" onClick={scrollToTop} className="hover:text-primary transition-colors flex items-center gap-3"><Calendar className="w-[18px] h-[18px] text-[#8c5211] opacity-70 stroke-[1.5]" /> Occasions</Link></li>
                <li><Link to="/account/bookings" onClick={scrollToTop} className="hover:text-primary transition-colors flex items-center gap-3"><Ticket className="w-[18px] h-[18px] text-[#8c5211] opacity-70 stroke-[1.5]" /> Bookings</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div className="flex-1 max-w-[140px]">
              <h4 className="text-[11px] font-sans font-bold tracking-[0.15em] uppercase text-[#8c5211] mb-6 flex flex-col gap-3">
                SUPPORT
                <span className="w-6 h-[2px] bg-[#b88c60] rounded-full"></span>
              </h4>
              <ul className="space-y-4 text-[13px] font-sans font-medium text-[#6b5c52]">
                <li><Link to="/faq" onClick={scrollToTop} className="hover:text-primary transition-colors flex items-center gap-3"><HelpCircle className="w-[18px] h-[18px] text-[#8c5211] opacity-70 stroke-[1.5]" /> FAQ</Link></li>
                <li><Link to="/contact" onClick={scrollToTop} className="hover:text-primary transition-colors flex items-center gap-3"><Headphones className="w-[18px] h-[18px] text-[#8c5211] opacity-70 stroke-[1.5]" /> Contact</Link></li>
                <li><Link to="/help" onClick={scrollToTop} className="hover:text-primary transition-colors flex items-center gap-3"><MessageSquare className="w-[18px] h-[18px] text-[#8c5211] opacity-70 stroke-[1.5]" /> Help Center</Link></li>
                <li><Link to="/privacy" onClick={scrollToTop} className="hover:text-primary transition-colors flex items-center gap-3"><Shield className="w-[18px] h-[18px] text-[#8c5211] opacity-70 stroke-[1.5]" /> Privacy Policy</Link></li>
              </ul>
            </div>

            {/* Connect */}
            <div className="flex-1 max-w-[140px]">
              <h4 className="text-[11px] font-sans font-bold tracking-[0.15em] uppercase text-[#8c5211] mb-6 flex flex-col gap-3">
                CONNECT
                <span className="w-6 h-[2px] bg-[#b88c60] rounded-full"></span>
              </h4>
              <ul className="space-y-4 text-[13px] font-sans font-medium text-[#6b5c52]">
                <li><a href="#" className="hover:text-primary transition-colors flex items-center gap-3"><svg className="w-[18px] h-[18px] text-[#8c5211] opacity-70" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> Instagram</a></li>
                <li><a href="#" className="hover:text-primary transition-colors flex items-center gap-3"><Send className="w-[18px] h-[18px] text-[#8c5211] opacity-70 stroke-[1.5]" /> Telegram</a></li>
                <li><a href="mailto:riopartyhouse@gmail.com" className="hover:text-primary transition-colors flex items-center gap-3"><Mail className="w-[18px] h-[18px] text-[#8c5211] opacity-70 stroke-[1.5]" /> Email</a></li>
                <li className="flex items-center gap-3 pt-3 text-[#8c5211] font-bold"><MapPin className="w-[18px] h-[18px] opacity-70 stroke-[1.5]" /> Bengaluru, <br/>India</li>
              </ul>
            </div>
          </div>

          {/* Right Column - Newsletter */}
          <div className="xl:w-[25%] border-t xl:border-t-0 xl:border-l border-[#ecdcd1] pt-12 xl:pt-0 xl:pl-10">
            <h4 className="text-[11px] font-sans font-bold tracking-[0.15em] uppercase text-[#8c5211] mb-6 flex flex-col gap-3">
              STAY UPDATED
              <span className="w-6 h-[2px] bg-[#b88c60] rounded-full"></span>
            </h4>
            
            <h5 className="text-[22px] font-heading text-[#1a1c21] font-extrabold mb-3 leading-tight">Be the First to Know</h5>
            <p className="text-[13px] font-medium text-[#6b5c52] leading-[1.7] mb-6 pr-2">
              Get special offers, new locations and exclusive experiences straight to your inbox.
            </p>
            
            {/* Newsletter Input */}
            <div className="relative mb-4 mt-2">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="w-4 h-4 text-[#8c5211] opacity-60" />
              </div>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full pl-11 pr-28 py-3.5 rounded-full border border-[#ecdcd1] bg-white/40 text-[13px] text-[#6b5c52] focus:outline-none focus:border-[#8c5211] transition-colors placeholder:text-[#a6998f]"
              />
              <button className="absolute inset-y-1.5 right-1.5 px-6 rounded-full bg-[#9e6223] text-white text-[12px] font-bold tracking-wide hover:bg-[#7a4b1b] transition-colors">
                Subscribe
              </button>
            </div>
            
            <div className="flex items-center gap-2 text-[11px] font-medium text-[#6b5c52] mb-10">
              <Lock className="w-3 h-3 text-[#8c5211] opacity-60" />
              No spam. Just good vibes and great movies.
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a href="#" className="w-[42px] h-[42px] rounded-full bg-[#f4e6d9] flex items-center justify-center text-[#9e6223] hover:bg-[#9e6223] hover:text-white transition-colors shadow-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="#" className="w-[42px] h-[42px] rounded-full bg-[#f4e6d9] flex items-center justify-center text-[#9e6223] hover:bg-[#9e6223] hover:text-white transition-colors shadow-sm">
                <Send className="w-4 h-4 -ml-[1px] mt-[1px]" />
              </a>
              <a href="#" className="w-[42px] h-[42px] rounded-full bg-[#f4e6d9] flex items-center justify-center text-[#9e6223] hover:bg-[#9e6223] hover:text-white transition-colors shadow-sm">
                <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 00-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.016 3.016 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="#" className="w-[42px] h-[42px] rounded-full bg-[#f4e6d9] flex items-center justify-center text-[#9e6223] hover:bg-[#9e6223] hover:text-white transition-colors shadow-sm">
                <Mail className="w-[18px] h-[18px]" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#ecdcd1] flex flex-col lg:flex-row items-center justify-between gap-6 text-[11.5px] font-sans font-medium text-[#6b5c52]">
          <p>© {new Date().getFullYear()} CS Cinemas. All rights reserved.</p>
          
          <div className="hidden md:flex items-center text-[#8c5211] font-bold tracking-[0.25em] uppercase text-[10px]">
            LIGHTS OFF 
            <div className="w-[3px] h-[3px] bg-[#8c5211] mx-4 rounded-[1px] opacity-60"></div>
            STORIES ON 
            <div className="w-[3px] h-[3px] bg-[#8c5211] mx-4 rounded-[1px] opacity-60"></div>
            MEMORIES FOREVER
          </div>

          <div className="flex items-center gap-4">
            <Link to="/privacy" onClick={scrollToTop} className="hover:text-primary transition-colors">Privacy Policy</Link>
            <span className="opacity-30">|</span>
            <Link to="/terms" onClick={scrollToTop} className="hover:text-primary transition-colors">Terms of Service</Link>
            <span className="opacity-30">|</span>
            <Link to="/sitemap" onClick={scrollToTop} className="hover:text-primary transition-colors">Sitemap</Link>
            
            <button onClick={scrollToTop} className="ml-4 w-auto px-5 h-[36px] rounded-full bg-[#f4e6d9] flex items-center justify-center text-[#9e6223] hover:bg-[#9e6223] hover:text-white transition-colors gap-2 shadow-sm font-bold tracking-wide">
              <ArrowUp className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to Top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
