import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Brand from '../components/Brand'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function submit(e?: React.FormEvent) {
    e?.preventDefault()
    setError(null)
    setSuccess(null)
    if (!name || !email || !message) return setError('Please provide name, email and a short message.')
    setLoading(true)
    try {
      // Demo: pretend to send message
      await new Promise(res => setTimeout(res, 700))
      setSuccess('Message sent — we will get back to you shortly.')
      setName('')
      setEmail('')
      setMessage('')
    } catch (err: any) {
      setError('Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ paddingTop: 24 }}>
      <header className="header" style={{ maxWidth: 1100, margin: '0 auto 16px' }}>
        <Brand />
      </header>

      <main style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="card contact-card" style={{ width: 'min(1100px, 96vw)' }}>
          <div className="contact-hero">
            <div>
              <h1 className="contact-title">Contact us</h1>
              <p className="contact-sub">We're happy to hear from you. Reach out with questions, catering requests or partnership inquiries.</p>
            </div>
            <div className="contact-actions">
              <Link to="/" className="link-plain">Back to home</Link>
            </div>
          </div>

          <div className="contact-grid">
            <section className="contact-info" aria-labelledby="reach-us">
              <h3 id="reach-us">Reach us</h3>
              <div className="info-list">
                <div className="info-row"><span className="info-label">Email</span><a href="mailto:franzzo057@gmail.com" className="info-value">franzzo057@gmail.com</a></div>
                <div className="info-row"><span className="info-label">Phone</span><a href="tel:+917752991747" className="info-value">+91 7752991747</a></div>
                <div className="info-row"><span className="info-label">Address</span><div className="info-value">Royal Food Court, Maan Rd, opp. TCG Phase 3, Hinjawadi, Pune, Maharashtra 411057</div></div>
              </div>

              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 13, color: 'rgba(230,240,255,0.75)' }}>Business hours: Mon–Sun 10:30 — 22:30</div>
              </div>
            </section>

            <section className="contact-form" aria-labelledby="send-message">
              <h3 id="send-message">Send us a message</h3>
              <form onSubmit={submit} className="form-grid">
                <label className="field">
                  <span className="field-label">Your name</span>
                  <input className="contact-input" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
                </label>

                <label className="field">
                  <span className="field-label">Email</span>
                  <input className="contact-input" placeholder="you@example.com" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                </label>

                <label className="field field-full">
                  <span className="field-label">Message</span>
                  <textarea className="contact-textarea" placeholder="Tell us how we can help" value={message} onChange={e => setMessage(e.target.value)} />
                </label>

                <div className="form-actions">
                  <button className="btn primary" type="submit" disabled={loading}>{loading ? 'Sending…' : 'Send message'}</button>
                  <button type="button" className="btn outline" onClick={() => { setName(''); setEmail(''); setMessage(''); setError(null); setSuccess(null) }} disabled={loading}>Clear</button>
                </div>

                {error && <div role="alert" className="form-error">{error}</div>}
                {success && <div role="status" className="form-success">{success}</div>}
              </form>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
