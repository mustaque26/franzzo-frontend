import React from 'react'
import { Link } from 'react-router-dom'
import Brand from '../components/Brand'

const BIRYANI_MENU = [
  { id: 1, name: 'Veg Dum Biryani', price: '80/120' },
  { id: 2, name: 'Ch. Dum Biryani', price: '99/130' },
  { id: 3, name: 'Ch. Tandoor Biryani', price: '109/140' },
  { id: 4, name: 'Ch. Hyderabadi Biryani', price: '109/140' },
  { id: 5, name: 'Maska Biryani', price: '109/140' },
]

export default function MenuBiryani() {
  return (
    <div style={{ paddingTop: 24 }}>
      <header className="header" style={{ maxWidth: 1100, margin: '0 auto 16px' }}>
        <Brand />
      </header>

      <main style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="card" style={{ width: 'min(1100px, 96vw)' }}>
          <h1 style={{ marginTop: 0 }}>Biryani</h1>
          <p style={{ marginTop: 4, color: 'rgba(0,0,0,0.65)' }}>Our popular biryani selections — choose your portion size (price shown as small/large).</p>

          <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
            {BIRYANI_MENU.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderRadius: 8, background: 'transparent' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{item.name}</div>
                </div>
                <div style={{ fontWeight: 700 }}>{item.price}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
            <Link to="/menu" className="link-plain">Main Course</Link>
            <Link to="/" className="link-plain">Back to home</Link>
          </div>
        </div>
      </main>
    </div>
  )
}

