import { useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  addDays,
  formatLongDate,
  isValidPickupDate,
  parseIsoDate,
  pickupRangeLabel,
  startOfDay,
  toIsoDate,
} from '../lib/dates';

export function HomePage() {
  const navigate = useNavigate();
  const today = useMemo(() => startOfDay(new Date()), []);
  const minDate = useMemo(() => addDays(today, 2), [today]);
  const maxDate = useMemo(() => addDays(today, 14), [today]);
  const minIso = toIsoDate(minDate);
  const maxIso = toIsoDate(maxDate);
  const [selected, setSelected] = useState(minIso);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const d = parseIsoDate(selected);
    if (!isValidPickupDate(d, today)) {
      setError('Choose a pickup date between 2 and 14 days from today, inclusive.');
      return;
    }
    setError(null);
    navigate(`/menu/${selected}`);
  };

  return (
    <div className="page">
      <div className="hero">
        <h1>Homemade catering, ready for pickup</h1>
        <p className="lede">
          Pick a date, explore that day’s rotating menu, and build a cart for your group. We cook in small
          batches; everything is packed for easy pickup.
        </p>
      </div>

      <section aria-labelledby="date-heading" className="stack">
        <h2 id="date-heading" style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', margin: 0 }}>
          Start with your event date
        </h2>
        <p id="date-help" style={{ margin: 0, color: 'var(--muted)' }}>
          Orders open from <strong>{formatLongDate(minDate)}</strong> through{' '}
          <strong>{formatLongDate(maxDate)}</strong> — {pickupRangeLabel(today).toLowerCase()}. Each day of the
          week has its own 10-item menu: 5 protein, 3 vegetarian, and 2 sides.
        </p>

        <form onSubmit={handleSubmit} className="stack" style={{ maxWidth: '28rem' }} noValidate>
          <div className="field">
            <label htmlFor="pickup-date">Pickup / catering date</label>
            <input
              id="pickup-date"
              name="pickupDate"
              type="date"
              min={minIso}
              max={maxIso}
              value={selected}
              onChange={(e) => {
                setSelected(e.target.value);
                setError(null);
              }}
              required
              aria-describedby="date-help"
              aria-invalid={error ? 'true' : 'false'}
            />
            {error ? (
              <p className="error-text" role="alert" id="date-err">
                {error}
              </p>
            ) : null}
          </div>
          <div>
            <button type="submit" className="btn btn-primary">
              View menu for this date
            </button>
          </div>
        </form>
      </section>

      <section className="stack" style={{ marginTop: '2.5rem' }} aria-labelledby="how-heading">
        <h2 id="how-heading" style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', margin: 0 }}>
          How it works
        </h2>
        <ol style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--muted)' }}>
          <li style={{ marginBottom: '0.5rem' }}>Choose a valid pickup date and browse the day’s menu.</li>
          <li style={{ marginBottom: '0.5rem' }}>Add trays to your cart and tell us your party size at checkout (6–30 people).</li>
          <li>Place the order; you’ll get an invoice to keep, and we’ll have a copy on file for the kitchen.</li>
        </ol>
        <p>
          <Link to="/about" className="btn btn-secondary" style={{ display: 'inline-flex' }}>
            Our story
          </Link>
        </p>
      </section>
    </div>
  );
}
