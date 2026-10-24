import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import Tenants from './pages/Tenants';
import Maintenance from './pages/Maintenance';
import Admin from './pages/Admin.jsx'

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAppShell = location.pathname !== '/';

  return (
    <div className={`app-root ${isAppShell ? 'app-mode' : 'marketing-mode'}`}>
      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          <Link to="/" className="nav-brand">
            <svg
              className="brand-icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9.5z" />
              <path d="M9 21V11h6v10" />
            </svg>
            <div className="brand-text">
              <span className="brand-name">Holt &amp; Ives</span>
              <span className="brand-sub">Property Operations</span>
            </div>
          </Link>

          <nav className="nav-links">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Overview
            </NavLink>
            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Dashboard
            </NavLink>
            <NavLink to="/properties" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Properties
            </NavLink>
            <NavLink to="/tenants" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Tenants
            </NavLink>
            <NavLink to="/maintenance" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Maintenance
            </NavLink>
          </nav>

          <div className="nav-actions">
            <Link to="/dashboard" className="btn-primary nav-cta">
              Enter Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/tenants" element={<Tenants />} />
          <Route path="/maintenance" element={<Maintenance />} />
                <Route path="/admin" element={<Admin />} />
      </Routes>
      </main>

      {!isAppShell && (
        <footer className="footer site-footer">
          <div className="container">
            <div className="footer-grid">
              <div className="footer-col brand-col">
                <div className="nav-brand footer-logo">
                  <svg
                    className="brand-icon"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9.5z" />
                    <path d="M9 21V11h6v10" />
                  </svg>
                  <span className="brand-name">Holt &amp; Ives</span>
                </div>
                <p className="footer-tagline">
                  Every property, accounted for. Built for real estate portfolios that demand quiet precision.
                </p>
                <p className="footer-meta">© {new Date().getFullYear()} Holt &amp; Ives Operations Platform.</p>
              </div>

              <div className="footer-col">
                <h4 className="footer-heading">Platform</h4>
                <ul className="footer-links">
                  <li><Link to="/dashboard">Executive Dashboard</Link></li>
                  <li><Link to="/properties">Property Ledger</Link></li>
                  <li><Link to="/tenants">Tenant Directory</Link></li>
                  <li><Link to="/maintenance">Maintenance Desk</Link></li>
                </ul>
              </div>

              <div className="footer-col">
                <h4 className="footer-heading">Capabilities</h4>
                <ul className="footer-links">
                  <li><span>Lease Expiration Tracking</span></li>
                  <li><span>Revenue Reconciliation</span></li>
                  <li><span>Priority Triage</span></li>
                  <li><span>Portfolio Analytics</span></li>
                </ul>
              </div>

              <div className="footer-col">
                <h4 className="footer-heading">Office &amp; Contact</h4>
                <p className="footer-contact-item">100 Arch Street, Suite 1400</p>
                <p className="footer-contact-item">Boston, MA 02110</p>
                <p className="footer-contact-item">ops@holtandives.com</p>
              </div>
            </div>
            <div className="footer-bottom">
              <span className="footer-rule-text">Composed · Exacting · Dependable</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}