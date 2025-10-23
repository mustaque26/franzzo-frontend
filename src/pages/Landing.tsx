import React from 'react'
import { Link } from 'react-router-dom'
import Brand from '../components/Brand'

export default function Landing() {
  const linkCard: React.CSSProperties = {
    padding: '14px 18px',
    minWidth: 130,
    textAlign: 'center',
    borderRadius: 8,
    background: 'rgba(255,255,255,0.03)',
    color: 'inherit',
    textDecoration: 'none',
    boxShadow: '0 1px 0 rgba(255,255,255,0.02)',
    fontWeight: 600,
  }

  return (
    <div style={{ paddingTop: 24 }}>
      <header className="header" style={{ maxWidth: 1100, margin: '0 auto 16px' }}>
      </header>

      <div className="login-hero" aria-hidden>
        <img src="/assets/logo.svg" alt="Franzzo logo" className="hero-logo" />
        <h1 className="hero-title">Franzzo Restaurant Dashboard</h1>
        <p className="hero-sub">Algorithmically Cooked. Royally Served.</p>
      </div>

      <main style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', margin: '12px 0 8px' }}>
          <Link to="/menu" style={linkCard} aria-label="Menu">Menu</Link>
          <Link to="/contact" style={linkCard} aria-label="Contact us">Contact us</Link>
          <Link to="/about" style={linkCard} aria-label="About us">About us</Link>
          <Link to="/gallery" style={linkCard} aria-label="Gallery">Gallery</Link>
          <Link to="/reviews" style={linkCard} aria-label="Google Reviews">Google Reviews</Link>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
          <div className="card login" style={{ width: 'min(420px, 92vw)' }}>
            <h2 style={{ marginTop: 0, marginBottom: 6 }}>Sign in</h2>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <Link to="/customer" className="btn">Customer Login</Link>
              <Link to="/admin" className="btn">Admin Login</Link>
            </div>
          </div>
        </div>

        {/* Big dummy image below the sign-in buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 18 }}>
          <div style={{ position: 'relative', width: 'min(1100px, 96%)' }}>
            {/* Responsive image using picture; falls back to SVG placeholders already present in public/assets */}
            <picture>
              <source media="(max-width: 640px)" srcSet="/assets/photo2.png" />
              <img
                src="/assets/photo1.png"
                alt="Franzzo hero placeholder"
                style={{
                  width: '100%',
                  display: 'block',
                  borderRadius: 12,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
                  maxHeight: '60vh',
                  objectFit: 'cover',
                }}
              />
            </picture>

            {/* CTA overlay */}
            <div style={{ position: 'absolute', left: 20, bottom: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ color: 'white', fontWeight: 700, textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>Explore our Menu</div>
              <Link to="/menu" className="btn" style={{ padding: '10px 14px' }} aria-label="See menu">See menu</Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="login-footer" aria-hidden>
        © 2025 Franzzo Foods Pvt. Ltd. | Slay Your Hunger.
      </footer>
    </div>
  )
}
