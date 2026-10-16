import { Link } from 'react-router-dom';
import { handleImageError } from '../../utils/imageUtils';
import { 
  MapPin, Calendar, Heart, Shield, HelpCircle, 
  Headphones, MessageSquare, Mail, 
  Users, ArrowUp, ArrowUpRight,
  Monitor, Sparkles, Images, Clapperboard, Film, Video
} from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#FBF5ED] pt-14 pb-8 relative overflow-hidden text-[#514B46] font-sans border-t border-[#EBD8C2]">
      
      {/* Subtle Background Filmstrip Curves */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <svg 
          className="absolute w-full h-full opacity-35" 
          viewBox="0 0 1600 700" 
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top Left Sweeping Film Strip */}
          <path
            d="M -100,500 C 150,450 300,250 380,-100"
            fill="none"
            stroke="#EBD8C2"
            strokeWidth="70"
          />
          <path
            d="M -100,500 C 150,450 300,250 380,-100"
            fill="none"
            stroke="#FBF5ED"
            strokeWidth="10"
            strokeDasharray="14 14"
            className="translate-x-[-18px]"
          />
          <path
            d="M -100,500 C 150,450 300,250 380,-100"
            fill="none"
            stroke="#FBF5ED"
            strokeWidth="10"
            strokeDasharray="14 14"
            className="translate-x-[18px]"
          />

          {/* Right Film Strip Arc curving over card area */}
          <path
            d="M 1150,-100 C 1200,200 1350,450 1700,550"
            fill="none"
            stroke="#EBD8C2"
            strokeWidth="80"
          />
          <path
            d="M 1150,-100 C 1200,200 1350,450 1700,550"
            fill="none"
            stroke="#FBF5ED"
            strokeWidth="12"
            strokeDasharray="16 16"
            className="translate-x-[-22px]"
          />
          <path
            d="M 1150,-100 C 1200,200 1350,450 1700,550"
            fill="none"
            stroke="#FBF5ED"
            strokeWidth="12"
            strokeDasharray="16 16"
            className="translate-x-[22px]"
          />
        </svg>
      </div>

      <div className="w-full mx-auto px-6 md:px-10 lg:px-12 xl:px-14 relative z-10 max-w-[1720px]">
        {/* 5-Column Responsive Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[1.35fr_0.65fr_0.65fr_0.75fr_1.5fr] gap-8 lg:gap-10 xl:gap-8 mb-12 items-start">
          
          {/* Column 1: Brand Identity */}
          <div className="flex flex-col pr-0 xl:pr-4">
            <Link to="/" onClick={scrollToTop} className="inline-flex items-center gap-0 mb-5" aria-label="Rio Party House Home">
              <img src="/logo.png" alt="Rio Party House" onError={handleImageError} className="h-[68px] w-[80px] object-contain" />
              <div className="flex -ml-1 w-[115px] items-center justify-center sm:-ml-1 sm:w-[150px]">
                <img src="/party.png" alt="Rio Party House" onError={handleImageError} className="h-[58px] object-contain" />
              </div>
            </Link>
            
            <h3 className="text-[28px] sm:text-[32px] font-heading font-black tracking-tight leading-[1.15] mb-3.5 text-[#10243A]">
              More Than Movies, <br/>
              <span className="bg-gradient-to-r from-[#D77E1E] via-[#BA382A] to-[#8C1D40] bg-clip-text text-transparent">
                Memories Together.
              </span>
            </h3>
            
            <p className="text-[#514B46] font-normal text-[13px] leading-[1.75] max-w-[390px] mb-6">
              Handcrafted private cinema rooms for birthdays, anniversaries, date nights, and surprise celebrations that deserve an unforgettable screen moment.
            </p>
            
            {/* 3 Circular Feature Highlights */}
            <div className="flex flex-wrap items-center gap-5 sm:gap-6 pt-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5E7D4] text-[#A86116] shrink-0 shadow-sm">
                  <Film className="w-4 h-4 stroke-[2]" />
                </div>
                <span className="text-[9.5px] font-bold text-[#10243A] uppercase tracking-wider leading-tight">
                  PRIVATE<br/>THEATERS
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5E7D4] text-[#A86116] shrink-0 shadow-sm">
                  <Users className="w-4 h-4 stroke-[2]" />
                </div>
                <span className="text-[9.5px] font-bold text-[#10243A] uppercase tracking-wider leading-tight">
                  SPECIAL<br/>OCCASIONS
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5E7D4] text-[#A86116] shrink-0 shadow-sm">
                  <Heart className="w-4 h-4 stroke-[2]" />
                </div>
                <span className="text-[9.5px] font-bold text-[#10243A] uppercase tracking-wider leading-tight">
                  UNFORGETTABLE<br/>EXPERIENCES
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Explore */}
          <div className="pt-2">
            <h4 className="text-[12px] font-sans font-bold tracking-[0.14em] uppercase text-[#A86116] mb-5 flex flex-col gap-2">
              EXPLORE
              <span className="w-6 h-[2.5px] bg-[#A86116] rounded-full"></span>
            </h4>
            <ul className="space-y-4 text-[13.5px] font-medium text-[#514B46]">
              <li>
                <Link to="/theaters" onClick={scrollToTop} className="flex items-center gap-3 hover:text-[#A86116] transition-colors py-0.5">
                  <Monitor className="w-[18px] h-[18px] text-[#A86116] stroke-[1.8]" />
                  <span>Theaters</span>
                </Link>
              </li>
              <li>
                <Link to="/events" onClick={scrollToTop} className="flex items-center gap-3 hover:text-[#A86116] transition-colors py-0.5">
                  <Calendar className="w-[18px] h-[18px] text-[#A86116] stroke-[1.8]" />
                  <span>Occasions</span>
                </Link>
              </li>
              <li>
                <Link to="/services" onClick={scrollToTop} className="flex items-center gap-3 hover:text-[#A86116] transition-colors py-0.5">
                  <Sparkles className="w-[18px] h-[18px] text-[#A86116] stroke-[1.8]" />
                  <span>Our Services</span>
                </Link>
              </li>
              <li>
                <Link to="/gallery" onClick={scrollToTop} className="flex items-center gap-3 hover:text-[#A86116] transition-colors py-0.5">
                  <Images className="w-[18px] h-[18px] text-[#A86116] stroke-[1.8]" />
                  <span>Gallery</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="pt-2">
            <h4 className="text-[12px] font-sans font-bold tracking-[0.14em] uppercase text-[#A86116] mb-5 flex flex-col gap-2">
              SUPPORT
              <span className="w-6 h-[2.5px] bg-[#A86116] rounded-full"></span>
            </h4>
            <ul className="space-y-4 text-[13.5px] font-medium text-[#514B46]">
              <li>
                <Link to="/faq" onClick={scrollToTop} className="flex items-center gap-3 hover:text-[#A86116] transition-colors py-0.5">
                  <HelpCircle className="w-[18px] h-[18px] text-[#A86116] stroke-[1.8]" />
                  <span>FAQ</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={scrollToTop} className="flex items-center gap-3 hover:text-[#A86116] transition-colors py-0.5">
                  <Headphones className="w-[18px] h-[18px] text-[#A86116] stroke-[1.8]" />
                  <span>Contact</span>
                </Link>
              </li>
              <li>
                <Link to="/help" onClick={scrollToTop} className="flex items-center gap-3 hover:text-[#A86116] transition-colors py-0.5">
                  <MessageSquare className="w-[18px] h-[18px] text-[#A86116] stroke-[1.8]" />
                  <span>Help Center</span>
                </Link>
              </li>
              <li>
                <Link to="/privacy" onClick={scrollToTop} className="flex items-center gap-3 hover:text-[#A86116] transition-colors py-0.5">
                  <Shield className="w-[18px] h-[18px] text-[#A86116] stroke-[1.8]" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Connect */}
          <div className="pt-2">
            <h4 className="text-[12px] font-sans font-bold tracking-[0.14em] uppercase text-[#A86116] mb-5 flex flex-col gap-2">
              CONNECT
              <span className="w-6 h-[2.5px] bg-[#A86116] rounded-full"></span>
            </h4>
            <ul className="space-y-4 text-[13.5px] font-medium text-[#514B46]">
              <li>
                <a
                  href="https://www.facebook.com/people/Rio-Party-House/61594885514764/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:text-[#A86116] transition-colors py-0.5"
                >
                  <svg className="w-[18px] h-[18px] text-[#A86116] stroke-[1.8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <g transform="matrix(0.75, 0, 0, 0.75, 2.625, 3)" strokeWidth="2">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </g>
                  </svg>
                  <span>Facebook</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/riopartyhouse?stkn=amZvODBnZXdqaXF0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:text-[#A86116] transition-colors py-0.5"
                >
                  <svg className="w-[18px] h-[18px] text-[#A86116]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/918147897771?text=Hi%2C%20I%E2%80%99m%20interested%20in%20your%20services.%20I%E2%80%99d%20like%20to%20make%20an%20enquiry.%20Please%20share%20more%20details."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:text-[#A86116] transition-colors py-0.5"
                >
                  <svg className="w-[18px] h-[18px] text-[#A86116]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.012c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
                  <span>WhatsApp</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/@RIOPARTYHOUSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:text-[#A86116] transition-colors py-0.5"
                >
                  <svg className="w-[18px] h-[18px] text-[#A86116]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.86-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M12,18.42c-5.592,0-7.391-0.347-7.653-1.328c-0.18-0.672-0.18-3.419-0.18-5.092s0-4.42,0.18-5.092C4.609,5.927,6.408,5.58,12,5.58s7.391,0.347,7.653,1.328c0.18,0.672,0.18,3.419,0.18,5.092s0,4.42-0.18,5.092C19.391,18.073,17.592,18.42,12,18.42z M10,15.464l5.5-3.182L10,9.1V15.464z"/>
                  </svg>
                  <span>YouTube</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:riopartyhouse@gmail.com"
                  className="flex items-center gap-3 hover:text-[#A86116] transition-colors py-0.5"
                >
                  <Mail className="w-[18px] h-[18px] text-[#A86116] stroke-[1.8]" />
                  <span>Email</span>
                </a>
              </li>
              <li className="pt-1.5">
                <div className="flex items-center gap-2 text-[#A86116] font-bold text-[13px]">
                  <MapPin className="w-[19px] h-[19px] text-[#A86116] shrink-0 stroke-[2]" />
                  <span>Bengaluru, India</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 5: Right-Side Premium Promotional Card */}
          <div className="pt-0 flex flex-col w-full">
            <div className="relative overflow-hidden rounded-[28px] sm:rounded-[32px] border border-[#EBD8C2] bg-[#FDFBF7] p-6 sm:p-7 shadow-[0_12px_36px_rgba(168,97,22,0.06)]">
              
              {/* Cinema Popcorn Bucket & Clapperboard Illustration (Positioned on Upper-Right) */}
              <div className="absolute -top-3 -right-2 w-[160px] sm:w-[195px] md:w-[220px] pointer-events-none z-10 select-none">
                <img 
                  src="/cinema-popcorn-promo.jpg" 
                  alt="Cinema Popcorn and Clapperboard"
                  className="w-full h-auto object-contain mix-blend-multiply drop-shadow-md"
                  onError={(e) => {
                    // Fallback to hide gracefully if image is unavailable
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

              {/* Badge */}
              <div className="relative z-20 mb-3 flex flex-col gap-2 items-start">
                <span className="text-[11px] font-sans font-bold tracking-[0.14em] uppercase text-[#A86116]">
                  MAKE EVERY MOMENT SPECIAL
                </span>
                <span className="w-6 h-[2px] bg-[#A86116] rounded-full"></span>
              </div>
              
              {/* Main Heading (Restricted width so it doesn't overlap popcorn on the right) */}
              <h5 className="relative z-20 text-[26px] sm:text-[29px] font-heading font-black tracking-tight leading-[1.12] mb-3 max-w-[62%] sm:max-w-[65%]">
                <span className="text-[#10243A]">Your Celebration,</span> <br/>
                <span className="text-[#A86116]">Our Big Screen.</span>
              </h5>
              
              {/* Description */}
              <p className="relative z-20 text-[13px] text-[#514B46] font-normal leading-[1.65] mb-5 max-w-[70%] sm:max-w-[72%]">
                Birthdays, anniversaries, and unforgettable movie nights — celebrate your special moments at Rio Party House.
              </p>
              
              {/* Pill CTA Button with right circular arrow container */}
              <div className="relative z-20 mb-5">
                <Link
                  to="/theaters"
                  onClick={scrollToTop}
                  className="inline-flex items-center justify-between pl-6 pr-1.5 h-[46px] rounded-full bg-[#A86116] hover:bg-[#8F4F0E] active:scale-[0.99] text-white text-[13.5px] font-bold tracking-wide transition-all shadow-[0_6px_18px_rgba(168,97,22,0.28)] group"
                >
                  <span className="pr-4">Celebrate With Us</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5E7D4] text-[#A86116] shadow-sm transition-transform group-hover:scale-105">
                    <ArrowUpRight className="w-4 h-4 stroke-[2.4]" />
                  </div>
                </Link>
              </div>
              
              {/* Bottom Feature Row with Thin Beige Divider */}
              <div className="pt-4 border-t border-[#EBD8C2] flex items-center gap-3.5 relative z-20">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5E7D4] text-[#A86116] shrink-0 shadow-sm">
                  <Video className="w-4 h-4 stroke-[2]" />
                </div>
                <div>
                  <h6 className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#10243A] leading-tight">
                    PRIVATE THEATER EXPERIENCES
                  </h6>
                  <p className="text-[12px] text-[#514B46] mt-0.5 font-normal">
                    Your people. Your moments. Your movie.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Bar Divider & Content */}
        <div className="pt-6 border-t border-[#EBD8C2] flex flex-col lg:flex-row items-center justify-between gap-5 text-[12px] font-sans font-medium text-[#514B46]">
          {/* Left: Brand Tagline */}
          <div className="flex items-center text-[#A86116] font-bold tracking-[0.22em] uppercase text-[11px]">
            LIGHTS OFF 
            <span className="w-1.5 h-1.5 bg-[#A86116] mx-3 rounded-full opacity-60"></span>
            STORIES ON 
            <span className="w-1.5 h-1.5 bg-[#A86116] mx-3 rounded-full opacity-60"></span>
            MEMORIES FOREVER
          </div>

          {/* Center: Copyright */}
          <p className="text-center text-[#514B46]">
            © 2026 Innomatrics Technologies. All Rights Reserved.
          </p>

          {/* Right: Navigation & Back to Top */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5">
            <Link to="/privacy" onClick={scrollToTop} className="hover:text-[#A86116] transition-colors">
              Privacy Policy
            </Link>
            <span className="text-[#EBD8C2]" aria-hidden="true">|</span>
            <Link to="/terms" onClick={scrollToTop} className="hover:text-[#A86116] transition-colors">
              Terms of Service
            </Link>
            <span className="text-[#EBD8C2]" aria-hidden="true">|</span>
            <a
              href="https://www.google.com/maps/place/Dinnur+main+road,+Ganesha+Block,+5th+cross,+R+T+Nagar/@13.0245137,77.5945149,713m/data=!3m1!1e3!4m10!1m2!2m1!1s%237,+Dinnur+Main+Road,+Ganesh+Block,+RT+Nagar,+Bangalore+-+560032.!3m6!1s0x3bae1700683e0615:0x3a273125772c571b!8m2!3d13.0247187!4d77.5949869!15sCkEjNywgRGlubnVyIE1haW4gUm9hZCwgR2FuZXNoIEJsb2NrLCBSVCBOYWdhciwgQmFuZ2Fsb3JlIC0gNTYwMDMyLpIBIWFsdGVybmF0aXZlX21lZGljaW5lX3ByYWN0aXRpb25lcuABAA!16s%2Fg%2F11y0pdv62q?authuser=0&entry=ttu&g_ep=EgoyMDI2MTAxMy4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#A86116] transition-colors"
            >
              Sitemap
            </a>
            
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Scroll back to top"
              className="ml-2 sm:ml-3 px-3.5 h-[34px] rounded-full border border-[#EBD8C2] bg-[#F5E7D4] flex items-center justify-center text-[#A86116] hover:bg-[#A86116] hover:text-white transition-all gap-1.5 shadow-sm font-bold text-[11.5px] tracking-wide"
            >
              <ArrowUp className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>Back to Top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
