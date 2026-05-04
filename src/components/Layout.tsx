import { NavLink, Outlet } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export function Layout() {
  const { cartCount } = useCart();
  return (
    <div className="layout">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header className="header" role="banner">
        <div className="header-inner">
          <NavLink className="brand" to="/" end>
            HomeSpun Kitchen
          </NavLink>
          <nav className="nav" aria-label="Primary">
            <NavLink to="/" end>
              Home
            </NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            <NavLink
              to="/cart"
              className={({ isActive }) => `cart-badge${isActive ? ' active' : ''}`}
            >
              Cart
              <span aria-hidden="true">·</span>
              <span className="visually-hidden">Items in cart: </span>
              {cartCount}
            </NavLink>
          </nav>
        </div>
      </header>
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <footer
        className="page no-print"
        style={{
          borderTop: '1px solid rgba(28,25,23,0.08)',
          padding: '2rem var(--space)',
          color: 'var(--muted)',
          fontSize: '0.9rem',
        }}
      >
        <p style={{ margin: 0 }}>
          © {new Date().getFullYear()} HomeSpun Kitchen · Made for pickup ·{' '}
          <a href="tel:+15555550123">(555) 555-0123</a>
        </p>
      </footer>
    </div>
  );
}
