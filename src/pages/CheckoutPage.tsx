import { FormEvent, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { buildOrder, newOrderId } from '../lib/orders';
import { saveInvoiceLocally } from '../lib/invoices';
import type { PaymentMethod } from '../types';
import { isValidPickupDate, parseIsoDate, startOfDay } from '../lib/dates';

const PICKUP_WINDOWS = ['11:00 AM – 2:00 PM', '4:00 PM – 7:00 PM'] as const;

const PARTY_MIN = 6;
const PARTY_MAX = 30;

export function CheckoutPage() {
  const navigate = useNavigate();
  const { lines, cateringDate, setCateringDate } = useCart();
  const today = useMemo(() => startOfDay(new Date()), []);

  const dateOk = cateringDate ? isValidPickupDate(parseIsoDate(cateringDate), today) : false;

  const [partySize, setPartySize] = useState(12);
  const [pickupWindow, setPickupWindow] = useState<string>(PICKUP_WINDOWS[0]);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [paymentRef, setPaymentRef] = useState('');
  const [instructions, setInstructions] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);

  if (!cateringDate || lines.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  if (!dateOk) {
    return (
      <div className="page">
        <h1 style={{ fontFamily: 'var(--font-display)' }}>Checkout unavailable</h1>
        <p className="lede">
          Your catering date is outside the ordering window. Clear your cart from the cart page and choose a new
          pickup date.
        </p>
        <Link to="/cart" className="btn btn-primary">
          Back to cart
        </Link>
      </div>
    );
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFieldError(null);

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setFieldError('Please fill in your full name, email, and phone number.');
      return;
    }

    if (partySize < PARTY_MIN || partySize > PARTY_MAX) {
      setFieldError(`Party size must be between ${PARTY_MIN} and ${PARTY_MAX} people.`);
      return;
    }

    const refRequired = paymentMethod !== 'cash';
    if (refRequired && !paymentRef.trim()) {
      setFieldError('Add a payment reference (for example: last four digits on the card, or your Venmo handle).');
      return;
    }

    const id = newOrderId();
    const order = buildOrder({
      id,
      pickupDate: cateringDate,
      pickupWindow,
      partySize,
      contact: { fullName: fullName.trim(), email: email.trim(), phone: phone.trim() },
      payment: { method: paymentMethod, reference: paymentRef.trim() },
      specialInstructions: instructions,
      lines,
    });

    saveInvoiceLocally(order);
    sessionStorage.setItem(`homespun-order-${id}`, JSON.stringify(order));
    setCateringDate(null);
    navigate(`/order/${id}`, { state: { order } });
  };

  return (
    <div className="page">
      <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.25rem' }}>Checkout</h1>
      <p style={{ marginTop: 0, color: 'var(--muted)', maxWidth: '40rem' }}>
        Payment details are recorded for pickup coordination only — no charges are processed on this demo site.
      </p>

      <form onSubmit={onSubmit} className="stack" style={{ maxWidth: '36rem' }} noValidate>
        {fieldError ? (
          <p role="alert" className="error-text">
            {fieldError}
          </p>
        ) : null}

        <fieldset className="stack" style={{ border: 'none', padding: 0, margin: 0 }}>
          <legend className="visually-hidden">Pickup details</legend>
          <div className="field">
            <label htmlFor="party-size">Party size (people)</label>
            <input
              id="party-size"
              name="partySize"
              type="number"
              inputMode="numeric"
              min={PARTY_MIN}
              max={PARTY_MAX}
              required
              value={partySize}
              onChange={(e) => setPartySize(Number.parseInt(e.target.value, 10) || PARTY_MIN)}
              aria-describedby="party-help"
            />
            <span id="party-help" className="field-hint">
              Minimum {PARTY_MIN} and maximum {PARTY_MAX} guests for catering portions.
            </span>
          </div>

          <div className="field">
            <label htmlFor="pickup-window">Pickup window</label>
            <select
              id="pickup-window"
              name="pickupWindow"
              value={pickupWindow}
              onChange={(e) => setPickupWindow(e.target.value)}
            >
              {PICKUP_WINDOWS.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>
        </fieldset>

        <fieldset className="stack" style={{ border: 'none', padding: 0, margin: 0 }}>
          <legend style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', marginBottom: '0.5rem' }}>
            Contact
          </legend>
          <div className="field">
            <label htmlFor="full-name">Full name</label>
            <input
              id="full-name"
              name="fullName"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
        </fieldset>

        <fieldset className="stack" style={{ border: 'none', padding: 0, margin: 0 }}>
          <legend style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', marginBottom: '0.5rem' }}>
            Payment (record only)
          </legend>
          <div className="field">
            <label htmlFor="pay-method">How you’ll pay at pickup</label>
            <select
              id="pay-method"
              name="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
            >
              <option value="card">Card (pay at pickup)</option>
              <option value="cash">Cash</option>
              <option value="venmo">Venmo</option>
              <option value="zelle">Zelle</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="pay-ref">
              Payment reference <span className="field-hint">(optional for cash)</span>
            </label>
            <input
              id="pay-ref"
              name="paymentRef"
              value={paymentRef}
              onChange={(e) => setPaymentRef(e.target.value)}
              placeholder={
                paymentMethod === 'card'
                  ? 'Last 4 digits on the card'
                  : paymentMethod === 'venmo'
                    ? '@your-venmo-handle'
                    : paymentMethod === 'zelle'
                      ? 'Email or phone on file'
                      : 'Optional for cash'
              }
              aria-describedby="pay-ref-help"
            />
            <span id="pay-ref-help" className="field-hint">
              We never charge online—this is only so the kitchen can match your payment at pickup.
            </span>
          </div>
        </fieldset>

        <div className="field">
          <label htmlFor="instructions">Special instructions</label>
          <textarea
            id="instructions"
            name="instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Allergies, reheating, labeled bags for teams, gate codes…"
          />
        </div>

        <div className="split no-print">
          <Link to="/cart" className="btn btn-secondary">
            Back to cart
          </Link>
          <button type="submit" className="btn btn-primary">
            Place order
          </button>
        </div>
      </form>
    </div>
  );
}
