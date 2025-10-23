import React from 'react'

export const ROLLS_MENU = [
  { id: 1, name: 'Egg Roll', price: '59' },
  { id: 2, name: 'Chicken Roll', price: '129' },
]

export default function RollsSection() {
  return (
    <div style={{ display: 'grid', gap: 12, marginTop: 6 }}>
      {ROLLS_MENU.map(item => (
        <div key={item.id} className="menu-item">
          <div className="menu-item-name">{item.name}</div>
          <div className="menu-item-price">{item.price}</div>
        </div>
      ))}
    </div>
  )
}

