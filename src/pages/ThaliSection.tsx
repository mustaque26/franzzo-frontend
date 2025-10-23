import React from 'react'

export const THALI_MENU = [
  {
    id: 1,
    name: 'Special Veg Thali',
    description: '(2 Veg, Dal, Rice, Parath(2) or fulke(3), salad, pickle, gulab jamun)',
    price: '139'
  },
  {
    id: 2,
    name: 'Mini Thali',
    description: '(1 veg, chapti(2), Rice, Pickle, Dal)',
    price: '89'
  },
  {
    id: 3,
    name: 'Non Veg Thali',
    description: '(Chicken gravy(2), Rice, Parath(2) or fulke(3), salad, pickle, gulab jamun)',
    price: '159'
  },
  {
    id: 4,
    name: 'Chapati Bhaji',
    description: '(3 fulke+1bhaji+pickle)',
    price: '60'
  },
]

export default function ThaliSection() {
  return (
    <div style={{ display: 'grid', gap: 14, marginTop: 6 }}>
      {THALI_MENU.map(item => (
        <div key={item.id} className="menu-item" style={{ display: 'grid', gap: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div className="menu-item-name" style={{ fontSize: 20, fontWeight: 700 }}>{item.name}</div>
            <div className="menu-item-price" style={{ fontSize: 20, fontWeight: 700, marginLeft: 12 }}>{item.price}</div>
          </div>
          {item.description ? (
            <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 1.3 }}>{item.description}</div>
          ) : null}
        </div>
      ))}
    </div>
  )
}

