import React, { useState, useRef, useEffect } from 'react'
import { registerCustomer, setCustomerUsername } from '../services/api'
import Brand from '../components/Brand'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const [username, setUsername] = useState('')
  const usernameRef = useRef<HTMLInputElement | null>(null)
  const [name, setName] = useState('')
  const [age, setAge] = useState<string | number>('')
  const [contact, setContact] = useState('')
  const [address, setAddress] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  // focus the username field first for faster registration
  useEffect(() => { usernameRef.current?.focus() }, [])

  const navigate = useNavigate()

  async function submit(e?: React.FormEvent) {
    e?.preventDefault()
    setError(null)
    setSuccess(null)
    if (!username || !name || !contact || !password) return setError('Username, name, contact and password are required')
    if (password !== confirm) return setError('Passwords do not match')
    setLoading(true)
    try {
      const payload: any = { username, name, contact, password }
      if (age !== '') payload.age = Number(age)
      if (address) payload.address = address
      await registerCustomer(payload)
      // store the username locally so orders can include customerUsername
      try { setCustomerUsername(username) } catch {}
      setSuccess('Registration successful — please sign in')
      // After a short delay, navigate to login
      setTimeout(() => navigate('/'), 900)
    } catch (err: any) {
      setError(err?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ paddingTop: 24 }}>
      <header className="header" style={{ maxWidth: 1100, margin: '0 auto 16px' }}>
      </header>

      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 4 }}>
        <div className="card login" style={{ width: 460 }}>
          <h2 style={{ marginTop: 0 }}>Create a Customer Account</h2>
          <form onSubmit={submit} style={{ display: 'grid', gap: 10 }}>
            <label style={{ fontSize: 13 }}>Username</label>
            <input ref={usernameRef} value={username} onChange={e => setUsername(e.target.value)} placeholder="alice30" />

            <label style={{ fontSize: 13 }}>Full name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Alice Smith" />

            <label style={{ fontSize: 13 }}>Age (optional)</label>
            <input value={age as any} onChange={e => setAge(e.target.value)} placeholder="30" />

            <label style={{ fontSize: 13 }}>Contact (email or phone)</label>
            <input value={contact} onChange={e => setContact(e.target.value)} placeholder="alice@example.com" />

            <label style={{ fontSize: 13 }}>Address (optional)</label>
            <input value={address} onChange={e => setAddress(e.target.value)} placeholder="123 Main St" />

            <label style={{ fontSize: 13 }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Choose a password" />

            <label style={{ fontSize: 13 }}>Confirm password</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Confirm password" />

            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
              <button type="button" onClick={() => { setUsername(''); setName(''); setAge(''); setContact(''); setAddress(''); setPassword(''); setConfirm(''); setError(null) }} disabled={loading}>Clear</button>
            </div>

            {error && <div style={{ color: '#ffb4a2' }}>{error}</div>}
            {success && <div style={{ color: '#b7f5c6' }}>{success}</div>}

            <div style={{ fontSize: 12, color: 'rgba(230,240,255,0.7)' }}>
              After registration you'll be redirected to the sign in page where you can log in with your contact and password.
            </div>

            {/* Inline label + sign-in link on same line */}
            <div style={{ marginTop: 12 }}>
              <div className="inline-action">
                <div className="inline-label">If already registered</div>
                <Link to="/" className="link-inline" aria-label="Sign in">Sign in</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
