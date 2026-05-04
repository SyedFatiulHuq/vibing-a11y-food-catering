export type Category = 'protein' | 'vegetarian' | 'sides';

export interface NutritionalFacts {
  servingSize: string;
  calories: number;
  totalFatG: number;
  saturatedFatG: number;
  cholesterolMg: number;
  sodiumMg: number;
  totalCarbG: number;
  dietaryFiberG: number;
  totalSugarsG: number;
  proteinG: number;
}

export interface FoodItem {
  id: string;
  name: string;
  /** Price in USD per unit (half-tray or listed serving unit). */
  price: number;
  /** Display label for the purchasable unit, e.g. “half-tray”. */
  unitLabel: string;
  /** Dummy availability / prep capacity for the day. */
  quantityAvailable: number;
  imageUrl: string;
  category: Category;
  description: string;
  ingredients: string[];
  nutrition: NutritionalFacts;
}

export interface CartLine {
  itemId: string;
  /** Catering / pickup calendar date (YYYY-MM-DD) this line belongs to. */
  cateringDate: string;
  quantity: number;
}

export interface CheckoutContact {
  fullName: string;
  email: string;
  phone: string;
}

export type PaymentMethod = 'card' | 'cash' | 'venmo' | 'zelle';

export interface PaymentDetails {
  method: PaymentMethod;
  /** Last four digits or handle — dummy only. */
  reference: string;
}

export interface OrderPayload {
  id: string;
  createdAt: string;
  pickupDate: string;
  pickupWindow: string;
  partySize: number;
  contact: CheckoutContact;
  payment: PaymentDetails;
  specialInstructions: string;
  lines: Array<{
    itemId: string;
    name: string;
    unitLabel: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }>;
  subtotal: number;
  taxEstimate: number;
  total: number;
}
