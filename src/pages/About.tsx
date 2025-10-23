import React from 'react'
import { Link } from 'react-router-dom'
import Brand from '../components/Brand'

export default function About() {
  return (
    <div style={{ paddingTop: 24 }}>
      <header className="header" style={{ maxWidth: 1100, margin: '0 auto 16px' }}>
        <Brand />
      </header>

      <main style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="card" style={{ width: 'min(1100px, 96vw)' }}>
          <h1 style={{ marginTop: 0 }}>About us</h1>

          <p className="about-paragraph">
            Franzzo is a modern food brand that blends flavour, freshness, and fun in every bite. Born from a passion for great taste and good vibes, Franzzo serves delicious fusion dishes that bring people together — whether it’s friends hanging out, families dining out, or food lovers discovering something new.
          </p>

          <p className="about-paragraph">
            We believe food should be exciting yet comforting. That’s why every Franzzo recipe is crafted with care — combining authentic Indian spices, creative twists, and quality ingredients to deliver a memorable dining experience.
          </p>

          <p className="about-paragraph">
            From our crowd-favourite Biryani and Tikka varieties to indulgent desserts and quick bites, Franzzo is all about satisfying cravings and spreading smiles. We focus on honest pricing, generous portions, and consistent quality so each visit feels familiar and delightful.
          </p>

          <p className="about-paragraph">
            Whether you visit us at our stalls during local events, order for delivery, or dine with friends and family, you’ll always find great taste and a welcoming vibe. Our commitment to freshness and sustainability means we actively minimise waste and source responsibly whenever possible.
          </p>

          <p className="about-paragraph" style={{ fontWeight: 800, marginTop: 8 }}>
            ✨ Franzzo — Slay Your Hunger!
          </p>

          <section style={{ marginTop: 18 }}>
            <h3 style={{ marginBottom: 8 }}>Our mission</h3>
            <p className="about-paragraph">
              To delight every guest with fast, consistent food and friendly service while minimizing waste and maximizing freshness.
            </p>
          </section>

          <section style={{ marginTop: 18 }}>
            <h3 style={{ marginBottom: 8 }}>Our team</h3>
            <div className="team-grid">
              <div className="team-member">
                <div style={{ fontWeight: 700 }}>Kalim</div>
                <div style={{ color: 'rgba(230,240,255,0.75)' }}>Head Chef</div>
              </div>

              <div className="team-member">
                <div style={{ fontWeight: 700 }}>Akhtiyar</div>
                <div style={{ color: 'rgba(230,240,255,0.75)' }}>Mains And Starter Chef</div>
              </div>

              <div className="team-member">
                <div style={{ fontWeight: 700 }}>Farman</div>
                <div style={{ color: 'rgba(230,240,255,0.75)' }}>Breakfast And Beverages</div>
              </div>

              <div className="team-member">
                <div style={{ fontWeight: 700 }}>Avinash</div>
                <div style={{ color: 'rgba(230,240,255,0.75)' }}>Helper</div>
              </div>

              <div className="team-member">
                <div style={{ fontWeight: 700 }}>Renuka</div>
                <div style={{ color: 'rgba(230,240,255,0.75)' }}>Roti And Chapati</div>
              </div>
            </div>
          </section>

          <div style={{ marginTop: 16 }}>
            <Link to="/" className="link-plain">Back to home</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
