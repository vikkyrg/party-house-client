import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { Calendar, Check, ChevronLeft, ChevronRight, MapPin, Play, Users, X, Gift } from 'lucide-react';
import { theaterService } from '../services/theaterService';
import { roomService } from '../services/roomService';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { SEO } from '../components/common/SEO';
import { getImageUrl, handleImageError } from '../utils/imageUtils';
import { readBookingQuery } from '../utils/bookingFlow';
import { getRoomPriceForDuration } from '../utils/dateUtils';

const fallbackImage = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070';

function Feature({ label }) {
  return <div className="flex min-w-[88px] flex-col items-center gap-2 text-center text-[10px] font-medium text-[#5f5148]"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f6e5d5] text-sm text-[#9a5919]">✦</span><span>{label}</span></div>;
}

function RoomSlot({ slot, date, selected, onChoose, onSelect }) {
  const isBooked = date && slot.available === false;
  const isChecking = date && slot.available === undefined;
  const isAvailable = !isBooked && !isChecking;
  const goToBooking = () => {
    if (!date) {
      onChoose();
      return;
    }
    if (isAvailable) onSelect(slot);
  };
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={goToBooking}
        disabled={!isAvailable}
        className={`inline-flex h-[28px] items-center justify-center rounded-[6px] border px-2.5 py-0.5 text-center text-[10px] font-medium transition-colors ${selected
            ? 'border-[#208653] bg-[#208653] text-white shadow-sm'
            : isBooked
              ? 'cursor-not-allowed border-[#e0e0e0] bg-[#f5f5f5] text-[#a0a0a0] opacity-80'
              : isChecking
                ? 'cursor-wait border-[#e0e0e0] bg-[#fafafa] text-[#666666]'
                : 'cursor-pointer border-[#d0d0d0] bg-white text-[#333333] hover:border-[#a9651c] hover:bg-[#fffaf5]'
          }`}
      >
        <div className="flex items-center gap-1 whitespace-nowrap text-[10px] font-bold">
          {selected && <Check className="h-3 w-3" />}
          <span>{slot.displayTime || (slot.startTime ? `${slot.startTime} – ${slot.endTime}` : slot.time)}</span>
        </div>
        {slot.duration && (
          <div className={`mt-0.5 text-[9px] font-medium ${selected ? 'text-[#a8e6c7]' : 'text-[#75685f]'}`}>
            {slot.duration} Hour{slot.duration > 1 ? 's' : ''}
          </div>
        )}
      </button>
      {slot.discount && <span className="text-[8px] font-bold leading-none text-[#208653]">{slot.discount}</span>}
    </div>
  );
}

function RoomCard({ room, theater, date, availability, selected, selectedSlot, onChooseDate, onSelectRoom, onSelectSlot, onBook }) {
  const [roomImageIndex, setRoomImageIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [selectedDurationFilter, setSelectedDurationFilter] = useState(2);
  const isAvailabilityLoading = Boolean(availability?.loading);
  const availabilityFailed = Boolean(availability?.error);
  const configuredSlots = (room.slots || []).filter((slot) => slot.isActive !== false).map((slot) => ({ ...slot, time: `${slot.startTime} - ${slot.endTime}` }));
  const allSlots = availability?.data?.slots || configuredSlots;
  
  const getSlotDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return 2;
    const parseTime = (timeStr) => {
      const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!match) return 0;
      let h = parseInt(match[1], 10);
      const m = parseInt(match[2], 10);
      const ampm = match[3].toUpperCase();
      if (h === 12) h = 0;
      if (ampm === 'PM') h += 12;
      return h + m / 60;
    };
    let start = parseTime(startTime);
    let end = parseTime(endTime);
    if (end < start) end += 24;
    return Math.round(end - start) || 2;
  };

  const slots = allSlots.map(slot => {
    const originalTime = slot.time || `${slot.startTime} - ${slot.endTime}`;
    let [start, end] = originalTime.split(' - ');
    if (originalTime.includes(' – ')) [start, end] = originalTime.split(' – ');
    const calculatedDuration = getSlotDuration(start?.trim(), end?.trim());
    return { ...slot, displayTime: `${start?.trim()} – ${end?.trim()}`, originalTime, duration: calculatedDuration };
  });

  const roomImages = [room.image, ...(room.galleryImages || [])].filter(Boolean).filter((image, index, images) => (getImageUrl(image) || image) && images.findIndex((candidate) => (getImageUrl(candidate) || candidate) === (getImageUrl(image) || image)) === index);
  const roomImage = roomImages[roomImageIndex] ? getImageUrl(roomImages[roomImageIndex]) : null;
  const displayedFeatures = [...(room.features || []), ...(room.amenities || [])].filter(Boolean).slice(0, 4);
  
  const selectedDuration = selectedSlot ? (selectedSlot.duration || getSlotDuration(selectedSlot.originalTime?.split(' - ')[0], selectedSlot.originalTime?.split(' - ')[1])) : selectedDurationFilter;
  const currentPrice = selectedDuration ? getRoomPriceForDuration(room, selectedDuration) : 0;

  const book = () => {
    if (!date) return onChooseDate();
    if (!selectedSlot) return onSelectSlot(null);
    onBook(room, selectedSlot, selectedDuration || 2);
  };

  const handleCardClick = (event) => {
    if (!event.target.closest('button, a, select, input')) onSelectRoom(room._id);
  };

  return <article onClick={handleCardClick} className={`flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-[16px] border bg-[#fffaf5] shadow-[0_4px_16px_rgba(75,43,20,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(75,43,20,0.12)] ${selected ? 'border-[#9b5417] bg-[#fff8ef] ring-2 ring-[#f0d4b8]' : 'border-[#ead9ca]'}`}>
    <div className="relative h-[190px] overflow-hidden bg-[#eadfce]">
      {roomImage ? <img src={roomImage} alt={room.name} onError={handleImageError} className="h-full w-full object-cover object-center" /> : <div className="flex h-full items-center justify-center text-xs text-[#8d7a6c]">Room image unavailable</div>}
      {roomImages.length > 1 && <><button type="button" aria-label="Previous room image" onClick={() => setRoomImageIndex((roomImageIndex + roomImages.length - 1) % roomImages.length)} className="absolute left-3 top-1/2 rounded-full bg-[#252238]/75 p-2 text-white"><ChevronLeft className="h-4 w-4" /></button><button type="button" aria-label="Next room image" onClick={() => setRoomImageIndex((roomImageIndex + 1) % roomImages.length)} className="absolute right-3 top-1/2 rounded-full bg-[#252238]/75 p-2 text-white"><ChevronRight className="h-4 w-4" /></button></>}
      {room.rating > 0 && <span className="absolute right-3 top-3 rounded-full bg-[#252238]/90 px-2 py-1 text-[10px] font-bold text-white">★ {room.rating.toFixed(1)}</span>}
      {(theater.theatreVideoUrl || theater.branchVideoUrl) && <div className="absolute bottom-3 left-3 flex gap-2">{theater.theatreVideoUrl && <a href={theater.theatreVideoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[9px] font-bold text-[#302638]"><Play className="h-3 w-3 fill-current text-[#1e5bb8]" /> Theatre Video</a>}{theater.branchVideoUrl && <a href={theater.branchVideoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[9px] font-bold text-[#302638]"><Play className="h-3 w-3 fill-current text-[#1e5bb8]" /> Branch Video</a>}</div>}
    </div>
    <div className="flex flex-1 flex-col p-3">
      <div className="flex items-start justify-between gap-2"><div><h3 className="text-[18px] font-extrabold text-[#17171c]">{room.name}</h3>{selected && <p className="mt-1 text-[10px] font-bold text-[#9b5417]">✓ Selected room</p>}</div></div>
      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-[#665951]">{room.couple ? <span className="flex items-center gap-1"><Users className="h-3 w-3" /> Couple: {room.couple}</span> : null}<span className="flex items-center gap-1"><Users className="h-3 w-3" /> Maximum Members: {room.maximumMembers}</span><span className="flex items-center gap-1"><Users className="h-3 w-3" /> Family Friend</span></div>
      {room.location && (
        <div className="mt-1.5 flex items-start gap-1 text-[10px] text-[#665951]">
          <MapPin className="h-3 w-3 shrink-0 mt-0.5 text-[#8c5211]" />
          <a
            href={room.googleMapLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(room.location)}`}
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#8c5211] hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {room.location}
          </a>
        </div>
      )}
      {displayedFeatures.length > 0 && <div className="mt-3 grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-[#5f5148]">{displayedFeatures.map((feature) => <span key={feature} className="flex items-center gap-1"><Check className="h-3 w-3 text-[#8c5211]" />{feature}</span>)}</div>}
      {room.description && (
        <p 
          onClick={(e) => {
            e.stopPropagation();
            setIsDescriptionExpanded(!isDescriptionExpanded);
          }}
          className={`mt-3 min-h-[30px] text-[10px] leading-4 text-[#75685f] cursor-pointer transition-all ${isDescriptionExpanded ? '' : 'line-clamp-2'}`}
          title={isDescriptionExpanded ? "Click to show less" : "Click to expand"}
        >
          {room.description}
        </p>
      )}
      <div className="mt-3"><div className="mb-3 flex flex-wrap items-center gap-1.5 text-[10px] font-medium text-[#5f5148]"><span className="flex items-center gap-1"><Gift className="h-3 w-3" /> Add Cake, Fog entry etc in next step</span> <span className="text-[#a89f91]">•</span> <span className="flex items-center gap-1 text-[#208653]"><Check className="h-3 w-3" /> Free Cancellation*</span></div>
      


      <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-[#28212b]">Select Duration</p>
      <div className="mb-4 flex flex-wrap gap-2">
        {[1, 2, 3].map((duration) => (
          <button
            key={duration}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedDurationFilter(duration);
              if (selectedSlot && selectedSlot.duration !== duration) {
                onSelectSlot(null);
              }
            }}
            className={`rounded-[6px] px-3 py-1.5 text-[10px] font-bold transition-colors ${
              selectedDurationFilter === duration
                ? 'bg-[#9b5417] text-white shadow-sm'
                : 'border border-[#d0d0d0] bg-white text-[#5f5148] hover:border-[#a9651c] hover:bg-[#fffaf5]'
            }`}
          >
            {duration} Hour{duration > 1 ? 's' : ''}
          </button>
        ))}
      </div>

      <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-[#28212b]">Select Time Slot</p>
      
      {!date && <p className="mb-2 rounded-md bg-[#fff9d9] p-1.5 text-[9px] text-[#80651a]">Select a date to check availability.</p>}
      {date && isAvailabilityLoading && <p className="mb-2 rounded-md bg-[#f5eee8] p-1.5 text-[9px] text-[#76685e]">Checking availability...</p>}
      {date && availabilityFailed && <p className="mb-2 rounded-md bg-red-50 p-1.5 text-[9px] text-red-600">Unable to load availability.</p>}
      
      <div className="flex flex-wrap items-start gap-1.5">
        {slots.filter(s => s.duration === selectedDurationFilter).length ? (
          slots.filter(s => s.duration === selectedDurationFilter).map((slot, index) => {
            const slotTime = slot.originalTime;
            const slotId = slot.id || slot._id;
            const selectedId = selectedSlot?.id || selectedSlot?._id;
            const isSelected = Boolean(selectedSlot) && (slotId && selectedId ? slotId === selectedId : slotTime === (selectedSlot.originalTime || selectedSlot.time || `${selectedSlot.startTime} - ${selectedSlot.endTime}`));
            return <RoomSlot key={slotId || slotTime || index} slot={slot} date={date} selected={isSelected} onChoose={onChooseDate} onSelect={onSelectSlot} />;
          })
        ) : (
          <span className="text-[9px] text-[#85756b]">No {selectedDurationFilter}-hour slots available for this date.</span>
        )}
      </div>
      <div className="mt-2.5 flex flex-wrap gap-2.5 text-[9px] text-[#665951]">
        <span className="flex items-center gap-1"><i className="inline-block h-2 w-2 rounded-full border border-[#d0d0d0] bg-white" />Available</span>
        <span className="flex items-center gap-1"><i className="inline-block h-2 w-2 rounded-full bg-[#208653]" />Selected</span>
        <span className="flex items-center gap-1"><i className="inline-block h-2 w-2 rounded-full bg-[#e5e5e5]" />Sold out</span>
      </div>
    </div>
      <div className="mt-auto flex flex-col gap-3 border-t border-[#ead9ca] pt-3">
        {selectedSlot ? (
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[12px] font-bold text-[#208653]">✓ {selectedSlot.displayTime || selectedSlot.originalTime}</span>
              <span className="text-[11px] font-medium text-[#75685f]">Duration: {selectedDuration} Hour{selectedDuration > 1 ? 's' : ''}</span>
              {currentPrice > 0 ? (
                <span className="mt-1 text-[22px] font-extrabold text-[#17171c]">₹{currentPrice}</span>
              ) : (
                <span className="mt-1 text-[16px] font-extrabold text-red-600">Price unavailable</span>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[12px] font-medium italic text-[#85756b]">Price shown after selecting a time slot</span>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-[#75685f]">For up to {room.maximumMembers} people</p>
          <button type="button" disabled={!selected || !date || !selectedSlot || currentPrice === 0 || currentPrice === undefined} onClick={book} className="rounded-full bg-[#9b5417] px-4 py-2.5 text-[11px] font-bold text-white shadow-sm transition hover:bg-[#7e4210] disabled:cursor-not-allowed disabled:opacity-45">Book Now <span className="ml-1">→</span></button>
        </div>
      </div>
    </div>
  </article>;
}

export function TheaterDetailsPage() {
  const { theaterId } = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const bookingQuery = readBookingQuery(searchParams);
  const preselectedDate = location.state?.selectedDate || bookingQuery.date || '';
  const preselectedRoomId = searchParams.get('roomId') || null;
  const hasPreselectedBooking = Boolean(preselectedDate);

  const [theater, setTheater] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(preselectedRoomId);
  const [date, setDate] = useState(preselectedDate);
  const [roomAvailability, setRoomAvailability] = useState({});
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [datePrompt, setDatePrompt] = useState(false);
  const [slotPrompt, setSlotPrompt] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  useEffect(() => {
    setDate(preselectedDate);
    setSelectedRoomId(preselectedRoomId);
    setSelectedTimeSlot(null);
  }, [preselectedDate, preselectedRoomId]);

  useEffect(() => {
    setSelectedTimeSlot(null);
    if (!date || !rooms.length) { setRoomAvailability({}); return; }
    const loadingState = Object.fromEntries(rooms.map((room) => [room._id, { loading: true }]));
    setRoomAvailability(loadingState);
    Promise.all(rooms.map((room) => roomService.getAvailability(room._id, date)
      .then((response) => [room._id, response])
      .catch(() => [room._id, { error: true }])))
      .then((entries) => setRoomAvailability(Object.fromEntries(entries)));
  }, [date, rooms]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    if (theaterId) {
      Promise.all([theaterService.getTheaterById(theaterId), roomService.getRooms(theaterId)])
        .then(([theaterResponse, roomsResponse]) => {
          setTheater(theaterResponse.data);
          setRooms(roomsResponse.data || []);
          setSelectedRoomId(preselectedRoomId || null);
          setSelectedTimeSlot(null);
        })
        .catch(setError)
        .finally(() => setLoading(false));
    } else {
      theaterService.getTheaters()
        .then(async (theatersResponse) => {
          const theaters = theatersResponse.data || (Array.isArray(theatersResponse) ? theatersResponse : []);
          const firstTheater = theaters[0];
          setTheater(firstTheater || { name: 'Our Rooms', description: 'Book exclusive private theater rooms for birthday parties, anniversaries, and special events.' });
          try {
            const roomsResponse = await roomService.getAllRooms();
            setRooms(roomsResponse.data || []);
          } catch (roomsErr) {
            setError(roomsErr);
          }
        })
        .catch(async () => {
          try {
            const roomsResponse = await roomService.getAllRooms();
            setTheater({ name: 'Our Rooms', description: 'Book exclusive private theater rooms for birthday parties, anniversaries, and special events.' });
            setRooms(roomsResponse.data || []);
          } catch (err) {
            setError(err);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [theaterId]);

  const images = useMemo(() => {
    const sourceImages = theater?.images || [];
    const seen = new Set();
    return sourceImages.filter((image) => {
      const imageKey = getImageUrl(image) || image;
      if (seen.has(imageKey)) return false;
      seen.add(imageKey);
      return true;
    });
  }, [theater]);

  const chooseDate = () => { if (!date) setDatePrompt(true); };
  const selectRoom = (roomId) => {
    setSelectedRoomId(roomId);
    if (!hasPreselectedBooking) setSelectedTimeSlot(null);
  };
  const chooseSlot = (slot) => {
    if (!slot) {
      setSlotPrompt(true);
      return;
    }
    setSelectedTimeSlot(slot);
  };

  const handleDateChange = (event) => {
    const nextDate = event.target.value;
    setDate(nextDate);
    setDatePrompt(false);
    if (selectedTimeSlot) {
      setSelectedTimeSlot(null);
    }
  };

  const bookRoom = (room, slot, duration) => {
    const tId = theaterId || (room.theater?._id ? room.theater._id : room.theater);
    window.location.assign(`/book/${tId}?roomId=${room._id}&date=${date}&duration=${duration}&slot=${encodeURIComponent(slot.originalTime || slot.time || `${slot.startTime} - ${slot.endTime}`)}${slot.id || slot._id ? `&slotId=${slot.id || slot._id}` : ''}`);
  };

  const sortedRooms = useMemo(() => {
    let filteredRooms = [...rooms];
    if (preselectedRoomId) {
      filteredRooms = filteredRooms.filter(r => r._id === preselectedRoomId);
    }
    return filteredRooms.sort((first, second) => {
      const getPrice = (r) => getRoomPriceForDuration(r, 2); // Default to 2 hours for sorting
      if (sortBy === 'price-low') return getPrice(first) - getPrice(second);
      if (sortBy === 'price-high') return getPrice(second) - getPrice(first);
      if (sortBy === 'members') return (second.maximumMembers || 0) - (first.maximumMembers || 0);
      return (first.sortOrder || 0) - (second.sortOrder || 0) || first.name.localeCompare(second.name);
    });
  }, [rooms, sortBy, preselectedRoomId, date]);

  if (loading) return <LoadingState message="Preparing rooms..." />;
  if (error) return <ErrorState error={error} />;

  return <div className="min-h-screen bg-[#fcf5eb] px-4 pb-20 pt-24 text-[#6b5c52] sm:px-5">
    <SEO title={`${theater?.name || 'Theater'} Rooms | RIO Party House`} />
    <div className="mx-auto max-w-[1240px]">

      {/* FILTER & HEADER BAR */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#17171c]">{sortedRooms.length} {sortedRooms.length === 1 ? 'Room' : 'Rooms'} Available</h2>
          <p className="mt-1 text-xs text-[#76685e]">{hasPreselectedBooking ? 'Selected date is already applied.' : 'Choose a room, select a date and available time slot'}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Date Picker Input */}
          <label className="flex items-center gap-2 text-xs font-bold text-[#594d46]">
            <Calendar className="h-4 w-4 text-[#8c5211]" /> Select Date 
            <input 
              type="date" 
              min={new Date().toISOString().slice(0, 10)} 
              value={date} 
              onChange={handleDateChange} 
              className="rounded-xl border border-[#d9c5b3] bg-white px-3 py-2 text-xs font-bold text-[#17171c] shadow-sm focus:border-[#9b5417] focus:outline-none" 
            />
          </label>

          {/* Sort By Dropdown */}
          <label className="flex items-center gap-2 text-xs font-bold text-[#594d46]">
            Sort by 
            <select 
              value={sortBy} 
              onChange={(event) => setSortBy(event.target.value)} 
              className="rounded-xl border border-[#d9c5b3] bg-white px-3 py-2 text-xs font-bold text-[#17171c] shadow-sm focus:border-[#9b5417] focus:outline-none"
            >
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="members">Maximum Members</option>
            </select>
          </label>
        </div>
      </div>

      {hasPreselectedBooking && (
        <div className="mt-4 rounded-2xl border border-[#ead9ca] bg-[#fffaf5] p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8c5211]">Selected Date</p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm font-bold text-[#17171c]">
            <span>{new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
          </div>
        </div>
      )}

      {!selectedRoomId && rooms.length > 0 && <p className="mt-4 rounded-xl bg-[#fff9d9] p-3 text-xs font-medium text-[#80651a]">Select a room to view available time slots.</p>}
      {selectedRoomId && !date && <p className="mt-4 rounded-xl bg-[#fff9d9] p-3 text-xs font-medium text-[#80651a]">Select a date to view available time slots.</p>}
      
      {rooms.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-[#ead9ca] bg-[#fffaf5] p-8">No rooms are available for this theater yet.</div>
      ) : (
        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {sortedRooms.map((room) => (
            <RoomCard 
              key={room._id} 
              room={room} 
              theater={theater} 
              date={date} 
              availability={roomAvailability[room._id]} 
              selected={selectedRoomId === room._id} 
              selectedSlot={selectedRoomId === room._id ? selectedTimeSlot : null} 
              onChooseDate={chooseDate} 
              onSelectRoom={selectRoom} 
              onSelectSlot={(slot) => { selectRoom(room._id); chooseSlot(slot); }} 
              onBook={bookRoom} 
            />
          ))}
        </div>
      )}

    </div>

    {(datePrompt || slotPrompt) && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4" role="dialog" aria-modal="true">
        <div className="w-full max-w-sm rounded-2xl bg-[#fffaf5] p-6 shadow-xl">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-[#17171c]">{datePrompt ? 'Choose a date first' : 'Choose a time slot first'}</h2>
              <p className="mt-1 text-sm text-[#6b5c52]">{datePrompt ? 'Select a date to check room availability.' : 'Select an available time slot before booking.'}</p>
            </div>
            <button type="button" onClick={() => { setDatePrompt(false); setSlotPrompt(false); }} aria-label="Close"><X className="h-5 w-5" /></button>
          </div>
          {datePrompt && (
            <input 
              autoFocus 
              type="date" 
              min={new Date().toISOString().slice(0, 10)} 
              onChange={(event) => { 
                handleDateChange(event); 
                setDatePrompt(false); 
              }} 
              className="mt-5 w-full rounded-xl border border-[#d9c5b3] bg-white px-4 py-3 text-sm" 
            />
          )}
        </div>
      </div>
    )}
  </div>;
}
