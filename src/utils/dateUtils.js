/**
 * Utility functions for date parsing, pricing, and Asia/Kolkata timezone slot calculations.
 */

/**
 * Gets the effective room price based on the provided duration.
 * 
 * @param {Object} room - Room object containing duration based prices
 * @param {number} duration - Selected duration (1, 2, or 3)
 * @returns {number} Active price for the room
 */
export const getRoomPriceForDuration = (room, duration) => {
  if (!room) return 0;
  if (duration === 1) return room.price1Hour ?? 0;
  if (duration === 2) return room.price2Hours ?? 0;
  if (duration === 3) return room.price3Hours ?? 0;
  return room.price2Hours ?? 0;
};

/**
 * Get current date string (YYYY-MM-DD) in Asia/Kolkata timezone
 */
export const getKolkataTodayString = (dateObj = new Date()) => {
  return dateObj.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
};

/**
 * Parse time string like "10:30 AM", "01:00 PM" into minutes from start of day (0-1439).
 * Returns -1 if invalid.
 */
export const parseTimeToMinutes = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') return -1;
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return -1;
  let [_, hours, minutes, modifier] = match;
  hours = parseInt(hours, 10);
  minutes = parseInt(minutes, 10);
  if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) return -1;
  if (hours === 12) hours = 0;
  if (modifier.toUpperCase() === 'PM') hours += 12;
  return hours * 60 + minutes;
};

/**
 * Get current time in minutes from midnight (0-1439) in Asia/Kolkata timezone
 */
export const getKolkataCurrentMinutes = (dateObj = new Date()) => {
  const timeStr = dateObj.toLocaleTimeString('en-US', {
    timeZone: 'Asia/Kolkata',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  });
  const [h, m] = timeStr.split(':').map((v) => parseInt(v, 10));
  return (h % 24) * 60 + m;
};

/**
 * Check if a slot start time has already passed for a given date in Asia/Kolkata timezone.
 * Returns true if date is in the past, or if date is today and slot start time <= current time.
 */
export const isSlotInPast = (bookingDateStr, slotStartTimeStr, now = new Date()) => {
  if (!bookingDateStr || !slotStartTimeStr) return false;
  const targetDate = bookingDateStr.trim().slice(0, 10);
  const currentDate = getKolkataTodayString(now);

  if (targetDate < currentDate) {
    return true; // Past date
  }

  if (targetDate === currentDate) {
    const slotStartMin = parseTimeToMinutes(slotStartTimeStr);
    if (slotStartMin === -1) return false;
    const currentMin = getKolkataCurrentMinutes(now);
    return slotStartMin <= currentMin; // Slot has already started or passed
  }

  return false; // Future date
};
