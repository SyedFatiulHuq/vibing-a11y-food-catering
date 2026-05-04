export type MenuCategory = "protein" | "vegetarian" | "side";

export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type NutritionFacts = {
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
};

export type FoodItem = {
  id: string;
  weekday: Weekday;
  category: MenuCategory;
  name: string;
  description: string;
  ingredients: string[];
  nutrition: NutritionFacts;
  /** Price per unit (one tray / batch) */
  priceUsd: number;
  /** How many portions one unit serves (for display) */
  portionsPerUnit: number;
  /** Dummy “available units” for the day */
  availableUnits: number;
  imageUrl: string;
};

export type CartLine = {
  itemId: string;
  quantity: number;
};

export type PaymentMethod = "cash" | "card_on_pickup" | "venmo" | "zelle";

export type InvoiceLine = {
  itemId: string;
  name: string;
  unitPriceUsd: number;
  quantity: number;
  lineTotalUsd: number;
};

export type Invoice = {
  id: string;
  createdAtIso: string;
  pickupDateIso: string;
  guestCount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupWindow: string;
  paymentMethod: PaymentMethod;
  paymentDetails: string;
  specialInstructions: string;
  lines: InvoiceLine[];
  subtotalUsd: number;
  totalUsd: number;
};

export type ContactSubmission = {
  id: string;
  createdAtIso: string;
  name: string;
  email: string;
  topic: string;
  message: string;
};
