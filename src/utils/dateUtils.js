/**
 * Utility functions for date parsing and day type determination (Weekday vs Weekend).
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
