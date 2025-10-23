import React, { useEffect, useState } from 'react'
import { get, postRaw } from '../services/api'

type InventoryItem = {
  id: number; name: string; category?: string; unit?: string;
  unitPrice?: number; currentStock?: number; minStock?: number
}

export function StockView() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [selected, setSelected] = useState<number>(0)
  const [qty, setQty] = useState<number>(0)
  const [type, setType] = useState<'IN'|'OUT'>('IN')
  const [remarks, setRemarks] = useState('')

  async function refresh() {
    try {
      const data = await get<InventoryItem[]>('/api/inventory/items')
      setItems(data)
    } catch (err: any) {
      console.error('Failed to load inventory:', err)
      alert(`Failed to load inventory: ${err?.message || err}`)
    }
  }

  useEffect(() => { refresh() }, [])

  const submit = async () => {
    if (!selected || !qty) return
    try {
      await postRaw(`/api/inventory/items/${selected}/adjust?quantity=${qty}&type=${type}&remarks=${encodeURIComponent(remarks)}`)
      await refresh()
    } catch (err: any) {
      console.error('Failed to update stock:', err)
      alert(`Failed to update stock: ${err?.message || err}`)
    }
  }

  return (
    <div className="card stock">
      <h2>Stock</h2>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <select value={selected} onChange={e => setSelected(Number(e.target.value))}>
          <option value={0}>Select Item</option>
          {items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
        </select>
        <input type="number" placeholder="Quantity" value={qty} onChange={e => setQty(Number(e.target.value))} />
        <select value={type} onChange={e => setType(e.target.value as any)}>
          <option value="IN">Add</option>
          <option value="OUT">Reduce</option>
        </select>
        <input placeholder="Remarks" value={remarks} onChange={e => setRemarks(e.target.value)} />
        <button className="btn" onClick={submit}>Update</button>
      </div>

      <h3 style={{ marginTop: 16 }}>Inventory</h3>
      <table cellPadding={6}>
        <thead><tr><th>Name</th><th>Category</th><th>Unit</th><th>Price</th><th>Current</th><th>Min</th></tr></thead>
        <tbody>
          {items.map(i => (
            <tr key={i.id}>
              <td>{i.name}</td>
              <td>{i.category}</td>
              <td>{i.unit}</td>
              <td>{i.unitPrice}</td>
              <td>{i.currentStock}</td>
              <td>{i.minStock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
