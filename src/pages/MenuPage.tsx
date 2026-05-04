import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getMenuForWeekday } from "../data/menus";
import { useCart } from "../context/CartContext";
import {
  formatLongDate,
  isPickupDateAllowed,
  maxPickupIso,
  minPickupIso,
  weekdayFromIsoDate,
} from "../lib/dates";
import type { FoodItem, MenuCategory } from "../types";

const categoryOrder: MenuCategory[] = ["protein", "vegetarian", "side"];

const categoryTitle: Record<MenuCategory, string> = {
  protein: "Proteins",
  vegetarian: "Vegetarian",
  side: "Sides",
};

function groupByCategory(items: FoodItem[]): Record<MenuCategory, FoodItem[]> {
  const map: Record<MenuCategory, FoodItem[]> = {
    protein: [],
    vegetarian: [],
    side: [],
  };
  for (const item of items) {
    map[item.category].push(item);
  }
  return map;
}

export function MenuPage() {
  const { pickupDate, setPickupDate, lines, addItem } = useCart();
  const [selected, setSelected] = useState(() => pickupDate ?? minPickupIso());

  useEffect(() => {
    if (pickupDate && pickupDate !== selected) {
      setSelected(pickupDate);
    }
  }, [pickupDate, selected]);

  const min = minPickupIso();
  const max = maxPickupIso();

  const onDateChange = (iso: string) => {
    if (!isPickupDateAllowed(iso)) return;
    if (lines.length > 0 && pickupDate && pickupDate !== iso) {
      const ok = window.confirm(
        "Changing the pickup date clears your cart because each date uses that day’s menu. Continue?",
      );
      if (!ok) return;
    }
    setSelected(iso);
    setPickupDate(iso);
  };

  useEffect(() => {
    if (!pickupDate && isPickupDateAllowed(selected)) {
      setPickupDate(selected);
    }
  }, [pickupDate, selected, setPickupDate]);

  const weekday = weekdayFromIsoDate(selected);
  const items = useMemo(() => getMenuForWeekday(weekday), [weekday]);
  const grouped = useMemo(() => groupByCategory(items), [items]);

  return (
    <div className="container stack" style={{ gap: "1.75rem" }}>
      <header className="stack" style={{ gap: "0.5rem" }}>
        <h1 className="font-display" style={{ margin: 0, fontSize: "2rem" }}>
          Menu for your pickup date
        </h1>
        <p style={{ margin: 0, color: "var(--muted)", maxWidth: "60ch" }}>
          Each weekday has a unique ten-item menu (five proteins, three vegetarian dishes, and two
          sides). Choose the calendar day you plan to pick up—your menu matches that day of the week.
        </p>
      </header>

      <div className="card" style={{ padding: "1.25rem" }}>
        <div className="field" style={{ maxWidth: 320 }}>
          <label htmlFor="pickup-date">Pickup date</label>
          <input
            id="pickup-date"
            type="date"
            min={min}
            max={max}
            value={selected}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>
        <p style={{ margin: "0.75rem 0 0", fontSize: "0.95rem", color: "var(--muted)" }}>
          {formatLongDate(selected)} · Orders open from {formatLongDate(min)} through {formatLongDate(max)}.
        </p>
      </div>

      {categoryOrder.map((cat) => (
        <section key={cat} aria-labelledby={`cat-${cat}`}>
          <h2 id={`cat-${cat}`} className="font-display" style={{ fontSize: "1.35rem" }}>
            {categoryTitle[cat]}
          </h2>
          <div className="grid-menu">
            {grouped[cat].map((item) => (
              <article
                key={item.id}
                className="card"
                style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}
              >
                <Link to={`/menu/item/${item.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <img
                    src={item.imageUrl}
                    alt=""
                    width={720}
                    height={480}
                    style={{ width: "100%", height: 180, objectFit: "cover" }}
                  />
                  <div style={{ padding: "1rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                    <h3 className="font-display" style={{ margin: 0, fontSize: "1.15rem" }}>
                      {item.name}
                    </h3>
                    <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.9rem", flex: 1 }}>
                      Serves about {item.portionsPerUnit} guests per unit · {item.availableUnits} units
                      available today
                    </p>
                    <p style={{ margin: 0, fontWeight: 700 }}>
                      {item.priceUsd.toLocaleString(undefined, { style: "currency", currency: "USD" })}{" "}
                      <span style={{ fontWeight: 500, color: "var(--muted)", fontSize: "0.9rem" }}>per unit</span>
                    </p>
                  </div>
                </Link>
                <div style={{ padding: "0 1rem 1rem", display: "flex", gap: "0.5rem" }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                    onClick={() => addItem(item.id, 1)}
                  >
                    Add to cart
                  </button>
                  <Link className="btn btn-secondary" to={`/menu/item/${item.id}`}>
                    Details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
