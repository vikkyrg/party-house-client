const BOOKING_DRAFT_KEY = 'rio-booking-draft';

export function readBookingDraft() {
  const savedDraft = window.sessionStorage.getItem(BOOKING_DRAFT_KEY);
  if (!savedDraft) return null;

  try {
    const draft = JSON.parse(savedDraft);
    return draft && typeof draft === 'object' && !Array.isArray(draft) ? draft : null;
  } catch {
    window.sessionStorage.removeItem(BOOKING_DRAFT_KEY);
    return null;
  }
}

export function writeBookingDraft(draft) {
  window.sessionStorage.setItem(BOOKING_DRAFT_KEY, JSON.stringify(draft));
}

export function clearBookingDraft() {
  window.sessionStorage.removeItem(BOOKING_DRAFT_KEY);
}
