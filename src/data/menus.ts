import type { FoodItem, MenuCategory, NutritionFacts, Weekday } from "../types";

function nutrition(seed: number): NutritionFacts {
  const base = 180 + (seed % 80);
  return {
    servingSize: "1 portion (approx. 6 oz)",
    calories: base + seed * 3,
    totalFatG: Math.round((8 + (seed % 12)) * 10) / 10,
    saturatedFatG: Math.round((2 + (seed % 4)) * 10) / 10,
    cholesterolMg: 25 + (seed % 60),
    sodiumMg: 320 + (seed % 400),
    totalCarbG: Math.round((14 + (seed % 20)) * 10) / 10,
    dietaryFiberG: Math.round((2 + (seed % 5)) * 10) / 10,
    totalSugarsG: Math.round((3 + (seed % 8)) * 10) / 10,
    proteinG: Math.round((12 + (seed % 18)) * 10) / 10,
  };
}

const BLUEPRINT: Record<
  Weekday,
  { protein: string[]; vegetarian: string[]; sides: string[] }
> = {
  monday: {
    protein: [
      "Citrus herb roasted chicken",
      "Smoked paprika pork tenderloin",
      "Garlic butter salmon",
      "Beef bourguignon cups",
      "Lemon thyme turkey breast",
    ],
    vegetarian: [
      "Wild mushroom risotto",
      "Roasted cauliflower steaks",
      "Spinach & ricotta stuffed shells",
    ],
    sides: [
      "Charred broccolini with lemon",
      "Buttermilk mashed potatoes",
    ],
  },
  tuesday: {
    protein: [
      "Honey mustard glazed ham",
      "Peri-peri grilled chicken thighs",
      "Herb crusted cod",
      "Slow braised short ribs",
      "Maple chipotle drumsticks",
    ],
    vegetarian: [
      "Eggplant involtini",
      "Creamy polenta with roasted tomatoes",
      "Chickpea & kale stew",
    ],
    sides: [
      "Arugula salad with shaved parmesan",
      "Roasted rainbow carrots",
    ],
  },
  wednesday: {
    protein: [
      "Tandoori spiced chicken skewers",
      "Garlic ginger shrimp",
      "Moroccan lamb meatballs",
      "Sesame soy glazed tofu bites (chef’s protein)",
      "Cider braised pork shoulder",
    ],
    vegetarian: [
      "Dal makhani",
      "Stuffed bell peppers with quinoa",
      "Zucchini ribbon lasagna",
    ],
    sides: [
      "Cucumber mint yogurt salad",
      "Saffron basmati rice",
    ],
  },
  thursday: {
    protein: [
      "Sunday gravy meatballs",
      "Crispy skin salmon with dill",
      "Coffee rubbed brisket slices",
      "Rotisserie style half chicken",
      "Coconut lime shrimp",
    ],
    vegetarian: [
      "Four cheese baked ziti",
      "Ratatouille gratin",
      "Black bean sweet potato enchiladas",
    ],
    sides: [
      "Caesar salad cups",
      "Garlic knots",
    ],
  },
  friday: {
    protein: [
      "Surf & turf sliders kit",
      "Miso glazed black cod",
      "Chipotle lime skirt steak",
      "Buttermilk fried chicken tenders",
      "Shrimp étouffée cups",
    ],
    vegetarian: [
      "Truffle mac & cheese",
      "Caprese orzo salad",
      "Thai peanut noodle bowl",
    ],
    sides: [
      "Cornbread with honey butter",
      "Crispy Brussels sprouts",
    ],
  },
  saturday: {
    protein: [
      "Prime rib au jus (sliced)",
      "Lobster roll style shrimp salad",
      "Pesto grilled chicken",
      "Baby back ribs with house BBQ",
      "Seared scallops with brown butter",
    ],
    vegetarian: [
      "Wild rice stuffed acorn squash",
      "Margherita flatbread",
      "Greek chickpea salad platter",
    ],
    sides: [
      "Roasted fingerling potatoes",
      "Seasonal fruit board",
    ],
  },
  sunday: {
    protein: [
      "Heritage roast chicken",
      "Braised lamb shanks",
      "Maple glazed salmon",
      "Stuffed pork loin with apples",
      "Classic meatloaf with glaze",
    ],
    vegetarian: [
      "Vegetable pot pie",
      "Creamy tomato basil soup shooters + grilled cheese",
      "Beet & goat cheese tartlets",
    ],
    sides: [
      "Green beans almondine",
      "Dinner rolls & whipped butter",
    ],
  },
};

function describe(name: string, category: MenuCategory): string {
  if (category === "protein") {
    return `${name} is slow-prepared in small batches, seasoned with our house spice blends, and finished for pickup so it reheats beautifully for your gathering.`;
  }
  if (category === "vegetarian") {
    return `${name} is built around seasonal produce and hearty vegetarian proteins—comfort-forward and satisfying for mixed crowds.`;
  }
  return `${name} is sized to complement mains and round out your table without overpowering the meal.`;
}

function ingredientsFor(_: string, category: MenuCategory): string[] {
  const common = ["kosher salt", "black pepper", "extra virgin olive oil"];
  if (category === "protein") {
    return [
      ...common,
      "citrus zest & fresh herbs",
      "house stock",
      "aromatic vegetables (onion, carrot, celery)",
      "finishing butter or glaze (menu dependent)",
    ];
  }
  if (category === "vegetarian") {
    return [
      ...common,
      "seasonal vegetables",
      "herbs from our window garden (when available)",
      "imported cheeses (where noted)",
    ];
  }
  return [
    ...common,
    "seasonal produce",
    "house vinaigrette or compound butter",
    "fresh herbs",
  ];
}

function buildItems(): FoodItem[] {
  const items: FoodItem[] = [];
  const weekdays: Weekday[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  for (const day of weekdays) {
    const bp = BLUEPRINT[day];
    let idx = 0;
    const push = (
      category: MenuCategory,
      names: string[],
      priceBase: number,
      portions: number,
      units: number,
    ) => {
      for (const name of names) {
        const id = `${day}-${category}-${idx}`;
        const seed = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
        items.push({
          id,
          weekday: day,
          category,
          name,
          description: describe(name, category),
          ingredients: ingredientsFor(name, category),
          nutrition: nutrition(seed),
          priceUsd: priceBase + (seed % 9),
          portionsPerUnit: portions,
          availableUnits: units,
          imageUrl: `https://picsum.photos/seed/${encodeURIComponent(id)}/720/480`,
        });
        idx += 1;
      }
    };
    push("protein", bp.protein, 48, 6, 8);
    push("vegetarian", bp.vegetarian, 36, 6, 10);
    push("side", bp.sides, 22, 8, 14);
  }
  return items;
}

const ALL_ITEMS = buildItems();

export function getMenuForWeekday(day: Weekday): FoodItem[] {
  return ALL_ITEMS.filter((i) => i.weekday === day);
}

export function getItemById(id: string): FoodItem | undefined {
  return ALL_ITEMS.find((i) => i.id === id);
}
