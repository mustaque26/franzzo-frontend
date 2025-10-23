import React, { useEffect, useMemo, useState } from 'react'
import { get, post } from '../services/api'

type MenuItem = { id: number; name: string; category?: string; unit?: string }
type WasteLog = { id?: number; menuItem: MenuItem; quantity: number; reason?: string; wasteDate?: string; costLoss?: number }

export function WasteView() {
  const [menu, setMenu] = useState<MenuItem[]>([])
  const [logs, setLogs] = useState<WasteLog[]>([])
  const [form, setForm] = useState<WasteLog>({ menuItem: { id: 1, name: '' }, quantity: 0 })

  async function refresh() {
    try {
      const [m, w] = await Promise.all([get<MenuItem[]>('/api/menu'), get<WasteLog[]>('/api/waste')])
      setMenu(m)
      setLogs(w)
    } catch (err: any) {
      console.error('Failed to load waste data:', err)
      alert(`Failed to load waste data: ${err?.message || err}`)
    }
  }

  useEffect(() => { refresh() }, [])

  const submit = async () => {
    if (!form.menuItem?.id || !form.quantity) return
    try {
      const saved = await post<WasteLog>('/api/waste', form)
      setLogs(prev => [...prev, saved])
    } catch (err: any) {
      console.error('Failed to save waste:', err)
      alert(`Failed to save waste: ${err?.message || err}`)
    }
  }

  const totalCost = useMemo(() => logs.reduce((s, l) => s + (l.costLoss || 0), 0), [logs])

  return (
    <div className="card waste">
      <h2>Daily Waste</h2>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <select value={form.menuItem?.id}
                onChange={e => setForm({ ...form, menuItem: { id: Number(e.target.value), name: '' } })}>
          <option value={0}>Select Menu Item</option>
          {menu.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <input type="number" placeholder="Quantity" value={form.quantity}
               onChange={e => setForm({ ...form, quantity: Number(e.target.value) })} />
        <input placeholder="Reason" value={form.reason || ''}
               onChange={e => setForm({ ...form, reason: e.target.value })} />
        <input type="date" value={form.wasteDate || ''}
               onChange={e => setForm({ ...form, wasteDate: e.target.value })} />
        <input type="number" placeholder="Cost Loss" value={form.costLoss || 0}
               onChange={e => setForm({ ...form, costLoss: Number(e.target.value) })} />
        <button className="btn" onClick={submit}>Save</button>
      </div>

      <h3 style={{ marginTop: 16 }}>Logs</h3>
      <table cellPadding={6}>
        <thead><tr><th>Date</th><th>Item</th><th>Qty</th><th>Reason</th><th>Cost Loss</th></tr></thead>
        <tbody>
          {logs.map(l => (
            <tr key={l.id}>
              <td>{l.wasteDate}</td>
              <td>{menu.find(m => m.id === l.menuItem?.id)?.name || l.menuItem?.id}</td>
              <td>{l.quantity}</td>
              <td>{l.reason}</td>
              <td>{l.costLoss}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 8 }}><b>Total Cost:</b> ₹{totalCost}</div>
    </div>
  )
}
