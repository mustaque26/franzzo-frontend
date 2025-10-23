import React, { useEffect, useState } from 'react'
import { WasteView } from './WasteView'
import { StockView } from './StockView'
import CustomerView from './CustomerView'
import { setAccessToken, getAccessToken, getUserRole } from '../services/api'
import Login from './Login'
import Brand from '../components/Brand'
import OrdersView from './OrdersView'

export default function App() {
  // helper for checking admin role in a case-insensitive way
  const isAdmin = (r: string | null | undefined) => (r || '').toLowerCase() === 'admin'
  // helper for checking customer role in a case-insensitive way
  const isCustomer = (r: string | null | undefined) => (r || '').toLowerCase() === 'customer'
  const [tab, setTab] = useState<'waste' | 'stock' | 'orders'>(() => (isAdmin(getUserRole()) ? 'stock' : 'waste'))
  const [token, setToken] = useState<string | null>(null)
  const [role, setRole] = useState<string | null>(() => getUserRole())
  const [devTokenInput, setDevTokenInput] = useState('')
  const [devRoleInput, setDevRoleInput] = useState('customer')

  useEffect(() => {
    setToken(getAccessToken())
    setRole(getUserRole())

    // If user already authenticated, respect the current pathname if possible
    const initRole = getUserRole()
    if (getAccessToken()) {
      const path = window.location.pathname || '/'
      if (path.startsWith('/admin')) setTab('stock')
      else if (path.startsWith('/orders')) setTab('orders')
      else if (path.startsWith('/customer')) setTab('waste')
      else {
        if (isAdmin(initRole)) {
          setTab('stock')
          window.history.replaceState({}, '', '/admin')
        } else {
          setTab('waste')
          window.history.replaceState({}, '', '/customer')
        }
      }
    }

    const onAuthChange = (e: any) => {
      const newToken = e?.detail?.token || null
      const newRole = e?.detail?.role ?? getUserRole()
      setToken(newToken)
      setRole(newRole)
      // choose default tab based on role
      if (isAdmin(newRole)) {
        setTab('stock')
        // push admin route after login
        try { window.history.pushState({}, '', '/admin/stock') } catch {}
      } else {
        setTab('waste')
        try { window.history.pushState({}, '', '/customer/waste') } catch {}
      }
    }
    window.addEventListener('auth:change', onAuthChange as EventListener)

    // keep tab in sync with browser navigation (back/forward)
    const onPop = () => {
      const path = window.location.pathname || '/'
      if (path.startsWith('/admin')) setTab('stock')
      else if (path.startsWith('/orders')) setTab('orders')
      else if (path.startsWith('/customer')) setTab('waste')
    }
    window.addEventListener('popstate', onPop)

    return () => {
      window.removeEventListener('auth:change', onAuthChange as EventListener)
      window.removeEventListener('popstate', onPop)
    }
  }, [])

  function handleClearToken() {
    setAccessToken(null)
    setToken(null)
    setRole(null)
    try { window.history.pushState({}, '', '/') } catch {}
  }

  // helper to copy the token from localStorage
  function copyToken() {
    const t = getAccessToken() || ''
    try { navigator.clipboard.writeText(t) } catch {}
  }

  // Dev-only helper: apply token and role from the dev inputs
  function applyDevToken() {
    if (!devTokenInput) return alert('Please paste a token first')
    const roleToSet = devRoleInput || null
    try {
      // store token and role; setAccessToken will also dispatch the auth:change event
      setAccessToken(devTokenInput, roleToSet)
    } catch {}
    setToken(devTokenInput)
    setRole(roleToSet)
    // ensure routing/tab reflects the chosen role
    if (isAdmin(roleToSet)) {
      setTab('stock')
      try { window.history.pushState({}, '', '/admin/stock') } catch {}
    } else {
      setTab('waste')
      try { window.history.pushState({}, '', '/customer/waste') } catch {}
    }
  }

  // If not authenticated, show the login page as the landing screen
  if (!token) {
    return (
      <div className="app-container">
        <Login />
      </div>
    )
  }

  return (
    <div className="app-container">
      <header className="header">
        <Brand />
        <div className="auth">
          {token ? (
            <>
              <div className="token-indicator">{role ? role.toUpperCase() : 'Authenticated'}</div>
              <button onClick={handleClearToken}>Logout</button>
            </>
          ) : null}
        </div>
      </header>


      {/* Dev-only debug panel to show masked token & role so you can copy it for curl tests */}

      {/* Only show the dashboards for admin users. Customers see the customer dashboard. Other/unknown roles see an informational card. */}
      {isAdmin(role) ? (
        <>
          <div style={{ display: 'flex', gap: 8, margin: '16px 0' }}>
            <button className={`btn tab-btn ${tab === 'waste' ? 'active' : ''}`} onClick={() => { setTab('waste'); try { window.history.pushState({}, '', '/customer/waste') } catch {} }}>Waste</button>
            <button className={`btn tab-btn ${tab === 'stock' ? 'active' : ''}`} onClick={() => { setTab('stock'); try { window.history.pushState({}, '', '/admin/stock') } catch {} }}>Stock</button>
             <button className={`btn tab-btn ${tab === 'orders' ? 'active' : ''}`} onClick={() => { setTab('orders'); try { window.history.pushState({}, '', '/orders') } catch {} }}>Orders</button>
          </div>

          <div style={{ width: '100%' }}>
            {tab === 'waste' ? <WasteView /> : (tab === 'stock' ? <StockView /> : <OrdersView />)}
          </div>
        </>
       ) : isCustomer(role) ? (
        <CustomerView />
       ) : (
         <div className="card">
           <h2>Welcome</h2>
           <p>You do not have access to the Waste and Stock dashboards. If you need access, please contact an administrator.</p>
         </div>
       )}
    </div>
  )
}
