import { NavLink, Outlet } from "react-router-dom";
import { useCart } from "../context/CartContext";

const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
  fontWeight: 600,
  color: isActive ? "var(--accent)" : "var(--ink)",
  textDecoration: "none",
  padding: "0.35rem 0",
  borderBottom: isActive ? "2px solid var(--accent)" : "2px solid transparent",
});

export function Layout() {
  const { lines } = useCart();
  const count = lines.reduce((n, l) => n + l.quantity, 0);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header
        style={{
          background: "var(--bg-elevated)",
          borderBottom: "1px solid var(--line)",
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "1rem",
            paddingBlock: "1rem",
            justifyContent: "space-between",
          }}
        >
          <NavLink
            to="/"
            style={{
              textDecoration: "none",
              color: "var(--ink)",
              display: "flex",
              flexDirection: "column",
              gap: 0,
            }}
          >
            <span className="font-display" style={{ fontSize: "1.35rem" }}>
              Harvest Table
            </span>
            <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
              Homemade catering · Pickup only
            </span>
          </NavLink>
          <nav
            aria-label="Primary"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1.25rem",
              alignItems: "center",
            }}
          >
            <NavLink to="/menu" style={navLinkStyle}>
              Menu
            </NavLink>
            <NavLink to="/cart" style={navLinkStyle}>
              Cart{count > 0 ? ` (${count})` : ""}
            </NavLink>
            <NavLink to="/about" style={navLinkStyle}>
              About
            </NavLink>
            <NavLink to="/contact" style={navLinkStyle}>
              Contact
            </NavLink>
          </nav>
        </div>
      </header>
      <main style={{ flex: 1, paddingBlock: "2rem" }}>
        <Outlet />
      </main>
      <footer
        style={{
          borderTop: "1px solid var(--line)",
          background: "#f1ebe2",
          paddingBlock: "1.5rem",
          marginTop: "auto",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            justifyContent: "space-between",
            color: "var(--muted)",
            fontSize: "0.9rem",
          }}
        >
          <span>© {new Date().getFullYear()} Harvest Table Catering</span>
          <span>Pickup orders · No accounts required</span>
        </div>
      </footer>
    </div>
  );
}
