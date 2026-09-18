import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Users, Calendar, Clock, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { bookingService } from '../../services/bookingService';
import { getImageUrl } from '../../utils/imageUtils';

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
            })).sort((a, b) => a.time.localeCompare(b.time));
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
    <div className={`bg-white rounded-[24px] overflow-hidden border transition-all duration-300 flex flex-col h-full
      ${isSelected ? 'border-[#8c5211] shadow-[0_8px_30px_rgba(140,82,17,0.12)]' : 'border-[#ecdcd1] shadow-sm hover:shadow-md'}
    `}>
      {/* IMAGE GALLERY SECTION */}
      <div className="relative h-[240px] md:h-[280px] w-full overflow-hidden bg-gray-100 group">
        <img 
          src={getImageUrl(images[currentImageIndex])} 
          alt={theater.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* City Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm font-sans text-[10px] font-extrabold text-[#1a1c21] tracking-widest uppercase shadow-sm">
            {theater.city?.name || 'BENGALURU'}
          </span>
        </div>

        {/* Gallery Controls */}
        {hasMultipleImages && (
          <>
            <button onClick={handlePrevImage} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#1a1c21] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm z-10">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={handleNextImage} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#1a1c21] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm z-10">
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
          <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm font-sans text-[11px] font-bold text-[#1a1c21] flex items-center gap-1 shadow-sm">
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
      <div className="p-5 flex flex-col flex-1">
        
        <div className="flex justify-between items-start mb-2 gap-4">
          <h2 className="text-[22px] font-heading font-extrabold text-[#1a1c21] leading-tight">
            {theater.name}
          </h2>
        </div>

        {/* Location & Maps */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="flex items-center gap-1 text-[13px] font-medium text-[#6b5c52]">
            <MapPin className="w-4 h-4 text-[#8c5211]" /> {theater.location?.name || 'Premium'}
          </span>
          {theater.googleMapsLink && (
            <a href={theater.googleMapsLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#e8f0fe] text-[#1967d2] hover:bg-[#d2e3fc] text-[10px] font-bold uppercase tracking-wider border border-[#d2e3fc] transition-colors">
              📍 MAPS
            </a>
          )}
          {selectedDate && !fetchingSlots && (
            <span className={`ml-auto inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${availableCount > 0 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-100'}`}>
               {availableCount > 0 ? '🟢' : '🔴'} {availableCount} Slot{availableCount !== 1 ? 's' : ''} Available
            </span>
          )}
        </div>

        {/* Features List */}
        <div className="space-y-2 mb-6">
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
           <p className="text-[12px] font-bold text-[#1a1c21] uppercase tracking-wider mb-3 text-center">
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
             <div className="grid grid-cols-2 gap-2 mb-5">
               {slotsData.map(slot => {
                 const isSlotSelected = isSelected && activeSlot === slot.time;
                 return (
                   <button
                     key={slot.id}
                     type="button"
                     disabled={!slot.available}
                     onClick={() => onSelectBooking({ theaterId: theater._id, slotId: slot.time })}
                     className={`p-2 rounded-lg border text-center transition-all ${
                       !slot.available 
                         ? 'opacity-40 bg-gray-50 border-gray-200 cursor-not-allowed line-through' 
                         : isSlotSelected
                           ? 'border-[#8c5211] bg-[#f9f2eb] ring-1 ring-[#8c5211]'
                           : 'border-[#ecdcd1] hover:border-[#8c5211] bg-white'
                     }`}
                   >
                     <div className={`text-[12px] font-bold ${!slot.available ? 'text-gray-500' : isSlotSelected ? 'text-[#8c5211]' : 'text-[#1a1c21]'}`}>
                       {slot.time}
                     </div>
                     <div className="text-[9px] mt-0.5 uppercase font-bold tracking-wider">
                       {!slot.available ? <span className="text-error">Full</span> : isSlotSelected ? <span className="text-[#8c5211]">Selected</span> : <span className="text-success">Available</span>}
                     </div>
                   </button>
                 );
               })}
             </div>
           )}

           {slotError && <p className="text-[11px] font-bold text-error text-center mb-3">{slotError}</p>}

           {/* PRICE & CONTINUE */}
           <div className="flex items-center justify-between mt-2 pt-4 border-t border-slate-100">
             <div className="flex flex-col">
               <span className="text-[20px] font-extrabold text-[#9e6223]">₹{theater.pricePerHour}</span>
               <span className="text-[10px] uppercase tracking-wider font-bold text-[#6b5c52]">Per Hour</span>
             </div>
             
             <button
               onClick={handleContinueBooking}
               disabled={!isSelected || !activeSlot}
               className={`px-5 py-3 rounded-xl font-bold text-[13px] transition-all flex items-center gap-1 ${
                 !isSelected || !activeSlot
                   ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                   : 'bg-[#1a1c21] text-white hover:bg-black shadow-md'
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
