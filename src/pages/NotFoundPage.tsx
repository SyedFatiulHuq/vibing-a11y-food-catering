import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="page">
      <h1 style={{ fontFamily: 'var(--font-display)' }}>Page not found</h1>
      <p className="lede">That address doesn’t match a menu or form here.</p>
      <Link to="/" className="btn btn-primary">
        Go home
      </Link>
    </div>
  );
}
