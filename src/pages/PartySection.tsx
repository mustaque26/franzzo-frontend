import React from 'react'

export const PARTY_MENU = [
  { id: 1, name: 'Chicken Dum Biryani (per kg)', price: '1049' },
  { id: 2, name: 'Hyderabadi Biryani (per kg)', price: '1149' },
  { id: 3, name: 'Maska Biryani (per kg)', price: '1299' },
  { id: 4, name: 'Tandoori Biryani (per kg)', price: '1299' },
  { id: 5, name: 'Paneer Tikka Biryani (per kg)', price: '1349' },
  { id: 6, name: 'Mutton Biryani (per kg)', price: '2249' },
  { id: 7, name: 'Veg Biryani (per kg)', price: '849' },
  { id: 8, name: 'Paneer Biryani (per kg)', price: '1249' },
]

export default function PartySection() {
  return (
    <div style={{ display: 'grid', gap: 12, marginTop: 6 }}>
      {PARTY_MENU.map(item => (
        <div key={item.id} className="menu-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="menu-item-name" style={{ fontSize: 20, fontWeight: 700 }}>{item.name}</div>
          <div className="menu-item-price" style={{ fontSize: 20, fontWeight: 700 }}>{item.price}</div>
        </div>
      ))}
    </div>
  )
}

