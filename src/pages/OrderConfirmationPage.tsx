import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import type { OrderPayload } from '../types';
import { InvoiceView } from '../components/InvoiceView';

export function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const fromNav = location.state as { order?: OrderPayload } | null;
  const [order, setOrder] = useState<OrderPayload | null>(fromNav?.order ?? null);

  useEffect(() => {
    if (order || !orderId) return;
    const raw = sessionStorage.getItem(`homespun-order-${orderId}`);
    if (raw) {
      try {
        setOrder(JSON.parse(raw) as OrderPayload);
      } catch {
        setOrder(null);
      }
    }
  }, [order, orderId]);

  const title = useMemo(
    () => (order ? `Order ${order.id} confirmed` : 'Order confirmation'),
    [order],
  );

  if (!orderId) {
    return (
      <div className="page">
        <h1>Missing order</h1>
        <Link to="/">Home</Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="page">
        <h1 style={{ fontFamily: 'var(--font-display)' }}>We couldn’t load that invoice</h1>
        <p className="lede">
          Open the confirmation link from your browser history right after ordering, or start a new order from the
          home page.
        </p>
        <Link to="/" className="btn btn-primary">
          Home
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>{title}</h1>
      <p style={{ marginTop: 0, color: 'var(--muted)', maxWidth: '40rem' }}>
        Thanks for ordering from HomeSpun Kitchen. Your invoice is saved in this browser for the business owner to
        reference alongside your pickup details.
      </p>

      <InvoiceView order={order} />

      <p className="no-print" style={{ marginTop: '1.5rem' }}>
        <Link to="/" className="btn btn-primary">
          Plan another pickup
        </Link>
      </p>
    </div>
  );
}
