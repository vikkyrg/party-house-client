import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { getImageUrl, handleImageError } from '../../utils/imageUtils';

export function TheaterCard({ 
  theater, 
  selectedDate, 
  selectedBooking, 
  onSelectBooking,
  onDateChange
}) {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // The images array to use
  const images = theater.images?.length > 0 
    ? theater.images 
    : ['https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070'];

  const hasMultipleImages = images.length > 1;


  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const isSelected = selectedBooking?.theaterId === theater._id;
  const activeSlot = isSelected ? selectedBooking?.slotId : null;
  
  const handleContinueBooking = () => {
    navigate(`/theaters/${theater._id}`);
  };

  return (
    <div className={`bg-[#fffaf5] rounded-[18px] overflow-hidden border transition-all duration-300 flex flex-col h-full
      ${isSelected ? 'border-[#a9651c] shadow-[0_8px_30px_rgba(169,101,28,0.16)]' : 'border-[#ead9ca] shadow-[0_4px_18px_rgba(75,43,20,0.06)] hover:shadow-[0_10px_26px_rgba(75,43,20,0.1)]'}
    `}>
      {/* IMAGE GALLERY SECTION */}
      <div className="relative h-[190px] md:h-[205px] w-full overflow-hidden bg-[#eadfce] group">
        <img 
          src={getImageUrl(images[currentImageIndex])} 
          alt={theater.name}
          onError={handleImageError}
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* City Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm font-sans text-[9px] font-extrabold text-[#17171c] tracking-widest uppercase shadow-sm">
            {theater.city?.name || 'BENGALURU'}
          </span>
        </div>

        {/* Gallery Controls */}
        {hasMultipleImages && (
          <>
            <button onClick={handlePrevImage} aria-label="Previous theater image" className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#17171c] transition-opacity hover:bg-white shadow-sm z-10">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={handleNextImage} aria-label="Next theater image" className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#17171c] transition-opacity hover:bg-white shadow-sm z-10">
              <ChevronRight className="w-5 h-5" />
            </button>
            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {images.map((_, idx) => (
                <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-3' : 'bg-white/50'}`} />
              ))}
            </div>
          </>
        )}
        
      </div>

      {/* MEDIA BUTTONS ROW (Just below image) */}
      {(theater.theatreVideoUrl || theater.branchVideoUrl) && (
        <div className="flex border-b border-[#ecdcd1] divide-x divide-[#ecdcd1]">
          {theater.theatreVideoUrl && (
            <a href={theater.theatreVideoUrl} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 bg-[#fcf8f5] hover:bg-[#f9f2eb] flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#1a1c21] uppercase tracking-wider transition-colors">
              <span className="text-[#8c5211]">▶</span> Theatre Video
            </a>
          )}
          {theater.branchVideoUrl && (
            <a href={theater.branchVideoUrl} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 bg-[#fcf8f5] hover:bg-[#f9f2eb] flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#1a1c21] uppercase tracking-wider transition-colors">
              <span className="text-[#8c5211]">▶</span> Branch Video
            </a>
          )}
        </div>
      )}

      {/* DETAILS SECTION */}
      <div className="p-4 md:p-5 flex flex-col flex-1">
        
        <div className="flex justify-between items-start mb-2 gap-4">
          <h2 className="text-[20px] font-heading font-extrabold text-[#17171c] leading-tight">
            {theater.name}
          </h2>
        </div>

        {/* Location & Maps */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="flex items-center gap-1 text-[13px] font-medium text-[#6b5c52]">
            <MapPin className="w-4 h-4 text-[#8c5211]" /> {theater.location?.name || 'Premium'}
          </span>
          {theater.googleMapsLink && (
            <a href={theater.googleMapsLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#e8f0fe] text-[#1967d2] hover:bg-[#d2e3fc] text-[10px] font-bold uppercase tracking-wider border border-[#d2e3fc] transition-colors">
              📍 MAPS
            </a>
          )}
        </div>

        {/* Features List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mb-5">
           <div className="flex items-center gap-2 text-[13px] text-[#4a4038] font-medium">
             <span className="w-5 flex justify-center text-[#8c5211]">✓</span>
             {theater.rooms?.filter((room) => room.isActive !== false).length || 0} Rooms Available
           </div>
           
           {/* If features exist, map them here, otherwise standard fallback for structure */}
           {theater.features && theater.features.length > 0 ? (
             theater.features.slice(0, 5).map((f, idx) => (
               <div key={idx} className="flex items-center gap-2 text-[13px] text-[#4a4038] font-medium">
                 <span className="w-5 flex justify-center text-[#8c5211]">✓</span>
                 {f}
               </div>
             ))
           ) : (
             <>
               <div className="flex items-center gap-2 text-[13px] text-[#4a4038] font-medium">
                 <span className="w-5 flex justify-center text-[#8c5211]">✓</span>
                 Free Cancellation
               </div>
               <div className="flex items-center gap-2 text-[13px] text-[#4a4038] font-medium">
                 <span className="w-5 flex justify-center text-[#8c5211]">✨</span>
                 Decor & Add-ons available in next step
               </div>
             </>
           )}
        </div>

        <div className="mt-auto border-t border-[#ecdcd1] pt-5">
           <div className="flex items-center justify-between mt-2 pt-4 border-t border-[#eadfd5]">
             <div className="flex flex-col">
               <span className="text-[12px] font-bold uppercase tracking-wider text-[#6b5c52]">Choose a room</span>
               <span className="text-[10px] font-medium text-[#6b5c52]">View room pricing</span>
             </div>
             
             <button
               onClick={handleContinueBooking}
               className="px-5 py-3 rounded-xl bg-[#a9651c] text-white hover:bg-[#8e5217] shadow-md font-bold text-[13px] transition-all flex items-center gap-1"
             >
               View Rooms <ArrowRight className="w-4 h-4" />
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}
