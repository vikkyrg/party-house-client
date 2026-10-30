import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, ChevronDown, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { roomService } from '../../services/roomService';

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function HeroBookingWidget() {
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [validationError, setValidationError] = useState('');

  const { data: roomsResponse } = useQuery({
    queryKey: ['rooms', 'all'],
    queryFn: () => roomService.getAllRooms(),
  });
  const rooms = roomsResponse?.data || [];

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dateInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateClick = () => {
    if (dateInputRef.current) {
      try {
        dateInputRef.current.showPicker();
      } catch (e) {
        dateInputRef.current.focus();
      }
    }
  };

  const handleBookNow = () => {
    if (!selectedRoom) {
      setValidationError('Please select a room.');
      return;
    }

    if (!selectedDate) {
      setValidationError('Please select a date.');
      return;
    }

    setValidationError('');
    
    // Find selected room to get its theaterId if available
    const room = rooms.find(r => r._id === selectedRoom);
    const theaterId = room?.theater?._id || room?.theater || '';
    
    // Build query with roomId and date
    let query = `roomId=${selectedRoom}&date=${selectedDate}`;
    const url = theaterId ? `/theaters/${theaterId}?${query}` : `/theaters?${query}`;
    
    navigate(url);
  };

  const handleBookOnCall = () => {
    window.location.href = 'tel:+918147897771';
  };

  // Check if both room and date are selected
  const isEnquiryReady = Boolean(selectedRoom && selectedDate);

  // WhatsApp click handler
  const handleWhatsAppEnquiry = () => {
    if (!selectedRoom || !selectedDate) {
      return;
    }

    setValidationError('');

    const roomObj = rooms.find((r) => r._id === selectedRoom);
    const roomName = roomObj?.name || 'Selected Theater';

    // Format date as DD-MM-YYYY (e.g. 06-11-2026)
    let formattedDate = selectedDate;
    if (selectedDate.includes('-')) {
      const parts = selectedDate.split('-');
      if (parts.length === 3) {
        formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }

    const message = `Hello Rio Party House,\n\nI would like to enquire about booking a theater.\n\nSelected Room: ${roomName}\nPreferred Date: ${formattedDate}\n\nPlease let me know the availability and booking details.\n\nThank you.`;

    const whatsappUrl = `https://wa.me/918147897771?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="w-full max-w-[800px] mx-auto mt-6 bg-white/95 backdrop-blur-md rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.25)] overflow-hidden text-left font-sans border border-[#e8ceb5]"
    >
      <div className="p-5 md:p-8">
        <div className="space-y-3">
          <div 
            ref={dropdownRef}
            className="relative border border-[#eaddd0] rounded-xl px-4 py-2.5 flex flex-col hover:border-[#8c5211] transition-colors focus-within:border-[#8c5211] cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <label className="text-[10px] font-bold tracking-widest uppercase text-[#8c5211] mb-0.5 flex items-center gap-2 cursor-pointer pointer-events-none">
              ROOM
            </label>
            <div className="relative w-full h-[21px] flex items-center">
              <span className={`text-[14px] font-bold ${selectedRoom ? 'text-[#1a1c21]' : 'text-[#1a1c21]/60'}`}>
                {selectedRoom ? rooms.find(r => r._id === selectedRoom)?.name : 'Select a room'}
              </span>
              <ChevronDown className={`absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c5211] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>
            
            {isDropdownOpen && (
              <div className="absolute top-[105%] left-0 w-full bg-white border border-[#eaddd0] rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] z-50 max-h-[220px] overflow-y-auto py-1">
                {rooms.length === 0 ? (
                  <div className="px-4 py-3 text-[13px] text-[#6b5c52]">Loading rooms...</div>
                ) : (
                  rooms.map((room) => (
                    <div 
                      key={room._id}
                      className={`px-4 py-2.5 text-[14px] font-bold cursor-pointer transition-colors hover:bg-[#fffaf5] hover:text-[#8c5211] ${selectedRoom === room._id ? 'bg-[#fffaf5] text-[#8c5211]' : 'text-[#1a1c21]'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRoom(room._id);
                        setValidationError('');
                        setIsDropdownOpen(false);
                      }}
                    >
                      {room.name}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div 
            className="relative border border-[#eaddd0] rounded-xl px-4 py-2.5 flex flex-col hover:border-[#8c5211] transition-colors focus-within:border-[#8c5211] cursor-pointer"
            onClick={handleDateClick}
          >
            <label className="text-[10px] font-bold tracking-widest uppercase text-[#8c5211] mb-0.5 flex items-center gap-2 cursor-pointer pointer-events-none">
              <Calendar className="w-3 h-3" /> DATE
            </label>
            <div className="relative w-full h-[21px] flex items-center">
              {/* Custom Display Layer */}
              <div className="absolute inset-0 flex items-center pointer-events-none justify-between">
                <span className={`text-[14px] font-bold ${selectedDate ? 'text-[#1a1c21]' : 'text-[#1a1c21]/60'}`}>
                  {selectedDate ? selectedDate.split('-').reverse().join('-') : 'dd-mm-yyyy'}
                </span>
                <Calendar className="w-4 h-4 text-[#8c5211] opacity-70" />
              </div>
              
              {/* Native Input Layer */}
              <input
                ref={dateInputRef}
                type="date"
                value={selectedDate}
                min={getTodayDate()}
                onChange={(event) => {
                  setSelectedDate(event.target.value);
                  setValidationError('');
                }}
                onClick={(e) => e.stopPropagation()}
                aria-label="Select booking date"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {validationError && (
            <p className="rounded-lg border border-[#f3d0c6] bg-[#fff0ee] px-3 py-2 text-[11px] font-medium text-[#a23d2e]">
              {validationError}
            </p>
          )}
        </div>

        {/* Action Buttons: Row 1 has Book Now & Book On Call */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          <button
            onClick={handleBookNow}
            className="bg-[#7a420b] text-white font-bold text-[15px] py-4 rounded-xl shadow-md hover:bg-[#5e3208] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            Book Now
          </button>

          <button
            onClick={handleBookOnCall}
            className="bg-white border-2 border-[#7a420b] text-[#7a420b] font-bold text-[15px] py-4 rounded-xl shadow-sm hover:bg-[#faf4ed] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Phone className="w-4 h-4" /> Book On Call
          </button>
        </div>

        {/* Action Buttons: Row 2 has Centered Enquire on WhatsApp */}
        <div className="mt-3 flex justify-center">
          <button
            type="button"
            disabled={!isEnquiryReady}
            onClick={handleWhatsAppEnquiry}
            title={isEnquiryReady ? 'Enquire on WhatsApp' : 'Select a room and date to enquire on WhatsApp'}
            className={`w-full md:w-[70%] font-bold text-[15px] py-3.5 rounded-xl transition-all flex items-center justify-center gap-2.5 ${
              isEnquiryReady
                ? 'bg-[#30265B] hover:bg-[#251d47] active:scale-[0.99] text-white shadow-md hover:shadow-lg cursor-pointer'
                : 'bg-[#EDE4D8] text-[#8C8276] opacity-80 cursor-not-allowed shadow-none'
            }`}
          >
            <svg
              className={`w-5 h-5 fill-current shrink-0 ${isEnquiryReady ? 'text-white' : 'text-[#8C8276]'}`}
              viewBox="0 0 24 24"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.012c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
            </svg>
            <span>Enquire on WhatsApp</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
