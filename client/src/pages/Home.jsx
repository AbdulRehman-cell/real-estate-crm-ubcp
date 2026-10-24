import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="landing-page">
      {/* 1. HERO SECTION */}
      <section className="hero">
        <div 
          className="hero-glow-wash" 
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '45%',
            height: '100%',
            background: 'radial-gradient(circle at top right, rgba(31, 75, 63, 0.12), transparent 70%)',
            filter: 'blur(80px)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />
        <img 
          className="hero-bg" 
          src="https://picsum.photos/seed/holtiveshero/1600/900" 
          alt="Modern property facade" 
        />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span className="eyebrow">The Holt &amp; Ives Operations Platform</span>
          <h1>
            Every property, <span className="gradient-text">accounted</span> for.
          </h1>
          <p className="hero-subtitle">
            Holt &amp; Ives gives property managers a single, composed view of their entire portfolio — 
            leases, tenants, and maintenance — so nothing slips and nothing surprises.
          </p>
          <div className="hero-actions">
            <Link to="/dashboard" className="btn-primary">
              Enter the Dashboard
            </Link>
            <a href="#capabilities" className="btn-secondary">
              Explore Capabilities
            </a>
          </div>

          {/* Product Preview Mockup */}
          <div className="product-preview-frame animate-in" style={{ marginTop: '56px' }}>
            <div className="preview-top-bar">
              <span className="preview-dot red"></span>
              <span className="preview-dot yellow"></span>
              <span className="preview-dot green"></span>
              <span className="preview-title">Holt &amp; Ives — Portfolio Control Desk v2.4</span>
            </div>
            <div className="preview-content">
              <img 
                src="https://picsum.photos/seed/dashboardpreview/1200/600" 
                alt="Holt & Ives Dashboard Preview" 
                className="img-cover img-rounded"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION DIVIDER */}
      <div className="section-divider"></div>

      {/* 2. PROOF STRIP STATS */}
      <section className="section proof-section">
        <div className="container">
          <div className="section-head text-center">
            <span className="eyebrow">Proven Scale</span>
            <h2>The numbers behind the discipline.</h2>
            <p className="section-subtitle">
              Trusted by single-asset operators and institutional portfolios managing multi-state residential assets.
            </p>
          </div>

          <div className="grid grid-3 stats-strip">
            <div className="card stat-card animate-in">
              <div className="stat-value">1,240+</div>
              <div className="stat-label">Units Under Active Management</div>
              <p className="stat-desc">Synchronized daily across 14 metropolitan centers.</p>
            </div>
            <div className="card stat-card animate-in">
              <div className="stat-value">98.3%</div>
              <div className="stat-label">On-Time Rent Reconciliation</div>
              <p className="stat-desc">Automated ledger posting with clear audit history.</p>
            </div>
            <div className="card stat-card animate-in">
              <div className="stat-value">4.6 hr</div>
              <div className="stat-label">Average Maintenance Response</div>
              <p className="stat-desc">From initial tenant request to vendor dispatch.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION DIVIDER */}
      <div className="section-divider"></div>

      {/* 3. CORE CAPABILITIES (3-Column Grid) */}
      <section id="capabilities" className="section capabilities-section">
        <div className="container">
          <div className="section-head text-center">
            <span className="eyebrow">Complete Oversight</span>
            <h2>One system. Three things that actually matter.</h2>
            <p className="section-subtitle">
              We stripped away enterprise clutter to leave only the core workflows that keep occupancy high and operations steady.
            </p>
          </div>

          <div className="grid grid-3 features-grid">
            <div className="card feature-card animate-in">
              <div className="feature-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M3 21h18M3 10h18M3 6h18M3 15h18" />
                  <path d="M5 6v15M9 6v15M15 6v15M19 6v15" />
                </svg>
              </div>
              <h3>Properties</h3>
              <p>Every unit, its status, and its rent roll, always current. Monitor occupancy, vacant unit turnaround times, and rental yields in one place.</p>
              <Link to="/properties" className="btn-ghost" style={{ marginTop: '16px', inlineSize: 'fit-content' }}>
                View Properties &rarr;
              </Link>
            </div>

            <div className="card feature-card animate-in">
              <div className="feature-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3>Tenants</h3>
              <p>Lease terms, contact details, and standing in one record. Keep track of upcoming lease renewals before they turn into vacant windows.</p>
              <Link to="/tenants" className="btn-ghost" style={{ marginTop: '16px', inlineSize: 'fit-content' }}>
                Manage Tenants &rarr;
              </Link>
            </div>

            <div className="card feature-card animate-in">
              <div className="feature-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
              </div>
              <h3>Maintenance</h3>
              <p>From reported to resolved, with priority that means something. Direct emergency items to specialists instantly and log receipts.</p>
              <Link to="/maintenance" className="btn-ghost" style={{ marginTop: '16px', inlineSize: 'fit-content' }}>
                Review Work Orders &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION DIVIDER */}
      <div className="section-divider"></div>

      {/* 4. HOW IT WORKS (3-Step Process) */}
      <section className="section how-it-works-section">
        <div className="container">
          <div className="section-head text-center">
            <span className="eyebrow">Methodology</span>
            <h2>From onboarding to resolution, in order.</h2>
            <p className="section-subtitle">
              Designed around the daily rhythms of seasoned property directors and asset owners.
            </p>
          </div>

          <div className="grid grid-3 steps-row">
            <div className="card step-card animate-in">
              <div className="step-num">01</div>
              <h3>Bring your portfolio in</h3>
              <p>Add every property with its type, address, and target rent. Import existing leases seamlessly with auto-parsed parameters.</p>
            </div>

            <div className="card step-card animate-in">
              <div className="step-num">02</div>
              <h3>Place your tenants</h3>
              <p>Attach leases, terms, and status in seconds. Set up automated email reminders for signature collections and renewal windows.</p>
            </div>

            <div className="card step-card animate-in">
              <div className="step-num">03</div>
              <h3>Stay ahead of issues</h3>
              <p>Triage maintenance by priority, not by panic. Filter by urgent items to ensure tenant safety and protect asset value.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION DIVIDER */}
      <div className="section-divider"></div>

      {/* 5. VISUAL GALLERY / PORTFOLIO SHOWCASE */}
      <section className="section showcase-section">
        <div className="container">
          <div className="section-head text-center">
            <span className="eyebrow">Curated Management</span>
            <h2>Built for every class of property.</h2>
            <p className="section-subtitle">
              Whether overseeing luxury urban lofts, multi-family complexes, or commercial suites, Holt &amp; Ives adapts to your mix.
            </p>
          </div>

          <div className="gallery-grid">
            <div className="gallery-item">
              <img src="https://picsum.photos/seed/apartmentcomplex/800/600" alt="Urban Apartment Building" />
              <div className="gallery-overlay">
                <div className="gallery-caption">
                  <strong>The Grandview Residences</strong>
                  <span>48 Units · Luxury Urban</span>
                </div>
              </div>
            </div>

            <div className="gallery-item">
              <img src="https://picsum.photos/seed/livingroominterior/800/600" alt="Modern Living Room" />
              <div className="gallery-overlay">
                <div className="gallery-caption">
                  <strong>The Oakridge Suites</strong>
                  <span>Interior Quality Standards</span>
                </div>
              </div>
            </div>

            <div className="gallery-item">
              <img src="https://picsum.photos/seed/commercialdesk/800/600" alt="Leasing Desk Handshake" />
              <div className="gallery-overlay">
                <div className="gallery-caption">
                  <strong>Leasing &amp; Tenant Desk</strong>
                  <span>98% Retention Rate</span>
                </div>
              </div>
            </div>

            <div className="gallery-item">
              <img src="https://picsum.photos/seed/suburbaerial/800/600" alt="Suburban Housing Aerial" />
              <div className="gallery-overlay">
                <div className="gallery-caption">
                  <strong>Highland Park Heights</strong>
                  <span>120 Single Family Units</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION DIVIDER */}
      <div className="section-divider"></div>

      {/* 6. TESTIMONIALS */}
      <section className="section testimonials-section">
        <div className="container">
          <div className="section-head text-center">
            <span className="eyebrow">Operator Perspectives</span>
            <h2>Trusted by those responsible for the bottom line.</h2>
          </div>

          <div className="grid grid-2 testimonials-grid">
            <div className="card testimonial animate-in">
              <p className="testimonial-text">
                "Before Holt &amp; Ives, maintenance requests were floating across text messages and spreadsheets. Now, our emergency response times have halved and our renewal conversations start 90 days out automatically."
              </p>
              <div className="testimonial-author-wrap" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
                <img src="https://i.pravatar.cc/150?img=33" alt="Eleanor Vance" className="avatar" />
                <div>
                  <div className="testimonial-author" style={{ fontWeight: '600', color: 'var(--text)' }}>Eleanor Vance</div>
                  <div className="testimonial-role" style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Principal Partner, Vance &amp; Sterling Assets</div>
                </div>
              </div>
            </div>

            <div className="card testimonial animate-in">
              <p className="testimonial-text">
                "The quiet precision of this interface is what sold our team. No unnecessary noise, just exact data on rent rolls, lease end dates, and vendor work orders. It’s the standard every property platform should meet."
              </p>
              <div className="testimonial-author-wrap" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
                <img src="https://i.pravatar.cc/150?img=12" alt="Marcus Sterling" className="avatar" />
                <div>
                  <div className="testimonial-author" style={{ fontWeight: '600', color: 'var(--text)' }}>Marcus Sterling</div>
                  <div className="testimonial-role" style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Managing Director, Apex Property Group</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CLOSING CTA BANNER */}
      <section className="cta-section">
        <div className="container text-center" style={{ position: 'relative', zIndex: 1 }}>
          <span className="eyebrow" style={{ color: 'var(--secondary)' }}>Ready to Standardize?</span>
          <h2 style={{ color: 'var(--surface)', marginTop: '12px', marginBottom: '16px' }}>
            Your portfolio deserves a system this disciplined.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto 32px' }}>
            Open the dashboard and see where things actually stand across your residential and commercial properties today.
          </p>
          <div className="hero-actions" style={{ justifyContent: 'center' }}>
            <Link to="/dashboard" className="btn-primary">
              Enter the Dashboard
            </Link>
            <Link to="/properties" className="btn-secondary" style={{ color: 'var(--surface)', borderColor: 'rgba(255,255,255,0.3)' }}>
              Browse Properties
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9.5z" />
                  <path d="M9 21V11h6v10" />
                </svg>
                <strong style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', color: 'var(--surface)' }}>Holt &amp; Ives</strong>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', maxWidth: '300px' }}>
                Every property, accounted for. A modern property operations platform built for modern managers.
              </p>
            </div>

            <div>
              <h4 style={{ color: 'var(--surface)', marginBottom: '16px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Navigation</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li><Link to="/" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Home</Link></li>
                <li><Link to="/dashboard" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Dashboard</Link></li>
                <li><Link to="/properties" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Properties</Link></li>
                <li><Link to="/tenants" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Tenants</Link></li>
                <li><Link to="/maintenance" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Maintenance</Link></li>
              </ul>
            </div>

            <div>
              <h4 style={{ color: 'var(--surface)', marginBottom: '16px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Platform Standards</h4>
              <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: '1.6' }}>
                Built in accordance with modern real estate accounting standards and tenant privacy protocols.
              </p>
            </div>
          </div>

          <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid var(--border)', color: 'var(--muted)', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <span>&copy; {new Date().getFullYear()} Holt &amp; Ives Property Operations platform. All rights reserved.</span>
            <span>Composed · Exacting · Dependable</span>
          </div>
        </div>
      </footer>
    </div>
  );
}