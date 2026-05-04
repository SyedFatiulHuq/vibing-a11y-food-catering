import type { Invoice } from "../types";
import { formatLongDate } from "../lib/dates";

type Props = { invoice: Invoice };

function money(n: number): string {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

const paymentLabel: Record<Invoice["paymentMethod"], string> = {
  cash: "Cash on pickup",
  card_on_pickup: "Card on pickup",
  venmo: "Venmo (manual)",
  zelle: "Zelle (manual)",
};

export function InvoicePanel({ invoice }: Props) {
  return (
    <article className="card" style={{ padding: "1.5rem" }}>
      <header
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: "1rem",
          borderBottom: "1px solid var(--line)",
          paddingBottom: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div>
          <h1 className="font-display" style={{ margin: 0, fontSize: "1.75rem" }}>
            Invoice
          </h1>
          <p style={{ margin: "0.25rem 0 0", color: "var(--muted)" }}>
            Order #{invoice.id}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0, fontWeight: 600 }}>Pickup</p>
          <p style={{ margin: "0.15rem 0 0" }}>{formatLongDate(invoice.pickupDateIso)}</p>
          <p style={{ margin: "0.35rem 0 0", color: "var(--muted)", fontSize: "0.9rem" }}>
            {invoice.pickupWindow}
          </p>
        </div>
      </header>

      <section aria-labelledby="bill-to-heading" style={{ marginBottom: "1.25rem" }}>
        <h2 id="bill-to-heading" className="sr-only">
          Bill to
        </h2>
        <p style={{ margin: 0, fontWeight: 700 }}>{invoice.customerName}</p>
        <p style={{ margin: "0.15rem 0 0" }}>{invoice.customerEmail}</p>
        <p style={{ margin: "0.15rem 0 0" }}>{invoice.customerPhone}</p>
        <p style={{ margin: "0.75rem 0 0", color: "var(--muted)" }}>
          Guests: <strong>{invoice.guestCount}</strong>
        </p>
      </section>

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
        <caption className="sr-only">Line items</caption>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "2px solid var(--ink)" }}>
            <th scope="col" style={{ padding: "0.5rem 0" }}>
              Item
            </th>
            <th scope="col">Qty</th>
            <th scope="col">Price</th>
            <th scope="col" style={{ textAlign: "right" }}>
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {invoice.lines.map((line) => (
            <tr key={line.itemId} style={{ borderBottom: "1px solid var(--line)" }}>
              <td style={{ padding: "0.55rem 0" }}>{line.name}</td>
              <td>{line.quantity}</td>
              <td>{money(line.unitPriceUsd)}</td>
              <td style={{ textAlign: "right" }}>{money(line.lineTotalUsd)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          justifyContent: "flex-end",
          gap: "2rem",
          fontWeight: 700,
        }}
      >
        <span>Total due at pickup</span>
        <span>{money(invoice.totalUsd)}</span>
      </div>

      <section style={{ marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid var(--line)" }}>
        <h2 className="font-display" style={{ fontSize: "1.1rem", margin: "0 0 0.5rem" }}>
          Payment (placeholder)
        </h2>
        <p style={{ margin: 0 }}>
          {paymentLabel[invoice.paymentMethod]}
          {invoice.paymentDetails ? ` · ${invoice.paymentDetails}` : ""}
        </p>
        <p style={{ margin: "0.75rem 0 0", color: "var(--muted)", fontSize: "0.9rem" }}>
          This site does not process payments. Please follow the instructions you receive by email
          or text from the kitchen.
        </p>
      </section>

      {invoice.specialInstructions.trim() ? (
        <section style={{ marginTop: "1rem" }}>
          <h2 className="font-display" style={{ fontSize: "1.1rem", margin: "0 0 0.5rem" }}>
            Special instructions
          </h2>
          <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{invoice.specialInstructions}</p>
        </section>
      ) : null}

      <p style={{ margin: "1.25rem 0 0", fontSize: "0.85rem", color: "var(--muted)" }}>
        Placed {new Date(invoice.createdAtIso).toLocaleString()} · A copy is stored for the business.
      </p>
    </article>
  );
}
