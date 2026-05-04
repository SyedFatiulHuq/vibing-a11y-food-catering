import type { OrderPayload } from '../types';

const STORAGE_KEY = 'homespun-kitchen-invoices';

export function saveInvoiceLocally(order: OrderPayload): void {
  const raw = localStorage.getItem(STORAGE_KEY);
  const list: OrderPayload[] = raw ? (JSON.parse(raw) as OrderPayload[]) : [];
  list.unshift(order);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function loadInvoices(): OrderPayload[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as OrderPayload[];
  } catch {
    return [];
  }
}
