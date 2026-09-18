import { Link } from 'react-router-dom';

export function FoundersPage() {
  return (
    <div className="min-h-screen bg-[#FCF5EB] pt-32 pb-24 relative overflow-hidden font-sans">
      {/* Background SVG Decors */}
      <div className="absolute top-0 right-0 pointer-events-none overflow-hidden w-[600px] h-[600px] z-0 opacity-40">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
          <g transform="translate(600, 0)">
            <circle cx="0" cy="0" r="550" fill="none" stroke="#eaddd0" strokeWidth="50" />
            <circle cx="0" cy="0" r="535" fill="none" stroke="#FAF4ED" strokeWidth="12" strokeDasharray="15 15" />
          </g>
        </svg>
      </div>

      <div className="w-full mx-auto px-5 sm:px-10 lg:px-20 max-w-4xl relative z-10 text-center mb-16">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-[1px] w-8 bg-[#c2a290]"></div>
          <span className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#9e6223]">
            CS CINEMAS
          </span>
          <div className="h-[1px] w-8 bg-[#c2a290]"></div>
        </div>

        <h1 className="text-[40px] md:text-[56px] font-heading font-extrabold text-[#1a1c21] mb-10 leading-[1.1]">
          Company & Founders
        </h1>

        <div className="bg-white rounded-[32px] p-8 md:p-16 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-[#f0e6dd] text-left">
          <p className="text-[16px] md:text-[18px] font-medium text-[#6b5c52] leading-[1.8] whitespace-pre-wrap mb-10">
            CS Cinemas is proudly owned and operated by BCKS Franchise LLP, a Bengaluru-based company driven by innovation, integrity, and a shared passion for redefining how India celebrates. With its Corporate Office at Magadi Main Road, Binnipet, Bengaluru and Registered Office in Hoodi, KR Puram, Bengaluru, the company oversees operations across multiple cities with a strong foundation in customer trust and operational excellence.
          </p>

          <p className="text-[16px] md:text-[18px] font-medium text-[#6b5c52] leading-[1.8] whitespace-pre-wrap mb-8">
            Behind this vision stands a team of dynamic partners who bring together global experience, analytical thinking, and entrepreneurial spirit.
          </p>

          <ul className="space-y-4 mb-10">
            <li className="flex items-start gap-4">
              <span className="w-2 h-2 rounded-full bg-[#c2a290] mt-2.5 shrink-0"></span>
              <p className="text-[16px] md:text-[18px] font-medium text-[#6b5c52] leading-[1.6]">
                <strong className="text-[#1a1c21]">Chetan Agrawal</strong>, Ex-McKinsey, MBA from IIT Madras, and B.Tech from NIT Rourkela, leads marketing & finance.
              </p>
            </li>
            <li className="flex items-start gap-4">
              <span className="w-2 h-2 rounded-full bg-[#c2a290] mt-2.5 shrink-0"></span>
              <p className="text-[16px] md:text-[18px] font-medium text-[#6b5c52] leading-[1.6]">
                <strong className="text-[#1a1c21]">Yash Agarwal</strong>, M.Sc from BTU Cottbus, Germany, and B.Tech Dayananda College, leads Operations & Expansions
              </p>
            </li>
            <li className="flex items-start gap-4">
              <span className="w-2 h-2 rounded-full bg-[#c2a290] mt-2.5 shrink-0"></span>
              <p className="text-[16px] md:text-[18px] font-medium text-[#6b5c52] leading-[1.6]">
                <strong className="text-[#1a1c21]">Sanketh Jain</strong>, B.Tech from Jain University, leads Customer Experience Management
              </p>
            </li>
            <li className="flex items-start gap-4">
              <span className="w-2 h-2 rounded-full bg-[#c2a290] mt-2.5 shrink-0"></span>
              <p className="text-[16px] md:text-[18px] font-medium text-[#6b5c52] leading-[1.6]">
                <strong className="text-[#1a1c21]">Bishnu Sahu</strong>, B.Tech from IIIT Allahabad, focuses on tech integrations to enhance customer journey
              </p>
            </li>
            <li className="flex items-start gap-4">
              <span className="w-2 h-2 rounded-full bg-[#c2a290] mt-2.5 shrink-0"></span>
              <p className="text-[16px] md:text-[18px] font-medium text-[#6b5c52] leading-[1.6]">
                <strong className="text-[#1a1c21]">Soumay Bansal</strong>, MBA from IIT Madras and BA Economy Hons from Delhi University, heads customer support & investor relations.
              </p>
            </li>
          </ul>

          <p className="text-[16px] md:text-[18px] font-medium text-[#6b5c52] leading-[1.8] whitespace-pre-wrap mb-10">
            Together, this diverse founding team represents the perfect blend of creativity, discipline, and empathy — united by one goal: to make celebration accessible for everyone.
          </p>

          <div className="mt-6 pt-8 border-t border-[#f0e6dd] flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-sm text-[#9e6223] font-bold tracking-wide uppercase">Discover Our Story</p>
            <Link to="/about" className="px-8 py-3 bg-[#1a1c21] text-white rounded-full font-bold hover:bg-[#8c5211] transition-colors shadow-md">
              About Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
