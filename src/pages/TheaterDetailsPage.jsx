import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Calendar, Check, Clock, MapPin, Users } from 'lucide-react';
import { theaterService } from '../services/theaterService';
import { roomService } from '../services/roomService';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { SEO } from '../components/common/SEO';
import { getImageUrl } from '../utils/imageUtils';

export function TheaterDetailsPage() {
  const { theaterId, roomId } = useParams();
  const navigate = useNavigate();
  const [theater, setTheater] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(roomId || '');
  const [date, setDate] = useState('');
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([theaterService.getTheaterById(theaterId), roomService.getRooms(theaterId)])
      .then(([theaterResponse, roomsResponse]) => {
        setTheater(theaterResponse.data);
        setRooms(roomsResponse.data || []);
        setSelectedRoomId(roomId || roomsResponse.data?.[0]?._id || '');
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [theaterId, roomId]);

  useEffect(() => {
    if (!selectedRoomId || !date) {
      setAvailability(null);
      return;
    }
    roomService.getAvailability(selectedRoomId, date).then(setAvailability).catch(setError);
  }, [selectedRoomId, date]);

  if (loading) return <LoadingState message="Preparing rooms..." />;
  if (error) return <ErrorState error={error} />;

  const selectedRoom = rooms.find((room) => room._id === selectedRoomId);
  const theaterImage = theater?.images?.[0];

  return (
    <div className="min-h-screen bg-[#fcf5eb] px-5 pb-20 pt-28 text-[#6b5c52]">
      <SEO title={`${theater?.name || 'Theater'} Rooms | RIO Party House`} />
      <div className="mx-auto max-w-[1180px]">
        <div className="overflow-hidden rounded-[24px] border border-[#ead9ca] bg-[#fffaf5] shadow-sm">
          {theaterImage && <img src={getImageUrl(theaterImage)} alt={theater.name} className="h-64 w-full object-cover" />}
          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8c5211]">Private cinema</p>
                <h1 className="text-3xl font-extrabold text-[#17171c]">{theater.name}</h1>
                <p className="mt-2 flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-[#8c5211]" />{theater.location?.name || theater.address || 'Bengaluru'}</p>
              </div>
              {theater.googleMapsLink && <a href={theater.googleMapsLink} target="_blank" rel="noreferrer" className="rounded-full bg-[#e8f0fe] px-4 py-2 text-xs font-bold text-[#1967d2]">MAPS</a>}
            </div>
            <p className="mt-5 max-w-3xl text-sm leading-7">{theater.description}</p>
          </div>
        </div>

        <h2 className="mt-10 text-2xl font-extrabold text-[#17171c]">Choose Your Room</h2>
        {rooms.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-[#ead9ca] bg-[#fffaf5] p-8">No rooms are available for this theater yet.</div>
        ) : (
          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr]">
            <div className="space-y-4">
              {rooms.map((room) => (
                <button key={room._id} onClick={() => { setSelectedRoomId(room._id); setAvailability(null); }} className={`w-full rounded-2xl border bg-[#fffaf5] p-4 text-left transition ${selectedRoomId === room._id ? 'border-[#a9651c] shadow-md' : 'border-[#ead9ca]'}`}>
                  <div className="flex gap-4">
                    {room.image && <img src={getImageUrl(room.image)} alt={room.name} className="h-24 w-32 rounded-xl object-cover" />}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-bold text-[#17171c]">{room.name}</h3>
                      <p className="mt-1 flex items-center gap-1 text-xs"><Users className="h-3.5 w-3.5" /> Up to {room.capacity} people</p>
                      <p className="mt-2 font-bold text-[#a9651c]">₹{room.basePrice} / hour</p>
                      <p className="text-xs text-[#6b5c52]">Additional guest: ₹{room.additionalGuestPrice ?? room.extraGuestPrice ?? 0} / person</p>
                    </div>
                  </div>
                  {room.features?.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{room.features.slice(0, 4).map((feature) => <span key={feature} className="inline-flex items-center gap-1 text-xs"><Check className="h-3 w-3 text-[#a9651c]" />{feature}</span>)}</div>}
                </button>
              ))}
            </div>

            {selectedRoom && <div className="rounded-2xl border border-[#ead9ca] bg-[#fffaf5] p-5">
              <h3 className="text-lg font-bold text-[#17171c]">{selectedRoom.name} availability</h3>
              <label className="mt-5 block text-xs font-bold uppercase tracking-wider text-[#8c5211]">Select date</label>
              <div className="relative mt-2"><Calendar className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-[#8c5211]" /><input type="date" min={new Date().toISOString().slice(0, 10)} value={date} onChange={(event) => setDate(event.target.value)} className="w-full rounded-xl border border-[#ead9ca] bg-white py-2.5 pl-10 pr-3 text-sm" /></div>
              {!date && <p className="mt-5 rounded-xl bg-[#fff9d9] p-4 text-sm font-medium text-[#80651a]">Please select a date to view available time slots.</p>}
              {date && availability && <div className="mt-5 space-y-2"><p className="mb-3 text-sm font-bold text-[#17171c]">{availability.data?.availableSlots?.length || 0} slots available</p>{(availability.data?.slots || []).map((slot) => <button key={slot.id} disabled={!slot.available} onClick={() => navigate(`/book/${theaterId}?roomId=${selectedRoom._id}&date=${date}&slot=${encodeURIComponent(slot.time)}`)} className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-bold ${slot.available ? 'border-[#bde8ce] bg-[#ecfff3] text-[#198754]' : 'cursor-not-allowed border-red-100 bg-red-50 text-red-400'}`}><span className="flex items-center gap-2"><Clock className="h-4 w-4" />{slot.time}</span><span>{slot.available ? 'AVAILABLE' : 'BOOKED'}</span></button>)}</div>}
              {date && !availability && <p className="mt-5 text-sm">Loading availability...</p>}
            </div>}
          </div>
        )}
        <Link to="/theaters" className="mt-8 inline-block text-sm font-bold text-[#8c5211]">Back to theaters</Link>
      </div>
    </div>
  );
}
