import React, {useState} from 'react'

export default function Brand() {
  const [imgFailed, setImgFailed] = useState(false)
  return (
    <div className="brand">
      {!imgFailed ? (
        <img
          src="/assets/logo.svg"
          alt="FranzzoOps logo"
          className="img-logo"
          onError={() => setImgFailed(true)}
          style={{ display: 'inline-block' }}
        />
      ) : (
        // fallback inline SVG (small, lightweight) to ensure brand always visible
        <div className="logo" style={{ width: 64, height: 64, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <rect width="24" height="24" rx="4" fill="#0ea5a4" />
            <path d="M6 12h12" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 7h12" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
            <path d="M6 17h12" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
          </svg>
        </div>
      )}
      <div style={{ display: 'inline-block', marginLeft: 12, verticalAlign: 'middle' }}>
        <h1 className="brand-title" style={{ margin: 0 }}>Franzzo Restaurant Dashboard</h1>
        <p className="brand-sub" style={{ margin: 0 }}>Operations Dashboard</p>
      </div>
    </div>
  )
}

