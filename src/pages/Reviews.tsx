import React from 'react'
import { Link } from 'react-router-dom'
import Brand from '../components/Brand'

export default function GoogleReviews() {
  return (
    <div style={{ paddingTop: 24 }}>
      <header className="header" style={{ maxWidth: 1100, margin: '0 auto 16px' }}>
        <Brand />
      </header>

      <main style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="card" style={{ width: 'min(1100px, 96vw)' }}>
          <h1 style={{ marginTop: 0 }}>Google Map</h1>
          <p style={{ color: 'rgba(230,240,255,0.85)' }}></p>
           <div style={{ textAlign: "center" }}>
                <iframe
                  title="Franzzo Google Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.010847569515!2d73.68984437579724!3d18.573549682530295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bbd21c903a49%3A0x2b68225de479ff77!2sFranzzo!5e0!3m2!1sen!2sin!4v1761204869901!5m2!1sen!2sin"
                  width="600"
                  height="400"
                  style={{
                    border: 0,
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
                  }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

          <section style={{ marginTop: 12 }}>
            <h3 style={{ marginBottom: 8 }}>Franzzo Google Reviews</h3>
            <div style={{ color: 'rgba(230,240,255,0.8)' }}>
              {/* Example iframe removed in demo to avoid external load; replace with your embed code */}
              <div style={{ padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.02)' }}>
                <em>
                 <div style={{ textAlign: "center" }}>
                      <iframe
                        title="Franzzo Google Reviews"
                        src="https://g.page/r/CXf_eeRdImgrEAE/review"
                        width="100%"
                        height="400"
                        style={{ border: 0, borderRadius: "12px" }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      ></iframe>
                    </div>
                </em>
              </div>
            </div>
          </section>

          <section style={{ marginTop: 12 }}>
            <h3 style={{ marginBottom: 8 }}>Direct link</h3>
            <p style={{ color: 'rgba(230,240,255,0.8)' }}>If you prefer a direct link to your Google Business reviews, use a link like:</p>
            <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer">https://g.page/r/CXf_eeRdImgrEAE/review</a>
          </section>

          <div style={{ marginTop: 16 }}>
            <Link to="/" className="link-plain">Back to home</Link>
          </div>
        </div>
      </main>
    </div>
  )
}

