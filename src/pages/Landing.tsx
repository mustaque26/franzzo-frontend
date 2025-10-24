import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Brand from '../components/Brand'

export default function Landing() {
  const linkCard: React.CSSProperties = {
    padding: '14px 18px',
    minWidth: 130,
    textAlign: 'center',
    borderRadius: 8,
    background: 'rgba(255,255,255,0.03)',
    color: 'inherit',
    textDecoration: 'none',
    boxShadow: '0 1px 0 rgba(255,255,255,0.02)',
    fontWeight: 600,
  }

  // dynamically read slideshow images from the landingimages folder via a small manifest
  const [images, setImages] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  // Load manifest (public/assets/landingimages/index.json) that lists filenames
  useEffect(() => {
    let mounted = true
    const manifestUrl = '/assets/landingimages/index.json'

    fetch(manifestUrl)
      .then(res => {
        if (!res.ok) throw new Error('manifest not found')
        return res.json()
      })
      .then((list: string[]) => {
        if (!mounted) return
        if (Array.isArray(list) && list.length > 0) {
          setImages(list.map(name => `/assets/landingimages/${name}`))
        } else {
          // fallback to known names if manifest is empty
          setImages(['/assets/landingimages/photo1.png', '/assets/landingimages/photo2.png', '/assets/landingimages/photo3.png'])
        }
      })
      .catch(() => {
        if (!mounted) return
        // fallback if fetch fails
        setImages(['/assets/landingimages/photo1.png', '/assets/landingimages/photo2.png', '/assets/landingimages/photo3.png'])
      })

    return () => { mounted = false }
  }, [])

  // Start slideshow only after images are loaded; preload them and set interval
  useEffect(() => {
    if (images.length === 0) return

    const preloaded = images.map(src => {
      const img = new Image()
      img.src = src
      return img
    })

    const id = setInterval(() => {
      setCurrentIndex(i => (i + 1) % images.length)
    }, 4000)

    return () => {
      clearInterval(id)
      preloaded.length = 0
    }
  }, [images])

  // Ensure we always have a valid src to render while the manifest/fetch settles
  const currentImage = images.length ? images[currentIndex] : '/assets/landingimages/photo1.png'

  return (
    <div style={{ paddingTop: 24 }}>
      <header className="header" style={{ maxWidth: 1100, margin: '0 auto 16px' }}>
      </header>

      <div className="login-hero" aria-hidden>
        <img src="/assets/logo.svg" alt="Franzzo logo" className="hero-logo" />
        <h1 className="hero-title">Franzzo Restaurant Dashboard</h1>
        <p className="hero-sub">Algorithmically Cooked. Royally Served.</p>
      </div>

      <main style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', margin: '12px 0 8px' }}>
          <Link to="/menu" style={linkCard} aria-label="Menu">Menu</Link>
          <Link to="/contact" style={linkCard} aria-label="Contact us">Contact us</Link>
          <Link to="/about" style={linkCard} aria-label="About us">About us</Link>
          <Link to="/gallery" style={linkCard} aria-label="Gallery">Gallery</Link>
          <Link to="/reviews" style={linkCard} aria-label="Google Reviews">Google Reviews</Link>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
          <div className="card login" style={{ width: 'min(420px, 92vw)' }}>
            <h2 style={{ marginTop: 0, marginBottom: 6 }}>Sign in</h2>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <Link to="/customer" className="btn">Customer Login</Link>
              <Link to="/admin" className="btn">Admin Login</Link>
            </div>
          </div>
        </div>

        {/* Big dummy image below the sign-in buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 18 }}>
          <div style={{ position: 'relative', width: 'min(1100px, 96%)' }}>
            {/* Responsive image using picture; falls back to SVG placeholders already present in public/assets */}
            <picture>
              <source media="(max-width: 640px)" srcSet={currentImage} />
              <img
                src={currentImage}
                alt="Franzzo hero placeholder"
                style={{
                  width: '100%',
                  display: 'block',
                  borderRadius: 12,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
                  maxHeight: '60vh',
                  objectFit: 'cover',
                }}
              />
            </picture>

            {/* CTA overlay */}
            <div style={{ position: 'absolute', left: 20, bottom: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ color: 'white', fontWeight: 700, textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>Explore our Menu</div>
              <Link to="/menu" className="btn" style={{ padding: '10px 14px' }} aria-label="See menu">See menu</Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="login-footer" aria-hidden>
        © 2025 Franzzo Foods Pvt. Ltd. | Slay Your Hunger.
      </footer>
    </div>
  )
}
