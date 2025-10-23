import React, { useEffect, useRef, useState } from 'react'
import { get, post, setAccessToken, getUserRole, getCustomerUsername, setCustomerUsername } from '../services/api'

// Default menu items to ensure these are available client-side if backend doesn't provide them
const DEFAULT_MENU_ITEMS: MenuItem[] = [
  { id: -1, name: 'Vegetable Salad (Light & Fresh)', price: 169 },
  { id: -2, name: 'Healthy Mushroom Salad', price: 169 },
  { id: -3, name: 'Healthy Paneer Salad', price: 199 },
  { id: -4, name: 'Paneer Rice Meal', price: 225 },
  { id: -5, name: 'Paneer Rice Meal (High Protein)', price: 245 },
  { id: -6, name: 'Chicken Rice Meal (Regular)', price: 239 },
  { id: -7, name: 'Chicken Rice Meal (High Protein)', price: 259 },
  { id: -8, name: 'Chicken Tikka Meal', price: 250 },
  { id: -9, name: 'Healthy Chicken Salad', price: 250 },
  { id: -10, name: 'Healthy Boiled Egg Salad', price: 150 },
]

type MenuItem = { id: number; name: string; price?: number; unit?: string }
// allow id to be number (from backend) or string (local fallback); include optional price saved with order
type OrderItem = { id?: number | string; menuItemId: number; quantity: number; price?: number | null; status?: string; menuItem?: MenuItem }
// Order can be a single-item order (legacy) or a combined order with items[] for cart placements
type Order = { id?: number | string; menuItemId?: number; quantity?: number; price?: number | null; status?: string; orderDate?: string; menuItem?: MenuItem; items?: OrderItem[] }

export default function CustomerView() {
  const isAdmin = (getUserRole() || '').toLowerCase() === 'admin'
  const [menu, setMenu] = useState<MenuItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  // cart holds multiple selected items before placing a single combined order
  const [cart, setCart] = useState<Array<{ id: string; menuItemId: number; quantity: number; price?: number | null; menuItem?: MenuItem }>>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null)
  const priceRef = useRef<HTMLInputElement | null>(null)
  const [qty, setQty] = useState<number>(1)
  const [loading, setLoading] = useState(false)
  const [ordersAvailable, setOrdersAvailable] = useState<boolean | null>(null) // null=unknown, false=404/unavailable, true=available

  // Helper to determine the correct orders base path depending on role
  function ordersBasePath() {
    // Always use the v1 orders endpoint for customer dashboard as requested
    return '/api/v1/orders'
  }

  // Attach menuItem references and normalize legacy single-item orders
  const attachMenu = (ord: any, mergedMenu: MenuItem[]): Order => {
    if (!ord) return ord
    // If order already has items, attach menuItem for each
    if (Array.isArray(ord.items) && ord.items.length) {
      const items = ord.items.map((it: any) => {
        const mId = typeof it?.menuItemId !== 'undefined' && it?.menuItemId !== null ? Number(it.menuItemId) : undefined
        const menuItem = typeof mId === 'number' ? mergedMenu.find((mm: any) => Number(mm?.id) === mId) : undefined
        return { ...it, menuItem, menuItemId: mId }
      }) as OrderItem[]
      return {
        id: ord.id ?? `legacy-${Math.random().toString(36).slice(2, 8)}`,
        orderDate: ord.orderDate,
        status: ord.status ?? undefined,
        items,
      }
    }

    // Legacy single-item order shape
    if (typeof ord.menuItemId !== 'undefined' && ord.menuItemId !== null) {
      const mId = Number(ord.menuItemId)
      const single: OrderItem = {
        id: ord.id ?? `legacy-${Math.random().toString(36).slice(2, 8)}`,
        menuItemId: mId,
        quantity: ord.quantity ?? 1,
        price: ord.price ?? null,
        status: ord.status ?? undefined,
        menuItem: mergedMenu.find((mm: MenuItem) => Number(mm.id) === mId),
      }
      return {
        id: ord.id ?? single.id,
        orderDate: ord.orderDate,
        status: ord.status ?? undefined,
        items: [single],
      }
    }

    // Nothing to normalize
    return { ...ord, items: [] }
  }

  async function refresh() {
    setLoading(true)
    try {
      // remove any legacy local storage so we don't use locally stored orders
      try { localStorage.removeItem('local_orders_v1') } catch {}

      // load menu
      const m = await get<MenuItem[]>('/api/menu').catch(() => null)
      const merged = Array.isArray(m) ? [...m] : []
      for (const d of DEFAULT_MENU_ITEMS) {
        if (!merged.some(mm => (mm.name || '').trim().toLowerCase() === (d.name || '').trim().toLowerCase())) {
          merged.push(d)
        }
      }
      setMenu(merged || [])

      // Try to load orders from the v1 orders endpoint
      const base = ordersBasePath()
      try {
        const o = await get<Order[]>(base)
        const withMenu = (o || []).map(ord => attachMenu(ord, merged))
        setOrders(withMenu)
        setOrdersAvailable(true)
      } catch (err: any) {
        // If orders endpoint missing or returns 404, show no orders (do NOT fall back to local storage)
        if (err && (err.status === 404 || (err?.response && err.response.status === 404))) {
          console.warn('Orders endpoint not found; clearing orders list')
          setOrders([])
          setOrdersAvailable(false)
        } else {
          throw err
        }
      }
    } catch (err: any) {
      console.error('Failed to load customer data:', err)
      alert(`Failed to load customer data: ${err?.message || err}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // initial refresh and start polling so customers see status updates from the backend
    refresh()
    const id = setInterval(() => { refresh().catch(() => {}) }, 5000)
    return () => clearInterval(id)
  }, [])

  // Add current selection to cart (allows multiple items before placing order)
  function addToCart() {
    if (!selectedId || qty <= 0) return alert('Please select an item and a positive quantity')
    const menuItem = menu.find(m => m.id === selectedId) || undefined
    const item = { id: `cart-${Date.now()}-${Math.random().toString(36).slice(2,6)}`, menuItemId: selectedId, quantity: qty, price: selectedPrice ?? null, menuItem }
    setCart(prev => [...prev, item])
    setSelectedId(null)
    setQty(1)
  }

  // Place orders for items in the cart
  async function placeCartOrders() {
    console.debug('[orders] placeCartOrders start', { cart, ordersAvailable, customerUsername: getCustomerUsername() })
    if (cart.length === 0) return alert('Cart is empty')
    if (ordersAvailable === false) return alert('Ordering is currently unavailable on the backend — cannot place orders right now.')
    setLoading(true)
    const now = new Date().toISOString()
    const base = ordersBasePath()

    const itemsResult: OrderItem[] = []
    const failedLocal: OrderItem[] = []

    // Try combined order POST first (some backends expect a single order with items[])
    let combinedTried = false
    try {
      const itemsPayload = cart.map(c => ({ menuItemId: c.menuItemId, quantity: c.quantity, price: c.price }))
      const cust = (() => { try { return getCustomerUsername() } catch { return null } })()
      const combinedBody: any = { items: itemsPayload }
      if (cust) { combinedBody.customerUsername = cust; combinedBody.username = cust }
      console.debug('[orders] attempting combined POST', combinedBody)
      const combinedRes = await post<any>(base, combinedBody).catch((e: any) => { throw e })
      // If backend accepted combined order, it may return the created order or array of orders
      if (combinedRes) {
        combinedTried = true
        // Normalize combinedRes into itemsResult entries
        if (Array.isArray(combinedRes)) {
          for (const saved of combinedRes) {
            itemsResult.push({ id: (saved && (saved.id as any)) || undefined, menuItemId: saved.menuItemId || (saved.items && saved.items[0]?.menuItemId) || undefined, quantity: saved.quantity || (saved.items && saved.items[0]?.quantity) || 1, price: saved.price ?? null, status: 'Placed' })
          }
        } else if (combinedRes.id || combinedRes.items) {
          // single order returned
          const saved = combinedRes
          // if saved.items exist, map those
          if (Array.isArray(saved.items) && saved.items.length) {
            for (const it of saved.items) {
              itemsResult.push({ id: (saved && (saved.id as any)) || undefined, menuItemId: it.menuItemId, quantity: it.quantity, price: it.price ?? null, status: 'Placed' })
            }
          } else {
            itemsResult.push({ id: (saved && (saved.id as any)) || undefined, menuItemId: saved.menuItemId, quantity: saved.quantity || 1, price: saved.price ?? null, status: 'Placed' })
          }
        }
      }
    } catch (errCombined: any) {
      console.debug('[orders] combined POST not supported or failed, falling back to per-item', errCombined)
      // fall through to per-item loop
    }

    // If combined not used or failed, fallback to per-item posts
    if (!combinedTried) {
      try {
        for (const c of cart) {
          try {
            const body: any = { menuItemId: c.menuItemId, quantity: c.quantity }
            // attach stored customer username if available so backend knows who placed the order
            try {
              const cust = getCustomerUsername()
              if (cust) { body.customerUsername = cust; body.username = cust }
            } catch {}
            if (c.price !== null && c.price !== undefined) body.price = c.price
            console.debug('[orders] posting item', body)
            const saved = await post<Order>(base, body)
            itemsResult.push({ id: (saved && (saved.id as any)) || undefined, menuItemId: c.menuItemId, quantity: c.quantity, price: c.price ?? null, status: 'Placed', menuItem: c.menuItem })
          } catch (err: any) {
            console.error('[orders] item post failed', { item: c, err })
            // record failure in-memory only (do not persist to localStorage)
            const localItem: OrderItem = { id: `local-${Date.now()}-${Math.random().toString(36).slice(2,6)}`, menuItemId: c.menuItemId, quantity: c.quantity, price: c.price ?? null, status: 'Pending', menuItem: c.menuItem }
            failedLocal.push(localItem)
          }
        }
      } catch (err: any) {
        console.error('[orders] placeCartOrders failed', err)
        alert(`Failed to place orders: ${err?.message || err}`)
      }
    }

    // For failed items, add them to UI temporarily but do not save to localStorage
    if (failedLocal.length > 0) {
      setOrders(prev => [...prev, ...failedLocal.map(it => ({ id: it.id, items: [it], orderDate: now, status: it.status }))])
      // notify user
      alert('Some items failed to place and were not saved locally. Please try again.')
    }

    if (itemsResult.length > 0) {
      const nowOrders = itemsResult.map(it => ({ id: it.id, items: [it], orderDate: now, status: it.status }))
      setOrders(prev => [...prev, ...nowOrders])
    }

    setCart([])
    setLoading(false)
  }

  // Change order status (admin action) - optimistic + backend
  async function changeOrderStatus(orderId: number | string | undefined, newStatus: string) {
    // optimistic update
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus, items: (o.items || []).map(it => ({ ...it, status: newStatus })) } : o))

    // backend update only (do not update localStorage)
    try {
      if (typeof orderId === 'number') {
        await post(`/api/v1/orders/${orderId}/status`, { status: newStatus }).catch(() => {})
      }
    } catch {}
  }

  // Logout handler: notify backend if available, clear client auth, then redirect to /login
  async function logout() {
    try { await post('/api/logout', undefined as any).catch(() => {}) } catch {}
    try { setAccessToken(null) } catch {}
    try { sessionStorage.clear() } catch {}
    try { setCustomerUsername(null) } catch {}
    window.location.href = '/login'
  }

  return (
    <div className="card customer">
      <h2>Order Menu</h2>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <select value={selectedId ?? 0} onChange={e => {
          const id = Number(e.target.value) || null
          setSelectedId(id)
          const item = menu.find(mm => mm.id === id)
          const p = item?.price ?? null
          setSelectedPrice(typeof p === 'number' ? p : null)
          setTimeout(() => { try { priceRef.current?.focus(); priceRef.current?.select() } catch {} }, 0)
        }}>
          <option value={0}>Select Item</option>
          {menu.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
        <input
          ref={priceRef}
          type="number"
          placeholder="Price"
          value={selectedPrice ?? ''}
          onChange={e => setSelectedPrice(e.target.value ? Number(e.target.value) : null)}
          style={{ width: 120 }}
        />
        <input type="number" min={1} value={qty} onChange={e => setQty(Number(e.target.value) || 1)} style={{ width: 80 }} />
        <button className="btn" onClick={addToCart}>Add to cart</button>
        {ordersAvailable === false && (
          <div style={{ marginLeft: 8, color: '#fca5a5', fontSize: 13, opacity: 0.95 }}>Ordering is currently unavailable on the backend — orders cannot be placed right now.</div>
        )}
        <button className="btn" onClick={refresh} disabled={loading} style={{ marginLeft: 'auto' }}>Refresh</button>
      </div>

      {/* Cart: show items user added and a total with Place Order for the cart */}
      <div style={{ marginTop: 12 }}>
        <h3>Cart</h3>
        {cart.length === 0 ? (
          <div style={{ opacity: 0.8 }}>No items in cart. Use Add to cart to queue multiple items.</div>
        ) : (
          <div>
            <table cellPadding={6} style={{ width: '100%', marginBottom: 8 }}>
              <tbody>
                {cart.map(c => (
                  <tr key={c.id}>
                    <td>{c.menuItem?.name || c.menuItemId}</td>
                    <td>{c.price != null ? `₹${c.price}` : '-'}</td>
                    <td>{c.quantity}</td>
                    <td>{c.price != null ? `₹${c.price * c.quantity}` : '-'}</td>
                    <td><button className="btn" onClick={() => setCart(prev => prev.filter(x => x.id !== c.id))}>Remove</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ fontWeight: 700 }}>Total: ₹{cart.reduce((s, c) => s + ((c.price ?? 0) * c.quantity), 0)}</div>
              <div style={{ marginLeft: 'auto' }}>
                <button className="btn" onClick={placeCartOrders} disabled={loading || cart.length === 0 || ordersAvailable === false}>Place Order</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <h3 style={{ marginTop: 16 }}>Your Orders</h3>
      {ordersAvailable === false && (
        <div style={{ marginTop: 8, color: '#fef3c7', opacity: 0.9 }}>Orders are not available from the backend. You can still view the menu but placing orders may fail.</div>
      )}
      <table cellPadding={6} style={{ width: '100%' }}>
        <thead>
          <tr>
            <th style={{ width: 180 }}>Date</th>
            <th>Items</th>
            <th style={{ width: 120 }}>Total</th>
            <th style={{ width: 160 }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr><td colSpan={4} style={{ opacity: 0.8 }}>No orders yet</td></tr>
          ) : (
            orders.map(o => {
              // normalize items: if order.items exists use it, otherwise map legacy single-item order to items array
              const items: OrderItem[] = o.items && o.items.length ? o.items : (o.menuItemId ? [{ id: o.id, menuItemId: o.menuItemId!, quantity: o.quantity || 0, price: o.price ?? null, status: o.status, menuItem: o.menuItem } as OrderItem] : [])
              const orderTotal = items.reduce((s, it) => s + ((it.price ?? 0) * (it.quantity || 0)), 0)
              return (
                <tr key={o.id || `${o.menuItemId}-${o.orderDate || ''}`}>
                  <td style={{ verticalAlign: 'top' }}>{o.orderDate}</td>
                  <td>
                    {items.map((it, idx) => (
                      <div key={it.id || idx} style={{ marginBottom: 6 }}>
                        <div style={{ fontWeight: 600 }}>{it.menuItem?.name || it.menuItemId}</div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>{it.quantity} × {it.price != null ? `₹${it.price}` : '—'}</div>
                      </div>
                    ))}
                  </td>
                  <td style={{ verticalAlign: 'top', fontWeight: 700 }}>{orderTotal ? `₹${orderTotal}` : '-'}</td>
                  <td style={{ verticalAlign: 'top' }}>
                    {/* show current status (fallback to Pending for local orders / unknown) */}
                    <div>{o.status || (items.some(i => (i as any).id && String((i as any).id).startsWith('local-')) ? 'Pending' : 'Placed')}</div>
                    <div style={{ marginTop: 8 }}>
                      {(() => {
                        const opt = ['Pending', 'Preparing', 'Ready', 'Delivered']
                        const rawStatus = o.status || (items.some(i => (i as any).id && String((i as any).id).startsWith('local-')) ? 'Pending' : 'Placed')
                        const currentStatus = opt.includes(rawStatus) ? rawStatus : 'Pending'
                        return (
                          <select
                            className="btn"
                            value={currentStatus}
                            onChange={(e) => changeOrderStatus(o.id, e.target.value)}
                            disabled={!isAdmin || loading}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Ready">Ready</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        )
                      })()}
                    </div>
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
