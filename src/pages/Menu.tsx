import React from 'react'
import { Link } from 'react-router-dom'
import Brand from '../components/Brand'

const SAMPLE_MENU = [
  { id: 1, name: 'Margherita Pizza', description: 'San Marzano tomato, fresh basil, buffalo mozzarella', price: '$12' },
  { id: 2, name: 'Spicy Arrabbiata Pasta', description: 'Penne tossed in a spicy tomato-garlic sauce', price: '$11' },
  { id: 3, name: 'Caesar Salad', description: 'Crisp romaine, shaved parmesan, house dressing', price: '$9' },
  { id: 4, name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with molten center', price: '$7' },
]

export default function Menu() {
  return (
    <div style={{ paddingTop: 24 }}>
      <header className="header" style={{ maxWidth: 1100, margin: '0 auto 16px' }}>
        <Brand />
      </header>

      <main style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="card" style={{ width: 'min(1100px, 96vw)' }}>
          <h1 style={{ marginTop: 0 }}>Menu</h1>
          <p style={{ marginTop: 4, color: 'rgba(230,240,255,0.85)' }}>Explore some sample dishes — replace these with your real menu items.</p>

          <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
            {SAMPLE_MENU.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.02)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{item.name}</div>
                  <div style={{ color: 'rgba(230,240,255,0.75)', fontSize: 14 }}>{item.description}</div>
                </div>
                <div style={{ fontWeight: 700 }}>{item.price}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16 }}>
            <Link to="/" className="link-plain">Back to home</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
