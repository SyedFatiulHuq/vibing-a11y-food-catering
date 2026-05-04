import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div className="container stack" style={{ gap: "2rem" }}>
      <section
        className="card"
        style={{
          padding: "clamp(1.5rem, 4vw, 2.5rem)",
          display: "grid",
          gap: "1.5rem",
          gridTemplateColumns: "1fr",
        }}
      >
        <div>
          <p style={{ letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", margin: 0 }}>
            Pickup · Made to order
          </p>
          <h1 className="font-display" style={{ fontSize: "clamp(2rem, 5vw, 2.75rem)", margin: "0.5rem 0" }}>
            Homemade catering for gatherings of 6–30 guests
          </h1>
          <p style={{ fontSize: "1.1rem", maxWidth: "52ch", color: "var(--muted)", margin: 0 }}>
            Choose your pickup date, browse that day’s rotating menu, and build a cart of proteins,
            vegetarian mains, and sides. We prep everything fresh for pickup—no delivery routes, no
            ghost kitchens.
          </p>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          <Link className="btn btn-primary" to="/menu">
            View menus by date
          </Link>
          <Link className="btn btn-secondary" to="/about">
            Our story
          </Link>
        </div>
      </section>

      <section aria-labelledby="how-it-works" className="stack" style={{ gap: "1rem" }}>
        <h2 id="how-it-works" className="font-display" style={{ fontSize: "1.5rem" }}>
          How ordering works
        </h2>
        <ol style={{ margin: 0, paddingLeft: "1.25rem", color: "var(--muted)", maxWidth: "65ch" }}>
          <li>Pick a pickup date between two days and two weeks from today.</li>
          <li>Explore that weekday’s menu—each day has its own ten-item lineup.</li>
          <li>Add trays to your cart, tell us your guest count (6–30), and check out.</li>
          <li>Receive an invoice on-screen; we keep a copy locally for the kitchen.</li>
        </ol>
      </section>
    </div>
  );
}
