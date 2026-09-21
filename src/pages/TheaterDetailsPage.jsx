import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { Calendar, Check, ChevronLeft, ChevronRight, MapPin, Play, Users, X } from 'lucide-react';
import { theaterService } from '../services/theaterService';
import { roomService } from '../services/roomService';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { SEO } from '../components/common/SEO';
import { getImageUrl } from '../utils/imageUtils';
import { readBookingQuery } from '../utils/bookingFlow';

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
    <button
      type="button"
      onClick={goToBooking}
      disabled={!isAvailable}
      className={`inline-flex min-h-[42px] items-center justify-center rounded-[8px] border px-3 py-1.5 text-center text-[11px] font-medium leading-tight transition ${
        selected
          ? 'border-[#208653] bg-[#208653] text-white shadow-sm'
          : isBooked
          ? 'cursor-not-allowed border-[#c7c7c7] bg-[#e5e5e5] text-[#888888]'
          : isChecking
          ? 'cursor-wait border-[#d9d9d9] bg-[#f7f7f7] text-[#222222]'
          : 'cursor-pointer border-[#c9c9c9] bg-white text-[#111111] hover:border-[#a9651c] hover:bg-[#fffaf5]'
      }`}
    >
      <span className="flex items-center gap-1">
        {selected && '✓ '}
        <span className="flex flex-col sm:flex-row sm:items-center sm:gap-1">
          <span>{slot.startTime || slot.time?.split(' - ')[0]}</span>
          <span className="hidden sm:inline">–</span>
          <span>{slot.endTime || slot.time?.split(' - ')[1]}</span>
        </span>
      </span>
    </button>
  );
}

function RoomCard({ room, theater, date, availability, selected, selectedSlot, onChooseDate, onSelectRoom, onSelectSlot, onBook }) {
  const [roomImageIndex, setRoomImageIndex] = useState(0);
  const isAvailabilityLoading = Boolean(availability?.loading);
  const availabilityFailed = Boolean(availability?.error);
  const configuredSlots = (room.slots || []).filter((slot) => slot.isActive !== false).map((slot) => ({ ...slot, time: `${slot.startTime} - ${slot.endTime}` }));
  const slots = availability?.data?.slots || configuredSlots;
  const roomImages = [room.image, ...(room.galleryImages || [])].filter(Boolean).filter((image, index, images) => (getImageUrl(image) || image) && images.findIndex((candidate) => (getImageUrl(candidate) || candidate) === (getImageUrl(image) || image)) === index);
  const roomImage = roomImages[roomImageIndex] ? getImageUrl(roomImages[roomImageIndex]) : null;
  const displayedFeatures = [...(room.features || []), ...(room.amenities || [])].filter(Boolean).slice(0, 4);
  const book = () => {
    if (!date) return onChooseDate();
    if (!selectedSlot) return onSelectSlot(null);
    onBook(room, selectedSlot);
  };

  const handleCardClick = (event) => {
    if (!event.target.closest('button, a, select, input')) onSelectRoom(room._id);
  };

  return <article onClick={handleCardClick} className={`flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-[16px] border bg-[#fffaf5] shadow-[0_4px_16px_rgba(75,43,20,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(75,43,20,0.12)] ${selected ? 'border-[#9b5417] bg-[#fff8ef] ring-2 ring-[#f0d4b8]' : 'border-[#ead9ca]'}`}>
    <div className="relative h-[190px] overflow-hidden bg-[#eadfce]">
      {roomImage ? <img src={roomImage} alt={room.name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-xs text-[#8d7a6c]">Room image unavailable</div>}
      {roomImages.length > 1 && <><button type="button" aria-label="Previous room image" onClick={() => setRoomImageIndex((roomImageIndex + roomImages.length - 1) % roomImages.length)} className="absolute left-3 top-1/2 rounded-full bg-[#252238]/75 p-2 text-white"><ChevronLeft className="h-4 w-4" /></button><button type="button" aria-label="Next room image" onClick={() => setRoomImageIndex((roomImageIndex + 1) % roomImages.length)} className="absolute right-3 top-1/2 rounded-full bg-[#252238]/75 p-2 text-white"><ChevronRight className="h-4 w-4" /></button></>}
      {room.rating > 0 && <span className="absolute right-3 top-3 rounded-full bg-[#252238]/90 px-2 py-1 text-[10px] font-bold text-white">★ {room.rating.toFixed(1)}</span>}
      {(theater.theatreVideoUrl || theater.branchVideoUrl) && <div className="absolute bottom-3 left-3 flex gap-2">{theater.theatreVideoUrl && <a href={theater.theatreVideoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[9px] font-bold text-[#302638]"><Play className="h-3 w-3 fill-current text-[#1e5bb8]" /> Theatre Video</a>}{theater.branchVideoUrl && <a href={theater.branchVideoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[9px] font-bold text-[#302638]"><Play className="h-3 w-3 fill-current text-[#1e5bb8]" /> Branch Video</a>}</div>}
    </div>
    <div className="flex flex-1 flex-col p-3">
      <div className="flex items-start justify-between gap-2"><div><h3 className="text-[18px] font-extrabold text-[#17171c]">{room.name}</h3>{selected && <p className="mt-1 text-[10px] font-bold text-[#9b5417]">✓ Selected room</p>}</div></div>
      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-[#665951]"><span className="flex items-center gap-1"><Users className="h-3 w-3" /> Couple: {room.couple ?? 2}</span><span className="flex items-center gap-1"><Users className="h-3 w-3" /> Maximum Members: {room.maximumMembers}</span></div>
      {displayedFeatures.length > 0 && <div className="mt-3 grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-[#5f5148]">{displayedFeatures.map((feature) => <span key={feature} className="flex items-center gap-1"><Check className="h-3 w-3 text-[#8c5211]" />{feature}</span>)}</div>}
      {room.description && <p className="mt-3 line-clamp-2 min-h-[30px] text-[10px] leading-4 text-[#75685f]">{room.description}</p>}
      <div className="mt-3"><p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-[#28212b]">Select Time Slot</p>{!date && <p className="mb-2 rounded-lg bg-[#fff9d9] p-2 text-[10px] text-[#80651a]">Select a date to check availability.</p>}{date && isAvailabilityLoading && <p className="mb-2 rounded-lg bg-[#f5eee8] p-2 text-[10px] text-[#76685e]">Checking availability...</p>}{date && availabilityFailed && <p className="mb-2 rounded-lg bg-red-50 p-2 text-[10px] text-red-600">Unable to load availability.</p>}<div className="flex flex-wrap items-start gap-2">{slots.length ? slots.map((slot, index) => { const slotTime = slot.time || `${slot.startTime} - ${slot.endTime}`; const slotId = slot.id || slot._id; const selectedId = selectedSlot?.id || selectedSlot?._id; const isSelected = Boolean(selectedSlot) && (slotId && selectedId ? slotId === selectedId : slotTime === (selectedSlot.time || `${selectedSlot.startTime} - ${selectedSlot.endTime}`)); return <RoomSlot key={slotId || slotTime || index} slot={slot} date={date} selected={isSelected} onChoose={onChooseDate} onSelect={onSelectSlot} />; }) : <span className="text-[10px] text-[#85756b]">No time slots configured</span>}</div><div className="mt-3 flex flex-wrap gap-3 text-[10px] text-[#76685e]"><span className="flex items-center gap-1.5"><i className="inline-block h-2.5 w-2.5 rounded-full bg-white ring-1 ring-[#b9a0c6]" />Available</span><span className="flex items-center gap-1.5"><i className="inline-block h-2.5 w-2.5 rounded-full bg-[#208653]" />Selected</span><span className="flex items-center gap-1.5"><i className="inline-block h-2.5 w-2.5 rounded-full bg-[#d8d3ce]" />Sold out</span></div></div>
      <div className="mt-auto flex items-end justify-between gap-2 border-t border-[#ead9ca] pt-3"><div><p className="text-[18px] font-extrabold text-[#17171c]">₹{room.price ?? 0}</p><p className="text-[9px] text-[#75685f]">For up to {room.maximumMembers} people</p></div><button type="button" disabled={!selected || !date || !selectedSlot} onClick={book} className="rounded-full bg-[#9b5417] px-4 py-2.5 text-[11px] font-bold text-white shadow-sm transition hover:bg-[#7e4210] disabled:cursor-not-allowed disabled:opacity-45">Book Now <span className="ml-1">→</span></button></div>
    </div>
  </article>;
}

export function TheaterDetailsPage() {
  const { theaterId } = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const bookingQuery = readBookingQuery(searchParams);
  const preselectedDate = location.state?.selectedDate || bookingQuery.date || '';
  const hasPreselectedBooking = Boolean(preselectedDate);

  const [theater, setTheater] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
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
    setSelectedRoomId(null);
    setSelectedTimeSlot(null);
  }, [preselectedDate]);

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
    Promise.all([theaterService.getTheaterById(theaterId), roomService.getRooms(theaterId)])
      .then(([theaterResponse, roomsResponse]) => { setTheater(theaterResponse.data); setRooms(roomsResponse.data || []); setSelectedRoomId(null); setSelectedTimeSlot(null); })
      .catch(setError)
      .finally(() => setLoading(false));
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
  const currentImage = getImageUrl(images[galleryIndex]) || fallbackImage;
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
  const bookRoom = (room, slot) => {
    window.location.assign(`/book/${theaterId}?roomId=${room._id}&date=${date}&slot=${encodeURIComponent(slot.time || `${slot.startTime} - ${slot.endTime}`)}${slot.id || slot._id ? `&slotId=${slot.id || slot._id}` : ''}`);
  };
  const sortedRooms = useMemo(() => [...rooms].sort((first, second) => {
    if (sortBy === 'price-low') return (first.price || 0) - (second.price || 0);
    if (sortBy === 'price-high') return (second.price || 0) - (first.price || 0);
    if (sortBy === 'members') return (second.maximumMembers || 0) - (first.maximumMembers || 0);
    return (first.sortOrder || 0) - (second.sortOrder || 0) || first.name.localeCompare(second.name);
  }), [rooms, sortBy]);
  const theaterFeatures = (theater?.amenities || []).filter(Boolean).slice(0, 5);

  if (loading) return <LoadingState message="Preparing rooms..." />;
  if (error) return <ErrorState error={error} />;

  return <div className="min-h-screen bg-[#fcf5eb] px-4 pb-20 pt-24 text-[#6b5c52] sm:px-5">
    <SEO title={`${theater?.name || 'Theater'} Rooms | RIO Party House`} />
    <div className="mx-auto max-w-[1240px]">
      <section className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.4fr)]">
        <div className="min-h-[260px] overflow-hidden rounded-[18px] lg:min-h-[300px]">
          <div className="relative min-h-[260px] overflow-hidden rounded-[12px] bg-[#eadfce] lg:min-h-[300px]"><img src={currentImage} alt={theater.name} className="h-full w-full object-cover" /><span className="absolute bottom-3 left-3 rounded-full bg-black/65 px-2 py-1 text-[10px] font-bold text-white">▣ {images.length ? galleryIndex + 1 : 0} / {images.length}</span>{images.length > 1 && <><button type="button" onClick={() => setGalleryIndex((galleryIndex + images.length - 1) % images.length)} className="absolute left-3 top-1/2 rounded-full bg-black/45 p-2 text-white"><ChevronLeft className="h-4 w-4" /></button><button type="button" onClick={() => setGalleryIndex((galleryIndex + 1) % images.length)} className="absolute right-3 top-1/2 rounded-full bg-black/45 p-2 text-white"><ChevronRight className="h-4 w-4" /></button></>}</div>
        </div>
        <div className="rounded-[18px] bg-[#fcf5eb] py-1 lg:px-2"><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#b38c71]">Private cinema</p><h1 className="mt-1 text-3xl font-extrabold leading-tight text-[#080b28] sm:text-4xl">{theater.name}</h1><p className="mt-2 flex items-center gap-1.5 text-xs"><MapPin className="h-4 w-4 text-[#8c5211]" />{theater.location?.name || theater.address || 'Location unavailable'}</p><p className="mt-4 max-w-2xl text-xs leading-5 text-[#65574f]">{theater.description}</p>{theaterFeatures.length > 0 && <div className="mt-5 flex flex-wrap justify-between gap-4">{theaterFeatures.map((feature) => <Feature key={feature} label={feature} />)}</div>}</div>
      </section>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-extrabold text-[#17171c]">{rooms.length} Rooms Available</h2><p className="mt-1 text-xs text-[#76685e]">{hasPreselectedBooking ? 'Selected date is already applied.' : 'Choose a room, date and available time slot'}</p></div><div className="flex flex-wrap items-center gap-3"><label className="flex items-center gap-2 text-xs font-bold text-[#594d46]"><Calendar className="h-4 w-4 text-[#8c5211]" /> Date <input type="date" min={new Date().toISOString().slice(0, 10)} value={date} onChange={handleDateChange} className="rounded-lg border border-[#d9c5b3] bg-white px-3 py-2 text-xs" /></label><label className="flex items-center gap-2 text-xs font-bold text-[#594d46]">Sort by <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="rounded-lg border border-[#d9c5b3] bg-white px-3 py-2 text-xs"><option value="recommended">Recommended</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option><option value="members">Maximum Members</option></select></label></div></div>
      {hasPreselectedBooking && (
        <div className="mt-4 rounded-2xl border border-[#ead9ca] bg-[#fffaf5] p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8c5211]">Selected</p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm font-bold text-[#17171c]">
            <span>{new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
          </div>
        </div>
      )}
      {!selectedRoomId && rooms.length > 0 && <p className="mt-4 rounded-xl bg-[#fff9d9] p-3 text-xs font-medium text-[#80651a]">Select a room to view available time slots.</p>}
      {selectedRoomId && !date && <p className="mt-4 rounded-xl bg-[#fff9d9] p-3 text-xs font-medium text-[#80651a]">Select a date to view available time slots.</p>}
      {rooms.length === 0 ? <div className="mt-5 rounded-2xl border border-[#ead9ca] bg-[#fffaf5] p-8">No rooms are available for this theater yet.</div> : <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{sortedRooms.map((room) => <RoomCard key={room._id} room={room} theater={theater} date={date} availability={roomAvailability[room._id]} selected={selectedRoomId === room._id} selectedSlot={selectedRoomId === room._id ? selectedTimeSlot : null} onChooseDate={chooseDate} onSelectRoom={selectRoom} onSelectSlot={(slot) => { selectRoom(room._id); chooseSlot(slot); }} onBook={bookRoom} />)}</div>}
      <Link to="/theaters" className="mt-8 inline-block text-sm font-bold text-[#8c5211]">Back to theaters</Link>
    </div>
    {(datePrompt || slotPrompt) && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4" role="dialog" aria-modal="true"><div className="w-full max-w-sm rounded-2xl bg-[#fffaf5] p-6 shadow-xl"><div className="flex items-start justify-between"><div><h2 className="text-lg font-extrabold text-[#17171c]">{datePrompt ? 'Choose a date first' : 'Choose a time slot first'}</h2><p className="mt-1 text-sm text-[#6b5c52]">{datePrompt ? 'Select a date to check room availability.' : 'Select an available time slot before booking.'}</p></div><button type="button" onClick={() => { setDatePrompt(false); setSlotPrompt(false); }} aria-label="Close"><X className="h-5 w-5" /></button></div>{datePrompt && <input autoFocus type="date" min={new Date().toISOString().slice(0, 10)} onChange={(event) => { setDate(event.target.value); setDatePrompt(false); }} className="mt-5 w-full rounded-xl border border-[#d9c5b3] bg-white px-4 py-3 text-sm" />}</div></div>}
  </div>;
}
