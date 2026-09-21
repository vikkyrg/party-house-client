import { describe, expect, it } from 'vitest';
import { buildTheaterBookingUrl, readBookingQuery } from './bookingFlow';

describe('booking flow helpers', () => {
  it('builds a theater URL that preserves the selected date for the home flow', () => {
    expect(buildTheaterBookingUrl('abc123', {
      date: '2026-09-22',
    })).toBe('/theaters/abc123?date=2026-09-22');
  });

  it('reads the preselected date from URL params without requiring a time slot', () => {
    const params = new URLSearchParams('date=2026-09-22');

    expect(readBookingQuery(params)).toEqual({
      date: '2026-09-22',
      timeSlot: '',
      source: '',
    });
  });
});
