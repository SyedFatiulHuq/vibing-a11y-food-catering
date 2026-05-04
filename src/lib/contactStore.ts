export interface ContactSubmission {
  id: string;
  sentAt: string;
  name: string;
  email: string;
  topic: string;
  message: string;
}

const STORAGE_KEY = 'homespun-kitchen-contact-messages';

export function saveContactMessage(entry: ContactSubmission): void {
  const raw = localStorage.getItem(STORAGE_KEY);
  const list: ContactSubmission[] = raw ? (JSON.parse(raw) as ContactSubmission[]) : [];
  list.unshift(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
