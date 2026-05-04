import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getMenuForPickupDate } from '../lib/menuForDate';
import { isValidPickupDate, formatLongDate, parseIsoDate, startOfDay } from '../lib/dates';
import type { Category, FoodItem } from '../types';
import { formatUsd } from '../lib/money';

const CATEGORY_ORDER: Category[] = ['protein', 'vegetarian', 'sides'];

const labels: Record<Category, string> = {
  protein: 'Protein',
  vegetarian: 'Vegetarian',
  sides: 'Sides',
};

function groupByCategory(items: FoodItem[]): Record<Category, FoodItem[]> {
  const empty: Record<Category, FoodItem[]> = {
    protein: [],
    vegetarian: [],
    sides: [],
  };
  for (const item of items) {
    empty[item.category].push(item);
  }
  return empty;
}

export function MenuPage() {
  const { date } = useParams<{ date: string }>();
  const { setCateringDate } = useCart();
  const iso = date ?? '';
  const today = useMemo(() => startOfDay(new Date()), []);

  const valid = useMemo(() => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
    return isValidPickupDate(parseIsoDate(iso), today);
  }, [iso, today]);

  const menu = valid ? getMenuForPickupDate(iso) : [];

  useEffect(() => {
    if (valid) setCateringDate(iso);
  }, [iso, valid, setCateringDate]);

  if (!valid) {
    return (
      <div className="page">
        <h1 style={{ fontFamily: 'var(--font-display)' }}>Menu not available for that date</h1>
        <p className="lede">
          Pickup dates must be at least two days and at most two weeks from today. Return home to pick a date
          in range.
        </p>
        <Link to="/" className="btn btn-primary">
          Choose a date
        </Link>
      </div>
    );
  }

  const grouped = groupByCategory(menu);

  return (
    <div className="page">
      <div className="hero">
        <h1 style={{ marginBottom: '0.5rem' }}>Menu for {formatLongDate(parseIsoDate(iso))}</h1>
        <p className="lede" style={{ marginBottom: 0 }}>
          This is the menu for the day of the week of your event. Tap an item for ingredients and nutrition. All
          items are prepared for pickup; portion your order for a group of 6–30 at checkout.
        </p>
      </div>

      {CATEGORY_ORDER.map((cat) => (
        <section
          key={cat}
          aria-labelledby={`cat-${cat}`}
          style={{ marginTop: '2rem' }}
        >
          <h2 id={`cat-${cat}`} style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', margin: '0 0 1rem' }}>
            {labels[cat]}
          </h2>
          <div className="card-grid">
            {grouped[cat].map((item) => (
              <article key={item.id} className="card">
                <Link
                  to={`/menu/${iso}/item/${item.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <img
                    src={item.imageUrl}
                    alt=""
                    width={800}
                    height={600}
                    loading="lazy"
                    style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }}
                  />
                </Link>
                <div className="card-body">
                  <span className="pill">{labels[cat]}</span>
                  <h3 className="card-title">
                    <Link
                      to={`/menu/${iso}/item/${item.id}`}
                      style={{ color: 'inherit', textDecoration: 'none' }}
                    >
                      {item.name}
                    </Link>
                  </h3>
                  <p className="meta" style={{ margin: 0 }}>
                    {formatUsd(item.price)} · {item.unitLabel}
                  </p>
                  <p className="meta" style={{ margin: 0 }}>
                    Available today: <strong>{item.quantityAvailable}</strong> units
                  </p>
                  <p style={{ margin: 0, flex: 1, fontSize: '0.95rem' }}>{item.description}</p>
                  <Link className="btn btn-secondary" to={`/menu/${iso}/item/${item.id}`} style={{ alignSelf: 'flex-start' }}>
                    Details & add to cart
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      <p style={{ marginTop: '2rem' }}>
        <Link to="/cart" className="btn btn-primary">
          View cart
        </Link>
      </p>
    </div>
  );
}
