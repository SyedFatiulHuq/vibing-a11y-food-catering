import type { OrderPayload } from '../types';
import { formatUsd } from '../lib/money';
import { formatLongDate, parseIsoDate } from '../lib/dates';

interface Props {
  order: OrderPayload;
  showPrintHint?: boolean;
}

export function InvoiceView({ order, showPrintHint = true }: Props) {
  return (
    <article className="invoice" aria-labelledby={`invoice-${order.id}-title`}>
      <header style={{ marginBottom: '1rem' }}>
        <h2 id={`invoice-${order.id}-title`} style={{ fontFamily: 'var(--font-display)', margin: '0 0 0.25rem' }}>
          Order invoice
        </h2>
        <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.95rem' }}>
          Order ID <strong>{order.id}</strong> · Placed{' '}
          {new Date(order.createdAt).toLocaleString(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
          })}
        </p>
      </header>

      <section aria-labelledby={`pickup-${order.id}`} style={{ marginBottom: '1rem' }}>
        <h3 id={`pickup-${order.id}`} className="visually-hidden">
          Pickup
        </h3>
        <p style={{ margin: '0.25rem 0' }}>
          <strong>Pickup date:</strong> {formatLongDate(parseIsoDate(order.pickupDate))}
        </p>
        <p style={{ margin: '0.25rem 0' }}>
          <strong>Pickup window:</strong> {order.pickupWindow}
        </p>
        <p style={{ margin: '0.25rem 0' }}>
          <strong>Party size:</strong> {order.partySize} people
        </p>
      </section>

      <section aria-labelledby={`contact-${order.id}`} style={{ marginBottom: '1rem' }}>
        <h3 id={`contact-${order.id}`} style={{ fontSize: '1rem', margin: '0 0 0.35rem' }}>
          Contact
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
          <li>{order.contact.fullName}</li>
          <li>
            <a href={`mailto:${order.contact.email}`}>{order.contact.email}</a>
          </li>
          <li>
            <a href={`tel:${order.contact.phone.replace(/\D/g, '')}`}>{order.contact.phone}</a>
          </li>
        </ul>
      </section>

      <section aria-labelledby={`payment-${order.id}`} style={{ marginBottom: '1rem' }}>
        <h3 id={`payment-${order.id}`} style={{ fontSize: '1rem', margin: '0 0 0.35rem' }}>
          Payment (record only)
        </h3>
        <p style={{ margin: 0 }}>
          {order.payment.method.toUpperCase()} · Reference: {order.payment.reference || '—'}
        </p>
      </section>

      {order.specialInstructions.trim() ? (
        <section aria-labelledby={`notes-${order.id}`} style={{ marginBottom: '1rem' }}>
          <h3 id={`notes-${order.id}`} style={{ fontSize: '1rem', margin: '0 0 0.35rem' }}>
            Special instructions
          </h3>
          <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{order.specialInstructions}</p>
        </section>
      ) : null}

      <section aria-labelledby={`lines-${order.id}`}>
        <h3 id={`lines-${order.id}`} style={{ fontSize: '1rem', margin: '0 0 0.5rem' }}>
          Items
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th scope="col">Item</th>
                <th scope="col">Unit</th>
                <th scope="col">Qty</th>
                <th scope="col">Line total</th>
              </tr>
            </thead>
            <tbody>
              {order.lines.map((line, idx) => (
                <tr key={`${line.itemId}-${idx}`}>
                  <td>{line.name}</td>
                  <td>
                    {formatUsd(line.unitPrice)} / {line.unitLabel}
                  </td>
                  <td>{line.quantity}</td>
                  <td>{formatUsd(line.lineTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: '1rem', textAlign: 'right', fontSize: '1rem' }}>
          <div>
            Subtotal: <strong>{formatUsd(order.subtotal)}</strong>
          </div>
          <div>
            Estimated tax (demo): <strong>{formatUsd(order.taxEstimate)}</strong>
          </div>
          <div style={{ marginTop: '0.35rem', fontSize: '1.15rem' }}>
            Total due at pickup: <strong>{formatUsd(order.total)}</strong>
          </div>
        </div>
      </section>

      {showPrintHint ? (
        <p className="no-print" style={{ marginTop: '1.25rem', fontSize: '0.9rem', color: 'var(--muted)' }}>
          Tip: use your browser’s print dialog to save a PDF copy for your records.
        </p>
      ) : null}
    </article>
  );
}
