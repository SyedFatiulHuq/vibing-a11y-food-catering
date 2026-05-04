import type { CartLine, CheckoutContact, OrderPayload, PaymentDetails } from '../types';
import { getItemById } from './menuData';
import { formatLongDate, parseIsoDate } from './dates';

const TAX_RATE = 0.08;

export function buildOrder(input: {
  id: string;
  pickupDate: string;
  pickupWindow: string;
  partySize: number;
  contact: CheckoutContact;
  payment: PaymentDetails;
  specialInstructions: string;
  lines: CartLine[];
}): OrderPayload {
  const createdAt = new Date().toISOString();
  const detailLines: OrderPayload['lines'] = [];
  let subtotal = 0;

  for (const line of input.lines) {
    const item = getItemById(line.itemId);
    if (!item) continue;
    const lineTotal = item.price * line.quantity;
    subtotal += lineTotal;
    detailLines.push({
      itemId: line.itemId,
      name: item.name,
      unitLabel: item.unitLabel,
      unitPrice: item.price,
      quantity: line.quantity,
      lineTotal,
    });
  }

  const taxEstimate = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + taxEstimate) * 100) / 100;

  return {
    id: input.id,
    createdAt,
    pickupDate: input.pickupDate,
    pickupWindow: input.pickupWindow,
    partySize: input.partySize,
    contact: input.contact,
    payment: input.payment,
    specialInstructions: input.specialInstructions,
    lines: detailLines,
    subtotal,
    taxEstimate,
    total,
  };
}

export function newOrderId(): string {
  return `HSK-${Date.now().toString(36).toUpperCase()}`;
}

export function orderSummaryHeading(isoDate: string): string {
  return `Pickup on ${formatLongDate(parseIsoDate(isoDate))}`;
}
