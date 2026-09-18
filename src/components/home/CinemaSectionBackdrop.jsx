export function CinemaSectionBackdrop({ variant = 'why' }) {
  if (variant === 'services') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -right-16 top-10 rotate-12 opacity-[0.06]">
          <svg width="520" height="180" viewBox="0 0 520 180" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 24H520M0 156H520" stroke="#8c5211" strokeWidth="4" />
            <path d="M0 8H520M0 172H520" stroke="#8c5211" strokeWidth="3" strokeDasharray="12 12" />
            <rect x="28" y="52" width="96" height="76" stroke="#8c5211" strokeWidth="3" />
            <rect x="148" y="52" width="96" height="76" stroke="#8c5211" strokeWidth="3" />
            <rect x="268" y="52" width="96" height="76" stroke="#8c5211" strokeWidth="3" />
            <rect x="388" y="52" width="96" height="76" stroke="#8c5211" strokeWidth="3" />
          </svg>
        </div>
        <div className="absolute left-0 bottom-8 -translate-x-8 -rotate-12 font-[cursive] text-[6rem] leading-none text-[#b94d5c] opacity-[0.12]">
          Create
        </div>
      </div>
    );
  }

  if (variant === 'reviews') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute left-8 top-12 font-serif text-[15rem] leading-none text-[#b94d5c] opacity-[0.1]">
          “
        </div>
        <div className="absolute right-0 top-1/2 translate-x-1/3 -translate-y-1/2 rotate-12 opacity-[0.06]">
          <svg width="340" height="760" viewBox="0 0 100 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 0V400 M85 0V400" stroke="#8c5211" strokeWidth="4" />
            <path d="M5 0V400 M95 0V400" stroke="#8c5211" strokeWidth="4" strokeDasharray="8 8" />
            <rect x="25" y="20" width="50" height="40" stroke="#8c5211" strokeWidth="2" />
            <rect x="25" y="80" width="50" height="40" stroke="#8c5211" strokeWidth="2" />
            <rect x="25" y="140" width="50" height="40" stroke="#8c5211" strokeWidth="2" />
            <rect x="25" y="200" width="50" height="40" stroke="#8c5211" strokeWidth="2" />
            <rect x="25" y="260" width="50" height="40" stroke="#8c5211" strokeWidth="2" />
            <rect x="25" y="320" width="50" height="40" stroke="#8c5211" strokeWidth="2" />
          </svg>
        </div>
        <div className="absolute right-24 bottom-10 font-[cursive] text-[5rem] leading-none text-[#a9651c] opacity-[0.14]">
          Memories
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="absolute left-0 top-1/2 -translate-x-1/4 -translate-y-1/2 pointer-events-none hidden xl:block -rotate-12 opacity-[0.05]" aria-hidden="true">
        <svg width="300" height="800" viewBox="0 0 100 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 0V400 M85 0V400" stroke="#8c5211" strokeWidth="4" />
          <path d="M5 0V400 M95 0V400" stroke="#8c5211" strokeWidth="4" strokeDasharray="8 8" />
          <rect x="25" y="20" width="50" height="40" stroke="#8c5211" strokeWidth="2" />
          <rect x="25" y="80" width="50" height="40" stroke="#8c5211" strokeWidth="2" />
          <rect x="25" y="140" width="50" height="40" stroke="#8c5211" strokeWidth="2" />
          <rect x="25" y="200" width="50" height="40" stroke="#8c5211" strokeWidth="2" />
          <rect x="25" y="260" width="50" height="40" stroke="#8c5211" strokeWidth="2" />
          <rect x="25" y="320" width="50" height="40" stroke="#8c5211" strokeWidth="2" />
        </svg>
      </div>

      <div className="absolute right-0 top-1/2 translate-x-8 -translate-y-1/2 pointer-events-none hidden xl:block z-0" aria-hidden="true">
        <div className="font-[cursive] text-[7rem] leading-[0.85] text-[#8c5211] opacity-[0.25] -rotate-12 transform scale-y-110">
          More <br /> Than <br /> Movies
        </div>
      </div>
    </>
  );
}