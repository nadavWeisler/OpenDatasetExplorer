import { Link, NavLink, Outlet } from 'react-router-dom';
import DisclaimerFooter from './DisclaimerFooter';

export default function Layout() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand">
            <span className="brand-mark" aria-hidden="true">
              ODE
            </span>
            <span className="brand-text">
              <strong>OpenDataset Explorer</strong>
              <small>Research dataset discovery</small>
            </span>
          </Link>
          <nav className="site-nav" aria-label="Main">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : undefined)}>
              Explore
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : undefined)}>
              Source &amp; About
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="site-main">
        <Outlet />
      </main>

      <DisclaimerFooter />
    </div>
  );
}
