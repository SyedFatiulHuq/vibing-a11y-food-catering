import type { Weekday } from "../types";

const JS_DAY_TO_WEEKDAY: Weekday[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function addLocalDays(d: Date, days: number): Date {
  const next = new Date(d);
  next.setDate(next.getDate() + days);
  return next;
}

export function toIsoDateLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseIsoDateLocal(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) throw new Error(`Invalid date: ${iso}`);
  return new Date(y, m - 1, d);
}

export function weekdayFromIsoDate(iso: string): Weekday {
  const d = parseIsoDateLocal(iso);
  return JS_DAY_TO_WEEKDAY[d.getDay()] ?? "monday";
}

/** Earliest pickup: two full days after today (local). */
export function minPickupIso(reference = new Date()): string {
  return toIsoDateLocal(addLocalDays(startOfLocalDay(reference), 2));
}

/** Latest pickup: two weeks (14 days) after today (local). */
export function maxPickupIso(reference = new Date()): string {
  return toIsoDateLocal(addLocalDays(startOfLocalDay(reference), 14));
}

export function isPickupDateAllowed(
  iso: string,
  reference = new Date(),
): boolean {
  let candidate: Date;
  try {
    candidate = startOfLocalDay(parseIsoDateLocal(iso));
  } catch {
    return false;
  }
  const min = startOfLocalDay(parseIsoDateLocal(minPickupIso(reference)));
  const max = startOfLocalDay(parseIsoDateLocal(maxPickupIso(reference)));
  return candidate >= min && candidate <= max;
}

export function formatLongDate(iso: string): string {
  const d = parseIsoDateLocal(iso);
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
