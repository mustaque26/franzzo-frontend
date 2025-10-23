import React, { useState, useEffect, useRef } from 'react'
import { login, setAccessToken, setCustomerUsername } from '../services/api'
import Brand from '../components/Brand'
import { useNavigate, Link, useLocation } from 'react-router-dom'

export default function Login() {
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  // Role is derived from the URL: /admin => admin, otherwise customer (default)
  const [role, setRole] = useState<'admin' | 'customer'>(() => (location.pathname.startsWith('/admin') ? 'admin' : 'customer'))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const userRef = useRef<HTMLInputElement | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // autofocus username input for faster login
    userRef.current?.focus()
  }, [])

  // Update role when the URL changes (so /admin and other paths reflect proper role)
  useEffect(() => {
    setRole(location.pathname.startsWith('/admin') ? 'admin' : 'customer')
  }, [location.pathname])

  async function submit(e?: React.FormEvent) {
    e?.preventDefault()
    setError(null)
    if (!username || !password) return setError('Username and password are required')
    setLoading(true)
    try {
      const result = await login(username, password, role)
      // Use role returned by the server (preferred) to navigate immediately
      const newRole = result?.role || role
      const token = result?.token || (result as any)?.token
      // Ensure token/role are stored (login helper should have done this, but set explicitly to be safe)
      try { if (token) setAccessToken(token, newRole) } catch {}
      // If customer login, store the username so orders can include it
      try { if ((newRole || '').toLowerCase() !== 'admin') setCustomerUsername(username) } catch {}
      // Force a full-page navigation to ensure the protected route sees the stored token/role
      if (newRole === 'admin') {
        try { window.location.replace('/admin/stock') } catch { /* ignore */ }
      } else {
        try { window.location.replace('/customer/waste') } catch { /* ignore */ }
      }
    } catch (err: any) {
      setError(err?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ paddingTop: 24 }}>
      {/* keep the header for other pages but the main hero is below for the login layout */}
      <header className="header" style={{ maxWidth: 1100, margin: '0 auto 16px' }}>
      </header>

      {/* Hero matching the provided design */}
      <div className="login-hero" aria-hidden>
        <img src="/assets/logo.svg" alt="Franzzo logo" className="hero-logo" />
        <h1 className="hero-title">Franzzo Restaurant Dashboard</h1>
        <p className="hero-sub">Algorithmically Cooked. Royally Served.</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
        <div className="card login" style={{ width: 'min(420px, 92vw)' }}>
          <h2 style={{ marginTop: 0, marginBottom: 6 }}>{role === 'admin' ? 'Admin Login' : 'Customer Login'}</h2>

          <form onSubmit={submit} style={{ display: 'grid', gap: 10 }}>
            <label style={{ fontSize: 13 }}>{role === 'admin' ? 'username' : 'Username'}</label>
            <input ref={userRef} value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />

            <label style={{ fontSize: 13 }}>Password</label>
            <div className="field-row">
              <input style={{ flex: 1 }} type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                className="eye-toggle"
                aria-pressed={showPassword}
                aria-label="Password Eye Toggle"
                title="Password Eye Toggle"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            <div className="form-actions">
              <button className="btn gold" type="submit" disabled={loading}>{loading ? 'Signing...' : 'Sign In'}</button>
              <button className="btn gold" type="button" onClick={() => { setUsername(''); setPassword(''); setError(null) }} disabled={loading}>Clear</button>
            </div>

            {error && <div role="alert" aria-live="polite" style={{ color: '#ffb4a2' }}>{error}</div>}

            {/* Role-specific helper text */}
            {role === 'admin' ? (
              <div className="muted">Sign in with your admin credentials. The token returned from the server will be stored in localStorage and used for authenticated admin API calls.</div>
            ) : (
              <div className="muted">Sign in with your contact (email or phone) and password. The token returned from the server will be stored in localStorage and used for authenticated requests.</div>
            )}

            {role === 'customer' ? (
              <div style={{ marginTop: 12 }}>
                <div className="inline-action">
                  <div className="inline-label">If not registered</div>
                  <Link to="/register" className="link-inline" aria-label="Create account">Create account</Link>
                </div>
              </div>
            ) : null}
          </form>
        </div>
      </div>

      <footer className="login-footer" aria-hidden>
        © 2025 Franzzo Foods Pvt. Ltd. | Slay Your Hunger.
      </footer>
    </div>
  )
}
