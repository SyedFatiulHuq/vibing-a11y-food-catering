import { useMemo } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { InvoicePanel } from "../components/InvoicePanel";
import { loadInvoices } from "../lib/invoices";
import type { Invoice } from "../types";

export function OrderConfirmationPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const stateInvoice = (location.state as { invoice?: Invoice } | null)?.invoice;

  const invoice = useMemo(() => {
    if (stateInvoice && stateInvoice.id === orderId) return stateInvoice;
    if (orderId) {
      return loadInvoices().find((i) => i.id === orderId);
    }
    return undefined;
  }, [orderId, stateInvoice]);

  if (!invoice) {
    return (
      <div className="container stack" style={{ maxWidth: 560 }}>
        <h1 className="font-display">Order not found</h1>
        <p style={{ color: "var(--muted)" }}>
          If you refreshed this page, your invoice is still saved in this browser for the business owner.
        </p>
        <Link to="/menu">Return to menu</Link>
      </div>
    );
  }

  return (
    <div className="container stack" style={{ gap: "1.5rem", maxWidth: 720 }}>
      <header className="stack" style={{ gap: "0.35rem" }}>
        <h1 className="font-display" style={{ margin: 0, fontSize: "2rem" }}>
          Thank you — your pickup is booked
        </h1>
        <p style={{ margin: 0, color: "var(--muted)" }}>
          Below is your invoice. We’ve stored a copy locally for the kitchen team on this device.
        </p>
      </header>
      <InvoicePanel invoice={invoice} />
      <Link className="btn btn-secondary" to="/menu" style={{ alignSelf: "flex-start" }}>
        Plan another order
      </Link>
    </div>
  );
}
