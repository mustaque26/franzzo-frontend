import React from 'react'

export const BEVERAGES_MENU = [
  { id: 1, name: 'Chai (Small/Large)', price: '15/30' },
  { id: 2, name: 'Sp. Chai', price: '20' },
  { id: 3, name: 'Coffee (Small/Large)', price: '25/50' },
  { id: 4, name: 'Black Coffee(Small/Large)', price: '25/50' },
  { id: 5, name: 'Green Tea', price: '25' },
  { id: 6, name: 'Water 500 (ml)', price: '10' },
  { id: 7, name: 'Water 1ltr', price: '20' },
  { id: 8, name: 'Lime Soda', price: '30' },
  { id: 9, name: 'Lemon Tea', price: '25' },
  { id: 10, name: 'Mojito', price: '99' },
]

export default function BeveragesSection() {
  return (
    <div style={{ display: 'grid', gap: 12, marginTop: 6 }}>
      {BEVERAGES_MENU.map(item => (
        <div key={item.id} className="menu-item">
          <div className="menu-item-name">{item.name}</div>
          <div className="menu-item-price">{item.price}</div>
        </div>
      ))}
    </div>
  )
}

