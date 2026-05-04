import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getItemById } from '../lib/menuData';
import { formatUsd } from '../lib/money';
import { formatLongDate, isValidPickupDate, parseIsoDate, startOfDay } from '../lib/dates';

export function CartPage() {
  const { lines, cateringDate, setLineQuantity, removeLine, clearCart } = useCart();
  const today = startOfDay(new Date());
  const dateValid = cateringDate ? isValidPickupDate(parseIsoDate(cateringDate), today) : false;

  if (!cateringDate || lines.length === 0) {
    return (
      <div className="page">
        <h1 style={{ fontFamily: 'var(--font-display)' }}>Your cart is empty</h1>
        <p className="lede">Browse a menu for your pickup date and add trays from an item’s detail page.</p>
        <Link to="/" className="btn btn-primary">
          Choose a pickup date
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.25rem' }}>Cart</h1>
      <p style={{ marginTop: 0, color: 'var(--muted)' }}>
        Catering date:{' '}
        <strong>{formatLongDate(parseIsoDate(cateringDate))}</strong> ·{' '}
        <Link to={`/menu/${cateringDate}`}>Return to menu</Link>
      </p>

      {!dateValid ? (
        <div role="alert" className="error-text" style={{ marginBottom: '1rem' }}>
          This pickup date is no longer in the order window (2–14 days out). Clear the cart and pick a new date
          on the home page.
        </div>
      ) : null}

      <ul className="stack" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {lines.map((line) => {
          const item = getItemById(line.itemId);
          if (!item) return null;
          const lineTotal = item.price * line.quantity;
          return (
            <li key={`${line.itemId}-${line.cateringDate}`} className="card" style={{ padding: '1rem' }}>
              <div className="split" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: '1 1 220px' }}>
                  <h2 style={{ fontSize: '1.15rem', margin: '0 0 0.35rem', fontFamily: 'var(--font-display)' }}>
                    {item.name}
                  </h2>
                  <p className="meta" style={{ margin: 0 }}>
                    {formatUsd(item.price)} · {item.unitLabel}
                  </p>
                  <p style={{ margin: '0.35rem 0 0', fontWeight: 600 }}>Line total: {formatUsd(lineTotal)}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                  <label htmlFor={`qty-${line.itemId}`} className="visually-hidden">
                    Quantity for {item.name}
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      aria-label={`Decrease ${item.name}`}
                      onClick={() =>
                        setLineQuantity(line.itemId, line.cateringDate, Math.max(0, line.quantity - 1))
                      }
                    >
                      −
                    </button>
                    <input
                      id={`qty-${line.itemId}`}
                      type="number"
                      inputMode="numeric"
                      min={0}
                      value={line.quantity}
                      onChange={(e) => {
                        const v = Number.parseInt(e.target.value, 10);
                        setLineQuantity(line.itemId, line.cateringDate, Number.isFinite(v) ? v : 0);
                      }}
                      style={{ width: '4rem', textAlign: 'center' }}
                      aria-describedby={`qty-help-${line.itemId}`}
                    />
                    <button
                      type="button"
                      className="btn btn-secondary"
                      aria-label={`Increase ${item.name}`}
                      onClick={() => setLineQuantity(line.itemId, line.cateringDate, line.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <span id={`qty-help-${line.itemId}`} className="visually-hidden">
                    Number of units for this line item.
                  </span>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => removeLine(line.itemId, line.cateringDate)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="split no-print" style={{ marginTop: '1.5rem', alignItems: 'center' }}>
        <button type="button" className="btn btn-secondary" onClick={() => clearCart()}>
          Clear cart
        </button>
        {dateValid ? (
          <Link to="/checkout" className="btn btn-primary">
            Continue to checkout
          </Link>
        ) : (
          <button type="button" className="btn btn-primary" disabled>
            Choose a valid pickup date to continue
          </button>
        )}
      </div>
    </div>
  );
}
