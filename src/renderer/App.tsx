import { useState } from 'react'
import { useApp } from './context/AppContext'
import { LayoutCompact } from './components/layouts/LayoutCompact'
import { LayoutCalendar } from './components/layouts/LayoutCalendar'
import { LayoutFocus } from './components/layouts/LayoutFocus'
import { TweaksPanel } from './components/TweaksPanel'

function AppContent() {
  const { settings, loading } = useApp()
  const [tweaksOpen, setTweaksOpen] = useState(false)

  if (loading) {
    return <div style={{ padding: 20, textAlign: 'center', color: 'oklch(0.6 0.01 250)', fontSize: 12 }}>Carregando...</div>
  }

  const layouts = {
    compact: LayoutCompact,
    calendar: LayoutCalendar,
    focus: LayoutFocus,
  }
  const Layout = layouts[settings.layout] || LayoutCompact

  return (
    <div style={{
      width: 330,
      background: 'white',
      borderRadius: 12,
      overflow: 'hidden',
    }}>
      <Layout />
      {/* Settings toggle */}
      <div style={{
        borderTop: '1px solid oklch(0.92 0.01 250)',
        padding: '6px 14px',
        display: 'flex', justifyContent: 'flex-end',
      }}>
        <button
          onClick={() => setTweaksOpen(o => !o)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 11, color: 'oklch(0.60 0.01 250)',
            fontFamily: "'DM Sans', sans-serif",
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = settings.accent}
          onMouseLeave={e => e.currentTarget.style.color = 'oklch(0.60 0.01 250)'}
        >
          ⚙ Tweaks
        </button>
      </div>
      {tweaksOpen && <TweaksPanel />}
    </div>
  )
}

export function App() {
  return <AppContent />
}
