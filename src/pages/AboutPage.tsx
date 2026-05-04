export function AboutPage() {
  return (
    <div className="page">
      <h1 style={{ fontFamily: 'var(--font-display)' }}>About HomeSpun Kitchen</h1>
      <p className="lede">
        We are a small, permit-compliant cottage catering kitchen serving weekday pickups within our metro area.
        Menus rotate by day so our tiny team can prep with care and keep flavors bold but familiar.
      </p>

      <section aria-labelledby="story-heading" className="stack">
        <h2 id="story-heading" style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', margin: 0 }}>
          Our story
        </h2>
        <p style={{ margin: 0, maxWidth: '42rem' }}>
          HomeSpun started as a weekend supper club: trays of lemon chicken, slow braises, and vegetable-forward
          sides that felt like a family table. When neighbors asked to bring the same food to their offices and
          gatherings, we structured weekly menus and pickup windows so nothing sits around—and every tray leaves
          hot and labeled.
        </p>
        <p style={{ margin: 0, maxWidth: '42rem' }}>
          Today we focus on group pickups only (6–30 guests) so we can schedule prep honestly and price fairly. If
          you need allergen isolation or reheating tips, tell us in special instructions; we read every note before
          we fire the ovens.
        </p>
      </section>

      <section aria-labelledby="values-heading" className="stack" style={{ marginTop: '2rem' }}>
        <h2 id="values-heading" style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', margin: 0 }}>
          What to expect
        </h2>
        <ul style={{ margin: 0, maxWidth: '42rem' }}>
          <li>Menus change by day of week — ten composed dishes per day.</li>
          <li>Pickup-only; we package for travel and share quick hold-hot guidance.</li>
          <li>Transparent ingredient lists and nutrition estimates on each dish.</li>
        </ul>
        <p style={{ margin: '0.75rem 0 0', maxWidth: '42rem', fontSize: '0.95rem', color: 'var(--muted)' }}>
          For the business owner: completed orders are stored in this browser’s local storage under the key{' '}
          <code style={{ fontSize: '0.9em' }}>homespun-kitchen-invoices</code> so you can review them from the same
          device later (demo behavior).
        </p>
      </section>
    </div>
  );
}
