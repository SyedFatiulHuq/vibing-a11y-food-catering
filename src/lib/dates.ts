/** Calendar date at local midnight. */
export function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function addDays(d: Date, days: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

/** YYYY-MM-DD in local timezone. */
export function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return startOfDay(new Date(y, (m ?? 1) - 1, d ?? 1));
}

const WEEKDAYS = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const;

export type WeekdayKey = (typeof WEEKDAYS)[number];

export function weekdayKeyFromDate(d: Date): WeekdayKey {
  return WEEKDAYS[d.getDay()];
}

export function formatLongDate(d: Date): string {
  return d.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Pickup must be between 2 and 14 days from today (inclusive of both bounds). */
export function isValidPickupDate(pickup: Date, today = new Date()): boolean {
  const t0 = startOfDay(today);
  const min = addDays(t0, 2);
  const max = addDays(t0, 14);
  const p = startOfDay(pickup);
  return p.getTime() >= min.getTime() && p.getTime() <= max.getTime();
}

export function pickupRangeLabel(today = new Date()): string {
  const t0 = startOfDay(today);
  const min = addDays(t0, 2);
  const max = addDays(t0, 14);
  return `${formatLongDate(min)} through ${formatLongDate(max)}`;
}
