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

// Add a small Sunday Special menu (matches the visual example)
const SUNDAY_MENU = [
  { id: 1, name: 'Ch. Keema', price: '149' },
  { id: 2, name: 'Mutton Keema', price: '200' },
  { id: 3, name: 'Mutton Korma (4/6)', price: '250/350' },
]

// Add a small Friday Special menu (matches the visual example)
const FRIDAY_MENU = [
  { id: 1, name: 'Ch. Dalcha', price: '149' },
  { id: 2, name: 'Mutton Dalcha', price: '249' },
]

// Add a Platters menu (single platter shown in the screenshot)
const PLATTERS_MENU = [
  { id: 1, name: 'Platters (2 tikka, 2 tangdi, 2 wings, Al faham Qtr, Biryani Qtr)', price: '399' },
]

// Add a small Saturday Special menu
const SATURDAY_MENU = [
  { id: 1, name: 'Mutton Korma (4/6)', price: '250/350' },
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
  // state for the Sunday Special collapsible
  const [openSunday, setOpenSunday] = useState(false)
  // state for the Friday Special collapsible
  const [openFriday, setOpenFriday] = useState(false)
  // state for the Platters collapsible
  const [openPlatters, setOpenPlatters] = useState(false)
  // state for the Saturday Special collapsible
  const [openSaturday, setOpenSaturday] = useState(false)

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
    else if (hash === 'sunday') openOnly('sunday')
    else if (hash === 'friday') openOnly('friday')
    else if (hash === 'platters') openOnly('platters')
    else if (hash === 'saturday') openOnly('saturday')
  }, [])

  // update URL hash without adding history entries
  function updateHash(name: string | null) {
    const base = window.location.pathname + window.location.search
    const newUrl = name ? `${base}#${name}` : base
    try { window.history.replaceState(null, '', newUrl) } catch { window.location.hash = name || '' }
  }

  function openOnly(section: 'starters' | 'biryani' | 'main' | 'rolls' | 'breakfast' | 'beverages' | 'thali' | 'party' | 'sunday' | 'friday' | 'platters' | 'saturday' | null) {
    setOpenStarters(section === 'starters')
    setOpenBiryani(section === 'biryani')
    setOpenMain(section === 'main')
    setOpenRolls(section === 'rolls')
    setOpenBreakfast(section === 'breakfast')
    setOpenBeverages(section === 'beverages')
    setOpenThali(section === 'thali')
    setOpenParty(section === 'party')
    setOpenSunday(section === 'sunday')
    setOpenFriday(section === 'friday')
    setOpenPlatters(section === 'platters')
    setOpenSaturday(section === 'saturday')
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

            {/* Friday Special section (uses fridaySpecial gradient) */}
            <div style={{ marginTop: 12 }}>
              <SectionHeader title="Friday Special" open={openFriday} onToggle={() => openOnly(openFriday ? null : 'friday')} gradientKey={'fridaySpecial'} />

              <div id="collapsible-friday-special" className={`collapsible ${openFriday ? 'open' : ''}`}>
                <div style={{ display: 'grid', gap: 12, marginTop: 6 }}>
                  {FRIDAY_MENU.map(item => (
                    <div key={item.id} className="menu-item">
                      <div className="menu-item-name">{item.name}</div>
                      <div className="menu-item-price">{item.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sunday Special section (uses sundaySpecial gradient) */}
            <div style={{ marginTop: 12 }}>
              <SectionHeader title="Sunday Special" open={openSunday} onToggle={() => openOnly(openSunday ? null : 'sunday')} gradientKey={'sundaySpecial'} />

              <div id="collapsible-sunday-special" className={`collapsible ${openSunday ? 'open' : ''}`}>
                <div style={{ display: 'grid', gap: 12, marginTop: 6 }}>
                  {SUNDAY_MENU.map(item => (
                    <div key={item.id} className="menu-item">
                      <div className="menu-item-name">{item.name}</div>
                      <div className="menu-item-price">{item.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Saturday Special section (uses saturdaySpecial gradient) */}
            <div style={{ marginTop: 12 }}>
              <SectionHeader title="Saturday Special" open={openSaturday} onToggle={() => openOnly(openSaturday ? null : 'saturday')} gradientKey={'saturdaySpecial'} />

              <div id="collapsible-saturday-special" className={`collapsible ${openSaturday ? 'open' : ''}`}>
                <div style={{ display: 'grid', gap: 12, marginTop: 6 }}>
                  {SATURDAY_MENU.map(item => (
                    <div key={item.id} className="menu-item">
                      <div className="menu-item-name">{item.name}</div>
                      <div className="menu-item-price">{item.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Platters section (uses platters gradient) */}
            <div style={{ marginTop: 12 }}>
              <SectionHeader title="Platters" open={openPlatters} onToggle={() => openOnly(openPlatters ? null : 'platters')} gradientKey={'platters'} />

              <div id="collapsible-platters" className={`collapsible ${openPlatters ? 'open' : ''}`}>
                <div style={{ display: 'grid', gap: 12, marginTop: 6 }}>
                  {PLATTERS_MENU.map(item => (
                    <div key={item.id} className="menu-item">
                      <div className="menu-item-name">{item.name}</div>
                      <div className="menu-item-price">{item.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

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
