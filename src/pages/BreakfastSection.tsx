import React from 'react'

export const BREAKFAST_MENU = [
  { id: 1, name: 'Omlette Pao (2Eggs,2Pao)', price: '40' },
  { id: 2, name: 'Omlette (2Eggs)', price: '30' },
  { id: 3, name: 'Boiled Eggs (2Eggs)', price: '30' },
  { id: 4, name: 'Pao (1p)', price: '5' },
  { id: 5, name: 'Butter Pao (1p)', price: '15' },
  { id: 6, name: 'Bun Maska', price: '30' },
  { id: 7, name: 'Egg Bhurji (2 Eggs)', price: '40' },
  { id: 8, name: 'Sandwich', price: '40' },
  { id: 9, name: 'Cheese Omlette', price: '50' },
  { id: 10, name: 'Plain Maggie', price: '40' },
  { id: 11, name: 'Egg Maggie', price: '60' },
]

export default function BreakfastSection() {
  return (
    <div style={{ display: 'grid', gap: 12, marginTop: 6 }}>
      {BREAKFAST_MENU.map(item => (
        <div key={item.id} className="menu-item">
          <div className="menu-item-name">{item.name}</div>
          <div className="menu-item-price">{item.price}</div>
        </div>
      ))}
    </div>
  )
}

