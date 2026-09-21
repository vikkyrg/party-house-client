export function buildTheaterBookingUrl(theaterId, { date, timeSlot, source } = {}) {
  const queryParts = [];

  if (date) queryParts.push(`date=${encodeURIComponent(date)}`);
  if (timeSlot) queryParts.push(`timeSlot=${encodeURIComponent(timeSlot)}`);
  if (source) queryParts.push(`source=${encodeURIComponent(source)}`);

  const query = queryParts.join('&');
  return query ? `/theaters/${theaterId}?${query}` : `/theaters/${theaterId}`;
}

export function readBookingQuery(searchParams) {
  const date = searchParams.get('date') || '';
  const timeSlot = searchParams.get('timeSlot') || '';
  const source = searchParams.get('source') || '';

  return {
    date,
    timeSlot,
    source,
  };
}
