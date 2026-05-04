import { getMenuForWeekday } from './menuData';
import type { FoodItem } from '../types';
import { parseIsoDate, weekdayKeyFromDate } from './dates';

export function getMenuForPickupDate(isoDate: string): FoodItem[] {
  const d = parseIsoDate(isoDate);
  const key = weekdayKeyFromDate(d);
  return getMenuForWeekday(key);
}

export function itemBelongsToPickupDate(itemId: string, isoDate: string): boolean {
  const d = parseIsoDate(isoDate);
  const dayKey = weekdayKeyFromDate(d);
  return itemId.startsWith(`${dayKey}-`);
}
