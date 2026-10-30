import React from 'react';
import { Mail } from 'lucide-react';

const socialLinks = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/people/Rio-Party-House/61594885514764/',
    isExternal: true,
    icon: (
      <svg className="w-4 h-4 text-[#172C4A] group-hover:text-[#A96512] transition-colors stroke-[1.8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <g transform="matrix(0.75, 0, 0, 0.75, 2.625, 3)" strokeWidth="2">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </g>
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/riopartyhouse?stkn=amZvODBnZXdqaXF0',
    isExternal: true,
    icon: (
      <svg className="w-4 h-4 text-[#172C4A] group-hover:text-[#A96512] transition-colors" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    name: 'WhatsApp',
    href: 'https://wa.me/918147897771?text=Hi%2C%20I%E2%80%99m%20interested%20in%20your%20services.%20I%E2%80%99d%20like%20to%20make%20an%20enquiry.%20Please%20share%20more%20details.',
    isExternal: true,
    icon: (
      <svg className="w-4 h-4 text-[#172C4A] group-hover:text-[#A96512] transition-colors" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.012c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
      </svg>
    ),
  },
  {
    name: 'Email',
    href: 'mailto:riopartyhouse@gmail.com',
    isExternal: false,
    icon: (
      <Mail className="w-4 h-4 text-[#172C4A] group-hover:text-[#A96512] transition-colors stroke-[1.8]" />
    ),
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@RIOPARTYHOUSE',
    isExternal: true,
    icon: (
      <svg className="w-4 h-4 text-[#172C4A] group-hover:text-[#A96512] transition-colors" fill="currentColor" viewBox="0 0 24 24">
        <path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.86-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M12,18.42c-5.592,0-7.391-0.347-7.653-1.328c-0.18-0.672-0.18-3.419-0.18-5.092s0-4.42,0.18-5.092C4.609,5.927,6.408,5.58,12,5.58s7.391,0.347,7.653,1.328c0.18,0.672,0.18,3.419,0.18,5.092s0,4.42-0.18,5.092C19.391,18.073,17.592,18.42,12,18.42z M10,15.464l5.5-3.182L10,9.1V15.464z" />
      </svg>
    ),
  },
];

export function HeroSocialIcons() {
  return (
    <div className="flex items-center justify-center gap-3 pt-1">
      {socialLinks.map((item) => (
        <a
          key={item.name}
          href={item.href}
          target={item.isExternal ? '_blank' : undefined}
          rel={item.isExternal ? 'noopener noreferrer' : undefined}
          aria-label={item.name}
          title={item.name}
          className="group relative flex h-9 w-9 items-center justify-center rounded-full bg-[#FBF4E9]/90 backdrop-blur-xs border border-[#E9DAC6] shadow-[0_2px_8px_rgba(23,44,74,0.06)] transition-all duration-300 hover:scale-110 hover:bg-white hover:border-[#A96512]/60 hover:shadow-[0_4px_12px_rgba(169,101,18,0.15)] active:scale-95"
        >
          {item.icon}
        </a>
      ))}
    </div>
  );
}

