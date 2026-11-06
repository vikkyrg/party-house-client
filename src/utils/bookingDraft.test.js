import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearBookingDraft, readBookingDraft, writeBookingDraft } from './bookingDraft';

describe('booking draft session storage', () => {
  const createStorage = () => {
    const values = new Map();
    return {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, String(value)),
      removeItem: (key) => values.delete(key),
      clear: () => values.clear(),
    };
  };

  beforeEach(() => {
    vi.stubGlobal('window', {
      sessionStorage: createStorage(),
      localStorage: createStorage(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('keeps booking progress in the current browser session', () => {
    const draft = {
      theaterId: 'theater-1',
      roomId: 'room-1',
      date: '2026-11-07',
      customerDetails: { name: 'Customer A' },
      currentStep: 5,
    };

    writeBookingDraft(draft);

    expect(readBookingDraft()).toEqual(draft);
    expect(window.sessionStorage.getItem('rio-booking-draft')).toContain('Customer A');
  });

  it('isolates drafts between browser sessions', () => {
    writeBookingDraft({ theaterId: 'theater-1' });
    const firstSessionStorage = window.sessionStorage;
    vi.stubGlobal('window', { sessionStorage: createStorage(), localStorage: createStorage() });

    expect(readBookingDraft()).toBeNull();
    writeBookingDraft({ theaterId: 'theater-2' });

    vi.stubGlobal('window', { sessionStorage: firstSessionStorage, localStorage: createStorage() });
    expect(readBookingDraft()).toEqual({ theaterId: 'theater-1' });
  });

  it('clears only the current session draft', () => {
    writeBookingDraft({ theaterId: 'theater-1' });
    window.localStorage.setItem('other-session-data', 'keep');

    clearBookingDraft();

    expect(readBookingDraft()).toBeNull();
    expect(window.localStorage.getItem('other-session-data')).toBe('keep');
  });

  it('discards malformed session data', () => {
    window.sessionStorage.setItem('rio-booking-draft', '{invalid');

    expect(readBookingDraft()).toBeNull();
    expect(window.sessionStorage.getItem('rio-booking-draft')).toBeNull();
  });
});
