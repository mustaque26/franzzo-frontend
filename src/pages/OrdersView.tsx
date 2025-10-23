import React, { useEffect, useState } from 'react'
import { get, post, getUserRole } from '../services/api'

type MenuItem = { id: number; name: string; price?: number }
type OrderItem = { id?: number | string; menuItemId: number; quantity: number; price?: number | null; status?: string; menuItem?: MenuItem }
type Order = { id?: number | string; orderDate?: string; status?: string; items?: OrderItem[]; menuItemId?: number; quantity?: number; price?: number | null }

export default function OrdersView() {
  const [menu, setMenu] = useState<MenuItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)

  async function refresh() {
    setLoading(true)
    try {
      const m = await get<MenuItem[]>('/api/menu')
      const merged = Array.isArray(m) ? [...m] : []
      setMenu(merged)

      try {
        const o = await get<Order[]>('/api/v1/orders')

        // Normalize orders so each order has an `items` array and each item has a `menuItem` attached.
        const attachMenu = (ord: any): Order => {
          if (!ord) return ord

          // If order already has items, attach menuItem for each
          if (Array.isArray(ord.items) && ord.items.length) {
            const items = ord.items.map((it: any) => {
              const mId = typeof it?.menuItemId !== 'undefined' && it?.menuItemId !== null ? Number(it.menuItemId) : undefined
              const menuItem = typeof mId === 'number' ? merged.find((mm: any) => Number(mm?.id) === mId) : undefined
              return { ...it, menuItem, menuItemId: mId }
            }) as OrderItem[]
            return {
              id: ord.id ?? `legacy-${Math.random().toString(36).slice(2, 8)}`,
              orderDate: ord.orderDate,
              status: ord.status ?? undefined,
              items,
            }
          }

          // If order is in legacy flat shape (has menuItemId on the order), normalize into single-item order
          if (typeof ord.menuItemId !== 'undefined' && ord.menuItemId !== null) {
            const mId = Number(ord.menuItemId)
            const single: OrderItem = {
              id: ord.id ?? `legacy-${Math.random().toString(36).slice(2, 8)}`,
              menuItemId: mId,
              quantity: ord.quantity ?? 1,
              price: ord.price ?? null,
              status: ord.status ?? undefined,
              menuItem: merged.find((mm: any) => Number(mm?.id) === mId),
            }
            return {
              id: ord.id ?? single.id,
              orderDate: ord.orderDate,
              status: ord.status ?? undefined,
              items: [single],
            }
          }

          // nothing to normalize, return as-is but ensure items is at least an empty array
          return { ...ord, items: [] }
        }

        const withMenu = (o || []).map(attachMenu)

        setOrders(withMenu)
       } catch (err) {
         // fallback to empty orders (do not read from localStorage)
         console.warn('Failed loading orders from backend; clearing orders list', err)
         setOrders([])
       }
     } catch (err) {
       console.error('Failed loading orders:', err)
     } finally {
       setLoading(false)
     }
   }

   useEffect(() => { refresh() }, [])

   async function changeOrderStatus(orderId: number | string | undefined, newStatus: string) {
     // optimistic update
     setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus, items: (o.items || []).map(it => ({ ...it, status: newStatus })) } : o))

     // no localStorage updates for orders; backend-only

     // best-effort backend call
     try {
       if (typeof orderId === 'number') {
         await post(`/api/v1/orders/${orderId}/status`, { status: newStatus }).catch(() => {})
       }
     } catch {}
   }

   const isAdmin = (getUserRole() || '').toLowerCase() === 'admin'

   return (
     <div className="card">
       <h2>Orders</h2>
       <div style={{ marginBottom: 12 }}>
         <button className="btn" onClick={refresh} disabled={loading}>Refresh</button>
       </div>

       <table cellPadding={6} style={{ width: '100%' }}>
         <thead>
           <tr><th style={{ width: 180 }}>Date</th><th>Items</th><th style={{ width: 120 }}>Total</th><th style={{ width: 160 }}>Status</th></tr>
         </thead>
         <tbody>
           {orders.length === 0 ? (
             <tr><td colSpan={4} style={{ opacity: 0.8 }}>No orders yet</td></tr>
           ) : orders.map(o => {
             const items: OrderItem[] = (o.items && o.items.length) ? o.items : []
             const orderTotal = items.reduce((s, it) => s + ((it.price ?? 0) * (it.quantity || 0)), 0)
             const rawStatus = o.status || (items.some(i => (i as any).id && String((i as any).id).startsWith('local-')) ? 'Pending' : 'Placed')
             return (
               <tr key={o.id || o.orderDate}>
                 <td style={{ verticalAlign: 'top' }}>{o.orderDate}</td>
                 <td>
                   {items.map((it, idx) => {
                     const name = (it.menuItem && it.menuItem.name) || menu.find(mm => mm.id === it.menuItemId)?.name || `Item ${it.menuItemId}`
                     return (
                       <div key={it.id || idx} style={{ marginBottom: 6 }}>
                         <div style={{ fontWeight: 600 }}>{name}</div>
                         <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>{it.quantity} × {it.price != null ? `₹${it.price}` : '—'}</div>
                       </div>
                     )
                   })}
                 </td>
                 <td style={{ verticalAlign: 'top', fontWeight: 700 }}>{orderTotal ? `₹${orderTotal}` : '-'}</td>
                 <td style={{ verticalAlign: 'top' }}>
                   <div>{rawStatus}</div>
                   <div style={{ marginTop: 8 }}>
                     <select className="btn" value={['Pending','Preparing','Ready','Delivered'].includes(rawStatus) ? rawStatus : 'Pending'} onChange={e => changeOrderStatus(o.id, e.target.value)} disabled={!isAdmin || loading}>
                       <option value="Pending">Pending</option>
                       <option value="Preparing">Preparing</option>
                       <option value="Ready">Ready</option>
                       <option value="Delivered">Delivered</option>
                     </select>
                   </div>
                 </td>
               </tr>
             )
           })}
         </tbody>
       </table>
     </div>
   )
 }
