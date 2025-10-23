import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Brand from '../components/Brand'
import RollsSection from './RollsSection'
import BreakfastSection from './BreakfastSection'
import BeveragesSection from './BeveragesSection'
import ThaliSection from './ThaliSection'
import PartySection from './PartySection'
import { SECTION_GRADIENTS } from '../constants/sectionGradients'

const STARTERS_MENU = [
  { id: 1, name: 'Al Faham (Q/H/F)', price: '119/229/449' },
  { id: 2, name: 'Ch. Tikka (6)', price: '149' },
  { id: 3, name: 'Ch. Lollypop (H4/F6)', price: '109/149' },
  { id: 4, name: 'Ch. Wings (6)', price: '149' },
  { id: 5, name: 'Ch. Drumstick (H2/F4)', price: '129/249' },
  { id: 6, name: 'Ch. Chaap (H1/F2)', price: '149/249' },
  { id: 7, name: 'Ch. Seek Kabab', price: '99' },
  { id: 8, name: 'Paneer Tikka (6)', price: '149' },
  { id: 9, name: 'Fish Fry (2)', price: '119' },
  { id: 10, name: 'Ch. Tikka Small (3)', price: '80' },
]

const BIRYANI_MENU = [
  { id: 1, name: 'Veg Dum Biryani', price: '80/120' },
  { id: 2, name: 'Ch. Dum Biryani', price: '99/130' },
  { id: 3, name: 'Ch. Tandoor Biryani', price: '109/140' },
  { id: 4, name: 'Ch. Hyderabadi Biryani', price: '109/140' },
  { id: 5, name: 'Maska Biryani', price: '109/140' },
]

const MAIN_MENU = [
  { id: 1, name: 'Chicken Sukkha (6)', price: '239' },
  { id: 2, name: 'Chicken Handi. (3/6)', price: '159/239' },
  { id: 3, name: 'Chicken Masala (3/6)', price: '149/229' },
  { id: 4, name: 'Chicken Korma (3/6)', price: '159/239' },
  { id: 5, name: 'Paneer Masala (8/16)', price: '159/239' },
  { id: 6, name: 'Paneer Handi. (8/16)', price: '149/229' },
  { id: 7, name: 'Mix Veg', price: '159' },
  { id: 8, name: 'Fish Curry (2)', price: '149' },
  { id: 9, name: 'Dal Tadka', price: '120' },
]

export default function Menu() {
  const [openStarters, setOpenStarters] = useState(false)
  const [openBiryani, setOpenBiryani] = useState(true)
  const [openMain, setOpenMain] = useState(false)
  const [openRolls, setOpenRolls] = useState(false)
  const [openBreakfast, setOpenBreakfast] = useState(false)
  const [openBeverages, setOpenBeverages] = useState(false)
  const [openThali, setOpenThali] = useState(false)
  const [openParty, setOpenParty] = useState(false)

  // Read URL hash on mount to open a specific section (e.g., #starters)
  useEffect(() => {
    const hash = (window.location.hash || '').replace('#', '')
    if (hash === 'starters') openOnly('starters')
    else if (hash === 'biryani') openOnly('biryani')
    else if (hash === 'main') openOnly('main')
    else if (hash === 'rolls') openOnly('rolls')
    else if (hash === 'breakfast') openOnly('breakfast')
    else if (hash === 'beverages') openOnly('beverages')
    else if (hash === 'thali') openOnly('thali')
    else if (hash === 'party') openOnly('party')
  }, [])

  // update URL hash without adding history entries
  function updateHash(name: string | null) {
    const base = window.location.pathname + window.location.search
    const newUrl = name ? `${base}#${name}` : base
    try { window.history.replaceState(null, '', newUrl) } catch { window.location.hash = name || '' }
  }

  function openOnly(section: 'starters' | 'biryani' | 'main' | 'rolls' | 'breakfast' | 'beverages' | 'thali' | 'party' | null) {
    setOpenStarters(section === 'starters')
    setOpenBiryani(section === 'biryani')
    setOpenMain(section === 'main')
    setOpenRolls(section === 'rolls')
    setOpenBreakfast(section === 'breakfast')
    setOpenBeverages(section === 'beverages')
    setOpenThali(section === 'thali')
    setOpenParty(section === 'party')
    updateHash(section)
  }

  const SectionHeader = ({ title, open, onToggle, gradientKey }: { title: string; open: boolean; onToggle: () => void; gradientKey?: string }) => {
    const id = `collapsible-${title.replace(/\s+/g, '-').toLowerCase()}`
    const background = SECTION_GRADIENTS[gradientKey || 'default'] || SECTION_GRADIENTS.default
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div className="section-title" style={{
          flex: 1,
          textAlign: 'center',
          background: background,
          color: '#fff',
          fontWeight: 800,
          fontSize: 26,
          padding: '10px 14px',
          borderRadius: 12
        }}>{title}</div>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          aria-expanded={open}
          aria-controls={id}
          aria-label={open ? `${title} collapse` : `${title} expand`}
          className={`menu-toggle ${open ? 'open' : ''}`}
          style={{
            marginLeft: 12,
            width: 44,
            height: 44,
            borderRadius: 10,
            border: 'none',
            background: 'rgba(255,255,255,0.06)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            touchAction: 'manipulation'
          }}
          title={open ? 'Collapse' : 'Expand'}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
            /* click handled on parent button to avoid double toggles */

            style={{
              transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 260ms cubic-bezier(.2,.9,.2,1)',
              display: 'block',
              cursor: 'pointer',
              touchAction: 'manipulation'
            }}
          >
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    )
  }

  return (
    <div style={{ paddingTop: 24 }}>
      <header className="header" style={{ maxWidth: 1100, margin: '0 auto 16px' }}>
        <Brand />
      </header>

      <main style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="card menu-hero" style={{ width: 'min(1100px, 96vw)', color: '#fff' }}>
          <div style={{ position: 'relative', zIndex: 2, padding: 24 }}>
            <h1 style={{ marginTop: 0 }}>Menu</h1>
            <p style={{ marginTop: 4, color: 'rgba(255,255,255,0.9)' }}>Click the arrow to expand or collapse a category. The open section is preserved in the URL hash.</p>

            {/* Rolls section (moved to its own file) */}
            <div style={{ marginTop: 12 }}>
              <SectionHeader title="Rolls" open={openRolls} onToggle={() => openOnly(openRolls ? null : 'rolls')} gradientKey={'rolls'} />

              <div id="collapsible-rolls" className={`collapsible ${openRolls ? 'open' : ''}`}>
                <RollsSection />
              </div>
            </div>

            {/* Breakfast section (moved to its own file) */}
            <div style={{ marginTop: 12 }}>
              <SectionHeader title="Breakfast" open={openBreakfast} onToggle={() => openOnly(openBreakfast ? null : 'breakfast')} gradientKey={'breakfast'} />

              <div id="collapsible-breakfast" className={`collapsible ${openBreakfast ? 'open' : ''}`}>
                <BreakfastSection />
              </div>
            </div>

            {/* Thali section (new file) */}
            <div style={{ marginTop: 12 }}>
              <SectionHeader title="Thali" open={openThali} onToggle={() => openOnly(openThali ? null : 'thali')} gradientKey={'thali'} />

              <div id="collapsible-thali" className={`collapsible ${openThali ? 'open' : ''}`}>
                <ThaliSection />
              </div>
            </div>

            {/* Starters section (top) */}
            <div style={{ marginTop: 12 }}>
              <SectionHeader title="Starters" open={openStarters} onToggle={() => openOnly(openStarters ? null : 'starters')} gradientKey={'starters'} />

              <div id="collapsible-starters" className={`collapsible ${openStarters ? 'open' : ''}`}>
                <div style={{ display: 'grid', gap: 12, marginTop: 6 }}>
                  {STARTERS_MENU.map(item => (
                    <div key={item.id} className="menu-item">
                      <div className="menu-item-name">{item.name}</div>
                      <div className="menu-item-price">{item.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Biryani section (middle) */}
            <div style={{ marginTop: 18 }}>
              <SectionHeader title="Biryani" open={openBiryani} onToggle={() => openOnly(openBiryani ? null : 'biryani')} gradientKey={'biryani'} />

              <div id="collapsible-biryani" className={`collapsible ${openBiryani ? 'open' : ''}`}>
                <div style={{ display: 'grid', gap: 12, marginTop: 6 }}>
                  {BIRYANI_MENU.map(item => (
                    <div key={item.id} className="menu-item">
                      <div className="menu-item-name">{item.name}</div>
                      <div className="menu-item-price">{item.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Party section (new file) */}
            <div style={{ marginTop: 18 }}>
              <SectionHeader title="Party Menu" open={openParty} onToggle={() => openOnly(openParty ? null : 'party')} gradientKey={'party'} />

              <div id="collapsible-party" className={`collapsible ${openParty ? 'open' : ''}`}>
                <PartySection />
              </div>
            </div>

            {/* Beverages section (new file) */}
            <div style={{ marginTop: 18 }}>
              <SectionHeader title="Beverages" open={openBeverages} onToggle={() => openOnly(openBeverages ? null : 'beverages')} gradientKey={'beverages'} />

              <div id="collapsible-beverages" className={`collapsible ${openBeverages ? 'open' : ''}`}>
                <BeveragesSection />
              </div>
            </div>

            {/* Main Course section (bottom) */}
            <div style={{ marginTop: 18 }}>
              <SectionHeader title="Main Course" open={openMain} onToggle={() => openOnly(openMain ? null : 'main')} gradientKey={'main'} />

              <div id="collapsible-main-course" className={`collapsible ${openMain ? 'open' : ''}`}>
                <div style={{ display: 'grid', gap: 12, marginTop: 6 }}>
                  {MAIN_MENU.map(item => (
                    <div key={item.id} className="menu-item">
                      <div className="menu-item-name">{item.name}</div>
                      <div className="menu-item-price">{item.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <Link to="/" className="link-plain" style={{ color: 'rgba(255,255,255,0.95)' }}>Back to home</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
