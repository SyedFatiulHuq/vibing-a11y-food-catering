import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getItemById } from '../lib/menuData';
import { itemBelongsToPickupDate } from '../lib/menuForDate';
import { isValidPickupDate, formatLongDate, parseIsoDate, startOfDay } from '../lib/dates';
import { formatUsd } from '../lib/money';
import { NutritionTable } from '../components/NutritionTable';

export function ItemDetailPage() {
  const { date, itemId } = useParams<{ date: string; itemId: string }>();
  const navigate = useNavigate();
  const { addLine, setCateringDate } = useCart();
  const [notice, setNotice] = useState<string | null>(null);
  const iso = date ?? '';
  const today = startOfDay(new Date());

  const dateOk =
    /^\d{4}-\d{2}-\d{2}$/.test(iso) && isValidPickupDate(parseIsoDate(iso), today);
  const item = itemId ? getItemById(itemId) : undefined;
  const match = item && itemBelongsToPickupDate(item.id, iso);

  useEffect(() => {
    if (dateOk) setCateringDate(iso);
  }, [dateOk, iso, setCateringDate]);

  useEffect(() => {
    if (!notice) return;
    const t = window.setTimeout(() => setNotice(null), 4500);
    return () => window.clearTimeout(t);
  }, [notice]);

  if (!dateOk || !item || !match) {
    return (
      <div className="page">
        <h1 style={{ fontFamily: 'var(--font-display)' }}>Item not found</h1>
        <p className="lede">This dish isn’t on the menu for the date you selected.</p>
        <Link to="/" className="btn btn-primary">
          Pick a new date
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    addLine(item.id, 1, iso);
    setNotice(`${item.name} added to your cart.`);
  };

  return (
    <div className="page">
      <nav aria-label="Breadcrumb" className="no-print" style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>
        <ol style={{ margin: 0, paddingLeft: '1.2rem' }}>
          <li style={{ display: 'inline' }}>
            <Link to="/">Home</Link>
            <span aria-hidden="true"> · </span>
          </li>
          <li style={{ display: 'inline' }}>
            <Link to={`/menu/${iso}`}>Menu</Link>
            <span aria-hidden="true"> · </span>
          </li>
          <li style={{ display: 'inline' }} aria-current="page">
            {item.name}
          </li>
        </ol>
      </nav>

      <div
        className="split"
        style={{ gap: '1.5rem', alignItems: 'stretch' }}
      >
        <div style={{ flex: '1 1 280px' }}>
          <img
            src={item.imageUrl}
            alt=""
            width={800}
            height={600}
            style={{ width: '100%', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}
          />
        </div>
        <div style={{ flex: '2 1 320px' }} className="stack">
          <h1 style={{ fontFamily: 'var(--font-display)', margin: 0, lineHeight: 1.2 }}>{item.name}</h1>
          <p style={{ margin: 0, color: 'var(--muted)' }}>
            On the menu for <strong>{formatLongDate(parseIsoDate(iso))}</strong>
          </p>
          <p style={{ margin: 0, fontSize: '1.1rem' }}>
            <strong>{formatUsd(item.price)}</strong> · {item.unitLabel}
          </p>
          <p style={{ margin: 0 }}>
            Kitchen capacity for this item today: <strong>{item.quantityAvailable}</strong> units.
          </p>
          <p style={{ margin: 0 }}>{item.description}</p>

          <section aria-labelledby="ingredients-heading">
            <h2 id="ingredients-heading" style={{ fontSize: '1.1rem', margin: '0 0 0.35rem' }}>
              Ingredients
            </h2>
            <ul style={{ margin: 0 }}>
              {item.ingredients.map((ing) => (
                <li key={ing}>{ing}</li>
              ))}
            </ul>
          </section>

          <NutritionTable facts={item.nutrition} />

          <div className="split no-print" style={{ alignItems: 'center' }}>
            <button type="button" className="btn btn-primary" onClick={handleAdd}>
              Add to cart
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
              Back
            </button>
          </div>
          <div aria-live="polite" className="visually-hidden">
            {notice}
          </div>
          {notice ? (
            <p role="status" className="no-print" style={{ margin: 0, fontWeight: 600 }}>
              {notice}{' '}
              <Link to="/cart">View cart</Link>.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
