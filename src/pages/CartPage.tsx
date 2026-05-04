import { useMemo } from "react";
import { Link } from "react-router-dom";
import { getItemById } from "../data/menus";
import { useCart } from "../context/CartContext";
import { formatLongDate } from "../lib/dates";

export function CartPage() {
  const { pickupDate, lines, setLineQuantity, removeLine, clearCart } = useCart();

  const rows = useMemo(() => {
    return lines
      .map((line) => {
        const item = getItemById(line.itemId);
        if (!item) return null;
        return { line, item, subtotal: item.priceUsd * line.quantity };
      })
      .filter(Boolean) as { line: { itemId: string; quantity: number }; item: NonNullable<ReturnType<typeof getItemById>>; subtotal: number }[];
  }, [lines]);

  const total = rows.reduce((s, r) => s + r.subtotal, 0);

  if (!pickupDate || lines.length === 0) {
    return (
      <div className="container stack" style={{ maxWidth: 560 }}>
        <h1 className="font-display" style={{ margin: 0 }}>
          Your cart is empty
        </h1>
        <p style={{ margin: 0, color: "var(--muted)" }}>
          Browse a pickup date on the menu and add trays. Portions are planned for groups of 6–30 guests.
        </p>
        <Link className="btn btn-primary" to="/menu" style={{ alignSelf: "flex-start" }}>
          Browse menus
        </Link>
      </div>
    );
  }

  return (
    <div className="container stack" style={{ gap: "1.25rem" }}>
      <header style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "1rem", alignItems: "baseline" }}>
        <div>
          <h1 className="font-display" style={{ margin: 0, fontSize: "2rem" }}>
            Cart
          </h1>
          <p style={{ margin: "0.35rem 0 0", color: "var(--muted)" }}>
            Pickup {formatLongDate(pickupDate)}
          </p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={() => clearCart()}>
          Clear cart
        </button>
      </header>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <caption className="sr-only">Shopping cart items</caption>
          <thead>
            <tr style={{ textAlign: "left", background: "#f7f2ea" }}>
              <th scope="col" style={{ padding: "0.75rem 1rem" }}>
                Item
              </th>
              <th scope="col" style={{ padding: "0.75rem 0.5rem" }}>
                Price
              </th>
              <th scope="col" style={{ padding: "0.75rem 0.5rem" }}>
                Qty
              </th>
              <th scope="col" style={{ padding: "0.75rem 1rem", textAlign: "right" }}>
                Subtotal
              </th>
              <th scope="col" style={{ padding: "0.75rem 1rem" }}>
                <span className="sr-only">Remove</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ line, item, subtotal }) => (
              <tr key={line.itemId} style={{ borderTop: "1px solid var(--line)" }}>
                <td style={{ padding: "0.85rem 1rem" }}>
                  <Link to={`/menu/item/${item.id}`} style={{ fontWeight: 600, color: "var(--ink)" }}>
                    {item.name}
                  </Link>
                  <div style={{ fontSize: "0.85rem", color: "var(--muted)" }}>{item.category}</div>
                </td>
                <td style={{ padding: "0.85rem 0.5rem", whiteSpace: "nowrap" }}>
                  {item.priceUsd.toLocaleString(undefined, { style: "currency", currency: "USD" })}
                </td>
                <td style={{ padding: "0.85rem 0.5rem" }}>
                  <label className="sr-only" htmlFor={`qty-${item.id}`}>
                    Quantity for {item.name}
                  </label>
                  <input
                    id={`qty-${item.id}`}
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={99}
                    value={line.quantity}
                    onChange={(e) => setLineQuantity(item.id, Number(e.target.value))}
                    style={{ width: 72, padding: "0.35rem" }}
                  />
                </td>
                <td style={{ padding: "0.85rem 1rem", textAlign: "right", fontWeight: 600 }}>
                  {subtotal.toLocaleString(undefined, { style: "currency", currency: "USD" })}
                </td>
                <td style={{ padding: "0.85rem 1rem" }}>
                  <button type="button" className="btn btn-ghost" onClick={() => removeLine(item.id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "1rem", alignItems: "center" }}>
        <p style={{ margin: 0, fontSize: "1.1rem" }}>
          Estimated food total:{" "}
          <strong>{total.toLocaleString(undefined, { style: "currency", currency: "USD" })}</strong>
        </p>
        <Link className="btn btn-primary" to="/checkout">
          Continue to checkout
        </Link>
      </div>
    </div>
  );
}
