import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getItemById } from "../data/menus";
import { useCart } from "../context/CartContext";
import { formatLongDate, weekdayFromIsoDate } from "../lib/dates";
import { NutritionTable } from "../components/NutritionTable";

export function ItemDetailPage() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { pickupDate, addItem, lines } = useCart();

  const item = useMemo(() => (itemId ? getItemById(itemId) : undefined), [itemId]);

  if (!item) {
    return (
      <div className="container stack">
        <h1 className="font-display">Item not found</h1>
        <Link to="/menu">Back to menu</Link>
      </div>
    );
  }

  const dateMismatch =
    pickupDate && weekdayFromIsoDate(pickupDate) !== item.weekday;

  const onAdd = () => {
    if (dateMismatch) {
      window.alert("This item belongs to a different weekday than your selected pickup date. Adjust the date on the menu page first.");
      return;
    }
    addItem(item.id, 1);
    navigate("/cart");
  };

  const inCart = lines.find((l) => l.itemId === item.id)?.quantity ?? 0;

  return (
    <div className="container stack" style={{ gap: "1.5rem" }}>
      <nav aria-label="Breadcrumb" style={{ fontSize: "0.95rem" }}>
        <Link to="/menu">Menu</Link>
        <span aria-hidden="true" style={{ marginInline: "0.35rem" }}>
          /
        </span>
        <span>{item.name}</span>
      </nav>

      <div
        style={{
          display: "grid",
          gap: "1.5rem",
          gridTemplateColumns: "1fr",
        }}
      >
        <div className="card" style={{ overflow: "hidden" }}>
          <img src={item.imageUrl} alt="" width={720} height={480} style={{ width: "100%", maxHeight: 420, objectFit: "cover" }} />
        </div>

        <div className="stack" style={{ gap: "1rem" }}>
          <header>
            <p style={{ margin: 0, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", fontSize: "0.8rem" }}>
              {item.category} · {item.weekday}
            </p>
            <h1 className="font-display" style={{ margin: "0.35rem 0", fontSize: "2rem" }}>
              {item.name}
            </h1>
            <p style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700 }}>
              {item.priceUsd.toLocaleString(undefined, { style: "currency", currency: "USD" })}{" "}
              <span style={{ fontWeight: 500, color: "var(--muted)", fontSize: "0.95rem" }}>per unit</span>
            </p>
            <p style={{ margin: "0.75rem 0 0", color: "var(--muted)" }}>
              Each unit serves about {item.portionsPerUnit} guests. Up to {item.availableUnits} units available
              for the selected pickup week.
            </p>
            {pickupDate ? (
              <p style={{ margin: "0.5rem 0 0", fontSize: "0.95rem" }}>
                Pickup date: <strong>{formatLongDate(pickupDate)}</strong>
                {dateMismatch ? (
                  <span style={{ color: "var(--accent)", display: "block", marginTop: "0.35rem" }}>
                    This dish is on the {item.weekday} menu. Choose a pickup date that falls on a{" "}
                    {item.weekday} to add it.
                  </span>
                ) : null}
              </p>
            ) : (
              <p style={{ margin: "0.5rem 0 0" }}>Select a pickup date on the menu page before adding items.</p>
            )}
          </header>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            <button type="button" className="btn btn-primary" onClick={onAdd} disabled={!pickupDate || !!dateMismatch}>
              Add to cart
            </button>
            <Link className="btn btn-secondary" to="/menu">
              Back to menu
            </Link>
            {inCart > 0 ? (
              <span style={{ alignSelf: "center", color: "var(--muted)" }}>
                {inCart} in cart — <Link to="/cart">view cart</Link>
              </span>
            ) : null}
          </div>

          <section>
            <h2 className="font-display" style={{ fontSize: "1.25rem" }}>
              Description
            </h2>
            <p style={{ margin: 0, maxWidth: "65ch" }}>{item.description}</p>
          </section>

          <section>
            <h2 className="font-display" style={{ fontSize: "1.25rem" }}>
              Ingredients
            </h2>
            <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
              {item.ingredients.map((ing) => (
                <li key={ing}>{ing}</li>
              ))}
            </ul>
          </section>

          <NutritionTable facts={item.nutrition} />
        </div>
      </div>
    </div>
  );
}
