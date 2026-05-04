import { FormEvent, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getItemById } from "../data/menus";
import { useCart } from "../context/CartContext";
import { formatLongDate } from "../lib/dates";
import { saveInvoice } from "../lib/invoices";
import type { Invoice, PaymentMethod } from "../types";

function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 7);
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const { pickupDate, lines, clearCart } = useCart();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guestCount, setGuestCount] = useState(12);
  const [pickupWindow, setPickupWindow] = useState("4:00–6:00 PM");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [paymentDetails, setPaymentDetails] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [error, setError] = useState<string | null>(null);

  const rows = useMemo(() => {
    return lines
      .map((line) => {
        const item = getItemById(line.itemId);
        if (!item) return null;
        const lineTotalUsd = item.priceUsd * line.quantity;
        return {
          itemId: item.id,
          name: item.name,
          unitPriceUsd: item.priceUsd,
          quantity: line.quantity,
          lineTotalUsd,
        };
      })
      .filter(Boolean) as Invoice["lines"];
  }, [lines]);

  const subtotal = rows.reduce((s, l) => s + l.lineTotalUsd, 0);

  if (!pickupDate || lines.length === 0) {
    return (
      <div className="container stack" style={{ maxWidth: 560 }}>
        <h1 className="font-display">Nothing to check out</h1>
        <p style={{ color: "var(--muted)" }}>Add items to your cart first.</p>
        <Link className="btn btn-primary" to="/menu">
          Browse menu
        </Link>
      </div>
    );
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError("Please provide your name, email, and phone number.");
      return;
    }
    if (guestCount < 6 || guestCount > 30) {
      setError("Guest count must be between 6 and 30 people.");
      return;
    }

    const invoice: Invoice = {
      id: `HT-${Date.now()}-${randomSuffix()}`,
      createdAtIso: new Date().toISOString(),
      pickupDateIso: pickupDate,
      guestCount,
      customerName: name.trim(),
      customerEmail: email.trim(),
      customerPhone: phone.trim(),
      pickupWindow: pickupWindow.trim() || "TBD with kitchen",
      paymentMethod,
      paymentDetails: paymentDetails.trim(),
      specialInstructions: specialInstructions.trim(),
      lines: rows,
      subtotalUsd: subtotal,
      totalUsd: subtotal,
    };

    saveInvoice(invoice);
    clearCart();
    navigate(`/order-confirmation/${invoice.id}`, { state: { invoice } });
  };

  return (
    <div className="container stack" style={{ gap: "1.5rem" }}>
      <header>
        <h1 className="font-display" style={{ margin: 0, fontSize: "2rem" }}>
          Checkout
        </h1>
        <p style={{ margin: "0.35rem 0 0", color: "var(--muted)" }}>
          Pickup {formatLongDate(pickupDate)} · Food subtotal{" "}
          <strong>{subtotal.toLocaleString(undefined, { style: "currency", currency: "USD" })}</strong>
        </p>
      </header>

      <form className="stack" style={{ gap: "1.25rem", maxWidth: 640 }} onSubmit={onSubmit}>
        <fieldset className="card" style={{ padding: "1.25rem", border: "none", margin: 0 }}>
          <legend className="font-display" style={{ fontSize: "1.15rem", padding: 0 }}>
            Guest count & pickup
          </legend>
          <div className="stack" style={{ gap: "1rem", marginTop: "1rem" }}>
            <div className="field">
              <label htmlFor="guests">How many guests are you planning for?</label>
              <input
                id="guests"
                type="number"
                min={6}
                max={30}
                required
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
              />
              <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>Minimum 6 · maximum 30 guests.</span>
            </div>
            <div className="field">
              <label htmlFor="window">Preferred pickup window</label>
              <select id="window" value={pickupWindow} onChange={(e) => setPickupWindow(e.target.value)}>
                <option>3:00–5:00 PM</option>
                <option>4:00–6:00 PM</option>
                <option>5:00–7:00 PM</option>
                <option>Weekend brunch 10:00 AM–12:00 PM</option>
                <option>I will coordinate by phone</option>
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset className="card" style={{ padding: "1.25rem", border: "none", margin: 0 }}>
          <legend className="font-display" style={{ fontSize: "1.15rem", padding: 0 }}>
            Contact
          </legend>
          <div className="stack" style={{ gap: "1rem", marginTop: "1rem" }}>
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input id="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="phone">Phone</label>
              <input id="phone" type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
          </div>
        </fieldset>

        <fieldset className="card" style={{ padding: "1.25rem", border: "none", margin: 0 }}>
          <legend className="font-display" style={{ fontSize: "1.15rem", padding: 0 }}>
            Payment details (placeholder)
          </legend>
          <p style={{ margin: "0.5rem 0 1rem", color: "var(--muted)", fontSize: "0.95rem" }}>
            We never charge cards on this website. Tell us how you plan to pay so the kitchen can match your order.
          </p>
          <div className="stack" style={{ gap: "1rem" }}>
            <div className="field">
              <label htmlFor="pmethod">Payment method</label>
              <select
                id="pmethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              >
                <option value="cash">Cash on pickup</option>
                <option value="card_on_pickup">Card on pickup</option>
                <option value="venmo">Venmo</option>
                <option value="zelle">Zelle</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="pdetails">Reference (optional)</label>
              <input
                id="pdetails"
                placeholder="@venmo-handle, last four digits, or note"
                value={paymentDetails}
                onChange={(e) => setPaymentDetails(e.target.value)}
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="card" style={{ padding: "1.25rem", border: "none", margin: 0 }}>
          <legend className="font-display" style={{ fontSize: "1.15rem", padding: 0 }}>
            Special instructions
          </legend>
          <div className="field" style={{ marginTop: "1rem" }}>
            <label htmlFor="notes" className="sr-only">
              Special instructions
            </label>
            <textarea
              id="notes"
              placeholder="Allergies, dietary callouts, pickup quirks, parking notes…"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
            />
          </div>
        </fieldset>

        {error ? (
          <p role="alert" style={{ margin: 0, color: "var(--accent)", fontWeight: 600 }}>
            {error}
          </p>
        ) : null}

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          <button type="submit" className="btn btn-primary">
            Place order & view invoice
          </button>
          <Link className="btn btn-secondary" to="/cart">
            Back to cart
          </Link>
        </div>
      </form>
    </div>
  );
}
