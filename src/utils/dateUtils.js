/**
 * Utility functions for date parsing and day type determination (Weekday vs Weekend).
 */

/**
 * Checks whether a given date string (YYYY-MM-DD or ISO) falls on a weekend (Saturday or Sunday).
 * Uses local date components to avoid UTC offset shifts.
 * 
 * @param {string} dateStr - Date string (e.g., '2026-10-10')
 * @returns {boolean} True if Saturday (6) or Sunday (0)
 */
export const isWeekendDay = (dateStr) => {
  if (!dateStr) return false;
  const cleanDateStr = String(dateStr).split('T')[0];
  const parts = cleanDateStr.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      const localDate = new Date(year, month, day);
      const dayOfWeek = localDate.getDay();
      return dayOfWeek === 0 || dayOfWeek === 6; // 0 = Sun, 6 = Sat
    }
  }
  const fallbackDate = new Date(cleanDateStr);
  const dayOfWeek = fallbackDate.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6;
};

/**
 * Gets the effective room price based on the provided date (or boolean flag).
 * 
 * @param {Object} room - Room object containing weekdayPrice/weekendPrice/price
 * @param {string|boolean} dateOrIsWeekend - Date string (YYYY-MM-DD) or explicit boolean isWeekend
 * @returns {number} Active price for the room
 */
export const getRoomPriceForDate = (room, dateOrIsWeekend) => {
  if (!room) return 0;
  const isWeekend = typeof dateOrIsWeekend === 'boolean'
    ? dateOrIsWeekend
    : isWeekendDay(dateOrIsWeekend);

  if (isWeekend) {
    return room.weekendPrice ?? room.price ?? 0;
  }
  return room.weekdayPrice ?? room.price ?? 0;
};
