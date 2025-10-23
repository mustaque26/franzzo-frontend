import React from 'react'
import { Link } from 'react-router-dom'
import Brand from '../components/Brand'

export default function About() {
  return (
    <div style={{ paddingTop: 24 }}>
      <header className="header" style={{ maxWidth: 1100, margin: '0 auto 16px' }}>
        <Brand />
      </header>

      <main style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="card" style={{ width: 'min(1100px, 96vw)' }}>
          <h1 style={{ marginTop: 0 }}>About us</h1>
          <p style={{ color: 'rgba(230,240,255,0.85)' }}>
            Franzzo is a demo restaurant operations dashboard built to showcase a simple, secure interface for
            managing orders, stock, waste and customer interactions. Use this space to tell your customers about
            your story, values and what makes your food special.
          </p>

          <section style={{ marginTop: 12 }}>
            <h3 style={{ marginBottom: 8 }}>Our mission</h3>
            <p style={{ color: 'rgba(230,240,255,0.8)' }}>To delight every guest with fast, consistent food and friendly service while minimizing waste and maximizing freshness.</p>
          </section>

          <section style={{ marginTop: 12 }}>
            <h3 style={{ marginBottom: 8 }}>Our team</h3>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: 10, borderRadius: 8, minWidth: 160 }}>
                <div style={{ fontWeight: 700 }}>Priya</div>
                <div style={{ color: 'rgba(230,240,255,0.75)' }}>Head Chef</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: 10, borderRadius: 8, minWidth: 160 }}>
                <div style={{ fontWeight: 700 }}>Ravi</div>
                <div style={{ color: 'rgba(230,240,255,0.75)' }}>General Manager</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: 10, borderRadius: 8, minWidth: 160 }}>
                <div style={{ fontWeight: 700 }}>Maya</div>
                <div style={{ color: 'rgba(230,240,255,0.75)' }}>Operations</div>
              </div>
            </div>
          </section>

          <div style={{ marginTop: 16 }}>
            <Link to="/" className="link-plain">Back to home</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
