import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Users, Calendar, Clock, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { bookingService } from '../../services/bookingService';
import { getImageUrl } from '../../utils/imageUtils';

const getSlotStartMinutes = (slotTime) => {
  const match = slotTime?.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return Number.MAX_SAFE_INTEGER;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3].toUpperCase();

  if (hours === 12) hours = 0;
  if (period === 'PM') hours += 12;

  return hours * 60 + minutes;
};

export function TheaterCard({ 
  theater, 
  selectedDate, 
  selectedBooking, 
  onSelectBooking,
  onDateChange
}) {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const dateInputRef = useRef(null);

  const handleOpenDatePicker = () => {
    if (dateInputRef.current && dateInputRef.current.showPicker) {
      dateInputRef.current.showPicker();
    } else if (dateInputRef.current) {
      dateInputRef.current.focus();
    }
  };
  
  const [slotsData, setSlotsData] = useState([]);
  const [fetchingSlots, setFetchingSlots] = useState(false);
  const [slotError, setSlotError] = useState('');

  // The images array to use
  const images = theater.images?.length > 0 
    ? theater.images 
    : ['https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070'];

  const hasMultipleImages = images.length > 1;

  useEffect(() => {
    if (selectedDate && theater._id) {
      setFetchingSlots(true);
      setSlotError('');
      
      bookingService.checkAvailability(theater._id, selectedDate)
        .then(res => {
          if (res.success) {
            const allSlots = [...res.data.availableSlots, ...res.data.bookedSlots];
            const structured = allSlots.map(s => ({
              id: s,
              time: s,
              available: res.data.availableSlots.includes(s)
            })).sort((a, b) => getSlotStartMinutes(a.time) - getSlotStartMinutes(b.time));
            setSlotsData(structured);
          }
        })
        .catch(err => {
          setSlotError('Failed to fetch availability.');
        })
        .finally(() => {
          setFetchingSlots(false);
        });
    } else {
      setSlotsData([]);
    }
  }, [selectedDate, theater._id]);

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
  
  const availableCount = slotsData.filter(s => s.available).length;

  const handleContinueBooking = () => {
    if (!isSelected || !activeSlot) return;
    
    const params = new URLSearchParams();
    params.append('date', selectedDate);
    params.append('slot', activeSlot);
    navigate(`/book/${theater._id}?${params.toString()}`);
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
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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
        
        {/* Rating Mockup (Optional per screenshot) */}
        <div className="absolute top-4 right-4 z-10">
          <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm font-sans text-[10px] font-bold text-[#17171c] flex items-center gap-1 shadow-sm">
             ★ 4.9
          </span>
        </div>
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
          {selectedDate && !fetchingSlots && (
             <span className={`ml-auto inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${availableCount > 0 ? 'bg-[#ecfff3] text-[#198754] border-[#bde8ce]' : 'bg-red-50 text-red-600 border-red-100'}`}>
               {availableCount > 0 ? '🟢' : '🔴'} {availableCount} Slot{availableCount !== 1 ? 's' : ''} Available
            </span>
          )}
        </div>

        {/* Features List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mb-5">
           <div className="flex items-center gap-2 text-[13px] text-[#4a4038] font-medium">
             <span className="w-5 flex justify-center"><Users className="w-4 h-4 text-[#8c5211]"/></span>
             Max {theater.capacity} People
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
           <p className="text-[10px] font-bold text-[#17171c] uppercase tracking-wider mb-3">
             Select Time Slot
           </p>

           {/* SLOT GRID */}
           {!selectedDate ? (
             <div 
               onClick={handleOpenDatePicker}
               className="relative text-[12px] text-[#6b5c52] p-4 bg-[#F9F6F0] rounded-xl border border-dashed border-[#ecdcd1] text-center group overflow-hidden transition-colors hover:bg-[#f2efe9] cursor-pointer"
             >
               <input 
                 ref={dateInputRef}
                 type="date"
                 min={new Date().toISOString().split('T')[0]}
                 onChange={(e) => onDateChange && onDateChange(e.target.value)}
                 className="absolute invisible w-0 h-0"
               />
               <span className="flex items-center justify-center gap-2 font-bold group-hover:text-[#8c5211] transition-colors">
                 <Calendar className="w-4 h-4" /> Please select a date above.
               </span>
             </div>
           ) : fetchingSlots ? (
             <div className="text-[12px] text-[#8c5211] font-bold text-center py-6 animate-pulse">
               Checking availability...
             </div>
           ) : availableCount === 0 || slotsData.length === 0 ? (
             <div className="text-[12px] text-error p-4 bg-error/5 rounded-xl border border-error/20 text-center font-medium flex flex-col gap-1">
               <span>No time slots available for this date.</span>
               <span>Please choose another date.</span>
             </div>
           ) : (
             <div className="grid grid-cols-4 gap-1.5 mb-4">
               {slotsData.map(slot => {
                 const isSlotSelected = isSelected && activeSlot === slot.time;
                 return (
                   <button
                     key={slot.id}
                     type="button"
                     disabled={!slot.available}
                     onClick={() => onSelectBooking({ theaterId: theater._id, slotId: slot.time })}
                     className={`min-h-[46px] px-1 py-1 rounded-lg border text-center transition-all ${
                       !slot.available 
                         ? 'opacity-40 bg-gray-50 border-gray-200 cursor-not-allowed line-through' 
                         : isSlotSelected
                           ? 'border-[#8c5211] bg-[#f9f2eb] ring-1 ring-[#8c5211]'
                           : 'border-[#ead9ca] hover:border-[#a9651c] bg-[#fffaf5]'
                     }`}
                   >
                     <div className={`text-[9px] leading-tight font-bold whitespace-nowrap ${!slot.available ? 'text-gray-500' : isSlotSelected ? 'text-[#8c5211]' : 'text-[#1a1c21]'}`}>
                       {slot.time}
                     </div>
                     <div className="text-[8px] mt-1 uppercase font-bold tracking-wide">
                       {!slot.available ? <span className="text-error">Booked</span> : isSlotSelected ? <span className="text-[#8c5211]">Selected</span> : <span className="text-success">Available</span>}
                     </div>
                   </button>
                 );
               })}
             </div>
           )}

           {slotError && <p className="text-[11px] font-bold text-error text-center mb-3">{slotError}</p>}

           {/* PRICE & CONTINUE */}
           <div className="flex items-center justify-between mt-2 pt-4 border-t border-[#eadfd5]">
             <div className="flex flex-col">
               <span className="text-[20px] font-extrabold text-[#a9651c]">₹{theater.pricePerHour}</span>
               <span className="text-[10px] uppercase tracking-wider font-bold text-[#6b5c52]">Per Hour</span>
             </div>
             
             <button
               onClick={handleContinueBooking}
               disabled={!isSelected || !activeSlot}
               className={`px-5 py-3 rounded-xl font-bold text-[13px] transition-all flex items-center gap-1 ${
                 !isSelected || !activeSlot
                   ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                   : 'bg-[#a9651c] text-white hover:bg-[#8e5217] shadow-md'
               }`}
             >
               Continue <ArrowRight className="w-4 h-4" />
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}
