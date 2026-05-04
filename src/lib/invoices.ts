import type { ContactSubmission, Invoice } from "../types";

const INVOICES_KEY = "harvest_table_invoices_v1";
const CONTACT_KEY = "harvest_table_contact_messages_v1";

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function saveInvoice(invoice: Invoice): void {
  const list = readJson<Invoice[]>(INVOICES_KEY, []);
  list.unshift(invoice);
  writeJson(INVOICES_KEY, list);
}

export function loadInvoices(): Invoice[] {
  return readJson<Invoice[]>(INVOICES_KEY, []);
}

export function saveContactMessage(msg: ContactSubmission): void {
  const list = readJson<ContactSubmission[]>(CONTACT_KEY, []);
  list.unshift(msg);
  writeJson(CONTACT_KEY, list);
}
