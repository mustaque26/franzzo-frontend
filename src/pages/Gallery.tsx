import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Brand from '../components/Brand'

const SAMPLE_PHOTOS = [
  { id: 1, src: '/assets/photo1.png', title: 'Signature Margherita', alt: 'Margherita pizza on a plate' },
  { id: 2, src: '/assets/photo2.png', title: 'Spicy Arrabbiata', alt: 'Spicy arrabbiata pasta' },
  { id: 3, src: '/assets/photo3.png', title: 'Chocolate Lava Cake', alt: 'Chocolate lava cake with molten center' },
]

export default function Gallery() {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const modalRef = useRef<HTMLDivElement | null>(null)
  const lastActiveRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (open) {
      // store last focused element so we can restore focus on close
      lastActiveRef.current = document.activeElement as HTMLElement
      // prevent background scrolling
      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      // focus the modal for keyboard handling
      modalRef.current?.focus()
      return () => {
        document.body.style.overflow = prevOverflow
      }
    } else {
      // restore focus to previously active element
      try { lastActiveRef.current?.focus() } catch {}
    }
  }, [open])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return
      if (e.key === 'Escape') {
        setOpen(false)
      } else if (e.key === 'ArrowLeft') {
        setIndex(i => (i - 1 + SAMPLE_PHOTOS.length) % SAMPLE_PHOTOS.length)
      } else if (e.key === 'ArrowRight') {
        setIndex(i => (i + 1) % SAMPLE_PHOTOS.length)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  function openAt(i: number) {
    setIndex(i)
    setOpen(true)
  }

  function prev() { setIndex(i => (i - 1 + SAMPLE_PHOTOS.length) % SAMPLE_PHOTOS.length) }
  function next() { setIndex(i => (i + 1) % SAMPLE_PHOTOS.length) }

  return (
    <div style={{ paddingTop: 24 }}>
      <header className="header" style={{ maxWidth: 1100, margin: '0 auto 16px' }}>
        <Brand />
      </header>

      <main style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="card" style={{ width: 'min(1100px, 96vw)' }}>
          <h1 style={{ marginTop: 0 }}>Gallery</h1>
          <p style={{ color: 'rgba(230,240,255,0.85)' }}>A small selection of photos showcasing our dishes and ambiance. Click an image to view it larger.</p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 12,
            marginTop: 12,
          }}>
            {SAMPLE_PHOTOS.map((photo, i) => (
              <figure key={photo.id} style={{ margin: 0, borderRadius: 8, overflow: 'hidden', background: 'rgba(255,255,255,0.02)' }}>
                <button
                  onClick={() => openAt(i)}
                  style={{ border: 'none', padding: 0, background: 'transparent', cursor: 'pointer', display: 'block', width: '100%' }}
                  aria-label={`Open ${photo.title}`}
                >
                  <img src={photo.src} alt={photo.alt} loading="lazy" style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }} />
                </button>
                <figcaption style={{ padding: '8px 10px', color: 'rgba(230,240,255,0.85)', fontSize: 14 }}>{photo.title}</figcaption>
              </figure>
            ))}
          </div>

          <div style={{ marginTop: 16 }}>
            <Link to="/" className="link-plain">Back to home</Link>
          </div>
        </div>
      </main>

      {/* Lightbox modal */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Image viewer: ${SAMPLE_PHOTOS[index].title}`}
          tabIndex={-1}
          ref={modalRef}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: 20,
          }}
          onClick={(e) => {
            // close when clicking on backdrop (but not when clicking the image or controls)
            if (e.target === e.currentTarget) setOpen(false)
          }}
        >
          <div style={{ position: 'relative', maxWidth: 'calc(100% - 80px)', maxHeight: '80vh', width: 'min(900px, 96%)' }}>
            <img src={SAMPLE_PHOTOS[index].src} alt={SAMPLE_PHOTOS[index].alt} style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8 }} />

            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', padding: '8px 10px', borderRadius: 6, cursor: 'pointer' }}
            >
              ✕
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); prev() }}
              aria-label="Previous image"
              style={{ position: 'absolute', left: -40, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'white', fontSize: 28, cursor: 'pointer' }}
            >
              ‹
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); next() }}
              aria-label="Next image"
              style={{ position: 'absolute', right: -40, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'white', fontSize: 28, cursor: 'pointer' }}
            >
              ›
            </button>

            <div style={{ position: 'absolute', left: 12, bottom: 12, color: 'rgba(255,255,255,0.95)', fontSize: 14 }}>{SAMPLE_PHOTOS[index].title}</div>
          </div>
        </div>
      )}
    </div>
  )
}
